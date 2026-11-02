import * as v from "valibot";

import {
  parseWithdrawalMethod,
  withdrawalTypeSchema,
} from "@/ops/withdrawal-methods";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const get = createFastifyHandler({
  method: "GET",
  path: "/:type",
  options: { auth: "user" },
  params: v.object({ type: withdrawalTypeSchema }),

  async handler({ reply, params, ctx }) {
    requireUser(ctx);

    const row = await ctx.db.withdrawalMethods.findUnique({
      where: { userId_type: { userId: ctx.user.member_id, type: params.type } },
      select: { type: true, details: true, createdAt: true, updatedAt: true },
    });

    if (!row) {
      throw AppError.notFound({
        message: `No ${params.type} withdrawal method found`,
      });
    }

    return AppResponse.success(reply, {
      data: {
        ...parseWithdrawalMethod(row),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    });
  },
});
