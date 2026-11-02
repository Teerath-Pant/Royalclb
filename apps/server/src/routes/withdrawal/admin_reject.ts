import * as v from "valibot";

import { createWalletEntry } from "@/ops/wallet";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const admin_reject = createFastifyHandler({
  method: "POST",
  path: "/admin/:id/reject",
  options: { auth: "admin" },
  params: v.object({ id: v.pipe(v.unknown(), v.toNumber()) }),
  body: v.object({
    rejectionReason: v.string(),
  }),

  async handler({ reply, params, body, ctx }) {
    requireUser(ctx);
    const dt = Now();

    await ctx.db.$transaction(async (tx) => {
      const request = await tx.withdrawalRequests.findUnique({
        where: { id: params.id },
      });

      if (!request) {
        throw AppError.notFound({ message: "Withdrawal request not found" });
      }

      if (request.status !== "PENDING") {
        throw AppError.badRequest({
          message: `Only pending requests can be rejected (current status: ${request.status})`,
        });
      }

      await tx.withdrawalRequests.update({
        where: { id: request.id },
        data: {
          status: "REJECTED",
          rejectionReason: body.rejectionReason,
          processedAt: dt.toDate(),
          updatedAt: dt.toDate(),
        },
      });

      await createWalletEntry(tx, {
        userId: request.userId,
        refId: request.id,
        amount: request.amount,
        note: `Withdrawal rejected - refund (${body.rejectionReason})`,
        type: "CREDIT",
        wallet: "WALLET",
        dt,
      });
    });

    return AppResponse.success(reply, {
      message: "Withdrawal request rejected and amount refunded",
    });
  },
});
