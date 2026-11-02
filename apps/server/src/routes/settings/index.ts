import type { FastifyInstance } from "fastify";

import { get } from "./get";

export function settingsRouter(app: FastifyInstance) {
  get(app);
}
