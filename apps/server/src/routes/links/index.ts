import type { FastifyInstance } from "fastify";

import { updateLink } from "./update-link";

export function linksRouter(app: FastifyInstance) {
  updateLink(app);
}
