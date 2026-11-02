import crypto from "node:crypto";

import { Decimal } from "decimal.js";

import { prisma } from "@/lib/prisma";
import type { winGo } from "@/lib/prisma";

import { calculateWinAmount } from "./calculate-win-amount";
import { handleRandom } from "./handle-random";
import { handleWinAndLose } from "./handle-win-lose";

type HandleLeast = {
  id: winGo["id"];
};

export const handleLeast = async ({ id }: HandleLeast) => {
  const bets = await prisma.winGoBets.findMany({
    where: { gameId: id },
    select: {
      number: true,
      color: true,
      bigSmall: true,
      betAmount: true,
    },
  });

  let totalBetAmount = new Decimal(0);
  for (const bet of bets) {
    totalBetAmount = totalBetAmount.plus(bet.betAmount);
  }

  if (totalBetAmount.eq(0)) {
    await handleRandom({ id });
    return;
  }

  const winAmounts = Array.from({ length: 10 }, (_, num) => {
    let sum = new Decimal(0);
    for (const bet of bets) {
      sum = sum.plus(calculateWinAmount({ winNumber: num, ...bet }));
    }
    return sum;
  });

  const minAmount = Decimal.min(...winAmounts);
  const candidates = winAmounts
    .map((amount, num) => ({ num, amount }))
    .filter(({ amount }) => amount.eq(minAmount));

  const winner = candidates[crypto.randomInt(0, candidates.length)];
  if (!winner) {
    await handleRandom({ id });
    return;
  }

  await handleWinAndLose({ id, winNumber: winner.num });
};
