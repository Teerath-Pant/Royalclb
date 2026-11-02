import * as v from "valibot";

import { aviator_status } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const games = createFastifyHandler({
  method: "GET",
  path: "/games",
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
    const { skip, take, page, limit } = searchParams;

    const where = {
      status: aviator_status.ENDED,
    } satisfies Prisma.aviatorWhereInput;

    const [count, items] = await Promise.all([
      ctx.db.aviator.count({ where }),
      ctx.db.aviator.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          maxFly: true,
          createdAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(count / limit);

    return AppResponse.success(reply, {
      message: "Games fetched successfully.",
      data: { items, totalPages, currentPage: page, total: count },
    });
  },
});
