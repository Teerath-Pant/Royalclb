import type { FastifyInstance } from "fastify";

import { betHistory } from "./bet-history";
import { betHistoryAdmin } from "./bet-history_admin";
import { gameHistoryAdmin } from "./game-history_admin";
import { makeWinner } from "./make-winner";
import { placeBet } from "./place-bet";

export function lotterySpinRouter(app: FastifyInstance) {
  placeBet(app);
  betHistory(app);
  gameHistoryAdmin(app);
  betHistoryAdmin(app);
  makeWinner(app);
}
