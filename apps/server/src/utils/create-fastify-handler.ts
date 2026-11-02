import { createFastifyHandlerFactory } from "@jeetgr/fastify-forge";

import { prisma } from "@/lib/prisma";
import type { PrismaClient, meddolic_user_details as User } from "@/lib/prisma";
import { authenticate } from "@/middlewares/authenticate";

type RouteOptions = { auth?: "user" | "admin" };

type AppCtx = {
  db: PrismaClient;
  user: User | null;
};

export const createFastifyHandler = createFastifyHandlerFactory<
  RouteOptions,
  AppCtx
>({
  createContext: async ({ req, reply, options }) => {
    if (options?.auth) {
      await authenticate(req, reply, options.auth);
      if (reply.sent) {
        return { db: prisma, user: null };
      }
      return { db: prisma, user: req.user };
    }
    return { db: prisma, user: null };
  },
});
