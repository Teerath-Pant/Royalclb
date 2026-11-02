import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { createPaginationSchema } from "@/utils/valibot";

export const getTransactions = createFastifyHandler({
  method: "GET",
  path: "/transactions",
  options: { auth: "user" },
  searchParams: createPaginationSchema(),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    const { page, limit } = searchParams;

    const [items, total] = await Promise.all([
      ctx.db.safeTransactions.findMany({
        where: { userId: ctx.user.member_id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      ctx.db.safeTransactions.count({
        where: { userId: ctx.user.member_id },
      }),
    ]);

    return AppResponse.success(reply, {
      data: {
        items,
        total,
        page,
        limit,
      },
    });
  },
});
