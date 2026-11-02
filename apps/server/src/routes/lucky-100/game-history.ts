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

    const total = await ctx.db.lucky100.count({
      where: {
        intervalMin: interval,
        status: "COMPLETED",
      },
    });

    const history = await ctx.db.lucky100.findMany({
      where: {
        intervalMin: interval,
        status: "COMPLETED",
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
