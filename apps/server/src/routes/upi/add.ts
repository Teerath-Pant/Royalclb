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
    upiId: v.string("Invalid UPI ID"),
  }),

  async handler({ body, reply, ctx }) {
    const dt = Now();
    const { upiId } = body;

    const existing = await ctx.db.upiIds.count({
      where: {
        upiId,
      },
    });

    if (existing > 0) {
      throw AppError.badRequest({ message: "UPI ID already exists" });
    }

    await ctx.db.upiIds.create({
      data: {
        upiId,
        createdAt: dt.toISOString(),
      },
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "UPI ID added successfully",
    });
  },
});
