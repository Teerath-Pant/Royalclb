import type { headTail } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: headTail["id"];
  result: NonNullable<headTail["result"]>;
};

export const handleWinAndLose = async ({ id, result }: HandleWinAndLose) => {
  const dt = Now();

  await prisma.headTail.update({
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

  const bets = await prisma.headTailBets.findMany({
    where: {
      gameId: id,
    },
  });

  return Promise.all(
    bets.map((bet) => {
      const { betOn, betAmount, id: betId, userId } = bet;

      const multipliers = getMultipliers({ result, betOn });
      const winAmount = betAmount.mul(multipliers);

      if (winAmount.greaterThan(0)) {
        const charge = winAmount.mul(platformCharge).div(100);
        const netWinAmount = winAmount.minus(charge);

        return Promise.all([
          prisma.headTailBets.update({
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
            note: "WIN (HEAD TAIL)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return prisma.headTailBets.update({
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
