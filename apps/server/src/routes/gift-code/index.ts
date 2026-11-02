import type { FastifyInstance } from "fastify";

import { admin_create } from "./admin_create";
import { admin_delete } from "./admin_delete";
import { admin_get } from "./admin_get";
import { admin_list } from "./admin_list";
import { claim } from "./claim";
import { claim_history } from "./claim-history";

export function giftCodeRouter(app: FastifyInstance) {
  admin_list(app);
  admin_get(app);
  admin_create(app);
  admin_delete(app);
  claim(app);
  claim_history(app);
}
