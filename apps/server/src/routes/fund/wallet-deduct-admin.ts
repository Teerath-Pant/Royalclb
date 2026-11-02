import * as v from "valibot";

import { createWalletEntry } from "@/ops/wallet";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { decimalSchema } from "@/utils/valibot";

const WALLET_FIELD = {
  WALLET: "wallet",
  FUND_WALLET: "fundWallet",
  BONUS_WALLET: "bonusWallet",
} as const;

export const walletDeductAdmin = createFastifyHandler({
  method: "POST",
  path: "/wallet-deduct-admin",
  options: { auth: "admin" },
  body: v.object({
    userId: v.pipe(v.string(), v.minLength(1)),
    wallet: v.picklist(["WALLET", "FUND_WALLET", "BONUS_WALLET"]),
    amount: decimalSchema,
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const { userId, wallet, amount } = body;
    const { member_id: adminMemberId } = ctx.user;
    const dt = Now();

    if (amount.lte(0)) {
      throw AppError.badRequest({
        message: "Amount must be greater than 0",
      });
    }

    await ctx.db.$transaction(async (tx) => {
      const user = await tx.meddolic_user_details.findFirst({
        where: { user_id: userId, user_type: 2, account_status: 1 },
      });

      if (!user) {
        throw AppError.notFound({ message: "Invalid or suspended user" });
      }

      const walletField = WALLET_FIELD[wallet];
      const currentBalance = user[walletField];

      if (currentBalance.lt(amount)) {
        throw AppError.badRequest({
          message: `Insufficient balance in ${walletField}`,
        });
      }

      await createWalletEntry(tx, {
        userId: user.member_id,
        refId: adminMemberId,
        amount,
        note: `Manual deduction by admin (${adminMemberId})`,
        type: "DEBIT",
        wallet,
        dt,
      });
    });

    return AppResponse.success(reply, {
      message: "Amount deducted successfully",
    });
  },
});
