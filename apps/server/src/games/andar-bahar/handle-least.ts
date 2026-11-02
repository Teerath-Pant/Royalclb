import { randomInt } from "node:crypto";

import { Prisma, prisma } from "@/lib/prisma";
import type { andarBahar } from "@/lib/prisma";

import { OPTIONS } from "./handle-random";
import { calculateWinAmount, handleWinAndLose } from "./handle-win-lose";

type HandleLeast = {
  id: andarBahar["id"];
};

export const handleLeast = async ({ id }: HandleLeast) => {
  const winningAmountForEveryResult = Object.fromEntries(
    OPTIONS.map((option) => [option, new Prisma.Decimal(0)])
  ) as Record<(typeof OPTIONS)[number], Prisma.Decimal>;

  const bets = await prisma.andarBaharBets.findMany({
    where: {
      gameId: id,
    },
    select: {
      betOn: true,
      betAmount: true,
    },
  });

  for (const option of OPTIONS) {
    let totalWinAmount = new Prisma.Decimal(0);
    for (const bet of bets) {
      const winAmount = calculateWinAmount({
        result: option,
        ...bet,
      });

      totalWinAmount = totalWinAmount.plus(winAmount);
    }

    winningAmountForEveryResult[option] = totalWinAmount;
  }

  const minAmount = Prisma.Decimal.min(
    ...Object.values(winningAmountForEveryResult)
  );

  const winningResults = Object.entries(winningAmountForEveryResult).filter(
    ([, amount]) => amount.eq(minAmount)
  );

  const randomIndex = randomInt(0, winningResults.length);
  const selectedResult = winningResults[randomIndex];
  const result = (
    selectedResult ? selectedResult[0] : OPTIONS[0]
  ) as keyof typeof winningAmountForEveryResult;

  await handleWinAndLose({ id, result });
};
