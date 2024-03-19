import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb; //fix warning related to Next.js and hot reloading. There is a chance a hot reload will create a new prisma client and the old one will be left open.

export default prismadb;
