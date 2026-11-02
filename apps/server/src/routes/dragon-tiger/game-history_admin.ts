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

    const whereCondition: Prisma.dragonTigerWhereInput = {
      periodId: {
        contains: search,
      },
    };

    const dateFilter = buildDateRangeFilter(fromDate, toDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }

    const [total, gameHistory] = await Promise.all([
      ctx.db.dragonTiger.count({
        where: whereCondition,
      }),
      ctx.db.dragonTiger.findMany({
        where: whereCondition,
        orderBy: {
          id: "desc",
        },
        take: limit,
        skip: offset,
        select: {
          id: true,
          periodId: true,
          createdAt: true,
        },
      }),
    ]);

    const history = await Promise.all(
      gameHistory.map(async (h, i) => {
        const bets = await ctx.db.dragonTigerBet.aggregate({
          _count: true,
          _sum: {
            betAmount: true,
            winAmount: true,
            netAmount: true,
          },
          where: {
            gameId: h.id,
          },
        });

        const users = bets._count;
        const total_bet = bets._sum.betAmount ?? new Prisma.Decimal(0);
        const total_win_amount = bets._sum.winAmount ?? new Prisma.Decimal(0);
        const total_net_win_amount =
          bets._sum.netAmount ?? new Prisma.Decimal(0);

        return {
          index: offset + i + 1,
          id: h.id,
          period_id: h.periodId,
          date_time: h.createdAt,
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
