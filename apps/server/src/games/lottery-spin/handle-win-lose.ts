import { Prisma, prisma } from "@/lib/prisma";
import type { lottery_spin_bets, lottery_spin_summary } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

type HandleWinAndLose = {
  id: lottery_spin_summary["id"];
  lotteryId: lottery_spin_bets["id"];
  winAmount: number;
};

export const handleWinAndLose = async ({
  id,
  lotteryId,
  winAmount,
}: HandleWinAndLose) => {
  const dt = Now();

  await prisma.lottery_spin_summary.update({
    data: {
      winning_lottery: lotteryId,
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const lotteries = await prisma.lottery_spin_bets.findMany({
    where: {
      game_id: id,
    },
  });

  return Promise.all(
    lotteries.map((lottery) => {
      if (lottery.id === lotteryId) {
        const charge = (winAmount * platformCharge.toNumber()) / 100;
        const netWinningAmount = new Prisma.Decimal(winAmount - charge);

        return Promise.all([
          prisma.lottery_spin_bets.update({
            data: {
              win_amount: winAmount,
              charge,
              net_win_amount: netWinningAmount,
              status: 1,
              result_date_time: dt.toISOString(),
            },
            where: {
              id: lottery.id,
            },
          }),
          walletService.entry2({
            user_id: lottery.member_id,
            txn_id: lottery.id,
            amount: netWinningAmount,
            note: "WIN (LOTTERY SPIN)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return prisma.lottery_spin_bets.update({
        data: {
          win_amount: 0,
          charge: 0,
          net_win_amount: 0,
          status: 2,
          result_date_time: dt.toISOString(),
        },
        where: {
          id: lottery.id,
        },
      });
    })
  );
};
