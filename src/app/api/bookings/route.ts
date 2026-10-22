import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { BookingError, createHold } from "@/server/booking";

const schema = z.object({
  locale: z.string().max(5),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().max(160),
  customerPhone: z.string().min(6).max(40),
  customerNotes: z.string().max(1000).optional(),
  acceptTerms: z.literal(true),
  acceptSafety: z.literal(true),
  marketingOptIn: z.boolean().optional(),
  participants: z.number().int().min(1).max(20),
  packVariantId: z.string().optional(),
  lines: z.array(z.object({
    variantId: z.string().min(2),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startMinutes: z.number().int().min(0).max(1440),
    participants: z.number().int().min(1).max(20),
    spectators: z.number().int().min(0).max(10).optional(),
  })).min(1).max(12),
});

const hits = new Map<string, number[]>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length > 20) return NextResponse.json({ error: "RATE" }, { status: 429 });
  recent.push(now);
  hits.set(ip, recent);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID" }, { status: 400 });
  try {
    const booking = await createHold({ ...parsed.data, idempotencyKey: request.headers.get("idempotency-key") || undefined });
    const jar = await cookies();
    jar.set("cws_ref", booking.reference, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 });
    return NextResponse.json({ reference: booking.reference, status: booking.status });
  } catch (error) {
    const code = error instanceof BookingError ? error.code : "ERROR";
    return NextResponse.json({ error: code }, { status: 409 });
  }
}
