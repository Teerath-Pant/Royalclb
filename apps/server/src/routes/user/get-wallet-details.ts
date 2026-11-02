import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const getWalletDetails = createFastifyHandler({
  method: "GET",
  path: "/wallet-details",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const { bonusWallet, fundWallet, wallet, member_id } = ctx.user;
    const totalWallet = bonusWallet.plus(fundWallet).plus(wallet);

    const [totalDepositAgg, totalWithdrawalAgg] = await Promise.all([
      ctx.db.recharges.aggregate({
        _sum: { amount: true },
        where: { userId: member_id, status: "APPROVED" },
      }),
      ctx.db.withdrawalRequests.aggregate({
        _sum: { netAmount: true },
        where: { userId: member_id, status: "APPROVED" },
      }),
    ]);

    const totalDeposit = safeDecimal(totalDepositAgg._sum.amount);
    const totalWithdrawal = safeDecimal(totalWithdrawalAgg._sum.netAmount);

    return AppResponse.success(reply, {
      message: "Wallet details fetched successfully",
      data: {
        bonusWallet,
        fundWallet,
        wallet,
        totalWallet,
        totalDeposit,
        totalWithdrawal,
      },
    });
  },
});
