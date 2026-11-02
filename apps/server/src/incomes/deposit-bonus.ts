import type dayjs from "dayjs";
import type { Decimal } from "decimal.js";

import type { Prisma } from "@/lib/prisma";
import { fundService } from "@/services/fund.service";
import { walletService } from "@/services/wallet.service";

type ReleaseParams = {
  userId: number;
  sponsorId: number | null;
  depositAmount: Decimal;
  dt: dayjs.Dayjs;
};

async function getConfig(
  db: Prisma.TransactionClient,
  { depositAmount, count }: { depositAmount: Decimal; count: number }
) {
  if (count <= 5) {
    return await db.meddolic_config_deposit_bonus.findFirst({
      select: {
        id: true,
        self_bonus: true,
        upline_bonus: true,
      },
      where: {
        recharge_need: { lte: depositAmount },
        deposit_number: count,
      },
    });
  }

  return await db.meddolic_config_deposit_bonus.findFirst({
    select: {
      id: true,
      self_bonus: true,
      upline_bonus: true,
    },
    where: { deposit_number: 6 },
  });
}

export const DepositBonus = {
  async release(
    db: Prisma.TransactionClient,
    { userId, sponsorId, depositAmount, dt }: ReleaseParams
  ) {
    const totalRechargeCount = await fundService.totalRechargeCount(db, {
      userId,
    });

    const config = await getConfig(db, {
      depositAmount,
      count: totalRechargeCount,
    });

    if (config === null) {
      return;
    }

    const selfBonusAmount = depositAmount.mul(config.self_bonus).div(100);
    const uplineBonusAmount = depositAmount.mul(config.upline_bonus).div(100);

    const selfEntry = await db.meddolic_user_deposit_bonus.create({
      data: {
        member_id: userId,
        deposit_number: totalRechargeCount,
        income_from: userId,
        deposit_amount: depositAmount,
        income: selfBonusAmount,
        bonus_id: config.id,
        date_time: dt.toISOString(),
      },
    });

    await walletService.entry2({
      tx: db,
      user_id: userId,
      txn_id: selfEntry.id,
      amount: selfEntry.income,
      note: "Deposit Bonus (Self)",
      type: "CREDIT",
      wallet_type: "BONUS_WALLET",
      dt,
    });

    if (sponsorId && uplineBonusAmount.gt(0)) {
      const uplineEntry = await db.meddolic_user_deposit_bonus.create({
        data: {
          member_id: sponsorId,
          deposit_number: totalRechargeCount,
          income_from: userId,
          deposit_amount: depositAmount,
          income: uplineBonusAmount,
          bonus_id: config.id,
          date_time: dt.toISOString(),
        },
      });

      await walletService.entry2({
        tx: db,
        user_id: sponsorId,
        txn_id: uplineEntry.id,
        amount: uplineEntry.income,
        note: "Deposit Bonus (Upline)",
        type: "CREDIT",
        wallet_type: "BONUS_WALLET",
        dt,
      });
    }
  },
};
