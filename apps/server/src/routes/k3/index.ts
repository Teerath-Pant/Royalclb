import type { FastifyInstance } from "fastify";

import { betHistory } from "./bet-history";
import { gameHistory } from "./game-history";
import { gameHistoryAdmin } from "./game-history_admin";
import { gameResult } from "./game-result";
import { placeBet } from "./place-bet";
import { updateMode } from "./update-mode";

export function k3Router(app: FastifyInstance) {
  gameResult(app);
  gameHistory(app);
  gameHistoryAdmin(app);
  betHistory(app);
  updateMode(app);
  placeBet(app);
}
