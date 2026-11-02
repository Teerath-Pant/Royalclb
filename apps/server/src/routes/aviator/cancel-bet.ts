import * as v from "valibot";

import { aviatorBet_side, aviatorBet_status } from "@/lib/prisma";
import { decrementAviatorBucketAmount } from "@/ops/aviator";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const cancelBet = createFastifyHandler({
  method: "POST",
  path: "/cancel",
  options: { auth: "user" },
  body: v.object({
    gameId: v.number(),
    side: v.enum(aviatorBet_side),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();

    await ctx.db.$transaction(async (tx) => {
      const bet = await tx.aviatorBet.findFirst({
        where: {
          userId: ctx.user.member_id,
          gameId: body.gameId,
          side: body.side,
        },
        select: { id: true, betAmount: true },
      });

      if (!bet) {
        throw AppError.notFound({ message: "You haven't placed any bet" });
      }

      const result = await tx.aviatorBet.deleteMany({
        where: { id: bet.id, status: aviatorBet_status.PENDING },
      });

      if (result.count === 0) {
        throw AppError.badRequest({
          message: "Bet cannot be cancelled (already cashed out or deleted)",
        });
      }

      await walletService.entry2({
        tx,
        user_id: ctx.user.member_id,
        txn_id: bet.id,
        amount: bet.betAmount,
        note: "Aviator bet cancelled",
        type: "CREDIT",
        wallet_type: "FUND_WALLET",
        dt,
      });

      await decrementAviatorBucketAmount(tx, bet.betAmount);
    });

    return AppResponse.success(reply, {
      message: "Bet cancelled successfully",
    });
  },
});
