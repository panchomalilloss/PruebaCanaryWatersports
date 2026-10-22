import { NextResponse } from "next/server";
import { monthAvailability } from "@/server/booking";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const variantId = url.searchParams.get("variantId") || "";
  const month = url.searchParams.get("month") || "";
  const participants = Number(url.searchParams.get("participants") || 1);
  if (!/^\d{4}-\d{2}$/.test(month) || !variantId) return NextResponse.json({ days: {} }, { status: 400 });
  const days = await monthAvailability({ variantId, month, participants });
  return NextResponse.json({ days });
}
