import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const update = createFastifyHandler({
  method: "PATCH",
  path: "/:id",
  options: { auth: "admin" },
  params: v.object({
    id: v.pipe(v.unknown(), v.toNumber("Invalid ID")),
  }),
  body: v.object({
    upiId: v.optional(v.string("Invalid UPI ID")),
    status: v.optional(v.picklist(["ENABLE", "DISABLE"], "Invalid Status")),
  }),

  async handler({ params, body, reply, ctx }) {
    const { id } = params;
    const { upiId, status } = body;

    const upi = await ctx.db.upiIds.findUnique({
      where: {
        id,
      },
    });

    if (!upi) {
      throw AppError.notFound({ message: "UPI ID does not exist" });
    }

    if (upiId) {
      const existingCount = await ctx.db.upiIds.count({
        where: {
          upiId,
        },
      });

      if (existingCount > 0) {
        throw AppError.badRequest({ message: "UPI ID already exists" });
      }
    }

    await ctx.db.upiIds.update({
      where: {
        id,
      },
      data: {
        upiId,
        status,
      },
    });

    return AppResponse.success(reply, {
      message: "UPI updated successfully",
    });
  },
});
