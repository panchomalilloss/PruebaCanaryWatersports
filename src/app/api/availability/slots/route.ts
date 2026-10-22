import { NextResponse } from "next/server";
import { daySlots } from "@/server/booking";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const variantId = url.searchParams.get("variantId") || "";
  const date = url.searchParams.get("date") || "";
  const participants = Number(url.searchParams.get("participants") || 1);
  const spectators = Number(url.searchParams.get("spectators") || 0);
  const ignoreMin = url.searchParams.get("ignoreMin") === "1";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !variantId) return NextResponse.json({ slots: [], reason: "unavailable" }, { status: 400 });
  const result = await daySlots({ variantId, date, participants, spectators, ignoreMin });
  return NextResponse.json(result);
}
