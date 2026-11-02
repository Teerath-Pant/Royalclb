import { randomInt } from "node:crypto";

import { random } from "es-toolkit";

import { logger } from "@/lib/logger";
import { Prisma, prisma } from "@/lib/prisma";
import type { updown_games } from "@/lib/prisma";

import { getDicePair } from "./get-dice-pair";
import { getMultipliers } from "./get-multipliers";
import { handleWinAndLose } from "./handle-win-lose";

type HandleLeast = {
  id: updown_games["id"];
};

export const handleLeast = async ({ id }: HandleLeast) => {
  const winningAmountForEveryResult = {
    L7: new Prisma.Decimal(0),
    E7: new Prisma.Decimal(0),
    G7: new Prisma.Decimal(0),
  };

  const bets = await prisma.updown_bets.findMany({
    where: {
      game_id: id,
    },
    select: {
      bet_on: true,
      bet_amount: true,
    },
  });

  for (const bet of bets) {
    const { bet_on, bet_amount } = bet;
    const multiplier = getMultipliers(bet_on);

    const winAmount = bet_amount.mul(multiplier);

    if (bet_on === "E7") {
      winningAmountForEveryResult.E7 =
        winningAmountForEveryResult.E7.plus(winAmount);
    } else if (bet_on === "L7") {
      winningAmountForEveryResult.L7 =
        winningAmountForEveryResult.L7.plus(winAmount);
    } else {
      winningAmountForEveryResult.G7 =
        winningAmountForEveryResult.G7.plus(winAmount);
    }
  }

  logger.info(winningAmountForEveryResult);

  const minAmount = Prisma.Decimal.min(
    ...Object.values(winningAmountForEveryResult)
  );

  const winningResults = Object.entries(winningAmountForEveryResult).filter(
    ([, amount]) => amount.eq(minAmount)
  );

  const randomIndex = randomInt(0, winningResults.length);
  const selected = winningResults[randomIndex];
  const winResult = (
    selected ? selected[0] : "L7"
  ) as keyof typeof winningAmountForEveryResult;

  let need = 0;

  switch (winResult) {
    case "E7": {
      need = 7;
      break;
    }
    case "L7": {
      need = random(2, 6);
      break;
    }
    case "G7": {
      need = random(8, 12);
      break;
    }
    default: {
      throw new Error("Invalid Result");
    }
  }
  const [winningDice1, winningDice2] = getDicePair(need);

  await handleWinAndLose({ id, winningDice1, winningDice2 });
};
