import * as v from "valibot";

import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const bets = createFastifyHandler({
  method: "GET",
  path: "/bets",
  options: { auth: "user" },
  searchParams: v.pipe(
    v.object({
      page: v.pipe(v.unknown(), v.toNumber()),
      limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    }),
    v.transform((data) => ({
      ...data,
      take: data.limit,
      skip: (data.page - 1) * data.limit,
    }))
  ),

  async handler({ searchParams, reply, ctx }) {
    requireUser(ctx);
    const { skip, take, page, limit } = searchParams;

    const where = {
      userId: ctx.user.member_id,
    } satisfies Prisma.aviatorBetWhereInput;

    const [count, items] = await Promise.all([
      ctx.db.aviatorBet.count({ where }),
      ctx.db.aviatorBet.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(count / limit);

    return AppResponse.success(reply, {
      message: "Games fetched successfully.",
      data: {
        items: items.map((item) => ({
          ...item,
          user: {
            name: ctx.user.name,
          },
        })),
        totalPages,
        currentPage: page,
        total: count,
      },
    });
  },
});
