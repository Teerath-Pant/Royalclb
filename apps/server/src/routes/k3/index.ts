import type { FastifyInstance } from "fastify";

import { betHistory } from "./bet-history";
import { betHistoryAdmin } from "./bet-history_admin";
import { gameHistory } from "./game-history";
import { gameHistoryAdmin } from "./game-history_admin";
import { gameResult } from "./game-result";
import { getMode } from "./get-mode";
import { placeBet } from "./place-bet";
import { updateMode } from "./update-mode";

export function k3Router(app: FastifyInstance) {
  gameResult(app);
  gameHistory(app);
  gameHistoryAdmin(app);
  betHistory(app);
  betHistoryAdmin(app);
  getMode(app);
  updateMode(app);
  placeBet(app);
}
