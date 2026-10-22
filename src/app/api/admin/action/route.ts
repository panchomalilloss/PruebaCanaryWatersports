import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { BookingError, cancelBooking, createManualBooking, markCompleted, rescheduleBooking } from "@/server/booking";
import { queueBookingEmails } from "@/server/email";

const line = z.object({
  variantId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startMinutes: z.number().int(),
  participants: z.number().int(),
});

const schema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("cancel"), id: z.string(), reason: z.string().optional() }),
  z.object({ type: z.literal("complete"), id: z.string() }),
  z.object({ type: z.literal("cash"), id: z.string() }),
  z.object({ type: z.literal("reschedule"), id: z.string(), lines: z.array(line).min(1) }),
  z.object({ type: z.literal("block"), activityId: z.string().optional(), date: z.string(), endDate: z.string(), reason: z.string(), kind: z.enum(["manual", "weather", "holiday"]) }),
  z.object({ type: z.literal("unblock"), id: z.string() }),
  z.object({ type: z.literal("capacity"), id: z.string(), capacity: z.number().int().min(0).max(100) }),
  z.object({ type: z.literal("price"), id: z.string(), priceCents: z.number().int().min(0), active: z.boolean() }),
  z.object({ type: z.literal("bookable"), id: z.string(), bookable: z.boolean() }),
  z.object({ type: z.literal("schedule"), activityId: z.string().optional(), label: z.string(), validFrom: z.string().optional(), validTo: z.string().optional(), openMinutes: z.number().int(), closeMinutes: z.number().int(), closed: z.boolean() }),
  z.object({ type: z.literal("extra"), activityId: z.string(), date: z.string(), startMinutes: z.number().int() }),
  z.object({ type: z.literal("coupon"), code: z.string().min(2), percentOff: z.number().int().optional(), amountOffCents: z.number().int().optional() }),
  z.object({
    type: z.literal("manual"),
    locale: z.string(),
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(6),
    source: z.enum(["phone", "whatsapp", "walkin", "admin"]),
    status: z.enum(["CONFIRMED", "PAID", "PENDING"]),
    participants: z.number().int(),
    lines: z.array(line).min(1),
    packVariantId: z.string().optional(),
  }),
]);

const adminOnly = new Set(["capacity", "price", "bookable", "schedule", "coupon"]);

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "DENIED" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID" }, { status: 400 });
  if (adminOnly.has(parsed.data.type) && user.role !== "ADMIN") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const body = parsed.data;
  try {
    if (body.type === "cancel") await cancelBooking(body.id, user.email, body.reason);
    if (body.type === "complete") await markCompleted(body.id, user.email);
    if (body.type === "cash") {
      const booking = await prisma.booking.findUnique({ where: { id: body.id } });
      if (!booking) throw new BookingError("NOT_FOUND");
      const paid = booking.totalCents - booking.discountCents;
      await prisma.payment.create({ data: { bookingId: booking.id, provider: "cash", amountCents: paid - booking.paidCents, kind: "balance", status: "succeeded" } });
      await prisma.booking.update({ where: { id: booking.id }, data: { status: "PAID", paidCents: paid, holdExpiresAt: null } });
      await queueBookingEmails(booking.id, "confirmed");
    }
    if (body.type === "reschedule") await rescheduleBooking(body.id, body.lines, user.email);
    if (body.type === "block") await prisma.block.create({ data: { activityId: body.activityId || null, date: body.date, endDate: body.endDate, reason: body.reason, kind: body.kind } });
    if (body.type === "unblock") await prisma.block.delete({ where: { id: body.id } });
    if (body.type === "capacity") await prisma.resource.update({ where: { id: body.id }, data: { capacity: body.capacity, assumption: false } });
    if (body.type === "price") await prisma.variant.update({ where: { id: body.id }, data: { priceCents: body.priceCents, active: body.active } });
    if (body.type === "bookable") await prisma.activity.update({ where: { id: body.id }, data: { bookable: body.bookable } });
    if (body.type === "schedule") {
      await prisma.schedule.create({
        data: {
          activityId: body.activityId || null,
          label: body.label,
          validFrom: body.validFrom || null,
          validTo: body.validTo || null,
          weekdays: "*",
          openMinutes: body.openMinutes,
          closeMinutes: body.closeMinutes,
          closed: body.closed,
        },
      });
    }
    if (body.type === "extra") await prisma.extraSlot.create({ data: body });
    if (body.type === "coupon") await prisma.coupon.upsert({ where: { code: body.code.toUpperCase() }, update: { percentOff: body.percentOff, amountOffCents: body.amountOffCents, active: true }, create: { code: body.code.toUpperCase(), percentOff: body.percentOff, amountOffCents: body.amountOffCents } });
    if (body.type === "manual") {
      await createManualBooking({
        ...body,
        acceptTerms: true,
        acceptSafety: true,
      });
    }
    await prisma.auditLog.create({ data: { actor: user.email, action: body.type, detail: JSON.stringify(body).slice(0, 500) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = error instanceof BookingError ? error.code : "ERROR";
    return NextResponse.json({ error: code }, { status: 409 });
  }
}
