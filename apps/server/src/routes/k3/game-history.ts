import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const gameHistory = createFastifyHandler({
  method: "GET",
  path: "/game-history",
  options: { auth: "user" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    interval: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
  }),

  async handler({ searchParams, reply, ctx }) {
    const { page, limit, interval } = searchParams;
    const offset = (page - 1) * limit;

    const total = await ctx.db.meddolic_game_k3_summary.count({
      where: {
        interval_min: interval,
        status: 0,
      },
    });

    const history = await ctx.db.meddolic_game_k3_summary.findMany({
      where: {
        interval_min: interval,
        status: 0,
      },
      orderBy: {
        id: "desc",
      },
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Game History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: history },
    });
  },
});
