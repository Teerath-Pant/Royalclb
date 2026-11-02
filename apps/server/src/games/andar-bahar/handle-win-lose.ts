import type { andarBahar, andarBaharBets } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: andarBahar["id"];
  result: NonNullable<andarBahar["result"]>;
};

export const handleWinAndLose = async ({ id, result }: HandleWinAndLose) => {
  const dt = Now();

  await prisma.andarBahar.update({
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

  const bets = await prisma.andarBaharBets.findMany({
    where: {
      gameId: id,
    },
  });

  return Promise.all(
    bets.map((bet) => {
      const { betOn, betAmount, id: betId, userId } = bet;

      const winAmount = calculateWinAmount({
        result,
        betOn,
        betAmount,
      });

      if (winAmount.greaterThan(0)) {
        const charge = winAmount.mul(platformCharge).div(100);
        const netWinAmount = winAmount.minus(charge);

        return Promise.all([
          prisma.andarBaharBets.update({
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
            note: "WIN (ANDAR BAHAR)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return prisma.andarBaharBets.update({
        data: {
          status: "LOSE",
          resultDateTime: dt.toISOString(),
        },
        where: {
          id: betId,
        },
      });
    })
  );
};

type CalculateWinAmountParams = {
  result: NonNullable<andarBahar["result"]>;
  betOn: andarBaharBets["betOn"];
  betAmount: andarBaharBets["betAmount"];
};

export function calculateWinAmount({
  result,
  betOn,
  betAmount,
}: CalculateWinAmountParams) {
  const multipliers = getMultipliers({ result, betOn });
  return betAmount.mul(multipliers);
}
