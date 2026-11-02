import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const remove = createFastifyHandler({
  method: "DELETE",
  path: "/:id",
  options: { auth: "admin" },
  params: v.object({
    id: v.pipe(v.unknown(), v.toNumber("Invalid UPI ID")),
  }),

  async handler({ params, reply, ctx }) {
    const { id } = params;

    const upi = await ctx.db.upiIds.findUnique({
      where: {
        id,
      },
    });

    if (!upi) {
      throw AppError.notFound({ message: "UPI ID does not exist" });
    }

    await ctx.db.upiIds.delete({
      where: {
        id,
      },
    });

    return AppResponse.success(reply, {
      message: "UPI ID removed successfully",
    });
  },
});
