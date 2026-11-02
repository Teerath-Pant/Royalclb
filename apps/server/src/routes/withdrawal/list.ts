import * as v from "valibot";

import { withdrawalRequests_status } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const list = createFastifyHandler({
  method: "GET",
  path: "/",
  options: { auth: "user" },
  searchParams: v.optional(
    v.object({
      page: v.optional(v.pipe(v.unknown(), v.toNumber())),
      limit: v.optional(v.pipe(v.unknown(), v.toNumber())),
      status: v.optional(v.enum(withdrawalRequests_status)),
    })
  ),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);

    const page = searchParams?.page ?? 1;
    const limit = searchParams?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      userId: ctx.user.member_id,
      ...(searchParams?.status ? { status: searchParams.status } : {}),
    };

    const [total, data] = await ctx.db.$transaction([
      ctx.db.withdrawalRequests.count({ where }),
      ctx.db.withdrawalRequests.findMany({
        where,
        orderBy: { requestedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          currency: true,
          amount: true,
          originalAmount: true,
          charge: true,
          netAmount: true,
          status: true,
          rejectionReason: true,
          transactionRef: true,
          requestedAt: true,
          processedAt: true,
        },
      }),
    ]);

    return AppResponse.success(reply, {
      data: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
        data,
      },
    });
  },
});
