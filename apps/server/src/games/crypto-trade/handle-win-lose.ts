import type { Prisma, cryptoTrade, cryptoTradeBets } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: cryptoTrade["id"];
  result: NonNullable<cryptoTrade["result"]>;
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

  await prisma.cryptoTrade.update({
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
  const bets = await prisma.cryptoTradeBets.findMany({
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
          prisma.cryptoTradeBets.update({
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
            note: "WIN (cryptoTrade)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return await prisma.cryptoTradeBets.update({
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
  result: NonNullable<cryptoTrade["result"]>;
  betOn: cryptoTradeBets["betOn"];
  betAmount: cryptoTradeBets["betAmount"];
};

export function calculateWinAmount({
  result,
  betOn,
  betAmount,
}: CalculateWinAmountParams) {
  const multipliers = getMultipliers({ result, betOn });

  return betAmount.mul(multipliers);
}
