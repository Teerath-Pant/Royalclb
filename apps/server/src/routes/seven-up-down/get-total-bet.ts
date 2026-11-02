import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const getTotalBet = createFastifyHandler({
  method: "GET",
  path: "/total-bet",
  options: { auth: "user" },
  searchParams: v.object({
    gameId: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ searchParams, reply, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;
    const { gameId } = searchParams;

    const totalBets = await ctx.db.updown_bets.groupBy({
      by: ["bet_on"],
      _sum: {
        bet_amount: true,
      },
      where: {
        game_id: gameId,
        user_id: member_id,
      },
    });

    const l7Bet = safeDecimal(
      totalBets.find(({ bet_on }) => bet_on === "L7")?._sum.bet_amount
    );
    const e7Bet = safeDecimal(
      totalBets.find(({ bet_on }) => bet_on === "E7")?._sum.bet_amount
    );
    const g7Bet = safeDecimal(
      totalBets.find(({ bet_on }) => bet_on === "G7")?._sum.bet_amount
    );

    return AppResponse.success(reply, {
      message: "Total Bets Fetched Successfully",
      data: {
        l7Bet,
        e7Bet,
        g7Bet,
      },
    });
  },
});
