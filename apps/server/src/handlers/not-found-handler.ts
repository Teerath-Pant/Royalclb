import type { FastifyRequest, FastifyReply } from "fastify";

import { AppResponse } from "@/utils/app-response";

export function notFoundHandler(req: FastifyRequest, reply: FastifyReply) {
  AppResponse.error(reply, {
    code: "NOT_FOUND",
    message: `Route not found: ${req.url}`,
  });
}
