import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const betHistory = createFastifyHandler({
  method: "GET",
  path: "/bet-history",
  options: { auth: "user" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
  }),

  async handler({ searchParams, reply, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;

    const { page, limit } = searchParams;
    const offset = (page - 1) * limit;

    const total = await ctx.db.lottery_spin_bets.count({
      where: {
        member_id,
      },
    });

    const games = await ctx.db.lottery_spin_bets.findMany({
      where: {
        member_id,
      },
      take: limit,
      skip: offset,
      include: {
        lottery_spin_summary: {
          select: {
            period_id: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Bet History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: games },
    });
  },
});
