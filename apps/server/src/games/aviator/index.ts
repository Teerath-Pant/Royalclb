import { Decimal } from "decimal.js";
import type { Namespace } from "socket.io";

import { aviator_outcome, aviator_status } from "@/lib/prisma";
import { sleep } from "@/utils/sleep";

import { redis } from "../../lib/redis";
import { endGame } from "./end-game";
import { shouldCrash } from "./should-crash";
import { startBet } from "./start-bet";
import { startFlightPhase } from "./start-flight-phase";

const BETTING_TIME = 15;
const INCREMENT_MULTIPLIER = new Decimal(0.01);
const INCREMENT_DELAY_MS = 50;

export const getAviatorRedisKey = (gameId: number) =>
  `aviator:game:${gameId}:multiplier` as const;

type EmitData = {
  id: number;
} & (
  | {
      status: Extract<aviator_status, "BETTING">;
      countdown: number;
    }
  | {
      status: Extract<aviator_status, "FLYING">;
      flyMultiplier: number;
    }
  | {
      status: Extract<aviator_status, "ENDED">;
    }
);

export const runAviator = async (nsp: Namespace) => {
  while (true) {
    const game = await startBet();

    // BETTING PHASE
    for (let countdown = BETTING_TIME; countdown > 0; countdown -= 1) {
      const emitData: EmitData = {
        id: game.id,
        status: aviator_status.BETTING,
        countdown,
      };

      nsp.volatile.emit("aviator", emitData);
      await sleep(1000);
    }

    // START FLIGHT
    const { maxPossibleFly } = await startFlightPhase(game.id);

    let currentMultiplier = new Decimal(1);
    let outcome: aviator_outcome = aviator_outcome.FLEW_AWAY;

    while (currentMultiplier.lte(maxPossibleFly)) {
      await redis.set(
        getAviatorRedisKey(game.id),
        currentMultiplier.toFixed(2),
        "EX",
        60
      );

      const emitData: EmitData = {
        id: game.id,
        status: aviator_status.FLYING,
        flyMultiplier: Number(currentMultiplier.toFixed(2)),
      };

      nsp.volatile.emit("aviator", emitData);

      if (await shouldCrash(game.id, currentMultiplier)) {
        outcome = aviator_outcome.CRASHED;
        break;
      }

      await sleep(INCREMENT_DELAY_MS);

      currentMultiplier = currentMultiplier.add(INCREMENT_MULTIPLIER);
    }

    await endGame(game.id, currentMultiplier, outcome);

    const emitData: EmitData = {
      id: game.id,
      status: aviator_status.ENDED,
    };
    nsp.volatile.emit("aviator", emitData);
  }
};
