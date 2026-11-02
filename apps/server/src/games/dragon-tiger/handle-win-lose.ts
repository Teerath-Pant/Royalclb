import { Prisma, prisma } from "@/lib/prisma";
import type {
  dragonTiger_result,
  dragonTiger,
  dragonTigerBet,
} from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: dragonTiger["id"];
  winResult: dragonTiger_result;
};

export const handleWinAndLose = async ({ id, winResult }: HandleWinAndLose) => {
  const dt = Now();

  await prisma.dragonTiger.update({
    data: {
      result: winResult,
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const bets = await prisma.dragonTigerBet.findMany({
    where: {
      gameId: id,
    },
  });

  for (const bet of bets) {
    const { betType, betAmount, id: betId, userId } = bet;

    const winAmount = calculateWinAmount({
      winResult,
      betOn: betType,
      betAmount,
    });

    if (winAmount.greaterThan(0)) {
      const charge = winAmount.mul(platformCharge).div(100);
      const netWinningAmount = winAmount.minus(charge);

      await Promise.all([
        prisma.dragonTigerBet.update({
          data: {
            winAmount,
            tax: charge,
            netAmount: netWinningAmount,
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
          amount: netWinningAmount,
          note: "WIN (DRAGON TIGER)",
          type: "CREDIT",
          dt,
          wallet_type: "WALLET",
        }),
      ]);

      continue;
    }

    await prisma.dragonTigerBet.update({
      data: {
        winAmount: 0,
        tax: 0,
        netAmount: 0,
        status: "FAILED",
        resultAt: dt.toISOString(),
      },
      where: {
        id: betId,
      },
    });
  }
};

type CalculateWinAmountParams = {
  winResult: dragonTiger_result;
  betOn: dragonTigerBet["betType"];
  betAmount: dragonTigerBet["betAmount"];
};

export function calculateWinAmount({
  winResult,
  betOn,
  betAmount,
}: CalculateWinAmountParams) {
  let winAmount = new Prisma.Decimal(0);
  const multipliers = getMultipliers(betOn);

  if (winResult === betOn) {
    const amount = betAmount.mul(multipliers);
    winAmount = winAmount.plus(amount);
  }

  return winAmount;
}
