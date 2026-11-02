import * as v from "valibot";

import { chickenRoadBet_status } from "@/lib/prisma";
import { provablyFairRandom } from "@/lib/rng";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

import { CRASH_TABLE, MAX_WIN, MULTIPLIERS } from "./config";

export const playStep = createFastifyHandler({
  method: "POST",
  path: "/:betId/play-step",
  options: { auth: "user" },
  params: v.object({
    betId: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ params, reply, ctx }) {
    requireUser(ctx);
    const result = await ctx.db.$transaction(async (tx) => {
      const bet = await tx.chickenRoadBet.findUnique({
        where: { id: params.betId, userId: ctx.user.member_id },
        select: {
          id: true,
          status: true,
          stepsReached: true,
          difficulty: true,
          serverSeed: true,
          clientSeed: true,
          nonce: true,
          version: true,
          betAmount: true,
        },
      });

      if (!bet) {
        throw AppError.notFound({ message: "Bet not found" });
      }
      if (bet.status !== chickenRoadBet_status.PENDING) {
        throw AppError.badRequest({ message: "Bet is not active" });
      }

      const nextStep = bet.stepsReached + 1;
      const { difficulty } = bet;

      const multipliers = MULTIPLIERS[difficulty];
      const maxSteps = multipliers.length;

      if (nextStep > maxSteps) {
        throw AppError.badRequest({ message: "Max steps reached" });
      }

      const multiplier = multipliers[nextStep - 1] ?? 1;

      /* 🔐 PROVABLY FAIR RNG */
      const rand = provablyFairRandom(
        bet.serverSeed,
        bet.clientSeed,
        bet.nonce
      );

      /* 🎯 EXACT RTP CRASH */
      const crashChance = CRASH_TABLE[difficulty][nextStep - 1] ?? 0;

      let shouldCrash = rand < crashChance;

      const potentialWin = bet.betAmount.mul(multiplier);

      if (potentialWin.gt(MAX_WIN)) {
        shouldCrash = true;
      }

      /* 🔒 ATOMIC UPDATE */
      const updateResult = await tx.chickenRoadBet.updateMany({
        where: {
          id: bet.id,
          status: chickenRoadBet_status.PENDING,
          stepsReached: bet.stepsReached,
          version: bet.version,
        },
        data: {
          stepsReached: nextStep,
          nonce: { increment: 1 },
          version: { increment: 1 },

          ...(shouldCrash
            ? {
                status: chickenRoadBet_status.FAILED,
                finalMultiplier: safeDecimal(0),
                cashoutMultiplier: safeDecimal(0),
              }
            : {
                cashoutMultiplier: safeDecimal(multiplier),
              }),
        },
      });

      if (updateResult.count === 0) {
        throw AppError.conflict({ message: "State changed, retry" });
      }

      if (shouldCrash) {
        return { crash: true, step: nextStep };
      }

      return {
        crash: false,
        step: nextStep,
        multiplier,
      };
    });

    return AppResponse.success(reply, {
      message: result.crash ? "Crash" : "Safe",
      data: result,
    });
  },
});
