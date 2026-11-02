import * as v from "valibot";

import type { OPTIONS } from "@/games/andar-bahar/handle-random";
import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const getTotalBet = createFastifyHandler({
  method: "GET",
  path: "/:id/total-bet",
  options: { auth: "user" },
  params: v.object({
    id: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ params, reply, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;
    const { id } = params;

    const totalBets = await ctx.db.andarBaharBets.groupBy({
      by: ["betOn"],
      _sum: {
        betAmount: true,
      },
      where: {
        gameId: id,
        userId: member_id,
      },
    });

    const totalBetsMap = {} as Record<(typeof OPTIONS)[number], Prisma.Decimal>;

    for (const { betOn, _sum } of totalBets) {
      totalBetsMap[betOn as (typeof OPTIONS)[number]] = safeDecimal(
        _sum.betAmount
      );
    }

    return AppResponse.success(reply, {
      message: "Total Bets Fetched Successfully",
      data: totalBetsMap,
    });
  },
});
