import { randomBytes } from "crypto";
import { DateTime } from "luxon";
import type { Booking, BookingItem, Schedule, Variant, VariantResource } from "@prisma/client";
import { prisma, type Db } from "./db";
import { buildSlots, dateKey, localNow, monthBounds, slotDateTime, type BuiltSlot } from "./time";
import { unitsFor } from "@/content/catalog";
import { queueBookingEmails } from "./email";

export class BookingError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

const ACTIVE = new Set(["HELD", "CONFIRMED", "PAID", "RESCHEDULED", "COMPLETED"]);

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function holdsCapacity(status: string, holdExpiresAt: Date | null, now: Date) {
  if (!ACTIVE.has(status)) return false;
  if (status === "HELD") return !!holdExpiresAt && holdExpiresAt > now;
  return true;
}

type ItemWithBooking = BookingItem & { booking: Booking };
type VariantFull = Variant & { resources: VariantResource[] };

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export function neededUnits(resources: VariantResource[], participants: number, spectators = 0) {
  const usage: { resourceId: string; units: number }[] = [];
  for (const resource of resources) {
    usage.push({
      resourceId: resource.resourceId,
      units: unitsFor(resource.basis, resource.units, resource.groupSize, participants),
    });
  }
  if (spectators > 0) {
    const existing = usage.find((row) => row.resourceId === "parasail-spectators");
    if (existing) existing.units += spectators;
    else usage.push({ resourceId: "parasail-spectators", units: spectators });
  }
  return usage.filter((row) => row.units > 0);
}

function resolveSchedule(schedules: Schedule[], activityId: string, date: string) {
  const weekday = String(DateTime.fromISO(date, { zone: "Atlantic/Canary" }).weekday);
  const matching = schedules.filter((schedule) => {
    if (schedule.activityId && schedule.activityId !== activityId) return false;
    if (schedule.validFrom && date < schedule.validFrom) return false;
    if (schedule.validTo && date > schedule.validTo) return false;
    if (schedule.weekdays !== "*" && !schedule.weekdays.split(",").includes(weekday)) return false;
    return true;
  });
  matching.sort((a, b) => {
    const score = (schedule: Schedule) => (schedule.activityId ? 2 : 0) + (schedule.validFrom ? 1 : 0);
    return score(b) - score(a);
  });
  return matching[0] ?? null;
}

async function loadContext(db: Db, from: string, to: string) {
  const [variants, resources, schedules, blocks, extras, items] = await Promise.all([
    db.variant.findMany({ include: { resources: true, activity: true, packComponents: true } }),
    db.resource.findMany(),
    db.schedule.findMany(),
    db.block.findMany({ where: { date: { lte: to }, endDate: { gte: from } } }),
    db.extraSlot.findMany({ where: { date: { gte: from, lte: to } } }),
    db.bookingItem.findMany({ where: { date: { gte: from, lte: to } }, include: { booking: true } }),
  ]);
  return { variants, resources, schedules, blocks, extras, items };
}

function blocked(blocks: { activityId: string | null; date: string; endDate: string; startMinutes: number | null; endMinutes: number | null }[], activityId: string, date: string, start: number, end: number) {
  return blocks.some((block) => {
    if (block.activityId && block.activityId !== activityId) return false;
    if (date < block.date || date > block.endDate) return false;
    if (block.startMinutes == null || block.endMinutes == null) return true;
    return overlaps(start, end, block.startMinutes, block.endMinutes);
  });
}

function usedUnits(items: ItemWithBooking[], resourceId: string, date: string, start: number, end: number, now: Date, ignoreBookingId?: string) {
  let used = 0;
  for (const item of items) {
    if (item.date !== date) continue;
    if (ignoreBookingId && item.bookingId === ignoreBookingId) continue;
    if (!holdsCapacity(item.booking.status, item.booking.holdExpiresAt, now)) continue;
    if (!overlaps(start, end, item.startMinutes, item.occupiedUntil)) continue;
    const snapshot = JSON.parse(item.resourceSnapshot) as { resourceId: string; units: number }[];
    used += snapshot.find((row) => row.resourceId === resourceId)?.units ?? 0;
  }
  return used;
}

function boatAlreadyBooked(items: ItemWithBooking[], date: string, start: number, end: number, now: Date) {
  return items.some((item) => {
    if (item.date !== date || item.variantId === "parasail-passenger") return false;
    if (!holdsCapacity(item.booking.status, item.booking.holdExpiresAt, now)) return false;
    if (!overlaps(start, end, item.startMinutes, item.occupiedUntil)) return false;
    const snapshot = JSON.parse(item.resourceSnapshot) as { resourceId: string; units: number }[];
    return snapshot.some((row) => row.resourceId === "parasail-boat" && row.units > 0);
  });
}

export type SlotResult = BuiltSlot & { label: string; remaining: number };

export async function daySlots(opts: {
  variantId: string;
  date: string;
  participants: number;
  spectators?: number;
  ignoreMin?: boolean;
  now?: DateTime;
  ignoreBookingId?: string;
}) {
  const nowDt = localNow(opts.now);
  const now = nowDt.toJSDate();
  const ctx = await loadContext(prisma, opts.date, opts.date);
  const variant = ctx.variants.find((item) => item.id === opts.variantId);
  if (!variant || !variant.active) return { slots: [] as SlotResult[], reason: "unavailable" as const };
  if (!variant.activity.bookable) return { slots: [], reason: "unavailable" as const };
  const schedule = resolveSchedule(ctx.schedules, variant.activityId, opts.date);
  if (!schedule || schedule.closed) return { slots: [], reason: "closed" as const };
  if (!opts.ignoreMin && (opts.participants < variant.minParticipants || opts.participants > variant.maxParticipants)) {
    return { slots: [], reason: "participants" as const };
  }
  if (opts.participants % variant.participantStep !== 0) return { slots: [], reason: "participants" as const };

  const extras = ctx.extras.filter((extra) => extra.activityId === variant.activityId && extra.date === opts.date).map((extra) => extra.startMinutes);
  const grid = buildSlots({
    openMinutes: schedule.openMinutes,
    closeMinutes: schedule.closeMinutes,
    interval: variant.intervalMinutes,
    duration: variant.durationMinutes,
    buffer: variant.bufferMinutes,
    rule: variant.slotRule,
    extras,
  });
  const usage = neededUnits(variant.resources, opts.participants, opts.spectators ?? 0);
  const capacity = new Map(ctx.resources.map((resource) => [resource.id, resource.capacity]));
  const slots: SlotResult[] = [];
  for (const slot of grid) {
    const when = slotDateTime(opts.date, slot.startMinutes);
    if (when < nowDt.plus({ minutes: variant.leadMinutes })) continue;
    if (blocked(ctx.blocks, variant.activityId, opts.date, slot.startMinutes, slot.occupiedUntil)) continue;
    if (variant.id === "parasail-passenger" && !boatAlreadyBooked(ctx.items, opts.date, slot.startMinutes, slot.occupiedUntil, now)) continue;
    let remaining = Number.POSITIVE_INFINITY;
    let ok = true;
    for (const row of usage) {
      const cap = capacity.get(row.resourceId) ?? 0;
      const left = cap - usedUnits(ctx.items, row.resourceId, opts.date, slot.startMinutes, slot.occupiedUntil, now, opts.ignoreBookingId);
      remaining = Math.min(remaining, left);
      if (left < row.units) ok = false;
    }
    if (!ok) continue;
    slots.push({ ...slot, label: when.toFormat("HH:mm"), remaining: Number.isFinite(remaining) ? remaining : 0 });
  }
  const wholeDay = ctx.blocks.some((block) => {
    if (block.activityId && block.activityId !== variant.activityId) return false;
    if (opts.date < block.date || opts.date > block.endDate) return false;
    return block.startMinutes == null || block.endMinutes == null;
  });
  if (!slots.length && wholeDay) return { slots, reason: "closed" as const };
  return { slots, reason: slots.length ? null : ("full" as const) };
}

export async function monthAvailability(opts: { variantId: string; month: string; participants: number; now?: DateTime }) {
  const { from, to, start, end } = monthBounds(opts.month);
  const nowDt = localNow(opts.now);
  const variant = await prisma.variant.findUnique({ where: { id: opts.variantId }, include: { activity: true, resources: true } });
  if (!variant) return {};
  const days: Record<string, "past" | "closed" | "full" | "open" | "unavailable"> = {};
  for (let cursor = start; cursor <= end; cursor = cursor.plus({ days: 1 })) {
    const date = dateKey(cursor);
    if (date < dateKey(nowDt)) {
      days[date] = "past";
      continue;
    }
    if (!variant.activity.bookable || !variant.active) {
      days[date] = "unavailable";
      continue;
    }
    const result = await daySlots({ ...opts, date, now: nowDt });
    days[date] = result.reason === "closed" ? "closed" : result.slots.length ? "open" : result.reason === "unavailable" ? "unavailable" : "full";
  }
  return days;
  void from;
  void to;
}

type LineInput = {
  variantId: string;
  date: string;
  startMinutes: number;
  participants: number;
  spectators?: number;
};

export type HoldInput = {
  locale: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
  acceptTerms: boolean;
  acceptSafety: boolean;
  marketingOptIn?: boolean;
  lines: LineInput[];
  packVariantId?: string;
  participants: number;
  idempotencyKey?: string;
  source?: string;
  couponCode?: string;
  now?: DateTime;
  ignoreBookingId?: string;
};

function referenceFor(date: string) {
  return `CWS-${date.replace(/-/g, "")}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function rangesOverlap(lines: { date: string; start: number; end: number }[]) {
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[i].date === lines[j].date && overlaps(lines[i].start, lines[i].end, lines[j].start, lines[j].end)) return true;
    }
  }
  return false;
}

export async function quoteLines(input: HoldInput) {
  const pack = input.packVariantId ? await prisma.variant.findUnique({ where: { id: input.packVariantId }, include: { packComponents: true, activity: true } }) : null;
  if (input.packVariantId && (!pack || !pack.activity.isPack)) throw new BookingError("PACK_INVALID");
  const variants = await prisma.variant.findMany({ include: { resources: true, activity: true } });
  const byId = new Map(variants.map((variant) => [variant.id, variant]));
  if (pack) {
    if (input.participants < pack.minParticipants || input.participants > pack.maxParticipants || input.participants % pack.participantStep !== 0) {
      throw new BookingError("PARTICIPANTS");
    }
    const pairs = input.participants / 2;
    for (const component of pack.packComponents) {
      const matching = input.lines.filter((line) => line.variantId === component.componentVariantId);
      if (component.slotMode === "perPair") {
        if (matching.length !== pairs) throw new BookingError("PACK_SLOTS");
        if (matching.some((line) => line.participants !== 2)) throw new BookingError("PARTICIPANTS");
      } else if (matching.length !== 1 || matching[0].participants !== input.participants) {
        throw new BookingError("PACK_SLOTS");
      }
    }
    const allowed = new Set(pack.packComponents.map((component) => component.componentVariantId));
    if (input.lines.some((line) => !allowed.has(line.variantId))) throw new BookingError("PACK_SLOTS");
  } else if (input.lines.length !== 1) {
    throw new BookingError("LINES");
  }

  let total = 0;
  const prepared: {
    variant: VariantFull & { activity: { bookable: boolean; id: string } };
    line: LineInput;
    slot: BuiltSlot;
    usage: { resourceId: string; units: number }[];
    priceCents: number;
  }[] = [];

  for (const line of input.lines) {
    const variant = byId.get(line.variantId);
    if (!variant || !variant.active || !variant.activity.bookable) throw new BookingError("UNAVAILABLE");
    const ignoreMin = Boolean(pack && variant.id === "jetboat-20");
    const result = await daySlots({
      variantId: variant.id,
      date: line.date,
      participants: line.participants,
      spectators: line.spectators ?? 0,
      ignoreMin,
      now: input.now,
      ignoreBookingId: input.ignoreBookingId,
    });
    const slot = result.slots.find((item) => item.startMinutes === line.startMinutes);
    if (!slot) throw new BookingError(result.reason === "closed" ? "CLOSED" : "SLOT_UNAVAILABLE");
    const spectators = variant.allowSpectators ? line.spectators ?? 0 : 0;
    if (!variant.allowSpectators && (line.spectators ?? 0) > 0) throw new BookingError("SPECTATORS");
    const usage = neededUnits(variant.resources, line.participants, spectators);
    const price = (variant.pricingUnit === "person" ? variant.priceCents * line.participants : variant.priceCents) + spectators * 1500;
    total += price;
    prepared.push({ variant, line: { ...line, spectators }, slot, usage, priceCents: price });
  }

  if (pack) {
    total = pack.priceCents * input.participants;
    const share = prepared.length ? Math.floor(total / prepared.length) : 0;
    prepared.forEach((row, index) => {
      row.priceCents = index === prepared.length - 1 ? total - share * (prepared.length - 1) : share;
    });
  }

  if (rangesOverlap(prepared.map((row) => ({ date: row.line.date, start: row.slot.startMinutes, end: row.slot.occupiedUntil })))) {
    throw new BookingError("SLOT_OVERLAP");
  }

  let discount = 0;
  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: input.couponCode.trim().toUpperCase() } });
    if (!coupon || !coupon.active) throw new BookingError("COUPON");
    discount = coupon.percentOff ? Math.round((total * coupon.percentOff) / 100) : Math.min(total, coupon.amountOffCents ?? 0);
  }
  return { prepared, total, discount, pack };
}

async function assertStillFree(db: Db, quoted: Awaited<ReturnType<typeof quoteLines>>, now: Date, ignoreBookingId?: string) {
  const dates = [...new Set(quoted.prepared.map((row) => row.line.date))];
  const [items, resources] = await Promise.all([
    db.bookingItem.findMany({ where: { date: { in: dates } }, include: { booking: true } }),
    db.resource.findMany(),
  ]);
  const capacity = new Map(resources.map((resource) => [resource.id, resource.capacity]));
  for (const row of quoted.prepared) {
    for (const use of row.usage) {
      const left = (capacity.get(use.resourceId) ?? 0) - usedUnits(items, use.resourceId, row.line.date, row.slot.startMinutes, row.slot.occupiedUntil, now, ignoreBookingId);
      if (left < use.units) throw new BookingError("SLOT_UNAVAILABLE");
    }
  }
}

export async function createHold(input: HoldInput) {
  if (!input.acceptTerms || !input.acceptSafety) throw new BookingError("CONSENT");
  return withLock(async () => {
    if (input.idempotencyKey) {
      const existing = await prisma.booking.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
      if (existing) return existing;
    }
    const quoted = await quoteLines(input);
    const now = localNow(input.now).toJSDate();
    const firstDate = quoted.prepared[0]?.line.date ?? dateKey(localNow(input.now));
    const holdMinutes = Number(process.env.HOLD_MINUTES || 15);
    return prisma.$transaction(async (tx) => {
      await tx.mutex.update({ where: { key: "booking" }, data: { key: "booking" } });
      await assertStillFree(tx, quoted, now, input.ignoreBookingId);
      return tx.booking.create({
        data: {
          reference: referenceFor(firstDate),
          idempotencyKey: input.idempotencyKey,
          status: "HELD",
          locale: input.locale,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerNotes: input.customerNotes ?? "",
          source: input.source ?? "web",
          totalCents: quoted.total,
          discountCents: quoted.discount,
          paidCents: 0,
          holdExpiresAt: new Date(Date.now() + holdMinutes * 60 * 1000),
          acceptTerms: true,
          acceptSafety: true,
          marketingOptIn: Boolean(input.marketingOptIn),
          packVariantId: input.packVariantId,
          participants: input.participants,
          items: {
            create: quoted.prepared.map((row) => ({
              activityId: row.variant.activityId,
              variantId: row.variant.id,
              date: row.line.date,
              startMinutes: row.slot.startMinutes,
              endMinutes: row.slot.endMinutes,
              occupiedUntil: row.slot.occupiedUntil,
              participants: row.line.participants,
              spectators: row.line.spectators ?? 0,
              priceCents: row.priceCents,
              resourceSnapshot: JSON.stringify(row.usage),
            })),
          },
        },
      });
    }, { isolationLevel: "Serializable", timeout: 20000 });
  });
}

export async function cancelBooking(id: string, actor: string, reason = "") {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED", staffNotes: reason, holdExpiresAt: new Date(0) },
  });
  await prisma.auditLog.create({ data: { actor, action: "cancel", detail: booking.reference } });
  await queueBookingEmails(booking.id, "cancelled");
  return booking;
}

export async function rescheduleBooking(id: string, lines: LineInput[], actor: string, now?: DateTime) {
  return withLock(async () => {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.status === "CANCELLED") throw new BookingError("NOT_FOUND");
    const quoted = await quoteLines({
      locale: booking.locale,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      acceptTerms: true,
      acceptSafety: true,
      lines,
      packVariantId: booking.packVariantId ?? undefined,
      participants: booking.participants,
      now,
      ignoreBookingId: id,
    });
    const updated = await prisma.$transaction(async (tx) => {
      await tx.mutex.update({ where: { key: "booking" }, data: { key: "booking" } });
      await assertStillFree(tx, quoted, localNow(now).toJSDate(), id);
      await tx.bookingItem.deleteMany({ where: { bookingId: id } });
      await tx.bookingItem.createMany({
        data: quoted.prepared.map((row) => ({
          bookingId: id,
          activityId: row.variant.activityId,
          variantId: row.variant.id,
          date: row.line.date,
          startMinutes: row.slot.startMinutes,
          endMinutes: row.slot.endMinutes,
          occupiedUntil: row.slot.occupiedUntil,
          participants: row.line.participants,
          spectators: row.line.spectators ?? 0,
          priceCents: row.priceCents,
          resourceSnapshot: JSON.stringify(row.usage),
        })),
      });
      const next = await tx.booking.update({
        where: { id },
        data: { status: "RESCHEDULED", totalCents: quoted.total, holdExpiresAt: null },
      });
      await tx.auditLog.create({ data: { actor, action: "reschedule", detail: booking.reference } });
      return next;
    });
    await queueBookingEmails(updated.id, "rescheduled");
    return updated;
  });
}

export async function createManualBooking(input: HoldInput & { status?: "CONFIRMED" | "PAID" | "PENDING"; paidCents?: number }) {
  if (input.status === "PENDING") {
    const booking = await prisma.booking.create({
      data: {
        reference: referenceFor(input.lines[0]?.date ?? dateKey(localNow())),
        status: "PENDING",
        locale: input.locale,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        customerNotes: input.customerNotes ?? "",
        source: input.source ?? "admin",
        totalCents: 0,
        paidCents: 0,
        acceptTerms: true,
        acceptSafety: true,
        participants: input.participants,
        packVariantId: input.packVariantId,
      },
    });
    return booking;
  }
  const booking = await createHold({ ...input, acceptTerms: true, acceptSafety: true, source: input.source ?? "admin" });
  const status = input.status ?? "CONFIRMED";
  const paid = status === "PAID" ? booking.totalCents - booking.discountCents : input.paidCents ?? 0;
  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status, paidCents: paid, holdExpiresAt: null, source: input.source ?? "admin" },
  });
  if (paid > 0) {
    await prisma.payment.create({
      data: { bookingId: booking.id, provider: "manual", amountCents: paid, kind: paid >= updated.totalCents ? "full" : "deposit", status: "succeeded" },
    });
  }
  await queueBookingEmails(updated.id, "confirmed");
  return updated;
}

export async function markCompleted(id: string, actor: string) {
  const booking = await prisma.booking.update({ where: { id }, data: { status: "COMPLETED" } });
  await prisma.auditLog.create({ data: { actor, action: "complete", detail: booking.reference } });
  return booking;
}

export function assertDeposit(amount: number) {
  if (![2000, 3000, 5000].includes(amount)) throw new BookingError("DEPOSIT");
}
