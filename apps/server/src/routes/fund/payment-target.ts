import * as v from "valibot";

import { getFundSettings } from "@/ops/fund-settings";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

/** Picks the least-used UPI ID or USDT address for a manual deposit. */
export const paymentTarget = createFastifyHandler({
  method: "GET",
  path: "/payment-target",
  options: { auth: "user" },
  searchParams: v.object({
    type: v.picklist(["INR", "USDT"]),
    amount: v.pipe(v.unknown(), v.toNumber(), v.minValue(0)),
  }),

  async handler({ reply, searchParams, ctx }) {
    const { type, amount } = searchParams;
    const { minRechargeInr, minRechargeUsd } = await getFundSettings(ctx.db, {
      minRechargeInr: true,
      minRechargeUsd: true,
    });

    if (type === "INR" ? amount < minRechargeInr.toNumber() : amount < minRechargeUsd.toNumber()) {
      throw new AppError("BAD_REQUEST", {
        message:
          type === "INR"
            ? `Minimum recharge amount is ₹${minRechargeInr}`
            : `Minimum recharge amount is ${minRechargeUsd} USDT`,
      });
    }

    const where = { status: "ENABLE" } as const;
    const orderBy = { views: "asc" } as const;

    if (type === "INR") {
      const upi = await ctx.db.upiIds.findFirst({ where, orderBy });
      if (!upi) {
        throw new AppError("BAD_REQUEST", { message: "No UPI ID available" });
      }
      return AppResponse.success(reply, {
        message: "Payment target fetched successfully",
        data: { id: upi.id, address: upi.upiId, amount },
      });
    }

    const wallet = await ctx.db.walletAddresses.findFirst({ where, orderBy });
    if (!wallet) {
      throw new AppError("BAD_REQUEST", { message: "No USDT address available" });
    }
    return AppResponse.success(reply, {
      message: "Payment target fetched successfully",
      data: { id: wallet.id, address: wallet.address, amount },
    });
  },
});

export const onlineOrder = createFastifyHandler({
  method: "GET",
  path: "/online-order/:orderId",
  options: { auth: "user" },
  params: v.object({ orderId: v.string() }),

  async handler({ reply, params, ctx }) {
    requireUser(ctx);
    const order = await ctx.db.recharges.findFirst({
      where: {
        orderId: params.orderId,
        method: "ONLINE",
        userId: ctx.user.member_id,
      },
      select: { paymentId: true, payAddress: true, originalAmount: true },
    });
    if (!order) {
      throw new AppError("NOT_FOUND", { message: "No request found." });
    }

    return AppResponse.success(reply, {
      message: "Order fetched successfully",
      data: order,
    });
  },
});
