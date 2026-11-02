import type dayjs from "dayjs";

import type { PrismaClient } from "@/lib/prisma";
import { fundService } from "@/services/fund.service";
import { walletService } from "@/services/wallet.service";

const MIN_RECHARGE = 500;
// const MIN_GAMEPLAY = 500;

type ReleaseParams = {
  userId: number;
  prevStart: dayjs.Dayjs;
  prevEnd: dayjs.Dayjs;
  dt: dayjs.Dayjs;
};

export const SalaryBonus = {
  async release(
    db: PrismaClient,
    { userId, prevStart, prevEnd, dt }: ReleaseParams
  ) {
    let activeCount = 0;

    const directs = await db.meddolic_user_details.findMany({
      where: { sponser_id: userId, topup_flag: 1 },
    });

    for (const direct of directs) {
      const totalRecharge = await fundService.totalRecharge(db, {
        userId: direct.member_id,
        from: prevStart,
        to: prevEnd,
      });

      if (totalRecharge.gte(MIN_RECHARGE)) {
        activeCount += 1;
      }
    }

    const config = await db.meddolic_config_salary_bonus.findFirst({
      select: { id: true, salary: true },
      where: { daily_active_member: { lte: activeCount } },
      orderBy: { id: "desc" },
    });

    if (config === null) {
      return;
    }

    const entry = await db.meddolic_user_salary_bonus.create({
      data: {
        member_id: userId,
        salary_id: config.id,
        salary: config.salary,
        date_time: dt.toDate(),
        release_date: dt.toDate(),
        release_status: 1,
        status: 1,
      },
    });

    await walletService.entry2({
      tx: db,
      user_id: userId,
      txn_id: entry.id,
      amount: entry.salary,
      note: "Salary Bonus",
      type: "CREDIT",
      wallet_type: "BONUS_WALLET",
      dt,
    });
  },
};
