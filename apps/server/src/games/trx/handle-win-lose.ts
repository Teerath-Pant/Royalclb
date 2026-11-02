import type { trx, trxBets } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: trx["id"];
  winNumber: NonNullable<trx["winNumber"]>;
  subHash: NonNullable<trx["subHash"]>;
  blockId: NonNullable<trx["blockId"]>;
};

export const handleWinAndLose = async ({
  id,
  winNumber,
  subHash,
  blockId,
}: HandleWinAndLose) => {
  const dt = Now();

  await prisma.trx.update({
    data: {
      blockId,
      subHash,
      winNumber,
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const bets = await prisma.trxBets.findMany({
    where: {
      gameId: id,
    },
  });

  return Promise.all(
    bets.map((bet) => {
      const { number, color, bigSmall, betAmount, id: betId, userId } = bet;

      const winAmount = calculateWinAmount({
        winNumber,
        number,
        color,
        bigSmall,
        betAmount,
      });

      if (winAmount.greaterThan(0)) {
        const charge = winAmount.mul(platformCharge).div(100);
        const netWinAmount = winAmount.minus(charge);

        return Promise.all([
          prisma.trxBets.update({
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
            note: "WIN (TRX)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return prisma.trxBets.update({
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
  winNumber: NonNullable<trx["winNumber"]>;
  number: trxBets["number"];
  color: trxBets["color"];
  bigSmall: trxBets["bigSmall"];
  betAmount: trxBets["betAmount"];
};

export function calculateWinAmount({
  winNumber,
  number,
  color,
  bigSmall,
  betAmount,
}: CalculateWinAmountParams) {
  const multipliers = getMultipliers({ winNumber, number, color, bigSmall });

  return betAmount.mul(multipliers);
}
