import { randomInt } from "node:crypto";

import { Prisma, prisma } from "@/lib/prisma";
import type { dragonTiger } from "@/lib/prisma";

import { getMultipliers } from "./get-multipliers";
import { handleWinAndLose } from "./handle-win-lose";

type HandleLeast = {
  id: dragonTiger["id"];
};

export const handleLeast = async ({ id }: HandleLeast) => {
  const winningAmountForEveryResult = {
    DRAGON: new Prisma.Decimal(0),
    TIGER: new Prisma.Decimal(0),
    TIE: new Prisma.Decimal(0),
  };

  const bets = await prisma.dragonTigerBet.findMany({
    where: {
      gameId: id,
    },
    select: {
      betAmount: true,
      betType: true,
    },
  });

  for (const bet of bets) {
    const { betType, betAmount } = bet;
    const multiplier = getMultipliers(betType);

    const winAmount = betAmount.mul(multiplier);

    if (betType === "DRAGON") {
      winningAmountForEveryResult.DRAGON =
        winningAmountForEveryResult.DRAGON.plus(winAmount);
    } else if (betType === "TIGER") {
      winningAmountForEveryResult.TIGER =
        winningAmountForEveryResult.TIGER.plus(winAmount);
    } else {
      winningAmountForEveryResult.TIE =
        winningAmountForEveryResult.TIE.plus(winAmount);
    }
  }

  const minAmount = Prisma.Decimal.min(
    ...Object.values(winningAmountForEveryResult)
  );

  const winningResults = Object.entries(winningAmountForEveryResult).filter(
    ([, amount]) => amount.eq(minAmount)
  );

  const randomIndex = randomInt(0, winningResults.length);
  const selected = winningResults[randomIndex];
  const winResult = (
    selected ? selected[0] : "DRAGON"
  ) as keyof typeof winningAmountForEveryResult;

  await handleWinAndLose({ id, winResult });
};
