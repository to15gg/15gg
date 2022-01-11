import { PrismaClient } from "@15gg/prisma/edge";
import { IS_DEVELOPMENT } from "utils";

declare global {
  var prismaEdge: PrismaClient | undefined;
  var count: number;
}

export * from "@15gg/prisma/edge";

export const prismaEdge =
  global.prismaEdge ||
  new PrismaClient({
    errorFormat: "pretty",
    log: ["error", "warn"],
  });

if (IS_DEVELOPMENT) global.prismaEdge = prismaEdge;

globalThis["fetch"] = global["fetch"];
globalThis["Headers"] = global["Headers"];
globalThis["Request"] = global["Request"];
globalThis["FormData"] = global["FormData"];
globalThis["Response"] = global["Response"];
globalThis["AbortController"] = global["AbortController"];
