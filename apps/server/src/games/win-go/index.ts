import type { Namespace } from "socket.io";

import { logger } from "@/lib/logger";
import { fireAndForget } from "@/utils/fire-and-forget";
import { sleep } from "@/utils/sleep";

import { calculateResult } from "./calculate-result";
import { startBet } from "./start-bet";
import { stopBet } from "./stop-bet";

type RunWinGo = {
  io: Namespace;
  interval: number;
};

type EmitData = {
  id: number;
  period: string;
  timerMin: number;
  timerSec: number;
  gameStatus: "betting" | "calculating";
};

const CALCULATION_TIME = 5;
const GAME_NAME = "Win Go";

export const runWinGo = async ({ io, interval }: RunWinGo) => {
  const intervalSec = interval * 60;
  const BET_TIME = intervalSec - CALCULATION_TIME;

  const roomName = `interval-${interval}`;
  const eventName = `game_win_go_${interval}`;

  while (true) {
    const { id, period } = await startBet({ interval });
    logger.info(`${GAME_NAME} Started`);

    for (let i = 1; i < BET_TIME; i += 1) {
      const remainingSec = intervalSec - i;
      const timerMin = Math.trunc(remainingSec / 60);
      const timerSec = remainingSec % 60;

      for (let j = 1; j <= 4; j += 1) {
        io.to(roomName).emit(eventName, {
          id,
          period,
          timerMin,
          timerSec,
          gameStatus: "betting",
        } satisfies EmitData);

        await sleep(250);
      }
    }

    const ids = await stopBet(interval, id);
    logger.info(`${GAME_NAME} Calculating`);

    for (let i = 0; i <= CALCULATION_TIME; i += 1) {
      const remainingSec = CALCULATION_TIME - i;
      const timerMin = Math.trunc(remainingSec / 60);
      const timerSec = remainingSec % 60;

      if (timerMin === 0 && timerSec === 2) {
        void fireAndForget(() => calculateResult({ interval, ids }));
      }

      for (let j = 1; j <= 4; j += 1) {
        io.to(roomName).emit(eventName, {
          id,
          period,
          timerMin,
          timerSec,
          gameStatus: "calculating",
        } satisfies EmitData);

        await sleep(250);
      }
    }

    logger.info(`${GAME_NAME} Stopped`);
  }
};
