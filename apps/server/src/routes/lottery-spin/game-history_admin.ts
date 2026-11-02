import * as v from "valibot";

import { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { buildDateRangeFilter } from "@/utils/build-date-range-filter";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { dateStringSchema } from "@/utils/valibot";

export const gameHistoryAdmin = createFastifyHandler({
  method: "GET",
  path: "/game-history-admin",
  options: { auth: "admin" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    search: v.optional(v.string()),
    fromDate: v.optional(dateStringSchema),
    toDate: v.optional(dateStringSchema),
  }),

  async handler({ searchParams, reply, ctx }) {
    const { page, limit, search, fromDate, toDate } = searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.lottery_spin_summaryWhereInput = {
      period_id: {
        contains: search,
      },
    };

    const dateFilter = buildDateRangeFilter(fromDate, toDate);
    if (dateFilter) {
      whereCondition.started_at = dateFilter;
    }

    const [total, gameHistory] = await ctx.db.$transaction([
      ctx.db.lottery_spin_summary.count({
        where: whereCondition,
      }),
      ctx.db.lottery_spin_summary.findMany({
        where: whereCondition,
        orderBy: {
          id: "desc",
        },
        take: limit,
        skip: offset,
        select: {
          id: true,
          period_id: true,
          started_at: true,
        },
      }),
    ]);

    const history = await Promise.all(
      gameHistory.map(async (h, i) => {
        const bets = await ctx.db.lottery_spin_bets.aggregate({
          _count: true,
          _sum: {
            bet_amount: true,
            win_amount: true,
            net_win_amount: true,
          },
          where: {
            game_id: h.id,
          },
        });

        const users = bets._count;
        const total_bet = bets._sum.bet_amount ?? new Prisma.Decimal(0);
        const total_win_amount = bets._sum.win_amount ?? new Prisma.Decimal(0);
        const total_net_win_amount =
          bets._sum.net_win_amount ?? new Prisma.Decimal(0);

        return {
          index: offset + i + 1,
          id: h.id,
          game_id: h.period_id,
          date_time: h.started_at,
          users,
          total_bet,
          admin_profit: total_bet.minus(total_win_amount),
          total_win_amount,
          total_net_win_amount,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Game History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: history },
    });
  },
});
