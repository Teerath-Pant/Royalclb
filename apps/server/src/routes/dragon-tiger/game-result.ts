import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const gameResult = createFastifyHandler({
  method: "GET",
  path: "/result",
  options: { auth: "user" },
  searchParams: v.object({
    id: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ searchParams, reply, ctx }) {
    const { id } = searchParams;

    const game = await ctx.db.dragonTiger.findUnique({
      where: {
        id,
      },
      select: {
        result: true,
      },
    });

    return AppResponse.success(reply, {
      message: "Game Result Fetched Successfully",
      data: game,
    });
  },
});
