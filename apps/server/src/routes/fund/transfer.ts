import * as v from "valibot";

import { DepositBonus } from "@/incomes/deposit-bonus";
import { getFundSettings } from "@/ops/fund-settings";
import { createWalletEntry } from "@/ops/wallet";
import { getDepositNeedToTrade } from "@/ops/withdraw";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { decimalSchema } from "@/utils/valibot";

export const transfer = createFastifyHandler({
  method: "POST",
  path: "/transfer",
  options: { auth: "user" },
  body: v.object({
    id: v.pipe(v.unknown(), v.toNumber()),
    amount: decimalSchema,
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const { id, amount } = body;
    const { uid, member_id } = ctx.user;
    const dt = Now();

    if (id === uid) {
      throw AppError.badRequest({ message: "You cannot transfer to yourself" });
    }

    if (amount.lte(0)) {
      throw AppError.badRequest({
        message: "Transfer amount must be greater than 0",
      });
    }

    const { minP2P, maxP2P, p2pCharge } = await getFundSettings(ctx.db, {
      minP2P: true,
      maxP2P: true,
      p2pCharge: true,
    });

    if (amount.lt(minP2P)) {
      throw AppError.badRequest({
        message: `Minimum transfer amount is ${minP2P}`,
      });
    }

    if (amount.gt(maxP2P)) {
      throw AppError.badRequest({
        message: `Maximum transfer amount is ${maxP2P}`,
      });
    }

    const user = await ctx.db.meddolic_user_details.findFirst({
      where: {
        uid: id,
      },
    });

    if (!user) {
      throw AppError.notFound({ message: "Invalid user ID" });
    }

    await ctx.db.$transaction(async (tx) => {
      const sender = await tx.meddolic_user_details.findUniqueOrThrow({
        where: { member_id },
        select: { wallet: true },
      });

      if (sender.wallet.lt(amount)) {
        throw AppError.badRequest({
          message: "Insufficient balance in wallet",
        });
      }

      const needToTrade = await getDepositNeedToTrade(tx, member_id);

      if (needToTrade.gt(0)) {
        throw AppError.badRequest({
          message: `You need to bet ${needToTrade.toFixed(2)} more before transferring`,
        });
      }

      const charge = amount.mul(p2pCharge).div(100);
      const netAmount = amount.sub(charge);

      const history = await tx.fundTransfers.create({
        data: {
          senderId: member_id,
          receiverId: user.member_id,
          amount,
          charge,
          netAmount,
          dateTime: dt.toDate(),
        },
      });

      await tx.recharges.create({
        data: {
          userId: user.member_id,
          originalAmount: amount,
          amount: netAmount,
          method: "P2P",
          type: "INR",
          status: "APPROVED",
          remark: `P2P from ${uid}`,
          actuallyPaid: amount,
          createdAt: dt.toISOString(),
          respondedAt: dt.toISOString(),
        },
      });

      await tx.meddolic_user_details.update({
        where: { member_id: user.member_id },
        data: { topup_flag: 1 },
      });

      await DepositBonus.release(tx, {
        userId: user.member_id,
        sponsorId: user.sponser_id,
        depositAmount: netAmount,
        dt,
      });

      await createWalletEntry(tx, {
        userId: member_id,
        refId: history.id,
        amount,
        note: `P2P to ${user.uid}`,
        type: "DEBIT",
        wallet: "WALLET",
        dt,
      });

      await createWalletEntry(tx, {
        userId: user.member_id,
        refId: history.id,
        amount: netAmount,
        note: `P2P from ${uid}`,
        type: "CREDIT",
        wallet: "FUND_WALLET",
        dt,
      });
    });

    return AppResponse.success(reply, {
      message: "Fund transferred successfully",
    });
  },
});
