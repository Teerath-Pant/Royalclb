import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";

export const add = createFastifyHandler({
  method: "POST",
  path: "/",
  options: { auth: "admin" },
  body: v.object({
    address: v.string("Invalid address"),
  }),

  async handler({ body, reply, ctx }) {
    const dt = Now();
    const { address } = body;

    const existing = await ctx.db.walletAddresses.count({
      where: {
        address,
      },
    });

    if (existing > 0) {
      throw AppError.badRequest({ message: "Address already exists" });
    }

    await ctx.db.walletAddresses.create({
      data: {
        address,
        createdAt: dt.toISOString(),
      },
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Address added successfully",
    });
  },
});
