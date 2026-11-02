import * as v from "valibot";

import { env } from "@/env";
import { faradpayClient, faradpayClientTrx } from "@/lib/faradpay";
import { Prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { generateOrderId } from "@/utils/generate-order-id";
import { requireUser } from "@/utils/require-user";

export const rechargeOnline = createFastifyHandler({
  method: "POST",
  path: "/recharge-online",
  options: { auth: "user" },
  body: v.object({
    amount: v.pipe(
      v.number(),
      v.transform((val) => new Prisma.Decimal(val))
    ),
    currency: v.picklist(["USDTBSC", "USDTTRX"]),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();
    const { amount, currency } = body;

    const { usdToInrRate, minRechargeUsd } = await getFundSettings(ctx.db, {
      usdToInrRate: true,
      minRechargeUsd: true,
    });

    if (amount.lt(minRechargeUsd)) {
      throw AppError.badRequest({
        message: `Minimum recharge amount is $${minRechargeUsd}`,
      });
    }

    const orderId = generateOrderId();

    const client = currency === "USDTBSC" ? faradpayClient : faradpayClientTrx;

    const data = await client.createPayment({
      amount,
      currencySymbol: currency,
      orderId,
      orderDescription: `${currency} Deposit (Online)`,
      ipnCallbackUrl: `${env.APP_URL}/api/fund/faradpay-callback`,
    });

    const createdRecharge = await ctx.db.$transaction(async (tx) => {
      const finalAmount = amount.mul(usdToInrRate);

      return await tx.recharges.create({
        data: {
          userId: ctx.user.member_id,
          originalAmount: amount,
          amount: finalAmount,
          method: "ONLINE",
          type: "USDT",
          createdAt: dt.toISOString(),
          paymentId: data.paymentId,
          payAddress: data.payAddress,
          orderId: data.orderId,
          gatewayStatus: data.paymentStatus,
          metadata: JSON.stringify({
            currency,
          }),
        },
      });
    });

    return AppResponse.success(reply, {
      message: "Recharge request created successfully",
      data: {
        id: createdRecharge.id,
        amount: createdRecharge.amount.toNumber(),
        paymentId: createdRecharge.paymentId,
        payAddress: createdRecharge.payAddress,
        orderId: createdRecharge.orderId,
      },
    });
  },
});
