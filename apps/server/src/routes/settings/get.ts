import { getFundSettings } from "@/ops/fund-settings";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const get = createFastifyHandler({
  method: "GET",
  path: "/",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    const { usdToInrRate, minRechargeInr, minRechargeUsd } =
      await getFundSettings(ctx.db, {
        usdToInrRate: true,
        minRechargeInr: true,
        minRechargeUsd: true,
      });

    return AppResponse.success(reply, {
      message: "Settings fetched successfully.",
      data: {
        minRechargeInr: minRechargeInr.toNumber(),
        minRechargeUsdt: minRechargeUsd.toNumber(),
        usdPrice: usdToInrRate.toNumber(),
      },
    });
  },
});
