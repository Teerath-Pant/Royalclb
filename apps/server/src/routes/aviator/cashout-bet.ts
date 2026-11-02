import * as v from "valibot";

import { getAviatorRedisKey } from "@/games/aviator/index";
import {
  aviator_status,
  aviatorBet_side,
  aviatorBet_status,
} from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { decrementAviatorBucketAmount } from "@/ops/aviator";
import { getFundSettings } from "@/ops/fund-settings";
import { createWalletEntry } from "@/ops/wallet";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const cashoutBet = createFastifyHandler({
  method: "POST",
  path: "/cashout",
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
        select: {
          id: true,
          betAmount: true,
          status: true,
          aviator: { select: { status: true } },
        },
      });

      if (!bet) {
        throw AppError.notFound({ message: "You have not placed a bet" });
      }

      if (bet.aviator.status !== aviator_status.FLYING) {
        throw AppError.badRequest({ message: "Game is not flying" });
      }

      if (bet.status !== aviatorBet_status.PENDING) {
        throw AppError.badRequest({ message: "Bet is already cashed out" });
      }

      const multiplier = await redis.get(getAviatorRedisKey(body.gameId));

      if (!multiplier) {
        throw AppError.badRequest({ message: "Game is not flying" });
      }

      const { platformCharge } = await getFundSettings(tx, {
        platformCharge: true,
      });

      const cashoutAmount = bet.betAmount.mul(multiplier);
      const tax = cashoutAmount.mul(platformCharge).div(100);
      const netAmount = cashoutAmount.sub(tax);

      const result = await tx.aviatorBet.updateMany({
        where: { id: bet.id, status: aviatorBet_status.PENDING },
        data: {
          cashoutMultiplier: safeDecimal(multiplier),
          winAmount: cashoutAmount,
          tax,
          netAmount,
          status: aviatorBet_status.CASHED_OUT,
          resultAt: new Date(),
        },
      });

      if (result.count === 0) {
        throw AppError.conflict({
          message: "Bet already cashed out or cancelled",
        });
      }

      await createWalletEntry(tx, {
        userId: ctx.user.member_id,
        refId: bet.id,
        amount: netAmount,
        note: "Aviator bet cashed out",
        type: "CREDIT",
        wallet: "WALLET",
        dt,
      });

      await decrementAviatorBucketAmount(tx, cashoutAmount);
    });

    return AppResponse.success(reply, {
      message: "Bet cashed out successfully",
    });
  },
});
