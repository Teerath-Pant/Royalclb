import * as v from "valibot";

import { AppError } from "@/utils/app-error";
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

    const game = await ctx.db.carRoulette.findUnique({
      where: {
        id,
      },
      select: {
        result: true,
      },
    });

    if (game === null) {
      throw AppError.notFound({
        message: "Game not found",
      });
    }

    return AppResponse.success(reply, {
      message: "Game Result Fetched Successfully",
      data: game,
    });
  },
});
