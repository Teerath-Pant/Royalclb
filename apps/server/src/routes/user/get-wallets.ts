import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const getWallets = createFastifyHandler({
  method: "GET",
  path: "/wallets",
  options: { auth: "user" },

  handler({ reply, ctx }) {
    requireUser(ctx);
    const { bonusWallet, fundWallet, wallet } = ctx.user;
    const totalWallet = bonusWallet.plus(fundWallet).plus(wallet);

    return AppResponse.success(reply, {
      message: "Wallets fetched successfully",
      data: {
        bonusWallet,
        fundWallet,
        wallet,
        totalWallet,
      },
    });
  },
});
