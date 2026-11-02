import type dayjs from "dayjs";
import type { Decimal } from "decimal.js";

import type { PrismaClient } from "@/lib/prisma";
import { getTotalBet } from "@/ops/bet";
import { walletService } from "@/services/wallet.service";

type ReleaseParams = {
  userId: number;
  rebatePercent: Decimal;
  prevStart: dayjs.Dayjs;
  prevEnd: dayjs.Dayjs;
  dt: dayjs.Dayjs;
};

export const RebateBonus = {
  async release(
    db: PrismaClient,
    { userId, rebatePercent, prevStart, prevEnd, dt }: ReleaseParams
  ) {
    const totalBet = await getTotalBet(db, {
      userId,
      from: prevStart,
      to: prevEnd,
    });

    if (totalBet.lte(0)) {
      return;
    }

    const bonus = totalBet.mul(rebatePercent).div(100);

    const entry = await db.meddolic_user_rebate_income.create({
      data: {
        member_id: userId,
        total_bet: totalBet,
        rebate_percent: rebatePercent,
        rebate_income: bonus,
        date_time: dt.toDate(),
      },
    });

    await walletService.entry2({
      tx: db,
      user_id: userId,
      txn_id: entry.id,
      amount: entry.rebate_income,
      note: "Rebate Income",
      type: "CREDIT",
      wallet_type: "BONUS_WALLET",
      dt,
    });
  },
};
