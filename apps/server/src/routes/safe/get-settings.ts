import { getSafeSetting } from "@/ops/safe-settings";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getSettings = createFastifyHandler({
  method: "GET",
  path: "/settings",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    const settings = await getSafeSetting(ctx.db, {
      interestRate: true,
      minDepositAmount: true,
      maxDepositAmount: true,
      minWithdrawAmount: true,
      maxWithdrawAmount: true,
    });

    return AppResponse.success(reply, {
      data: settings,
    });
  },
});
