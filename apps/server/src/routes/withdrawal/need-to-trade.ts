import { getDepositNeedToTrade } from "@/ops/withdraw";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const getWithdrawalNeedToTrade = createFastifyHandler({
  method: "GET",
  path: "/need-to-trade",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);

    const needToTrade = await getDepositNeedToTrade(ctx.db, ctx.user.member_id);

    return AppResponse.success(reply, {
      message: "Need to trade amount fetched successfully",
      data: {
        needToTrade,
      },
    });
  },
});
