import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const getAccumulatedRevenue = createFastifyHandler({
  method: "GET",
  path: "/accumulated-revenue",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const interestAggregate = await ctx.db.safeInterestLogs.aggregate({
      _sum: { amount: true },
      where: { userId: ctx.user.member_id },
    });

    const accumulatedRevenue = safeDecimal(
      interestAggregate._sum.amount
    ).toNumber();

    return AppResponse.success(reply, {
      data: accumulatedRevenue,
    });
  },
});
