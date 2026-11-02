import * as v from "valibot";

import { getSafeSetting } from "@/ops/safe-settings";
import { createWalletEntry } from "@/ops/wallet";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { createAmountSchema } from "@/utils/valibot";

export const deposit = createFastifyHandler({
  method: "POST",
  path: "/deposit",
  options: { auth: "user" },
  body: v.object({
    amount: createAmountSchema("Invalid amount"),
  }),

  async handler({ reply, body, ctx }) {
    requireUser(ctx);
    const dt = Now();

    await ctx.db.$transaction(async (tx) => {
      const safeSettings = await getSafeSetting(tx, {
        minDepositAmount: true,
        maxDepositAmount: true,
      });

      if (body.amount.lt(safeSettings.minDepositAmount)) {
        throw AppError.badRequest({
          message: `Amount must be at least ${safeSettings.minDepositAmount.toFixed(2)}`,
        });
      }

      if (body.amount.gt(safeSettings.maxDepositAmount)) {
        throw AppError.badRequest({
          message: `Amount must be at most ${safeSettings.maxDepositAmount.toFixed(2)}`,
        });
      }

      const user = await tx.meddolic_user_details.findUniqueOrThrow({
        where: { member_id: ctx.user.member_id },
        select: { fundWallet: true, safeWallet: true },
      });

      if (user.fundWallet.lt(body.amount)) {
        throw AppError.badRequest({ message: "Insufficient funds" });
      }

      const entry = await tx.safeTransactions.create({
        data: {
          userId: ctx.user.member_id,
          type: "deposit",
          amount: body.amount,
          balanceAfter: user.safeWallet.plus(body.amount),
          createdAt: dt.toDate(),
        },
      });

      await createWalletEntry(tx, {
        userId: ctx.user.member_id,
        refId: entry.id,
        amount: body.amount,
        note: "Safe deposit",
        type: "DEBIT",
        wallet: "FUND_WALLET",
        dt,
      });

      await createWalletEntry(tx, {
        userId: ctx.user.member_id,
        refId: entry.id,
        amount: body.amount,
        note: "Safe deposit",
        type: "CREDIT",
        wallet: "SAFE_WALLET",
        dt,
      });
    });

    return AppResponse.success(reply, {
      message: "Amount deposited to safe successfully",
    });
  },
});
