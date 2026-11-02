import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const getResult = createFastifyHandler({
  method: "GET",
  path: "/get-result/:id",
  options: { auth: "user" },
  params: v.object({
    id: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ params, reply, ctx }) {
    requireUser(ctx);
    const { id } = params;
    const { member_id } = ctx.user;

    const game = await ctx.db.winGo.findUnique({
      where: {
        id,
        status: "COMPLETED",
      },
      select: {
        winNumber: true,
        period: true,
      },
    });

    if (!game) {
      throw AppError.notFound({ message: "Invalid Game Id" });
    }

    if (game.winNumber === null) {
      throw AppError.notFound({ message: "Game is not yet completed." });
    }

    const response = {
      period: game.period,
      winNumber: game.winNumber,
    };

    const sum = await ctx.db.winGoBets.aggregate({
      _sum: {
        betAmount: true,
        netWinAmount: true,
      },
      where: {
        gameId: id,
        userId: member_id,
      },
    });

    const totalBetAmount = safeDecimal(sum._sum.betAmount);
    const totalWinAmount = safeDecimal(sum._sum.netWinAmount);

    if (totalBetAmount.eq(0)) {
      return AppResponse.success(reply, {
        message: "Total Result Fetched Successfully",
        data: {
          ...response,
          status: "no-bet",
        },
      });
    }

    const finalAmount = totalWinAmount.minus(totalBetAmount);

    if (finalAmount.lessThan(0)) {
      return AppResponse.success(reply, {
        message: "Total Result Fetched Successfully",
        data: {
          ...response,
          status: "lose",
          netAmount: finalAmount,
        },
      });
    }

    return AppResponse.success(reply, {
      message: "Total Result Fetched Successfully",
      data: {
        ...response,
        status: "win",
        netAmount: totalWinAmount,
      },
    });
  },
});
