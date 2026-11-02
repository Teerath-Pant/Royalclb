import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const rechargeHistory = createFastifyHandler({
  method: "GET",
  path: "/recharge",
  options: { auth: "user" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
  }),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;

    const { page, limit } = searchParams;
    const offset = (page - 1) * limit;

    const total = await ctx.db.recharges.count({
      where: {
        userId: member_id,
        method: { in: ["OFFLINE", "ONLINE"] },
      },
    });

    const recharges = await ctx.db.recharges.findMany({
      where: {
        userId: member_id,
        method: { in: ["OFFLINE", "ONLINE"] },
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        meddolic_user_details: {
          select: {
            uid: true,
            name: true,
          },
        },
        amount: true,
        method: true,
        utrNo: true,
        remark: true,
        type: true,
        status: true,
        createdAt: true,
        respondedAt: true,
        metadata: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = recharges.map((r) => {
      const user = r.meddolic_user_details;

      return {
        id: r.id,
        user: {
          uid: user.uid,
          name: user.name,
        },
        amount: r.amount,
        method: r.method,
        utrNo: r.utrNo,
        remark: r.remark,
        type: r.type,
        status: r.status,
        createdAt: r.createdAt,
        respondedAt: r.respondedAt,
        metadata: r.metadata,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Recharge History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data },
    });
  },
});
