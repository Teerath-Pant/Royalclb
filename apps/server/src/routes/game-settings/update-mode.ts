import * as v from "valibot";

import { gameSettings_game } from "@/lib/prisma";
import { gameSettingsService } from "@/services/game-settings.service";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const updateMode = createFastifyHandler({
  method: "PUT",
  path: "/mode",
  options: { auth: "admin" },
  body: v.object({
    interval: v.pipe(v.unknown(), v.toNumber()),
    game: v.enum(gameSettings_game),
    mode: v.string(),
  }),

  async handler({ body, reply }) {
    const { interval, game, mode } = body;

    await gameSettingsService.set(
      { mode },
      {
        interval_game: {
          interval,
          game,
        },
      }
    );

    return AppResponse.success(reply, {
      message: "Game Mode Updated Successfully",
    });
  },
});
