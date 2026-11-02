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

    const game = await ctx.db.updown_games.findUnique({
      where: {
        id,
        status: "COMPLETED",
      },
      select: {
        winning_dice1: true,
        winning_dice2: true,
      },
    });

    if (!game) {
      throw AppError.notFound({ message: "Invalid Game Id" });
    }

    const winningDice1 = game.winning_dice1 ?? 0;
    const winningDice2 = game.winning_dice2 ?? 0;

    const response = {
      winningDice1,
      winningDice2,
    };

    const sum = await ctx.db.updown_bets.aggregate({
      _sum: {
        bet_amount: true,
        net_win_amount: true,
      },
      where: {
        game_id: id,
        user_id: member_id,
      },
    });

    const totalBetAmount = safeDecimal(sum._sum.bet_amount);
    const totalWinAmount = safeDecimal(sum._sum.net_win_amount);

    if (totalBetAmount.eq(0)) {
      return AppResponse.success(reply, {
        message: "Total Result Fetched Successfully",
        data: {
          ...response,
          status: "no-bet",
        },
      });
    }

    if (totalWinAmount.eq(0)) {
      return AppResponse.success(reply, {
        message: "Total Result Fetched Successfully",
        data: {
          ...response,
          status: "lose",
          netAmount: totalBetAmount,
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
