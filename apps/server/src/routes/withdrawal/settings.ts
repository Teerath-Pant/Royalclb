import { getFundSettings } from "@/ops/fund-settings";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getWithdrawalSettings = createFastifyHandler({
  method: "GET",
  path: "/settings",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    const settings = await getFundSettings(ctx.db, {
      minWithdrawInr: true,
      maxWithdrawInr: true,
      minWithdrawUsd: true,
      maxWithdrawUsd: true,
      withdrawCharge: true,
      maxWithdrawalsPerDay: true,
      usdToInrRate: true,
    });

    return AppResponse.success(reply, {
      message: "Withdrawal settings fetched successfully",
      data: {
        minWithdrawInr: settings.minWithdrawInr.toNumber(),
        maxWithdrawInr: settings.maxWithdrawInr.toNumber(),
        minWithdrawUsd: settings.minWithdrawUsd.toNumber(),
        maxWithdrawUsd: settings.maxWithdrawUsd.toNumber(),
        withdrawCharge: settings.withdrawCharge.toNumber(),
        maxWithdrawalsPerDay: settings.maxWithdrawalsPerDay,
        usdToInrRate: settings.usdToInrRate.toNumber(),
      },
    });
  },
});
