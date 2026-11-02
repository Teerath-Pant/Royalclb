import * as v from "valibot";

import { aviatorBet_side } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const hasBet = createFastifyHandler({
  method: "GET",
  path: "/:gameId/bet",
  options: { auth: "user" },
  params: v.object({
    gameId: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ params, reply, ctx }) {
    requireUser(ctx);
    const bets = await ctx.db.aviatorBet.groupBy({
      by: ["side"],
      where: {
        gameId: params.gameId,
        userId: ctx.user.member_id,
      },
      _sum: { betAmount: true },
    });

    const result: Record<aviatorBet_side, number | null> = {
      [aviatorBet_side.LEFT]: null,
      [aviatorBet_side.RIGHT]: null,
    };

    for (const bet of bets) {
      const amount = Number(bet._sum.betAmount ?? 0);

      if (amount) {
        result[bet.side] = amount;
      }
    }

    return AppResponse.success(reply, {
      message: "Bet fetched successfully.",
      data: result,
    });
  },
});
