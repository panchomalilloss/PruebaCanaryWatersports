import { prisma } from "./db";
import { BookingError, assertDeposit } from "./booking";
import { queueBookingEmails } from "./email";

export function dueCents(booking: { totalCents: number; discountCents: number; paidCents: number }) {
  return Math.max(0, booking.totalCents - booking.discountCents - booking.paidCents);
}

export async function startPayment(bookingId: string, mode: "full" | "deposit", depositCents?: number) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new BookingError("NOT_FOUND");
  if (booking.status !== "HELD" || !booking.holdExpiresAt || booking.holdExpiresAt < new Date()) throw new BookingError("HOLD_EXPIRED");
  const due = dueCents(booking);
  let amount = due;
  let kind: "full" | "deposit" = "full";
  if (mode === "deposit") {
    if (!depositCents) throw new BookingError("DEPOSIT");
    assertDeposit(depositCents);
    if (depositCents >= due) throw new BookingError("DEPOSIT");
    amount = depositCents;
    kind = "deposit";
  }
  const paymentMode = process.env.PAYMENT_MODE || "test";
  if (paymentMode === "stripe") {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new BookingError("PAYMENTS_UNCONFIGURED");
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(key);
    const payment = await prisma.payment.create({
      data: { bookingId, provider: "stripe", amountCents: amount, kind, status: "pending" },
    });
    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.customerEmail,
      success_url: `${site}/booking/${booking.reference}/?paid=1`,
      cancel_url: `${site}/checkout/?ref=${booking.reference}`,
      metadata: { bookingId: booking.id, paymentId: payment.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: { name: `Canary Watersports ${booking.reference}` },
          },
        },
      ],
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { providerRef: session.id } });
    return { mode: "stripe" as const, url: session.url, paymentId: payment.id };
  }
  if (paymentMode !== "test") throw new BookingError("PAYMENTS_UNCONFIGURED");
  const payment = await prisma.payment.create({
    data: { bookingId, provider: "test", amountCents: amount, kind, status: "pending" },
  });
  return { mode: "test" as const, paymentId: payment.id, amountCents: amount, testOnly: true as const };
}

export async function markPaymentSucceeded(paymentId: string, providerRef?: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: paymentId }, include: { booking: true } });
    if (!payment) throw new BookingError("NOT_FOUND");
    if (payment.status === "succeeded") return payment.booking;
    if (payment.booking.status !== "HELD" && payment.booking.status !== "CONFIRMED") throw new BookingError("STATE");
    const paid = payment.booking.paidCents + payment.amountCents;
    const total = payment.booking.totalCents - payment.booking.discountCents;
    const status = paid >= total ? "PAID" : "CONFIRMED";
    await tx.payment.update({ where: { id: paymentId }, data: { status: "succeeded", providerRef: providerRef ?? payment.providerRef } });
    return tx.booking.update({ where: { id: payment.bookingId }, data: { paidCents: paid, status, holdExpiresAt: null } });
  });
}

export async function confirmTestPayment(paymentId: string) {
  if ((process.env.PAYMENT_MODE || "test") !== "test") throw new BookingError("NOT_TEST");
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.provider !== "test") throw new BookingError("NOT_FOUND");
  const booking = await markPaymentSucceeded(paymentId);
  await queueBookingEmails(booking.id, booking.status === "PAID" ? "confirmed" : "confirmed");
  return booking;
}

export async function handleStripeEvent(rawBody: string, signature: string | null) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret || !signature) throw new BookingError("PAYMENTS_UNCONFIGURED");
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(key);
  const event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    const amount = session.amount_total;
    if (!paymentId || amount == null) throw new BookingError("PAYMENT_MISMATCH");
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.amountCents !== amount) throw new BookingError("PAYMENT_MISMATCH");
    const booking = await markPaymentSucceeded(paymentId, session.id);
    await queueBookingEmails(booking.id, "confirmed");
  }
  return { received: true };
}
