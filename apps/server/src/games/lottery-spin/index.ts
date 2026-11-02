import type { Namespace } from "socket.io";

import { logger } from "@/lib/logger";
import { sleep } from "@/utils/sleep";

import { calculateResult } from "./calculate-result";
import { startBet } from "./start-bet";
import { stopBet } from "./stop-bet";

type RunLotterySpin = {
  io: Namespace;
  interval: number;
};

type EmitData = {
  id: number;
  periodId: string;
  timerMin: number;
  timerSec: number;
  gameStatus: "betting" | "calculating";
};

const CALCULATION_TIME = 5;

export const runLS = async ({ io, interval }: RunLotterySpin) => {
  const intervalSec = interval * 60;
  const BET_TIME = intervalSec - CALCULATION_TIME;

  const roomName = `interval-${interval}`;
  const eventName = `game_ls_${interval}`;

  while (true) {
    const { id, periodId } = await startBet({ interval });
    logger.info("LS Started");

    for (let i = 1; i <= BET_TIME; i += 1) {
      const remainingSec = intervalSec - i;
      const timerMin = Math.trunc(remainingSec / 60);
      const timerSec = remainingSec % 60;

      for (let j = 1; j <= 4; j += 1) {
        io.to(roomName).emit(eventName, {
          id,
          periodId,
          timerMin,
          timerSec,
          gameStatus: "betting",
        } satisfies EmitData);

        await sleep(250);
      }
    }

    const { ids } = await stopBet(interval, id);
    logger.info("LS Stopped");

    calculateResult({ interval, ids });

    for (let i = 1; i <= CALCULATION_TIME; i += 1) {
      const remainingSec = CALCULATION_TIME - i;
      const timerMin = Math.trunc(remainingSec / 60);
      const timerSec = remainingSec % 60;

      for (let j = 1; j <= 4; j += 1) {
        io.to(roomName).emit(eventName, {
          id,
          periodId,
          timerMin,
          timerSec,
          gameStatus: "calculating",
        } satisfies EmitData);

        await sleep(250);
      }
    }
  }
};
