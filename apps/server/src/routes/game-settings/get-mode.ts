import * as v from "valibot";

import { gameSettings_game } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getMode = createFastifyHandler({
  method: "GET",
  path: "/mode",
  options: { auth: "admin" },
  searchParams: v.object({
    interval: v.pipe(v.unknown(), v.toNumber()),
    game: v.enum(gameSettings_game),
  }),

  async handler({ searchParams, reply, ctx }) {
    const { interval, game } = searchParams;

    const settings = await ctx.db.gameSettings.findUnique({
      select: { mode: true },
      where: { interval_game: { interval, game } },
    });

    return AppResponse.success(reply, { data: { mode: settings?.mode ?? null } });
  },
});
