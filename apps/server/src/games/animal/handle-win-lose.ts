import type { animal, animalBets } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: animal["id"];
  result: NonNullable<animal["result"]>;
};

export const handleWinAndLose = async ({ id, result }: HandleWinAndLose) => {
  const dt = Now();

  await prisma.animal.update({
    data: {
      result,
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const bets = await prisma.animalBets.findMany({
    where: {
      gameId: id,
    },
  });

  for (const bet of bets) {
    const { betOn, betAmount, id: betId, userId } = bet;

    const winAmount = calculateWinAmount({
      result,
      betOn,
      betAmount,
    });

    if (winAmount.greaterThan(0)) {
      const charge = winAmount.mul(platformCharge).div(100);
      const netWinAmount = winAmount.minus(charge);

      await Promise.all([
        prisma.animalBets.update({
          data: {
            winAmount,
            charge,
            netWinAmount,
            status: "WIN",
            resultDateTime: dt.toISOString(),
          },
          where: {
            id: betId,
          },
        }),
        walletService.entry2({
          user_id: userId,
          txn_id: betId,
          amount: netWinAmount,
          note: "WIN (ANIMAL)",
          type: "CREDIT",
          dt,
          wallet_type: "WALLET",
        }),
      ]);

      continue;
    }
    await prisma.animalBets.update({
      data: {
        status: "LOSE",
        resultDateTime: dt.toISOString(),
      },
      where: {
        id: betId,
      },
    });
  }
};

type CalculateWinAmountParams = {
  result: NonNullable<animal["result"]>;
  betOn: animalBets["betOn"];
  betAmount: animalBets["betAmount"];
};

export function calculateWinAmount({
  result,
  betOn,
  betAmount,
}: CalculateWinAmountParams) {
  const multipliers = getMultipliers({ result, betOn });
  return betAmount.mul(multipliers);
}
