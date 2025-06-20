import * as PrismaClientModule from "@prisma/client";
const PrismaClient = PrismaClientModule.PrismaClient;

const globalForPrisma = global as unknown as { prisma: PrismaClientModule.PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;