import { Prisma, prisma } from "@/lib/prisma";
import type { lottery_spin_summary } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: lottery_spin_summary["id"];
};

const AVAILABLE_WIN_AMOUNTS = [
  25, 50, 100, 300, 800, 2000, 5000, 12_000, 20_000, 35_000,
];

export const handleRandom = async ({ id }: HandleRandom) => {
  const bets = await prisma.lottery_spin_bets.findMany({
    where: {
      game_id: id,
    },
    select: {
      id: true,
      bet_amount: true,
    },
  });

  let totalBetAmount = new Prisma.Decimal(0);
  for (const bet of bets) {
    totalBetAmount = totalBetAmount.plus(bet.bet_amount);
  }

  const winningLotteryId =
    bets[Math.floor(Math.random() * bets.length)]?.id ?? 0;

  const winAmount = calculateWinAmount(totalBetAmount.toNumber());

  await handleWinAndLose({ id, lotteryId: winningLotteryId, winAmount });
};

const calculateWinAmount = (totalBetAmount: number): number => {
  if (totalBetAmount === 0) {
    return (
      AVAILABLE_WIN_AMOUNTS[
        Math.floor(Math.random() * AVAILABLE_WIN_AMOUNTS.length)
      ] ?? 25
    );
  }

  const halfBetAmount = totalBetAmount / 2;

  return findMaxLessThan(AVAILABLE_WIN_AMOUNTS, halfBetAmount);
};

const findMaxLessThan = (arr: number[], target: number): number => {
  let left = 0;
  let right = arr.length - 1;
  let result = arr[0] ?? 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const val = arr[mid];
    if (val !== undefined && val < target) {
      result = val;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
};
