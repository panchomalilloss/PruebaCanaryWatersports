import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { activities, packComponents, resources, variants } from "../src/content/catalog";

const prisma = new PrismaClient();

async function main() {
  await prisma.emailLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.packComponent.deleteMany();
  await prisma.variantResource.deleteMany();
  await prisma.extraSlot.deleteMany();
  await prisma.block.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();
  await prisma.mutex.deleteMany();

  await prisma.mutex.create({ data: { key: "booking" } });

  for (const resource of resources) {
    const fromEnv = "capacityEnv" in resource && resource.capacityEnv ? Number(process.env[resource.capacityEnv]) : NaN;
    await prisma.resource.create({
      data: {
        id: resource.id,
        name: resource.name,
        capacity: Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : resource.fallback,
        assumption: resource.assumption,
        notes: resource.notes,
      },
    });
  }

  for (const activity of activities) {
    await prisma.activity.create({
      data: {
        id: activity.id,
        bookable: activity.bookable,
        sort: activity.sort,
        image: activity.image,
        isPack: activity.isPack,
        names: JSON.stringify(activity.names),
        summaries: JSON.stringify(activity.summaries),
      },
    });
  }

  for (const variant of variants) {
    await prisma.variant.create({
      data: {
        id: variant.id,
        activityId: variant.activityId,
        durationMinutes: variant.durationMinutes,
        bufferMinutes: variant.bufferMinutes,
        intervalMinutes: variant.intervalMinutes,
        slotRule: variant.slotRule,
        minParticipants: variant.minParticipants,
        maxParticipants: variant.maxParticipants,
        participantStep: variant.participantStep,
        priceCents: variant.priceCents,
        pricingUnit: variant.pricingUnit,
        focus: variant.focus,
        sort: variant.sort,
        allowSpectators: Boolean(variant.allowSpectators),
        names: JSON.stringify(variant.names),
        blurbs: JSON.stringify(variant.blurbs),
        resources: {
          create: variant.resources.map((resource) => ({
            resourceId: resource.resourceId,
            basis: resource.basis,
            units: resource.units,
            groupSize: resource.groupSize ?? 1,
          })),
        },
      },
    });
  }

  for (const component of packComponents) {
    await prisma.packComponent.create({ data: component });
  }

  await prisma.schedule.create({
    data: {
      label: "Regular season",
      weekdays: "*",
      openMinutes: 11 * 60,
      closeMinutes: 17 * 60 + 30,
    },
  });

  const email = (process.env.ADMIN_EMAIL || "admin@canarywatersports.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "change-me-before-production";
  await prisma.user.create({
    data: {
      email,
      name: process.env.ADMIN_NAME || "Canary Watersports",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });
  console.log(`Admin ready: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
