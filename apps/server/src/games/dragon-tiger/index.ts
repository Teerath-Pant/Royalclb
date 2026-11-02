import type { Namespace } from "socket.io";

import { logger } from "@/lib/logger";
import { sleep } from "@/utils/sleep";

import { calculateResult } from "./calculate-result";
import { startBet } from "./start-bet";
import { stopBet } from "./stop-bet";

type RunDragonTiger = {
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

export const runDragonTiger = async ({ io, interval }: RunDragonTiger) => {
  const intervalSec = interval * 60;
  const BET_TIME = intervalSec;

  const roomName = `interval-${interval}`;
  const eventName = `game_dt_${interval}`;

  while (true) {
    const { id, periodId } = await startBet({ interval });
    logger.info("DT Started");

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
    logger.info("DT Stopped");

    calculateResult({ interval, ids });

    for (let i = 0; i <= CALCULATION_TIME; i += 1) {
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
