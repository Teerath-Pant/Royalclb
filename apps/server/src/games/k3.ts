// oxlint-disable typescript/no-non-null-assertion unicorn/no-array-reduce unicorn/no-array-for-each
import { randomInt } from "node:crypto";

import type { Namespace } from "socket.io";

import { Now } from "@//utils/date";
import { logger } from "@/lib/logger";
import { Prisma, prisma } from "@/lib/prisma";
import type { meddolic_game_k3_summary } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { k3SettingsService } from "@/services/k3-settings.service";
import { walletService } from "@/services/wallet.service";
import { sleep } from "@/utils/sleep";

import { calculateWinAmount } from "./k3-handlers";

const ODDS = {
  NUMBER: {
    3: 207.36,
    4: 69.12,
    5: 34.56,
    6: 20.74,
    7: 13.83,
    8: 9.88,
    9: 8.3,
    10: 7.68,
    11: 7.68,
    12: 8.3,
    13: 9.88,
    14: 13.83,
    15: 20.74,
    16: 34.56,
    17: 69.12,
    18: 207.36,
  },
  BIG_SMALL: {
    1: 1.92,
    2: 1.92,
  },
  ODD_EVEN: {
    1: 1.92,
    2: 1.92,
  },
  IDENTICAL_2: 13.83,
  DIFFERENT_2: 6.91,
  IDENTICAL_3: 207.36,
  ANY_IDENTICAL_3: 34.56,
  DIFFERENT_3: 34.56,
  ANY_CONSECUTIVE_3: 8.64,
} as const;

export type Odds = typeof ODDS;

const startBet = async (interval: number) => {
  const dt = Now();

  const { next_period_id } = await k3SettingsService.get(
    { next_period_id: true },
    interval
  );

  const gameId = dt.format("YYYYMMDD") + next_period_id;

  const game = await prisma.meddolic_game_k3_summary.create({
    data: {
      game_id: gameId,
      interval_min: interval,
      started_at: dt.toISOString(),
    },
    select: {
      id: true,
    },
  });

  await k3SettingsService.set(
    {
      next_period_id: {
        increment: 1,
      },
    },
    interval
  );

  return {
    id: game.id,
    gameId,
  };
};

const stopBet = async (
  interval: number,
  id: meddolic_game_k3_summary["id"]
) => {
  const dt = Now();

  const runningGames = await prisma.meddolic_game_k3_summary.findMany({
    where: {
      status: 1,
      id: {
        lte: id,
      },
      interval_min: interval,
    },
    select: {
      id: true,
    },
  });

  const ids = runningGames.map((g) => g.id);

  if (ids.length > 0) {
    await prisma.meddolic_game_k3_summary.updateMany({
      data: {
        status: 0,
        completed_at: dt.toISOString(),
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  return {
    ids,
  };
};

const calculateResult = async (
  interval: number,
  ids: meddolic_game_k3_summary["id"][]
) => {
  const { mode } = await k3SettingsService.get({ mode: true }, interval);

  ids.forEach(async (id) => {
    switch (mode) {
      case "random": {
        await handleRandom({ id });
        break;
      }
      case "least": {
        await handleLeast({ id });
        break;
      }
      default: {
        await handleManual({ id, winningCombination: mode });
        break;
      }
    }
  });
};

type HandleRandom = {
  id: meddolic_game_k3_summary["id"];
};

const handleRandom = async ({ id }: HandleRandom) => {
  const winningDice1 = randomInt(1, 7);
  const winningDice2 = randomInt(1, 7);
  const winningDice3 = randomInt(1, 7);

  await handleWinAndLose({ id, winningDice1, winningDice2, winningDice3 });
};

type HandleLeast = {
  id: meddolic_game_k3_summary["id"];
};

const DICE_RANGE = Array.from({ length: 6 }, (_, i) => i + 1);

const combinations = DICE_RANGE.flatMap((i) =>
  DICE_RANGE.flatMap((j) =>
    DICE_RANGE.map((k) => ({
      key: `${i}${j}${k}`,
      dice1: i,
      dice2: j,
      dice3: k,
      total: i + j + k,
    }))
  )
);

const handleLeast = async ({ id }: HandleLeast) => {
  const winningAmountForEveryCombination: Record<string, Prisma.Decimal> = {};

  const bets = await prisma.meddolic_game_k3_bets.findMany({
    where: {
      session_id: id,
    },
  });

  // oxlint-disable-next-line unicorn/no-array-for-each
  combinations.forEach(({ key, dice1, dice2, dice3, total }) => {
    const totalWinAmount = bets.reduce((sum, bet) => {
      const winAmount = calculateWinAmount({
        bet,
        ODDS,
        winningDice1: dice1,
        winningDice2: dice2,
        winningDice3: dice3,
        totalDice: total,
      });
      return sum.plus(winAmount);
    }, new Prisma.Decimal(0));

    winningAmountForEveryCombination[key] = totalWinAmount;
  });

  // find the minimum amount
  const minAmount = Prisma.Decimal.min(
    ...Object.values(winningAmountForEveryCombination)
  );

  // find the combination with the minimum amount
  const winningCombinations = Object.entries(
    winningAmountForEveryCombination
  ).filter(([, amount]) => amount.equals(minAmount));

  // Get a random combination from the winning combinations
  const winningCombination =
    winningCombinations[randomInt(0, winningCombinations.length)];

  const [winningDices] = winningCombination!;

  const [winningDice1, winningDice2, winningDice3] = [...winningDices].map(
    Number
  );

  await handleWinAndLose({
    id,
    winningDice1: winningDice1!,
    winningDice2: winningDice2!,
    winningDice3: winningDice3!,
  });
};

type HandleManual = {
  id: meddolic_game_k3_summary["id"];
  winningCombination: string;
};

const handleManual = async ({ id, winningCombination }: HandleManual) => {
  let [winningDice1, winningDice2, winningDice3] = [...winningCombination].map(
    Number
  );

  winningDice1 ||= randomInt(1, 7);
  winningDice2 ||= randomInt(1, 7);
  winningDice3 ||= randomInt(1, 7);

  await handleWinAndLose({ id, winningDice1, winningDice2, winningDice3 });
};

type HandleWinAndLose = {
  id: meddolic_game_k3_summary["id"];
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
};

export type NumberBet =
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;
export type BigSmallBet = 1 | 2;
export type OddEvenBet = 1 | 2;

const handleWinAndLose = async ({
  id,
  winningDice1,
  winningDice2,
  winningDice3,
}: HandleWinAndLose) => {
  const dt = Now();

  await prisma.meddolic_game_k3_summary.update({
    data: {
      winning_dice1: winningDice1,
      winning_dice2: winningDice2,
      winning_dice3: winningDice3,
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const bets = await prisma.meddolic_game_k3_bets.findMany({
    where: {
      session_id: id,
    },
  });

  const totalDice = winningDice1 + winningDice2 + winningDice3;

  for (const bet of bets) {
    const winAmount = calculateWinAmount({
      bet,
      ODDS,
      winningDice1,
      winningDice2,
      winningDice3,
      totalDice,
    });

    if (winAmount.lessThanOrEqualTo(0)) {
      // Losing bet
      await prisma.meddolic_game_k3_bets.update({
        data: {
          status: 2,
          win_amount: 0,
          charge: 0,
          net_win_amount: 0,
          result_date_time: dt.toISOString(),
        },
        where: {
          id: bet.id,
        },
      });
      continue;
    }
    // Winning bet
    const charge = winAmount.times(platformCharge).dividedBy(100);
    const netWinAmount = winAmount.minus(charge);

    await Promise.all([
      prisma.meddolic_game_k3_bets.update({
        data: {
          status: 1,
          win_amount: winAmount,
          charge,
          net_win_amount: netWinAmount,
          result_date_time: dt.toISOString(),
        },
        where: {
          id: bet.id,
        },
      }),
      walletService.entry2({
        user_id: bet.member_id,
        txn_id: bet.id,
        amount: netWinAmount,
        note: "WIN (K3)",
        type: "CREDIT",
        dt,
        wallet_type: "WALLET",
      }),
    ]);
  }
};

type RunK3 = {
  io: Namespace;
  interval: number;
};

type EmitData = {
  id: number;
  gameId: string;
  timerMin: number;
  timerSec: number;
  gameStatus: "betting" | "calculating";
};

const CALCULATION_TIME = 5;

const runK3 = async ({ io, interval }: RunK3) => {
  const intervalSec = interval * 60;
  const BET_TIME = intervalSec - CALCULATION_TIME;

  while (true) {
    const { id, gameId } = await startBet(interval);
    logger.info("K3 Started");

    for (let i = 1; i <= BET_TIME; i += 1) {
      const remainingSec = intervalSec - i;
      const timerMin = Math.trunc(remainingSec / 60);
      const timerSec = remainingSec % 60;

      for (let j = 1; j <= 4; j += 1) {
        io.to(`interval-${interval}`).emit(`game_k3_${interval}`, {
          id,
          gameId,
          timerMin,
          timerSec,
          gameStatus: "betting",
        } satisfies EmitData);

        await sleep(250);
      }
    }

    const { ids } = await stopBet(interval, id);
    logger.info("K3 Stopped");

    calculateResult(interval, ids);

    for (let i = 1; i <= CALCULATION_TIME; i += 1) {
      const remainingSec = CALCULATION_TIME - i;
      const timerMin = Math.trunc(remainingSec / 60);
      const timerSec = remainingSec % 60;

      for (let j = 1; j <= 4; j += 1) {
        io.to(`interval-${interval}`).emit(`game_k3_${interval}`, {
          id,
          gameId,
          timerMin,
          timerSec,
          gameStatus: "calculating",
        } satisfies EmitData);

        await sleep(250);
      }
    }
  }
};

export { runK3 };
