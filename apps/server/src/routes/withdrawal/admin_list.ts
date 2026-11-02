import * as v from "valibot";

import { withdrawalRequests_status } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const admin_list = createFastifyHandler({
  method: "GET",
  path: "/admin",
  options: { auth: "admin" },
  searchParams: v.optional(
    v.object({
      page: v.optional(v.pipe(v.unknown(), v.toNumber())),
      limit: v.optional(v.pipe(v.unknown(), v.toNumber())),
      status: v.optional(v.enum(withdrawalRequests_status)),
      userId: v.optional(v.pipe(v.unknown(), v.toNumber())),
    })
  ),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);

    const page = searchParams?.page ?? 1;
    const limit = searchParams?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      ...(searchParams?.status ? { status: searchParams.status } : {}),
      ...(searchParams?.userId ? { userId: searchParams.userId } : {}),
    };

    const [total, data] = await ctx.db.$transaction([
      ctx.db.withdrawalRequests.count({ where }),
      ctx.db.withdrawalRequests.findMany({
        where,
        orderBy: { requestedAt: "desc" },
        skip,
        take: limit,
        include: {
          meddolic_user_details: { select: { name: true, member_id: true } },
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
