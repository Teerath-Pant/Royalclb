import { chickenRoadBet_status } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const getActiveBet = createFastifyHandler({
  method: "GET",
  path: "/active-bet",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const activeBet = await ctx.db.chickenRoadBet.findFirst({
      where: {
        userId: ctx.user.member_id,
        status: chickenRoadBet_status.PENDING,
      },
      select: {
        id: true,
        betAmount: true,
        difficulty: true,
        cashoutMultiplier: true,
        stepsReached: true,
      },
    });

    return AppResponse.success(reply, {
      message: "Active bet fetched successfully",
      data: activeBet,
    });
  },
});
