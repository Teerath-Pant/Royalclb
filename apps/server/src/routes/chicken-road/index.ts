import type { FastifyInstance } from "fastify";

import { bets } from "./bets";
import { cashout } from "./cashout";
import { getActiveBet } from "./get-active-bet";
import { placeBet } from "./place-bet";
import { playStep } from "./play-step";
import { revealSeed } from "./reveal-seed";

export function chickenRoadRouter(app: FastifyInstance) {
  bets(app);
  getActiveBet(app);
  revealSeed(app);
  placeBet(app);
  playStep(app);
  cashout(app);
}
