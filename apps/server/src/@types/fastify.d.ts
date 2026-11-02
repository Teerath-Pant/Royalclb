import type { Server } from "socket.io";

import type { meddolic_user_details } from "@/lib/prisma";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }

  interface FastifyRequest {
    user: meddolic_user_details | null;
  }
}
