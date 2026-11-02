import * as v from "valibot";

import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { buildDateRangeFilter } from "@/utils/build-date-range-filter";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { safeDecimal } from "@/utils/safe-decimal";
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
    interval: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ searchParams, reply, ctx }) {
    const { page, limit, search, fromDate, toDate, interval } = searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.lucky100WhereInput = {
      period: {
        contains: search,
      },
      intervalMin: interval,
    };

    const dateFilter = buildDateRangeFilter(fromDate, toDate);
    if (dateFilter) {
      whereCondition.startedAt = dateFilter;
    }

    const [total, gameHistory] = await Promise.all([
      ctx.db.lucky100.count({
        where: whereCondition,
      }),
      ctx.db.lucky100.findMany({
        where: whereCondition,
        orderBy: {
          id: "desc",
        },
        take: limit,
        skip: offset,
        select: {
          id: true,
          period: true,
          startedAt: true,
        },
      }),
    ]);

    const history = await Promise.all(
      gameHistory.map(async (h, i) => {
        const bets = await ctx.db.lucky100Bets.aggregate({
          _count: true,
          _sum: {
            betAmount: true,
            winAmount: true,
            netWinAmount: true,
          },
          where: {
            gameId: h.id,
          },
        });

        const users = bets._count;
        const totalBet = safeDecimal(bets._sum.betAmount);
        const totalWinAmount = safeDecimal(bets._sum.winAmount);
        const totalNetWinAmount = safeDecimal(bets._sum.netWinAmount);

        return {
          index: offset + i + 1,
          id: h.id,
          period: h.period,
          dateTime: h.startedAt,
          users,
          totalBet,
          adminProfit: totalBet.minus(totalWinAmount),
          totalWinAmount,
          totalNetWinAmount,
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
