import { existsSync } from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";

function sqliteUrl() {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  if (!url.startsWith("file:")) return url;
  const spec = url.slice("file:".length);
  if (spec.startsWith("//") || spec.startsWith("/") || /^[A-Za-z]:[\\/]/.test(spec)) return url;
  const relative = spec.replace(/^\.\//, "");
  const direct = path.resolve(process.cwd(), relative);
  const nested = path.resolve(process.cwd(), "prisma", relative);
  const found = existsSync(direct) ? direct : nested;
  return `file:${found.replace(/\\/g, "/")}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: sqliteUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type Db = PrismaClient | Prisma.TransactionClient;
