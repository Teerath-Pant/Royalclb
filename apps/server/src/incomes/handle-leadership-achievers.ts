import type dayjs from "dayjs";
import { Decimal } from "decimal.js";

import { prisma } from "@/lib/prisma";
import type { meddolic_user_details } from "@/lib/prisma";
import { fundService } from "@/services/fund.service";
// import { safeDecimal } from "@/utils/safe-decimal";
// import { settingsService } from "@/services/settings.service";
// import { walletService } from "@/services/wallet.service";

type HandleLeadershipAchieverParams = {
  userId: meddolic_user_details["member_id"];
  dt: dayjs.Dayjs;
  prevMonthStart: dayjs.Dayjs;
  prevMonthEnd: dayjs.Dayjs;
};

const TOTAL_DIRECT_NEED = 10;
const MIN_RECHARGE = 5000;

export const handleLeadershipAchiever = async ({
  userId,
  dt,
  prevMonthStart,
  prevMonthEnd,
}: HandleLeadershipAchieverParams) => {
  const prevMonthStartIST = prevMonthStart.add(5, "hours").add(30, "minutes");
  const prevMonthEndIST = prevMonthEnd.add(5, "hours").add(30, "minutes");

  const directUsers = await prisma.meddolic_user_details.findMany({
    where: {
      sponser_id: userId,
      date_time: {
        gte: prevMonthStartIST.toISOString(),
        lte: prevMonthEndIST.toISOString(),
      },
    },
    select: {
      member_id: true,
      fundWallet: true,
      wallet: true,
      bonusWallet: true,
    },
  });

  const directCount = directUsers.length;

  if (directCount < TOTAL_DIRECT_NEED) {
    return;
  }

  const userRecharge: {
    userId: meddolic_user_details["member_id"];
    recharge: Decimal;
  }[] = [];

  let aboveRequirementCount = 0;

  for (const directUser of directUsers) {
    const { member_id, bonusWallet, wallet, fundWallet } = directUser;

    const totalWallet = bonusWallet.plus(wallet).plus(fundWallet);

    if (totalWallet.greaterThanOrEqualTo(5000)) {
      aboveRequirementCount += 1;
    }

    const totalRecharge = await fundService.totalRecharge(prisma, {
      userId: member_id,
      from: prevMonthStartIST,
      to: prevMonthEndIST,
    });

    userRecharge.push({
      userId: member_id,
      recharge: totalRecharge,
    });
  }

  if (aboveRequirementCount < 3) {
    return;
  }

  // Sort by recharge (DESC)
  userRecharge.sort((a, b) => b.recharge.minus(a.recharge).toNumber());

  let userCount = 0;
  let totalRecharge = new Decimal(0);

  for (const user of userRecharge) {
    const { recharge } = user;

    totalRecharge = totalRecharge.plus(recharge);

    if (recharge.greaterThanOrEqualTo(MIN_RECHARGE)) {
      userCount += 1;
    }
  }

  if (userCount < TOTAL_DIRECT_NEED) {
    return;
  }

  await Promise.all([
    prisma.leadership_achiever_list.create({
      data: {
        user_id: userId,
        total_direct: directCount,
        valid_direct: userCount,
        total_recharge: totalRecharge,
        date_time: dt.toISOString(),
      },
      select: {
        id: true,
      },
    }),
    prisma.meddolic_user_details.update({
      where: {
        member_id: userId,
      },
      data: {
        leadershipId: 0,
      },
    }),
  ]);
};
