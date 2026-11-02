import * as v from "valibot";

import {
  parseWithdrawalMethod,
  validateWithdrawalDetails,
  withdrawalTypeSchema,
} from "@/ops/withdrawal-methods";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const upsert = createFastifyHandler({
  method: "PUT",
  path: "/:type",
  options: { auth: "user" },
  params: v.object({ type: withdrawalTypeSchema }),
  body: v.object({
    details: v.record(v.string(), v.unknown()),
  }),

  async handler({ reply, params, body, ctx }) {
    requireUser(ctx);
    const dt = Now();

    const validatedDetails = validateWithdrawalDetails(
      params.type,
      body.details
    );
    const detailsJson = JSON.stringify(validatedDetails);

    const row = await ctx.db.withdrawalMethods.upsert({
      where: { userId_type: { userId: ctx.user.member_id, type: params.type } },
      create: {
        userId: ctx.user.member_id,
        type: params.type,
        details: detailsJson,
        createdAt: dt.toDate(),
      },
      update: {
        details: detailsJson,
        updatedAt: dt.toDate(),
      },
      select: { type: true, details: true },
    });

    return AppResponse.success(reply, {
      message: `${params.type} withdrawal method saved successfully`,
      data: parseWithdrawalMethod(row),
    });
  },
});
