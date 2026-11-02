import * as v from "valibot";

import { Prisma } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const postSpin = createFastifyHandler({
  method: "POST",
  path: "/",
  options: { auth: "user" },
  body: v.object({
    wonAmount: v.pipe(
      v.unknown(),
      v.toNumber(),
      v.transform((val) => new Prisma.Decimal(val))
    ),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;
    const { wonAmount } = body;
    const dt = Now();

    const spin = await ctx.db.meddolic_user_spin_history.create({
      data: {
        member_id,
        winning_amount: wonAmount,
        date_time: dt.toISOString(),
        next_date_time: dt.add(1, "minute").toISOString(),
        status: 1,
      },
      select: {
        id: true,
      },
    });

    const txnId = spin.id;

    await ctx.db.meddolic_user_details.update({
      data: {
        bonusWallet: {
          increment: wonAmount,
        },
      },
      where: {
        member_id,
      },
    });

    walletService.entry({
      amount: wonAmount,
      dateTime: dt,
      statementId: 25,
      txnId,
      userId: member_id,
      walletType: "bonusWallet",
      type: "credit",
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Spin recorded successfully",
    });
  },
});
