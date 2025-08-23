import { PrismaClient } from "@prisma/client";

// Reuse Prisma client across hot reloads in development to avoid exhausting database connections.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
