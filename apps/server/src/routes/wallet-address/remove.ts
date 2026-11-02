import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const remove = createFastifyHandler({
  method: "DELETE",
  path: "/:id",
  options: { auth: "admin" },
  params: v.object({
    id: v.pipe(v.unknown(), v.toNumber("Invalid wallet address ID")),
  }),

  async handler({ params, reply, ctx }) {
    const { id } = params;

    const walletAddress = await ctx.db.walletAddresses.findUnique({
      where: {
        id,
      },
    });

    if (!walletAddress) {
      throw AppError.notFound({ message: "Wallet address ID does not exist" });
    }

    await ctx.db.walletAddresses.delete({
      where: {
        id,
      },
    });

    return AppResponse.success(reply, {
      message: "Wallet address ID removed successfully",
    });
  },
});
