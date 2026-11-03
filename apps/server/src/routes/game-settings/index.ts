import type { FastifyInstance } from "fastify";

import { getMode } from "./get-mode";
import { updateMode } from "./update-mode";

export function gameSettingsRouter(app: FastifyInstance) {
  getMode(app);
  updateMode(app);
}
