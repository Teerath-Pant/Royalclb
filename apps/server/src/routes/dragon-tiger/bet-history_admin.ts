import { isNumber } from "es-toolkit";
import * as v from "valibot";

import { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { buildDateRangeFilter } from "@/utils/build-date-range-filter";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { dateStringSchema } from "@/utils/valibot";

export const betHistoryAdmin = createFastifyHandler({
  method: "GET",
  path: "/bet-history-admin",
  options: { auth: "admin" },
  searchParams: v.object({
    gameId: v.pipe(v.unknown(), v.toNumber()),
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    search: v.optional(v.string()),
    fromDate: v.optional(dateStringSchema),
    toDate: v.optional(dateStringSchema),
  }),

  async handler({ searchParams, reply, ctx }) {
    const { page, limit, search, fromDate, toDate, gameId } = searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.dragonTigerBetWhereInput = {
      meddolic_user_details: {
        uid: {
          equals: isNumber(search) ? Number(search) : undefined,
        },
        name: {
          contains: search,
        },
      },
      gameId,
    };

    const dateFilter = buildDateRangeFilter(fromDate, toDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }

    const [total, gameHistory] = await Promise.all([
      ctx.db.dragonTigerBet.count({
        where: whereCondition,
      }),
      ctx.db.dragonTigerBet.findMany({
        where: whereCondition,
        orderBy: {
          id: "desc",
        },
        take: limit,
        skip: offset,
        select: {
          id: true,
          betType: true,
          betAmount: true,
          winAmount: true,
          tax: true,
          netAmount: true,
          status: true,
          createdAt: true,
          meddolic_user_details: {
            select: {
              uid: true,
              name: true,
              bonusWallet: true,
              fundWallet: true,
              wallet: true,
            },
          },
        },
      }),
    ]);

    let totalBet = new Prisma.Decimal(0);

    const history = gameHistory.map((h, i) => {
      const { uid, name, bonusWallet, wallet, fundWallet } =
        h.meddolic_user_details;

      totalBet = totalBet.plus(h.betAmount);

      return {
        index: offset + i + 1,
        id: h.id,
        uid,
        name,
        total_wallet: bonusWallet.plus(wallet).plus(fundWallet),
        bet_on: h.betType,
        bet_amount: h.betAmount,
        win_amount: h.winAmount ?? 0,
        charge: h.tax ?? 0,
        net_win_amount: h.netAmount ?? 0,
        status: h.status,
        date_time: h.createdAt,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Game History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: history, totalBet },
    });
  },
});
