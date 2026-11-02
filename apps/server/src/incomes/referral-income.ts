import type dayjs from "dayjs";

import { prisma } from "@/lib/prisma";
import type { meddolic_user_details } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";

type ReleaseReferralIncomeParams = {
  user_id: meddolic_user_details["member_id"];
  dt: dayjs.Dayjs;
  prevStart: dayjs.Dayjs;
  prevEnd: dayjs.Dayjs;
};

export const releaseReferralIncome = async ({
  user_id,
  dt,
  prevStart,
  prevEnd,
}: ReleaseReferralIncomeParams) => {
  const directTeam = await prisma.meddolic_user_details.findMany({
    where: {
      sponser_id: user_id,
    },
    select: {
      member_id: true,
    },
  });

  const directIds = directTeam.map(({ member_id }) => member_id);

  const totalDirect = directIds.length;

  const totalSpins = await prisma.lottery_spin_bets.count({
    where: {
      member_id: {
        in: directIds,
      },
      date_time: {
        gte: prevStart.toISOString(),
        lte: prevEnd.toISOString(),
      },
    },
  });

  const config = await prisma.referral_income_config.findFirst({
    where: {
      direct_need: {
        lte: totalDirect,
      },
      spin_need: {
        lte: totalSpins,
      },
    },
    select: {
      id: true,
      income: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (!config) {
    return;
  }

  const referralIncome = await prisma.referral_income.create({
    data: {
      user_id,
      config_id: config.id,
      total_direct: totalDirect,
      total_spin: totalSpins,
      income: config.income,
      date_time: dt.toISOString(),
    },
    select: {
      id: true,
    },
  });

  await walletService.entry2({
    user_id,
    txn_id: referralIncome.id,
    amount: config.income,
    note: "Referral Income",
    type: "CREDIT",
    wallet_type: "BONUS_WALLET",
    dt,
  });
};
