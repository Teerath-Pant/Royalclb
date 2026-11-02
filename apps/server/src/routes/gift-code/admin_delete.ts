import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { createPrimaryKeySchema } from "@/utils/valibot";

export const admin_delete = createFastifyHandler({
  method: "DELETE",
  path: "/admin/:id",
  options: { auth: "admin" },
  params: v.object({
    id: createPrimaryKeySchema("Invalid gift code ID"),
  }),

  async handler({ params, reply, ctx }) {
    await ctx.db.$transaction(async (tx) => {
      const giftCode = await tx.giftCode.findUnique({
        where: { id: params.id },
        select: { id: true, claimedCount: true },
      });

      if (!giftCode) {
        throw AppError.notFound({ message: "Gift code not found" });
      }

      if (giftCode.claimedCount > 0) {
        throw AppError.badRequest({
          message: "Cannot delete a gift code that has already been claimed",
        });
      }

      await ctx.db.giftCode.delete({
        where: { id: params.id },
      });
    });

    return AppResponse.success(reply, {
      message: "Gift code deleted successfully",
    });
  },
});
