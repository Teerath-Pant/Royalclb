import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const claim_history = createFastifyHandler({
  method: "GET",
  path: "/claim-history",
  options: { auth: "user" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
  }),

  async handler({ searchParams, reply, ctx }) {
    requireUser(ctx);
    const offset = (searchParams.page - 1) * searchParams.limit;
    const userId = ctx.user.member_id;

    const [total, items] = await Promise.all([
      ctx.db.giftCodeClaim.count({ where: { userId } }),
      ctx.db.giftCodeClaim.findMany({
        where: { userId },
        orderBy: { claimedAt: "desc" },
        take: searchParams.limit,
        skip: offset,
        select: {
          id: true,
          claimedAt: true,
          giftCode: {
            select: {
              code: true,
              amount: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / searchParams.limit);

    return AppResponse.success(reply, {
      message: "Claim history fetched successfully",
      data: { totalPages, currentPage: searchParams.page, total, items },
    });
  },
});
