import * as v from "valibot";

import { checkSafeWithdrawEligibility } from "@/ops/safe";
import { getSafeSetting } from "@/ops/safe-settings";
import { createWalletEntry } from "@/ops/wallet";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { createAmountSchema } from "@/utils/valibot";

export const withdraw = createFastifyHandler({
  method: "POST",
  path: "/withdrawal",
  options: { auth: "user" },
  body: v.object({
    amount: createAmountSchema("Invalid amount"),
  }),

  async handler({ reply, body, ctx }) {
    requireUser(ctx);
    const dt = Now();

    await ctx.db.$transaction(async (tx) => {
      const safeSettings = await getSafeSetting(tx, {
        minWithdrawAmount: true,
        maxWithdrawAmount: true,
      });

      if (body.amount.lt(safeSettings.minWithdrawAmount)) {
        throw AppError.badRequest({
          message: `Amount must be at least ${safeSettings.minWithdrawAmount.toFixed(2)}`,
        });
      }

      if (body.amount.gt(safeSettings.maxWithdrawAmount)) {
        throw AppError.badRequest({
          message: `Amount must be at most ${safeSettings.maxWithdrawAmount.toFixed(2)}`,
        });
      }

      const user = await tx.meddolic_user_details.findUniqueOrThrow({
        where: { member_id: ctx.user.member_id },
        select: { fundWallet: true, safeWallet: true },
      });

      if (user.safeWallet.lt(body.amount)) {
        throw AppError.badRequest({ message: "Insufficient safe balance" });
      }

      const eligible = await checkSafeWithdrawEligibility(
        tx,
        ctx.user.member_id,
        body.amount
      );

      if (!eligible) {
        throw AppError.badRequest({
          message:
            "You must spend more in the app before withdrawing this amount",
        });
      }

      const entry = await tx.safeTransactions.create({
        data: {
          userId: ctx.user.member_id,
          type: "withdraw",
          amount: body.amount,
          balanceAfter: user.safeWallet.minus(body.amount),
          createdAt: dt.toDate(),
        },
      });

      await createWalletEntry(tx, {
        userId: ctx.user.member_id,
        refId: entry.id,
        amount: body.amount,
        note: "Safe withdrawal",
        type: "DEBIT",
        wallet: "SAFE_WALLET",
        dt,
      });

      await createWalletEntry(tx, {
        userId: ctx.user.member_id,
        refId: entry.id,
        amount: body.amount,
        note: "Safe withdrawal",
        type: "CREDIT",
        wallet: "WALLET",
        dt,
      });
    });

    return AppResponse.success(reply, {
      message: "Amount withdrawn from safe successfully",
    });
  },
});
