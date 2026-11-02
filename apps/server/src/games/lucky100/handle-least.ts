import { randomInt } from "node:crypto";

import { Prisma, prisma } from "@/lib/prisma";
import type { lucky100 } from "@/lib/prisma";

import { calculateWinAmount, handleWinAndLose } from "./handle-win-lose";

type HandleLeast = {
  id: lucky100["id"];
};

export const handleLeast = async ({ id }: HandleLeast) => {
  const winningAmountForEveryResult: Record<number, Prisma.Decimal> = {};

  const bets = await prisma.lucky100Bets.findMany({
    where: {
      gameId: id,
    },
    select: {
      number: true,
      evenOdd: true,
      bigSmall: true,
      betAmount: true,
    },
  });

  for (let num = 1; num <= 100; num += 1) {
    let totalWinAmount = new Prisma.Decimal(0);
    for (const bet of bets) {
      const winAmount = calculateWinAmount({
        winNumber: num,
        ...bet,
      });

      totalWinAmount = totalWinAmount.plus(winAmount);
    }

    winningAmountForEveryResult[num] = totalWinAmount;
  }

  const minAmount = Prisma.Decimal.min(
    ...Object.values(winningAmountForEveryResult)
  );

  const winningResults = Object.entries(winningAmountForEveryResult).filter(
    ([, amount]) => amount.eq(minAmount)
  );

  const winningResult = winningResults[randomInt(0, winningResults.length)];

  const winNumber = winningResult ? winningResult[0] : "1";

  await handleWinAndLose({ id, winNumber: Number.parseInt(winNumber, 10) });
};
