import * as v from "valibot";

import { chickenRoadBet_status } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const cashout = createFastifyHandler({
  method: "POST",
  path: "/:betId/cashout",
  options: { auth: "user" },
  params: v.object({
    betId: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ params, reply, ctx }) {
    requireUser(ctx);
    const result = await ctx.db.$transaction(async (tx) => {
      const dt = Now();

      const bet = await tx.chickenRoadBet.findUnique({
        where: { id: params.betId, userId: ctx.user.member_id },
        select: {
          id: true,
          userId: true,
          status: true,
          betAmount: true,
          cashoutMultiplier: true,
          stepsReached: true,
          version: true,
        },
      });

      if (!bet) {
        throw AppError.notFound({ message: "Bet not found" });
      }

      if (bet.status !== chickenRoadBet_status.PENDING) {
        throw AppError.badRequest({ message: "Bet is not active" });
      }

      if (!bet.cashoutMultiplier || bet.cashoutMultiplier.lte(1)) {
        throw AppError.badRequest({ message: "Nothing to cashout yet" });
      }

      const { platformCharge } = await getFundSettings(tx, {
        platformCharge: true,
      });

      const winAmount = bet.betAmount.mul(bet.cashoutMultiplier);
      const tax = winAmount.mul(platformCharge).div(100);
      const netAmount = winAmount.minus(tax);

      const update = await tx.chickenRoadBet.updateMany({
        where: {
          id: bet.id,
          status: chickenRoadBet_status.PENDING,
          stepsReached: bet.stepsReached,
          version: bet.version,
        },
        data: {
          status: chickenRoadBet_status.SUCCESS,
          finalMultiplier: bet.cashoutMultiplier,
          winAmount,
          tax,
          netAmount,
          cashedOutAt: dt.toISOString(),
          version: { increment: 1 },
        },
      });

      if (update.count === 0) {
        throw AppError.conflict({ message: "State changed, retry" });
      }

      await walletService.entry2({
        user_id: ctx.user.member_id,
        txn_id: bet.id,
        amount: netAmount,
        note: "Cashout (Chicken Road)",
        type: "CREDIT",
        dt,
        wallet_type: "WALLET",
      });

      return {
        winAmount,
        netAmount,
        multiplier: bet.cashoutMultiplier,
      };
    });

    return AppResponse.success(reply, {
      message: "Cashed out successfully",
      data: result,
    });
  },
});
