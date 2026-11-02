import * as v from "valibot";

import type { Prisma } from "@/lib/prisma";
import { giftCode_status } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const admin_list = createFastifyHandler({
  method: "GET",
  path: "/admin",
  options: { auth: "admin" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    status: v.optional(v.enum(giftCode_status)),
  }),

  async handler({ searchParams, reply, ctx }) {
    const offset = (searchParams.page - 1) * searchParams.limit;

    const where: Prisma.giftCodeWhereInput = {
      status: searchParams.status,
    };

    const [total, items] = await Promise.all([
      ctx.db.giftCode.count({ where }),
      ctx.db.giftCode.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: searchParams.limit,
        skip: offset,
        select: {
          id: true,
          code: true,
          amount: true,
          maxClaims: true,
          claimedCount: true,
          expiresAt: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / searchParams.limit);

    return AppResponse.success(reply, {
      message: "Recharge History Fetched Successfully",
      data: { totalPages, currentPage: searchParams.page, total, items },
    });
  },
});
