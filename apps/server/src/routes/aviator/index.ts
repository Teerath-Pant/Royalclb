import type { FastifyInstance } from "fastify";

import { bets } from "./bet";
import { betHistory } from "./bet-history";
import { cancelBet } from "./cancel-bet";
import { cashoutBet } from "./cashout-bet";
import { games } from "./games";
import { hasBet } from "./has-bet";
import { placeBet } from "./place-bet";
import { getAviatorGames } from "./games-admin";
import { resetAviatorBucket } from "./reset-bucket-admin";
import { getAviatorBets } from "./bets-admin";

export function aviatorRouter(app: FastifyInstance) {
  games(app);
  bets(app);
  betHistory(app);
  hasBet(app);
  placeBet(app);
  cashoutBet(app);
  cancelBet(app);

  getAviatorGames(app);
  resetAviatorBucket(app);
  getAviatorBets(app);
}
