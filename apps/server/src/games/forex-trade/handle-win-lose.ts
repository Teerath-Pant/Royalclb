import type { Prisma, forexTrade, forexTradeBets } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: forexTrade["id"];
  result: NonNullable<forexTrade["result"]>;
  lastPrice: Prisma.Decimal;
  currentPrice: Prisma.Decimal;
};

export const handleWinAndLose = async ({
  id,
  result,
  lastPrice,
  currentPrice,
}: HandleWinAndLose) => {
  const dt = Now();

  await prisma.forexTrade.update({
    data: {
      lastPrice,
      currentPrice,
      result,
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const bets = await prisma.forexTradeBets.findMany({
    where: {
      gameId: id,
    },
  });

  return await Promise.all(
    bets.map(async (bet) => {
      const { betOn, betAmount, id: betId, userId } = bet;

      const winAmount = calculateWinAmount({
        result,
        betOn,
        betAmount,
      });

      if (winAmount.greaterThan(0)) {
        const charge = winAmount.mul(platformCharge).div(100);
        const netWinAmount = winAmount.minus(charge);

        return await Promise.all([
          prisma.forexTradeBets.update({
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
            note: "WIN (FOREX TRADE)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }

      return await prisma.forexTradeBets.update({
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
  result: NonNullable<forexTrade["result"]>;
  betOn: forexTradeBets["betOn"];
  betAmount: forexTradeBets["betAmount"];
};

export function calculateWinAmount({
  result,
  betOn,
  betAmount,
}: CalculateWinAmountParams) {
  const multipliers = getMultipliers({ result, betOn });

  return betAmount.mul(multipliers);
}
