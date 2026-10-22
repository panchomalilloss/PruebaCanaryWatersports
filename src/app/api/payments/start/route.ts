import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { BookingError } from "@/server/booking";
import { startPayment } from "@/server/payments";

const schema = z.object({
  reference: z.string().min(6),
  mode: z.enum(["full", "deposit"]),
  depositCents: z.number().int().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID" }, { status: 400 });
  const booking = await prisma.booking.findUnique({ where: { reference: parsed.data.reference } });
  if (!booking) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  try {
    const result = await startPayment(booking.id, parsed.data.mode, parsed.data.depositCents);
    return NextResponse.json(result);
  } catch (error) {
    const code = error instanceof BookingError ? error.code : "ERROR";
    return NextResponse.json({ error: code }, { status: 409 });
  }
}
