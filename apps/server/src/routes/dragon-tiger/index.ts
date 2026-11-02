import type { FastifyInstance } from "fastify";

import { betHistoryAdmin } from "./bet-history_admin";
import { gameHistory } from "./game-history";
import { gameHistoryAdmin } from "./game-history_admin";
import { gameResult } from "./game-result";
import { getResult } from "./get-result";
import { getTotalBet } from "./get-total-bet";
import { placeBet } from "./place-bet";

export function dragonTigerRouter(app: FastifyInstance) {
  gameHistory(app);
  getTotalBet(app);
  gameResult(app);
  getResult(app);
  gameHistoryAdmin(app);
  betHistoryAdmin(app);
  placeBet(app);
}
