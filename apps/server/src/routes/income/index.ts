import type { FastifyInstance } from "fastify";

import { commissionSummary } from "./commission-summary";
import { listIncome } from "./list-income";

export function incomeRouter(app: FastifyInstance) {
  commissionSummary(app);
  listIncome(app);
}
