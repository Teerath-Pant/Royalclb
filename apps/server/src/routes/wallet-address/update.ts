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
    address: v.optional(v.string("Invalid address")),
    status: v.optional(v.picklist(["ENABLE", "DISABLE"], "Invalid Status")),
  }),

  async handler({ params, body, reply, ctx }) {
    const { id } = params;
    const { address, status } = body;

    const walletAddress = await ctx.db.walletAddresses.findUnique({
      where: {
        id,
      },
    });

    if (!walletAddress) {
      throw AppError.notFound({ message: "Wallet address does not exist" });
    }

    if (address) {
      const existingCount = await ctx.db.walletAddresses.count({
        where: {
          address,
        },
      });

      if (existingCount > 0) {
        throw AppError.badRequest({ message: "Address already exists" });
      }
    }

    await ctx.db.walletAddresses.update({
      where: {
        id,
      },
      data: {
        address,
        status,
      },
    });

    return AppResponse.success(reply, {
      message: "Address updated successfully",
    });
  },
});
