import type dayjs from "dayjs";

import type { Prisma } from "@/lib/prisma";
import { fundService } from "@/services/fund.service";
import { walletService } from "@/services/wallet.service";

type ReleaseParams = {
  userId: number;
  prevStart: dayjs.Dayjs;
  prevEnd: dayjs.Dayjs;
  dt: dayjs.Dayjs;
};

export const DailyDepositBonus = {
  async release(
    db: Prisma.TransactionClient,
    { userId, prevStart, prevEnd, dt }: ReleaseParams
  ) {
    const totalDeposit = await fundService.totalRecharge(db, {
      userId,
      from: prevStart,
      to: prevEnd,
    });

    const config = await db.meddolic_config_daily_recharge_bonus.findFirst({
      select: {
        id: true,
        bonus: true,
      },
      where: {
        recharge: { lte: totalDeposit },
      },
      orderBy: { recharge: "desc" },
    });

    if (config === null) {
      return;
    }

    const entry = await db.meddolic_user_daily_recharge_bonus.create({
      data: {
        member_id: userId,
        total_recharge: totalDeposit,
        bonus_id: config.id,
        bonus: config.bonus,
        date_time: dt.toISOString(),
      },
    });

    await walletService.entry2({
      tx: db,
      user_id: userId,
      txn_id: entry.id,
      amount: entry.bonus,
      note: "Daily Deposit Bonus",
      type: "CREDIT",
      wallet_type: "BONUS_WALLET",
      dt,
    });
  },
};
