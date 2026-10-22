import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { clock } from "@/lib/format";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "DENIED" }, { status: 401 });
  const bookings = await prisma.booking.findMany({ include: { items: true, payments: true }, orderBy: { createdAt: "desc" } });
  const header = ["reference", "status", "date", "time", "activity", "variant", "participants", "name", "email", "phone", "total", "paid", "source"];
  const rows = bookings.flatMap((booking) =>
    (booking.items.length ? booking.items : [null]).map((item) => [
      booking.reference,
      booking.status,
      item?.date ?? "",
      item ? clock(item.startMinutes) : "",
      item?.activityId ?? "",
      item?.variantId ?? "",
      item ? String(item.participants) : String(booking.participants),
      booking.customerName,
      booking.customerEmail,
      booking.customerPhone,
      ((booking.totalCents - booking.discountCents) / 100).toFixed(2),
      (booking.paidCents / 100).toFixed(2),
      booking.source,
    ]),
  );
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=reservas.csv" } });
}
