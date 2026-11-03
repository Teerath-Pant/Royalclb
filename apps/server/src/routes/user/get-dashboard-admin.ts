import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

const members = { user_type: 2 };

export const adminDashboard = createFastifyHandler({
  method: "GET",
  path: "/admin/dashboard",
  options: { auth: "admin" },

  async handler({ reply, ctx }) {
    const { meddolic_user_details: users, recharges, withdrawalRequests } = ctx.db;

    const [totalUser, activeMember, inActiveMember, wallets, fund, pending, approved] =
      await Promise.all([
        users.count({ where: members }),
        users.count({ where: { ...members, topup_flag: 1 } }),
        users.count({ where: { ...members, topup_flag: 0 } }),
        users.aggregate({ where: members, _sum: { wallet: true, fundWallet: true } }),
        recharges.aggregate({
          where: { status: "PENDING", method: "OFFLINE" },
          _sum: { amount: true },
        }),
        withdrawalRequests.aggregate({
          where: { status: "PENDING" },
          _sum: { amount: true },
        }),
        withdrawalRequests.aggregate({
          where: { status: "APPROVED" },
          _sum: { amount: true },
        }),
      ]);

    return AppResponse.success(reply, {
      data: {
        totalUser,
        activeMember,
        inActiveMember,
        workingWallet: wallets._sum.wallet?.toFixed(2) ?? null,
        fundWallet: wallets._sum.fundWallet?.toFixed(2) ?? null,
        totalActiveIncome: activeMember,
        fundRequest: fund._sum.amount?.toFixed(2) ?? null,
        totalPendingWithdraw: pending._sum.amount?.toFixed(2) ?? null,
        totalWithdraw: approved._sum.amount?.toFixed(2) ?? null,
      },
    });
  },
});
