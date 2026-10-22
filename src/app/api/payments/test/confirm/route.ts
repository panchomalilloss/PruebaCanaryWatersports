import { NextResponse } from "next/server";
import { z } from "zod";
import { BookingError } from "@/server/booking";
import { confirmTestPayment } from "@/server/payments";

const schema = z.object({ paymentId: z.string().min(4) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID" }, { status: 400 });
  try {
    const booking = await confirmTestPayment(parsed.data.paymentId);
    return NextResponse.json({ reference: booking.reference, status: booking.status, paidCents: booking.paidCents });
  } catch (error) {
    const code = error instanceof BookingError ? error.code : "ERROR";
    return NextResponse.json({ error: code }, { status: 409 });
  }
}
