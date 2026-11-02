import type { FastifyInstance } from "fastify";

import { deposit } from "./deposit";
import { getAccumulatedRevenue } from "./get-accumulated-revenue";
import { getBalance } from "./get-balance";
import { getInterestLogs } from "./get-interest-logs";
import { getSettings } from "./get-settings";
import { getTransactions } from "./get-transactions";
import { withdraw } from "./withdrawal";

export function safeRouter(app: FastifyInstance) {
  deposit(app);
  withdraw(app);
  getSettings(app);
  getTransactions(app);
  getInterestLogs(app);
  getBalance(app);
  getAccumulatedRevenue(app);
}
