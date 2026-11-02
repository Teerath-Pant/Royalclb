import * as v from "valibot";

import { DepositBonus } from "@/incomes/deposit-bonus";
import { UsdDepositBonus } from "@/incomes/usd-deposit-bonus";
import { recharges_status } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { safeDecimal } from "@/utils/safe-decimal";

export const faradpayCallback = createFastifyHandler({
  method: "POST",
  path: "/faradpay-callback",
  body: v.object({
    payment_status: v.string(),
    order_id: v.string(),
    actually_paid: v.pipe(
      v.number(),
      v.transform((val) => safeDecimal(val))
    ),
  }),

  async handler({ body, reply, ctx }) {
    const entry = await ctx.db.recharges.findFirst({
      where: {
        orderId: body.order_id,
        status: recharges_status.PENDING,
      },
    });

    if (!entry) {
      throw AppError.notFound({ message: "Deposit not found" });
    }

    const user = await ctx.db.meddolic_user_details.findUnique({
      where: { member_id: entry.userId },
      select: { member_id: true, sponser_id: true },
    });

    if (!user) {
      throw AppError.notFound({ message: "User not found" });
    }

    const { usdToInrRate } = await getFundSettings(ctx.db, {
      usdToInrRate: true,
    });

    const isFinished = ["partial", "finished"].includes(body.payment_status);

    const finalAmount = body.actually_paid.mul(usdToInrRate);

    const dt = Now();

    await ctx.db.$transaction(async (tx) => {
      const updateResult = await tx.recharges.updateMany({
        where: { id: entry.id, status: recharges_status.PENDING },
        data: {
          gatewayStatus: body.payment_status,
          amount: finalAmount,
          actuallyPaid: body.actually_paid,
          status: isFinished
            ? recharges_status.APPROVED
            : recharges_status.REJECTED,
        },
      });

      if (updateResult.count === 0) {
        throw AppError.conflict({ message: "Deposit already processed" });
      }

      if (isFinished) {
        await tx.meddolic_user_details.updateMany({
          where: { member_id: entry.userId },
          data: { topup_flag: 1 },
        });

        await walletService.entry2({
          user_id: entry.userId,
          txn_id: entry.id,
          amount: finalAmount,
          note: "Fund Recharge (Online)",
          type: "CREDIT",
          wallet_type: "FUND_WALLET",
          dt,
          tx,
        });

        await DepositBonus.release(tx, {
          userId: user.member_id,
          sponsorId: user.sponser_id,
          depositAmount: finalAmount,
          dt,
        });

        await UsdDepositBonus.release(tx, {
          userId: user.member_id,
          usdtDepositAmount: body.actually_paid,
          dt,
        });
      }
    });

    return AppResponse.success(reply, {
      message: "Success",
    });
  },
});
