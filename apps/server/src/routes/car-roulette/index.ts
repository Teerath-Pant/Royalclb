import type { FastifyInstance } from "fastify";

import { betHistoryAdmin } from "./bet-history_admin";
import { gameHistory } from "./game-history";
import { gameHistoryAdmin } from "./game-history_admin";
import { gameResult } from "./game-result";
import { getResult } from "./get-result";
import { getTotalBet } from "./get-total-bet";
import { placeBet } from "./place-bet";

export function carRouletteRouter(app: FastifyInstance) {
  gameHistory(app);
  gameResult(app);
  getResult(app);
  getTotalBet(app);
  gameHistoryAdmin(app);
  betHistoryAdmin(app);
  placeBet(app);
}
