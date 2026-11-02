import dayjs from "dayjs";
import * as v from "valibot";

import { Prisma } from "@/lib/prisma";
import type { meddolic_user_details, PrismaClient } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

async function getTotalDeposit(
  db: PrismaClient,
  userId: meddolic_user_details["member_id"],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
) {
  const recharges = await db.recharges.aggregate({
    where: {
      userId,
      status: "APPROVED",
      createdAt: {
        gte: startDate.add(5, "hours").add(30, "minutes").toISOString(),
        lte: endDate.add(5, "hours").add(30, "minutes").toISOString(),
      },
    },
    _sum: {
      amount: true,
    },
  });

  return safeDecimal(recharges._sum.amount);
}

async function getTotalBet(
  db: PrismaClient,
  userId: meddolic_user_details["member_id"],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
) {
  const [cpBets, headTailBets, lucky100Bets, aviatorBets, k3Bets, lsBets] =
    await Promise.all([
      db.winGoBets.aggregate({
        where: {
          userId,
          dateTime: {
            gte: startDate.add(5, "hours").add(30, "minutes").toISOString(),
            lte: endDate.add(5, "hours").add(30, "minutes").toISOString(),
          },
        },
        _sum: {
          betAmount: true,
        },
      }),
      db.meddolic_user_head_tail_game_bet_details.aggregate({
        where: {
          memberId: userId,
          dateTime: {
            gte: startDate.add(5, "hours").add(30, "minutes").toISOString(),
            lte: endDate.add(5, "hours").add(30, "minutes").toISOString(),
          },
        },
        _sum: {
          betAmount: true,
        },
      }),
      db.lucky100Bets.aggregate({
        where: {
          userId,
          dateTime: {
            gte: startDate.add(5, "hours").add(30, "minutes").toISOString(),
            lte: endDate.add(5, "hours").add(30, "minutes").toISOString(),
          },
        },
        _sum: {
          betAmount: true,
        },
      }),
      db.aviatorBet.aggregate({
        where: {
          userId,
          createdAt: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        _sum: {
          betAmount: true,
        },
      }),
      db.meddolic_game_k3_bets.aggregate({
        where: {
          member_id: userId,
          date_time: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        _sum: {
          bet_amount: true,
        },
      }),
      db.lottery_spin_bets.aggregate({
        where: {
          member_id: userId,
          date_time: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        _sum: {
          bet_amount: true,
        },
      }),
    ]);

  const totalCpBet = safeDecimal(cpBets._sum.betAmount);
  const totalHeadTailBet = safeDecimal(headTailBets._sum.betAmount);
  const totalLucky100Bet = safeDecimal(lucky100Bets._sum.betAmount);
  const totalAviatorBet = safeDecimal(aviatorBets._sum.betAmount);
  const totalK3Bet = safeDecimal(k3Bets._sum.bet_amount);
  const totalLSBet = safeDecimal(lsBets._sum.bet_amount);

  return totalCpBet
    .plus(totalHeadTailBet)
    .plus(totalLucky100Bet)
    .plus(totalAviatorBet)
    .plus(totalK3Bet)
    .plus(totalLSBet);
}

async function getTotalCommission(
  db: PrismaClient,
  parentId: meddolic_user_details["member_id"],
  userId: meddolic_user_details["member_id"],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
) {
  const trade = await db.meddolic_user_trade_commission.aggregate({
    where: {
      member_id: parentId,
      child_id: userId,
      status: 1,
      date_time: {
        gte: startDate.add(5, "hours").add(30, "minutes").toISOString(),
        lte: endDate.add(5, "hours").add(30, "minutes").toISOString(),
      },
    },
    _sum: {
      commission: true,
    },
  });

  const totalTrade = safeDecimal(trade._sum.commission);

  return totalTrade;
}

async function calcFr(
  db: PrismaClient,
  userId: meddolic_user_details["member_id"],
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): Promise<readonly [number, Prisma.Decimal]> {
  const count = await db.recharges.count({
    where: {
      userId,
      status: "APPROVED",
    },
  });

  if (count > 1) {
    return [0, new Prisma.Decimal(0)];
  }

  const recharges = await db.recharges.findFirst({
    where: {
      userId,
      status: "APPROVED",
      createdAt: {
        gte: startDate.add(5, "hours").add(30, "minutes").toISOString(),
        lte: endDate.add(5, "hours").add(30, "minutes").toISOString(),
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  if (recharges) {
    return [1, recharges.amount] as const;
  }

  return [0, new Prisma.Decimal(0)];
}

export const getSubordinateData = createFastifyHandler({
  method: "GET",
  path: "/subordinate-data",
  options: { auth: "user" },

  searchParams: v.object({
    level: v.optional(v.pipe(v.unknown(), v.toNumber())),
    date: v.pipe(v.unknown(), v.toString()),
    uid: v.optional(v.pipe(v.unknown(), v.toNumber())),
  }),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;

    const { level, date, uid } = searchParams;

    const dt = dayjs(date).tz("Asia/Kolkata");
    const todayStart = dt.startOf("day");
    const todayEnd = dt.endOf("day");

    let child_id: number | undefined;

    if (uid) {
      const user = await ctx.db.meddolic_user_details.findFirst({
        where: {
          uid,
        },
        select: {
          member_id: true,
        },
      });

      if (user) {
        child_id = user.member_id;
      } else {
        child_id = 0;
      }
    }

    const max = await ctx.db.meddolic_config_trade_commission.aggregate({
      _max: {
        level: true,
      },
    });
    const maxLevel = max._max.level ?? 0;

    const totalTeam = await ctx.db.meddolic_user_child_ids.findMany({
      where: {
        level: level ?? { lte: maxLevel },
        member_id,
        child_id,
      },
      orderBy: {
        level: "asc",
      },
    });

    let depositCount = 0;
    let depositAmount = new Prisma.Decimal(0);
    let bettorCount = 0;
    let betAmount = new Prisma.Decimal(0);
    let frCount = 0;
    let frAmount = new Prisma.Decimal(0);

    const teamData = await Promise.all(
      totalTeam.map(async (team) => {
        const totalDeposit = await getTotalDeposit(
          ctx.db,
          team.child_id,
          todayStart,
          todayEnd
        );
        const totalBet = await getTotalBet(
          ctx.db,
          team.child_id,
          todayStart,
          todayEnd
        );
        const totalCommission = await getTotalCommission(
          ctx.db,
          member_id,
          team.child_id,
          todayStart,
          todayEnd
        );

        const user = await ctx.db.meddolic_user_details.findUnique({
          where: {
            member_id: team.child_id,
          },
          select: {
            uid: true,
          },
        });

        if (totalDeposit.gt(0)) {
          depositCount += 1;
          depositAmount = depositAmount.plus(totalDeposit);
        }

        if (totalBet.gt(0)) {
          bettorCount += 1;
          betAmount = betAmount.plus(totalBet);
        }

        const [c, a] = await calcFr(
          ctx.db,
          team.child_id,
          todayStart,
          todayEnd
        );

        frCount += c;
        frAmount = frAmount.plus(a);

        return {
          uid: user?.uid,
          level: team.level,
          totalBet: totalBet.toFixed(2),
          totalDeposit: totalDeposit.toFixed(2),
          totalCommission: totalCommission.toFixed(2),
          date,
        };
      })
    );

    return AppResponse.success(reply, {
      message: "Subordinate Data Fetched Successfully.",
      data: {
        teamData: teamData.toSorted(
          (a, b) => Number(b.totalCommission) - Number(a.totalCommission)
        ),
        maxLevel,
        depositCount,
        depositAmount: depositAmount.toFixed(2),
        bettorCount,
        betAmount: betAmount.toFixed(2),
        frCount,
        frAmount: frAmount.toFixed(2),
      },
    });
  },
});
