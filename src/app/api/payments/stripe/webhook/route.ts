import { NextResponse } from "next/server";
import { BookingError } from "@/server/booking";
import { handleStripeEvent } from "@/server/payments";

export async function POST(request: Request) {
  const body = await request.text();
  try {
    const result = await handleStripeEvent(body, request.headers.get("stripe-signature"));
    return NextResponse.json(result);
  } catch (error) {
    const code = error instanceof BookingError ? error.code : "ERROR";
    return NextResponse.json({ error: code }, { status: 400 });
  }
}
