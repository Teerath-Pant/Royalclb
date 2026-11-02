import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const getBalance = createFastifyHandler({
  method: "GET",
  path: "/balance",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const user = await ctx.db.meddolic_user_details.findUniqueOrThrow({
      where: { member_id: ctx.user.member_id },
      select: { safeWallet: true, safeInterestWallet: true },
    });

    return AppResponse.success(reply, {
      data: user,
    });
  },
});
