import * as v from "valibot";

import { gameSettingsService } from "@/services/game-settings.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const makeWinner = createFastifyHandler({
  method: "POST",
  path: "/make-winner",
  options: { auth: "admin" },
  body: v.object({
    gameId: v.pipe(v.unknown(), v.toNumber()),
    id: v.pipe(v.unknown(), v.toNumber()),
    amount: v.pipe(v.unknown(), v.toNumber()),
    interval: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ body, reply, ctx }) {
    const { id, amount, interval, gameId } = body;

    const game = await ctx.db.lottery_spin_summary.findUnique({
      where: {
        id: gameId,
      },
      select: {
        status: true,
      },
    });

    if (!game || game.status === 0) {
      throw AppError.notFound({ message: "Game is already completed." });
    }

    await gameSettingsService.set(
      {
        mode: `${id}:${amount}`,
      },
      {
        interval_game: {
          interval,
          game: "LOTTERY_SPIN",
        },
      }
    );

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Winner Updated successfully.",
    });
  },
});
