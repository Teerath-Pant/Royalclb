import type { carRoulette, carRouletteBet } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: carRoulette["id"];
  result: NonNullable<carRoulette["result"]>;
};

export const handleWinAndLose = async ({ id, result }: HandleWinAndLose) => {
  const dt = Now();

  await prisma.carRoulette.update({
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

  const bets = await prisma.carRouletteBet.findMany({
    where: {
      gameId: id,
    },
  });

  return Promise.all(
    bets.map((bet) => {
      const { betType, betAmount, id: betId, userId } = bet;

      const winAmount = calculateWinAmount({
        result,
        betOn: betType,
        betAmount,
      });

      if (winAmount.greaterThan(0)) {
        const charge = winAmount.mul(platformCharge).div(100);
        const netWinAmount = winAmount.minus(charge);

        return Promise.all([
          prisma.carRouletteBet.update({
            data: {
              winAmount,
              tax: charge,
              netAmount: netWinAmount,
              status: "SUCCESS",
              resultAt: dt.toISOString(),
            },
            where: {
              id: betId,
            },
          }),
          walletService.entry2({
            user_id: userId,
            txn_id: betId,
            amount: netWinAmount,
            note: "WIN (CAR ROULETTE)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return prisma.carRouletteBet.update({
        data: {
          status: "FAILED",
          resultAt: dt.toISOString(),
        },
        where: {
          id: betId,
        },
      });
    })
  );
};

type CalculateWinAmountParams = {
  result: NonNullable<carRoulette["result"]>;
  betOn: carRouletteBet["betType"];
  betAmount: carRouletteBet["betAmount"];
};

export function calculateWinAmount({
  result,
  betOn,
  betAmount,
}: CalculateWinAmountParams) {
  const multipliers = getMultipliers({ result, betOn });
  return betAmount.mul(multipliers);
}
