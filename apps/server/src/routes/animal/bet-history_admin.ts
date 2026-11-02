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

    const whereCondition: Prisma.animalBetsWhereInput = {
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
      whereCondition.dateTime = dateFilter;
    }

    const [total, gameHistory] = await Promise.all([
      ctx.db.animalBets.count({
        where: whereCondition,
      }),
      ctx.db.animalBets.findMany({
        where: whereCondition,
        orderBy: {
          id: "desc",
        },
        take: limit,
        skip: offset,
        select: {
          id: true,
          betOn: true,
          betAmount: true,
          winAmount: true,
          charge: true,
          netWinAmount: true,
          status: true,
          dateTime: true,
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
        totalWallet: bonusWallet.plus(wallet).plus(fundWallet),
        betOn: h.betOn,
        betAmount: h.betAmount,
        winAmount: h.winAmount ?? 0,
        charge: h.charge ?? 0,
        netWinAmount: h.netWinAmount ?? 0,
        status: h.status,
        dateTime: h.dateTime,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Game History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: history, totalBet },
    });
  },
});
