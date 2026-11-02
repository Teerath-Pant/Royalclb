import * as v from "valibot";

import { DepositBonus } from "@/incomes/deposit-bonus";
import { UsdDepositBonus } from "@/incomes/usd-deposit-bonus";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";

export const rechargeResponseAdmin = createFastifyHandler({
  method: "POST",
  path: "/recharge-admin",
  options: { auth: "admin" },
  body: v.object({
    id: v.pipe(v.unknown(), v.toNumber()),
    remark: v.pipe(v.string(), v.minLength(1)),
    response: v.picklist(["APPROVED", "REJECTED"]),
  }),

  async handler({ body, ctx, reply }) {
    const { id, response, remark } = body;
    const dt = Now();

    const recharge = await ctx.db.recharges.findUnique({
      where: { id },
    });

    if (!recharge) {
      throw AppError.notFound({ message: "Recharge request not found" });
    }

    await ctx.db.$transaction(async (tx) => {
      await tx.recharges.update({
        where: {
          id,
        },
        data: {
          status: response,
          remark,
          respondedAt: dt.toISOString(),
        },
      });

      if (response === "APPROVED") {
        const user = await tx.meddolic_user_details.update({
          where: { member_id: recharge.userId },
          data: { topup_flag: 1 },
        });

        await walletService.entry2({
          user_id: recharge.userId,
          txn_id: recharge.id,
          amount: recharge.amount,
          note: "Fund Recharge",
          type: "CREDIT",
          wallet_type: "FUND_WALLET",
          dt,
          tx,
        });

        await DepositBonus.release(tx, {
          userId: user.member_id,
          sponsorId: user.sponser_id,
          depositAmount: recharge.amount,
          dt,
        });

        if (recharge.type === "USDT") {
          await UsdDepositBonus.release(tx, {
            userId: user.member_id,
            usdtDepositAmount: recharge.originalAmount,
            dt,
          });
        }
      }
    });

    return AppResponse.success(reply, {
      message: "Fund recharge response updated successfully",
    });
  },
});
