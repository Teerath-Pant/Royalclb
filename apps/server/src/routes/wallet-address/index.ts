import type { FastifyInstance } from "fastify";

import { add } from "./add";
import { getAll } from "./get-all";
import { remove } from "./remove";
import { update } from "./update";

export function walletAddressRouter(app: FastifyInstance) {
  getAll(app);
  add(app);
  remove(app);
  update(app);
}
