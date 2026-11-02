import { parseWithdrawalMethod } from "@/ops/withdrawal-methods";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const list = createFastifyHandler({
  method: "GET",
  path: "/",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);

    const rows = await ctx.db.withdrawalMethods.findMany({
      where: { userId: ctx.user.member_id },
      select: { type: true, details: true, createdAt: true, updatedAt: true },
    });

    const data = rows.map((row) => ({
      ...parseWithdrawalMethod(row),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return AppResponse.success(reply, { data });
  },
});
