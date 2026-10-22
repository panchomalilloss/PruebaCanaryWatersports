import { currentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { AdminDesk } from "@/components/AdminDesk";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const user = await currentUser();
  const date = (await searchParams).date || new Date().toISOString().slice(0, 10);
  if (!user) return <AdminDesk user={null} date={date} bookings={[]} resources={[]} variants={[]} activities={[]} blocks={[]} />;
  const [bookings, resources, variants, activities, blocks] = await Promise.all([
    prisma.booking.findMany({ include: { items: true, payments: true }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.resource.findMany(),
    prisma.variant.findMany({ orderBy: { sort: "asc" } }),
    prisma.activity.findMany({ orderBy: { sort: "asc" } }),
    prisma.block.findMany({ orderBy: { date: "desc" }, take: 50 }),
  ]);
  return (
    <AdminDesk
      user={user}
      date={date}
      bookings={JSON.parse(JSON.stringify(bookings))}
      resources={resources}
      variants={variants.map((variant) => ({ id: variant.id, activityId: variant.activityId, priceCents: variant.priceCents, active: variant.active }))}
      activities={activities.map((activity) => ({ id: activity.id, bookable: activity.bookable }))}
      blocks={blocks.map((block) => ({ id: block.id, date: block.date, endDate: block.endDate, kind: block.kind, reason: block.reason, activityId: block.activityId }))}
    />
  );
}
