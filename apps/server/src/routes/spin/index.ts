import type { FastifyInstance } from "fastify";

import { postSpin } from "./post-spin";

export function spinRouter(app: FastifyInstance) {
  postSpin(app);
}
