import { PrismaClient } from "@15gg/prisma";
import { IS_DEVELOPMENT } from "utils";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.ORIGINAL_DATABASE_URL,
      },
    },
    errorFormat: "pretty",
    log: ["error", "warn"],
  });

if (IS_DEVELOPMENT) global.prisma = prisma;
