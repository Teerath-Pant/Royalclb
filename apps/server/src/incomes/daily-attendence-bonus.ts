import type dayjs from "dayjs";

import type { Prisma, PrismaClient } from "@/lib/prisma";
import { getTotalBet } from "@/ops/bet";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

type ReleaseParams = {
  userId: number;
  dt: dayjs.Dayjs;
};

export const DailyAttendenceBonus = {
  async release(db: Prisma.TransactionClient, { userId, dt }: ReleaseParams) {
    const todayStart = dt.startOf("day");
    const todayEnd = dt.endOf("day");
    const prevStart = dt.subtract(1, "day").startOf("day");
    const prevEnd = dt.subtract(1, "day").endOf("day");

    const count = await db.meddolic_user_attendence_bonus.count({
      where: {
        member_id: userId,
        date_time: {
          gte: todayStart.toISOString(),
          lte: todayEnd.toISOString(),
        },
      },
    });

    if (count > 0) {
      return;
    }

    let attendenceDay = 1;
    const lastAttendence = await db.meddolic_user_attendence_bonus.findFirst({
      select: {
        day: true,
      },
      where: {
        member_id: userId,
        date_time: {
          gte: prevStart.toISOString(),
          lte: prevEnd.toISOString(),
        },
      },
    });

    if (lastAttendence !== null) {
      attendenceDay = (lastAttendence.day % 7) + 1;
    }

    const config = await db.meddolic_config_attendence_bonus.findFirst({
      select: {
        id: true,
        bet_need: true,
        bonus: true,
      },
      where: {
        day: attendenceDay,
      },
    });

    if (config === null) {
      return;
    }

    const totalBet = await getTotalBet(db, {
      userId,
      from: todayStart,
      to: todayEnd,
    });

    if (totalBet.lt(config.bet_need)) {
      return;
    }

    await db.meddolic_user_attendence_bonus.create({
      data: {
        member_id: userId,
        attendence_id: config.id,
        day: attendenceDay,
        bonus: config.bonus,
        status: 0,
        date_time: dt.toISOString(),
      },
    });
  },

  async autoClaim(db: PrismaClient) {
    const dt = Now();
    const attendences = await db.meddolic_user_attendence_bonus.findMany({
      where: { status: 0 },
    });

    for (const attendence of attendences) {
      await db.$transaction(async (tx) => {
        await tx.meddolic_user_attendence_bonus.update({
          where: { id: attendence.id },
          data: { status: 1 },
        });

        await walletService.entry2({
          tx,
          user_id: attendence.member_id,
          txn_id: attendence.id,
          amount: attendence.bonus,
          note: "Attendence Bonus",
          type: "CREDIT",
          wallet_type: "BONUS_WALLET",
          dt,
        });
      });
    }
  },
};
