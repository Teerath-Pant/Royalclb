import * as v from "valibot";

import {
  withdrawalRequests_currency,
  withdrawalRequests_type,
} from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { createWalletEntry } from "@/ops/wallet";
import { getDepositNeedToTrade } from "@/ops/withdraw";
import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { decimalSchema } from "@/utils/valibot";

export const create = createFastifyHandler({
  method: "POST",
  path: "/",
  options: { auth: "user" },
  body: v.object({
    amount: decimalSchema,
    type: v.enum(withdrawalRequests_type),
    currency: v.enum(withdrawalRequests_currency),
    otp: v.optional(v.pipe(v.string(), v.length(6))),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();
    const todayStart = dt.startOf("day");
    const todayEnd = dt.endOf("day");
    const { amount, type, currency } = body;

    if (ctx.user.twoFactorEnabled) {
      if (!body.otp) {
        throw AppError.badRequest({
          message: "OTP is required to place a withdrawal request",
        });
      }

      await OtpService.verifyOtp("withdrawal", ctx.user.email_id, body.otp);
    }

    const fundSettings = await getFundSettings(ctx.db, {
      minWithdrawInr: true,
      maxWithdrawInr: true,
      minWithdrawUsd: true,
      maxWithdrawUsd: true,
      withdrawCharge: true,
      maxWithdrawalsPerDay: true,
      usdToInrRate: true,
    });

    const symbol = currency === "INR" ? "₹" : "$";
    const minWithdraw =
      currency === "INR"
        ? fundSettings.minWithdrawInr
        : fundSettings.minWithdrawUsd;
    const maxWithdraw =
      currency === "INR"
        ? fundSettings.maxWithdrawInr
        : fundSettings.maxWithdrawUsd;

    if (amount.lt(minWithdraw)) {
      throw AppError.badRequest({
        message: `Minimum withdrawal amount is ${symbol}${minWithdraw}`,
      });
    }

    if (amount.gt(maxWithdraw)) {
      throw AppError.badRequest({
        message: `Maximum withdrawal amount is ${symbol}${maxWithdraw}`,
      });
    }

    const finalAmount =
      currency === "INR" ? amount : amount.mul(fundSettings.usdToInrRate);
    const charge = finalAmount.mul(fundSettings.withdrawCharge).div(100);
    const netAmount = finalAmount.sub(charge);

    await ctx.db.$transaction(async (tx) => {
      const method = await tx.withdrawalMethods.findUnique({
        where: {
          userId_type: { userId: ctx.user.member_id, type },
        },
        select: { id: true, details: true },
      });

      if (!method) {
        throw AppError.badRequest({
          message: `No ${type} withdrawal method found. Please add one first.`,
        });
      }

      const todayCount = await tx.withdrawalRequests.count({
        where: {
          userId: ctx.user.member_id,
          requestedAt: { gte: todayStart.toDate(), lte: todayEnd.toDate() },
          status: { in: ["PENDING", "APPROVED"] },
        },
      });

      if (todayCount >= fundSettings.maxWithdrawalsPerDay) {
        throw AppError.badRequest({
          message: `You've reached the maximum of ${fundSettings.maxWithdrawalsPerDay} withdrawals per day`,
        });
      }

      const user = await tx.meddolic_user_details.findUniqueOrThrow({
        where: { member_id: ctx.user.member_id },
        select: { wallet: true },
      });

      if (user.wallet.lt(finalAmount)) {
        throw AppError.badRequest({ message: "Insufficient wallet balance" });
      }

      const needToTrade = await getDepositNeedToTrade(tx, ctx.user.member_id);

      if (needToTrade.gt(0)) {
        throw AppError.badRequest({
          message: `You need to bet ${symbol}${needToTrade.toFixed(2)} more before withdrawing`,
        });
      }

      const request = await tx.withdrawalRequests.create({
        data: {
          userId: ctx.user.member_id,
          methodId: method.id,
          type,
          currency,
          originalAmount: amount,
          amount: finalAmount,
          charge,
          netAmount,
          destinationSnapshot: method.details,
          status: "PENDING",
          requestedAt: dt.toDate(),
          updatedAt: dt.toDate(),
        },
      });

      await createWalletEntry(tx, {
        userId: ctx.user.member_id,
        refId: request.id,
        amount: finalAmount,
        note: `Withdrawal request (${type})`,
        type: "DEBIT",
        wallet: "WALLET",
        dt,
      });
    });

    return AppResponse.success(reply, {
      message: "Withdrawal request submitted successfully",
    });
  },
});
