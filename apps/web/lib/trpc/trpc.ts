import { initTRPC } from "@trpc/server";
import type { inferAsyncReturnType } from "@trpc/server";
import { prisma } from "@/lib/prisma";

export const createTRPCContext = async () => ({ prisma });

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
