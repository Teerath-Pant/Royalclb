import type { FastifyInstance } from "fastify";

import { betHistory } from "./bet-history";
import { betHistoryAdmin } from "./bet-history_admin";
import { chartHistory } from "./chart-history";
import { gameHistory } from "./game-history";
import { gameHistoryAdmin } from "./game-history_admin";
import { getResult } from "./get-result";
import { placeBet } from "./place-bet";

export function winGoRouter(app: FastifyInstance) {
  gameHistory(app);
  betHistory(app);
  chartHistory(app);
  getResult(app);
  gameHistoryAdmin(app);
  betHistoryAdmin(app);
  placeBet(app);
}
