import type { FastifyInstance } from "fastify";

import { get } from "./get";
import { list } from "./list";
import { upsert } from "./upsert";

export function withdrawalMethodsRouter(app: FastifyInstance) {
  list(app);
  get(app);
  upsert(app);
}
