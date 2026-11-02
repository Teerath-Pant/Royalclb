import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getName = createFastifyHandler({
  method: "GET",
  path: "/name/:id",
  params: v.object({
    id: v.pipe(v.unknown(), v.toString()),
  }),
  async handler({ reply, params, ctx }) {
    const user = await ctx.db.meddolic_user_details.findFirst({
      where: /^\d+$/u.test(params.id)
        ? { uid: Number.parseInt(params.id, 10) }
        : { user_id: params.id },
    });

    if (!user) {
      throw AppError.notFound({ message: "Invalid user ID" });
    }

    return AppResponse.success(reply, {
      message: "User name fetched successfully",
      data: {
        name: user.name,
      },
    });
  },
});
