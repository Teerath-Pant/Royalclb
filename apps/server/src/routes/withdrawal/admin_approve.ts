import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const admin_approve = createFastifyHandler({
  method: "POST",
  path: "/admin/:id/approve",
  options: { auth: "admin" },
  params: v.object({ id: v.pipe(v.unknown(), v.toNumber()) }),
  body: v.object({
    transactionRef: v.string(),
  }),

  async handler({ reply, params, body, ctx }) {
    requireUser(ctx);
    const dt = Now();

    const request = await ctx.db.withdrawalRequests.findUnique({
      where: { id: params.id },
    });

    if (!request) {
      throw AppError.notFound({ message: "Withdrawal request not found" });
    }

    if (request.status !== "PENDING") {
      throw AppError.badRequest({
        message: `Only pending requests can be approved (current status: ${request.status})`,
      });
    }

    await ctx.db.withdrawalRequests.update({
      where: { id: request.id },
      data: {
        status: "APPROVED",
        transactionRef: body.transactionRef,
        processedAt: dt.toDate(),
        updatedAt: dt.toDate(),
      },
    });

    return AppResponse.success(reply, {
      message: "Withdrawal request approved successfully",
    });
  },
});
