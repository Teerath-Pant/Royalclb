import type dayjs from "dayjs";
import { Decimal } from "decimal.js";

import { prisma } from "@/lib/prisma";
import type { meddolic_user_details } from "@/lib/prisma";
import { fundService } from "@/services/fund.service";
import { settingsService } from "@/services/settings.service";
import { walletService } from "@/services/wallet.service";
import { safeDecimal } from "@/utils/safe-decimal";

type ReleaseMatchingIncomeParams = {
  userId: meddolic_user_details["member_id"];
  prevStart: dayjs.Dayjs;
  prevEnd: dayjs.Dayjs;
  dt: dayjs.Dayjs;
};

export const releaseMatchingIncome = async ({
  userId,
  prevStart,
  prevEnd,
  dt,
}: ReleaseMatchingIncomeParams) => {
  const prevStartIST = prevStart.add(5, "hours").add(30, "minutes");
  const prevEndIST = prevEnd.add(5, "hours").add(30, "minutes");

  const teamMembers = await prisma.meddolic_user_child_ids.findMany({
    where: {
      member_id: userId,
      level: {
        lte: 5,
      },
    },
    select: {
      child_id: true,
    },
  });

  const userRecharge: {
    userId: meddolic_user_details["member_id"];
    recharge: Decimal;
  }[] = [];

  let totalRecharge = new Decimal(0);

  for (const teamMember of teamMembers) {
    const { child_id } = teamMember;

    const recharge = await fundService.totalRecharge(prisma, {
      userId: child_id,
      from: prevStartIST,
      to: prevEndIST,
    });

    userRecharge.push({
      userId: child_id,
      recharge,
    });

    totalRecharge = totalRecharge.plus(recharge);
  }

  userRecharge.sort((a, b) => b.recharge.minus(a.recharge).toNumber());

  const strongLeg = safeDecimal(userRecharge[0]?.recharge);
  const weakLeg = totalRecharge.minus(strongLeg);

  const oldCarry = await prisma.matching_carry.findFirst({
    where: {
      user_id: userId,
    },
    orderBy: {
      date_time: "desc",
    },
    select: {
      strong_leg_carry: true,
      weak_leg_carry: true,
      id: true,
    },
  });

  if (oldCarry?.id) {
    await prisma.matching_carry.delete({
      where: { id: oldCarry.id },
    });
  }

  const strongLegCarry = safeDecimal(oldCarry?.strong_leg_carry);
  const weakLegCarry = safeDecimal(oldCarry?.weak_leg_carry);

  const totalStrongLeg = strongLegCarry.plus(strongLeg);
  const totalWeakLeg = weakLegCarry.plus(weakLeg);

  if (totalStrongLeg.lte(0) && totalWeakLeg.lte(0)) {
    return;
  }

  const matching = Decimal.min(totalStrongLeg, totalWeakLeg);

  if (matching.lte(0)) {
    await prisma.matching_carry.create({
      data: {
        user_id: userId,
        strong_leg_carry: totalStrongLeg,
        weak_leg_carry: totalWeakLeg,
        date_time: dt.toISOString(),
      },
    });

    return;
  }

  const { matching_percent } = await settingsService.get({
    matching_percent: true,
  });

  const matchingIncome = matching.mul(matching_percent).div(100);

  const { id: txnId } = await prisma.matching_income.create({
    data: {
      user_id: userId,
      strong_leg: strongLeg,
      weak_leg: weakLeg,
      strong_leg_carry: strongLegCarry,
      weak_leg_carry: weakLegCarry,
      matching_amount: matching,
      income: matchingIncome,
      date_time: dt.toISOString(),
    },
    select: {
      id: true,
    },
  });

  const newStrongLegCarry = totalStrongLeg.minus(matching);
  const newWeakLegCarry = totalWeakLeg.minus(matching);

  if (newStrongLegCarry.gt(0) || newWeakLegCarry.gt(0)) {
    await prisma.matching_carry.create({
      data: {
        user_id: userId,
        strong_leg_carry: newStrongLegCarry,
        weak_leg_carry: newWeakLegCarry,
        date_time: dt.toISOString(),
      },
    });
  }

  await walletService.entry2({
    user_id: userId,
    txn_id: txnId,
    amount: matchingIncome,
    note: "Matching Income",
    type: "CREDIT",
    wallet_type: "WALLET",
    dt,
  });
};
