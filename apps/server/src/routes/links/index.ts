import type { FastifyInstance } from "fastify";

import { getLink } from "./get-link";
import { updateLink } from "./update-link";

export function linksRouter(app: FastifyInstance) {
  getLink(app);
  updateLink(app);
}
