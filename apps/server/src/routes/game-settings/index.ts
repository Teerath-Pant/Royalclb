import type { FastifyInstance } from "fastify";

import { updateMode } from "./update-mode";

export function gameSettingsRouter(app: FastifyInstance) {
  updateMode(app);
}
