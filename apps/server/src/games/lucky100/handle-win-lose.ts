import type { lucky100, lucky100Bets } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: lucky100["id"];
  winNumber: NonNullable<lucky100["winNumber"]>;
};

export const handleWinAndLose = async ({ id, winNumber }: HandleWinAndLose) => {
  const dt = Now();

  await prisma.lucky100.update({
    data: {
      winNumber,
      winEvenOdd: winNumber % 2 === 0 ? "EVEN" : "ODD",
      winBigSmall: winNumber > 50 ? "BIG" : "SMALL",
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const bets = await prisma.lucky100Bets.findMany({
    where: {
      gameId: id,
    },
  });

  return Promise.all(
    bets.map((bet) => {
      const { number, evenOdd, bigSmall, betAmount, id: betId, userId } = bet;

      const winAmount = calculateWinAmount({
        winNumber,
        number,
        evenOdd,
        bigSmall,
        betAmount,
      });

      if (winAmount.greaterThan(0)) {
        const charge = winAmount.mul(platformCharge).div(100);
        const netWinAmount = winAmount.minus(charge);

        return Promise.all([
          prisma.lucky100Bets.update({
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
            note: "WIN (LUCKY 100)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return prisma.lucky100Bets.update({
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
  winNumber: NonNullable<lucky100["winNumber"]>;
  number: lucky100Bets["number"];
  evenOdd: lucky100Bets["evenOdd"];
  bigSmall: lucky100Bets["bigSmall"];
  betAmount: lucky100Bets["betAmount"];
};

export function calculateWinAmount({
  winNumber,
  number,
  evenOdd,
  bigSmall,
  betAmount,
}: CalculateWinAmountParams) {
  const multipliers = getMultipliers({ winNumber, number, evenOdd, bigSmall });

  return betAmount.mul(multipliers);
}
