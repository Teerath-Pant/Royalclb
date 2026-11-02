import * as v from "valibot";

import { Prisma, recharges_type } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const recharge = createFastifyHandler({
  method: "POST",
  path: "/recharge",
  options: { auth: "user" },
  body: v.object({
    id: v.number(),
    amount: v.pipe(
      v.number(),
      v.transform((val) => new Prisma.Decimal(val))
    ),
    utrNo: v.string(),
    type: v.enum(recharges_type),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();
    const { id, amount, utrNo, type } = body;

    if (utrNo.length < 1) {
      throw AppError.badRequest({
        message: `${type === recharges_type.INR ? "UTR No. " : "TXN Hash "} is required`,
      });
    }

    const { usdToInrRate, minRechargeInr, minRechargeUsd } =
      await getFundSettings(ctx.db, {
        usdToInrRate: true,
        minRechargeInr: true,
        minRechargeUsd: true,
      });

    const minRecharge =
      type === recharges_type.INR ? minRechargeInr : minRechargeUsd;
    const symbol = type === recharges_type.INR ? "₹" : "$";

    if (amount.lt(minRecharge)) {
      throw AppError.badRequest({
        message: `Minimum recharge amount is ${symbol}${minRecharge}`,
      });
    }

    await ctx.db.$transaction(async (tx) => {
      const prevSameUtrCount = await tx.recharges.count({
        where: { utrNo },
      });

      if (prevSameUtrCount > 0) {
        throw AppError.badRequest({
          message: "Someone has already used this UTR number",
        });
      }

      const finalAmount =
        type === recharges_type.INR ? amount : amount.mul(usdToInrRate);

      await tx.recharges.create({
        data: {
          userId: ctx.user.member_id,
          originalAmount: amount,
          amount: finalAmount,
          method: "OFFLINE",
          actuallyPaid: amount,
          utrNo,
          type,
          createdAt: dt.toISOString(),
        },
      });

      if (type === recharges_type.INR) {
        await tx.upiIds.update({
          where: { id },
          data: { views: { increment: 1 } },
        });
      } else {
        await tx.walletAddresses.update({
          where: { id },
          data: { views: { increment: 1 } },
        });
      }
    });

    return AppResponse.success(reply, {
      message: "Recharge request submitted successfully",
    });
  },
});
