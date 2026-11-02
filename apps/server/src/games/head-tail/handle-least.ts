import { randomInt } from "node:crypto";

import { Prisma, prisma } from "@/lib/prisma";
import type { headTail } from "@/lib/prisma";

import { getMultipliers } from "./get-multipliers";
import { handleWinAndLose } from "./handle-win-lose";

type HandleLeast = {
  id: headTail["id"];
};

export const handleLeast = async ({ id }: HandleLeast) => {
  const winningAmountForEveryResult: Record<string, Prisma.Decimal> = {
    HEAD: new Prisma.Decimal(0),
    TAIL: new Prisma.Decimal(0),
  };

  const bets = await prisma.headTailBets.findMany({
    where: {
      gameId: id,
    },
    select: {
      betOn: true,
      betAmount: true,
    },
  });

  for (const result of ["HEAD", "TAIL"] as const) {
    let totalWinAmount = new Prisma.Decimal(0);
    for (const bet of bets) {
      const multipliers = getMultipliers({ result, betOn: bet.betOn });
      const winAmount = bet.betAmount.mul(multipliers);

      totalWinAmount = totalWinAmount.plus(winAmount);
    }

    winningAmountForEveryResult[result] = totalWinAmount;
  }

  const minAmount = Prisma.Decimal.min(
    ...Object.values(winningAmountForEveryResult)
  );

  const winningResults = Object.entries(winningAmountForEveryResult).filter(
    ([, amount]) => amount.eq(minAmount)
  );

  const winningResult = winningResults[randomInt(0, winningResults.length)];

  const result = winningResult ? winningResult[0] : "HEAD";

  await handleWinAndLose({
    id,
    result: result as NonNullable<headTail["result"]>,
  });
};
