import * as v from "valibot";

import { chickenRoadBet_status } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const bets = createFastifyHandler({
  method: "GET",
  path: "/bets",
  options: { auth: "user" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
  }),

  async handler({ searchParams, reply, ctx }) {
    requireUser(ctx);
    const { page, limit } = searchParams;
    const skip = (page - 1) * limit;
    const take = limit;

    const where = {
      userId: ctx.user.member_id,
      status: { not: chickenRoadBet_status.PENDING },
    } satisfies Prisma.chickenRoadBetWhereInput;

    const [count, items] = await Promise.all([
      ctx.db.chickenRoadBet.count({ where }),
      ctx.db.chickenRoadBet.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          betAmount: true,
          finalMultiplier: true,
          winAmount: true,
          createdAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(count / limit);

    return AppResponse.success(reply, {
      message: "Bets fetched successfully.",
      data: { items, totalPages, currentPage: page, total: count },
    });
  },
});
