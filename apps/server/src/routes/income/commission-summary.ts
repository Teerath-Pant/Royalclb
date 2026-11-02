import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

const isoDate = v.pipe(v.string(), v.isoDate("Expected a date as YYYY-MM-DD"));

export const commissionSummary = createFastifyHandler({
  method: "GET",
  path: "/commission-summary",
  options: { auth: "user" },
  searchParams: v.object({ from: isoDate, to: isoDate }),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    // date_time holds IST wall-clock values, so compare against them as written.
    const where = {
      member_id: ctx.user.member_id,
      status: 1,
      date_time: {
        gte: new Date(`${searchParams.from}T00:00:00.000Z`),
        lte: new Date(`${searchParams.to}T23:59:59.999Z`),
      },
    };

    const result = await ctx.db.meddolic_user_trade_commission.aggregate({
      where,
      _sum: { commission: true },
      _count: true,
    });

    return AppResponse.success(reply, {
      message: "Commission summary fetched successfully",
      data: {
        totalCommission: safeDecimal(result._sum.commission).toFixed(2),
        count: result._count,
      },
    });
  },
});
