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

    const totalBets = await ctx.db.dragonTigerBet.groupBy({
      by: ["betType"],
      _sum: {
        betAmount: true,
      },
      where: {
        gameId,
        userId: member_id,
      },
    });

    const dragonBet = safeDecimal(
      totalBets.find(({ betType }) => betType === "DRAGON")?._sum.betAmount
    );
    const tigerBet = safeDecimal(
      totalBets.find(({ betType }) => betType === "TIGER")?._sum.betAmount
    );
    const tieBet = safeDecimal(
      totalBets.find(({ betType }) => betType === "TIE")?._sum.betAmount
    );

    return AppResponse.success(reply, {
      message: "Total Bets Fetched Successfully",
      data: {
        dragonBet,
        tigerBet,
        tieBet,
      },
    });
  },
});
