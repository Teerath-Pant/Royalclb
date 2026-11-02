import type dayjs from "dayjs";

import { prisma } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";

export const releaseReward = async ({ dt }: { dt: dayjs.Dayjs }) => {
  const summaries = await prisma.reward_summary.findMany({
    where: {
      status: "RUNNING",
    },
  });

  const rewardPromises = summaries.map(async (summary) => {
    const { id: txnId } = await prisma.reward.create({
      data: {
        summary_id: summary.id,
        user_id: summary.user_id,
        income: summary.income,
        date_time: dt.toISOString(),
      },
    });

    await walletService.entry2({
      user_id: summary.user_id,
      txn_id: txnId,
      amount: summary.income,
      note: "Reward Income",
      type: "CREDIT",
      wallet_type: "WALLET",
      dt,
    });

    const total = await prisma.reward.count({
      where: {
        summary_id: summary.id,
      },
    });

    if (total >= summary.duration) {
      await prisma.reward_summary.update({
        where: {
          id: summary.id,
        },
        data: {
          status: "STOPPED",
        },
      });
    }
  });

  await Promise.all(rewardPromises);
};
