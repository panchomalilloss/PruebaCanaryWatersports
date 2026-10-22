import { execSync } from "child_process";
import { beforeAll, expect, test } from "vitest";
import { DateTime } from "luxon";
import { prisma } from "../src/server/db";
import { BookingError, cancelBooking, createHold, daySlots, rescheduleBooking } from "../src/server/booking";
import { confirmTestPayment, startPayment } from "../src/server/payments";

const now = DateTime.fromISO("2026-06-15T08:00:00", { zone: "Atlantic/Canary" });
const date = "2026-07-15";

beforeAll(() => {
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env });
});

function customer(suffix: string) {
  return {
    locale: "es",
    customerName: "Ana Test",
    customerEmail: `ana${suffix}@example.com`,
    customerPhone: "+34600000000",
    acceptTerms: true as const,
    acceptSafety: true as const,
    participants: 1,
    now,
  };
}

test("jet ski slots are every 30 minutes and parasail only on the hour", async () => {
  const ski = await daySlots({ variantId: "jetski-circuit-single", date, participants: 1, now });
  expect(ski.slots.map((slot) => slot.label)).toContain("11:00");
  expect(ski.slots.map((slot) => slot.label)).toContain("11:30");
  expect(ski.slots.map((slot) => slot.label)).not.toContain("17:30");
  const fly = await daySlots({ variantId: "parasail-single", date, participants: 1, now });
  expect(fly.slots.map((slot) => slot.label)).toEqual(["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]);
});

test("past dates and short notice are refused", async () => {
  const past = await daySlots({ variantId: "jetski-circuit-single", date: "2026-06-14", participants: 1, now });
  expect(past.slots).toHaveLength(0);
  await expect(createHold({ ...customer("past"), lines: [{ variantId: "jetski-circuit-single", date: "2026-06-14", startMinutes: 660, participants: 1 }] })).rejects.toBeInstanceOf(BookingError);
  const soon = DateTime.fromISO("2026-07-15T10:00:00", { zone: "Atlantic/Canary" });
  const slots = await daySlots({ variantId: "jetski-circuit-single", date, participants: 1, now: soon });
  expect(slots.slots.some((slot) => slot.label === "11:00")).toBe(false);
  expect(slots.slots.some((slot) => slot.label === "14:00")).toBe(true);
});

test("crazy sofa stays closed", async () => {
  const sofa = await daySlots({ variantId: "sofa-ride", date, participants: 2, now });
  expect(sofa.reason).toBe("unavailable");
});

test("two people cannot take the last jet ski", async () => {
  await prisma.resource.update({ where: { id: "jetskis" }, data: { capacity: 1 } });
  const line = { variantId: "jetski-circuit-single", date, startMinutes: 12 * 60, participants: 1 };
  const results = await Promise.allSettled([
    createHold({ ...customer("a"), lines: [line] }),
    createHold({ ...customer("b"), lines: [line] }),
  ]);
  const ok = results.filter((result) => result.status === "fulfilled");
  const denied = results.filter((result) => result.status === "rejected");
  expect(ok).toHaveLength(1);
  expect(denied).toHaveLength(1);
  const booking = ok[0].status === "fulfilled" ? ok[0].value : null;
  await cancelBooking(booking!.id, "test");
  const again = await daySlots({ variantId: "jetski-circuit-single", date, participants: 1, now });
  expect(again.slots.some((slot) => slot.startMinutes === 12 * 60)).toBe(true);
  await prisma.resource.update({ where: { id: "jetskis" }, data: { capacity: 4 } });
});

test("a pack holds every included activity and rejects overlaps", async () => {
  await expect(createHold({
    ...customer("packbad"),
    participants: 2,
    packVariantId: "pack-2-main",
    lines: [
      { variantId: "jetski-circuit-double", date, startMinutes: 11 * 60, participants: 2 },
      { variantId: "parasail-tandem", date, startMinutes: 11 * 60, participants: 2 },
    ],
  })).rejects.toMatchObject({ code: "SLOT_OVERLAP" });

  const booking = await createHold({
    ...customer("pack"),
    participants: 2,
    packVariantId: "pack-2-main",
    lines: [
      { variantId: "jetski-circuit-double", date, startMinutes: 11 * 60, participants: 2 },
      { variantId: "parasail-tandem", date, startMinutes: 12 * 60, participants: 2 },
    ],
  });
  const fly = await daySlots({ variantId: "parasail-tandem", date, participants: 2, now });
  expect(fly.slots.some((slot) => slot.startMinutes === 12 * 60)).toBe(false);
  const ski = await daySlots({ variantId: "jetski-circuit-double", date, participants: 2, now });
  expect(ski.slots.find((slot) => slot.startMinutes === 11 * 60)?.remaining).toBe(3);
  await rescheduleBooking(booking.id, [
    { variantId: "jetski-circuit-double", date, startMinutes: 15 * 60, participants: 2 },
    { variantId: "parasail-tandem", date, startMinutes: 16 * 60, participants: 2 },
  ], "test", now);
  const freed = await daySlots({ variantId: "parasail-tandem", date, participants: 2, now });
  expect(freed.slots.some((slot) => slot.startMinutes === 12 * 60)).toBe(true);
});

test("weather closure removes the day and payment is confirmed only on the server", async () => {
  await prisma.block.create({ data: { activityId: "jet-boat", date: "2026-08-01", endDate: "2026-08-01", reason: "swell", kind: "weather" } });
  const closed = await daySlots({ variantId: "jetboat-20", date: "2026-08-01", participants: 4, now });
  expect(closed.slots).toHaveLength(0);
  expect(closed.reason).toBe("closed");
  const booking = await createHold({
    ...customer("pay"),
    participants: 4,
    lines: [{ variantId: "jetboat-20", date, startMinutes: 11 * 60, participants: 4 }],
  });
  const started = await startPayment(booking.id, "full");
  expect(started.mode).toBe("test");
  if (started.mode !== "test") return;
  const payment = await prisma.payment.findUnique({ where: { id: started.paymentId } });
  expect(payment?.amountCents).toBe(14000);
  const paid = await confirmTestPayment(started.paymentId);
  expect(paid.status).toBe("PAID");
  expect(paid.paidCents).toBe(14000);
  const mail = await prisma.emailLog.findFirst({ where: { bookingId: booking.id } });
  expect(mail?.body).toContain(booking.reference);
  expect(mail?.body).toContain("Puerto Escala");
});

test("local times stay on the clock across the Canary daylight change", async () => {
  for (const day of ["2026-03-28", "2026-03-30", "2026-10-24", "2026-10-26"]) {
    const slots = await daySlots({ variantId: "parasail-single", date: day, participants: 1, now: DateTime.fromISO("2026-01-01T09:00:00", { zone: "Atlantic/Canary" }) });
    expect(slots.slots[0]?.label).toBe("11:00");
  }
});
