import { appRouter } from "@/lib/trpc/router";
import { createTRPCContext } from "@/lib/trpc/trpc";

export const createCaller = async () => {
  const ctx = await createTRPCContext();
  return appRouter.createCaller(ctx);
};
