import * as v from "valibot";

import { DepositBonus } from "@/incomes/deposit-bonus";
import { getFundSettings } from "@/ops/fund-settings";
import { createWalletEntry } from "@/ops/wallet";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { decimalSchema } from "@/utils/valibot";

export const transferAdmin = createFastifyHandler({
  method: "POST",
  path: "/transfer-admin",
  options: { auth: "admin" },
  body: v.object({
    userId: v.pipe(v.string(), v.minLength(1)),
    amount: decimalSchema,
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const { userId, amount } = body;
    const { member_id: adminMemberId } = ctx.user;
    const dt = Now();

    if (amount.lte(0)) {
      throw AppError.badRequest({
        message: "Transfer amount must be greater than 0",
      });
    }

    const { p2pCharge } = await getFundSettings(ctx.db, { p2pCharge: true });

    const user = await ctx.db.meddolic_user_details.findFirst({
      where: { user_id: userId, user_type: 2, account_status: 1 },
    });

    if (!user) {
      throw AppError.notFound({ message: "Invalid or suspended user" });
    }

    if (user.member_id === adminMemberId) {
      throw AppError.badRequest({
        message: "You cannot transfer to yourself",
      });
    }

    await ctx.db.$transaction(async (tx) => {
      const charge = amount.mul(p2pCharge).div(100);
      const netAmount = amount.sub(charge);

      const history = await tx.fundTransfers.create({
        data: {
          senderId: adminMemberId,
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
          remark: `Admin fund transfer from ${adminMemberId}`,
          actuallyPaid: amount,
          createdAt: dt.toISOString(),
          respondedAt: dt.toISOString(),
        },
      });

      await tx.meddolic_user_details.updateMany({
        where: { member_id: user.member_id, topup_flag: 0 },
        data: { topup_flag: 1 },
      });

      await DepositBonus.release(tx, {
        userId: user.member_id,
        sponsorId: user.sponser_id,
        depositAmount: netAmount,
        dt,
      });

      await createWalletEntry(tx, {
        userId: user.member_id,
        refId: history.id,
        amount: netAmount,
        note: `Admin fund transfer from ${adminMemberId}`,
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
