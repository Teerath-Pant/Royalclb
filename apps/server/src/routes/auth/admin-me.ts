import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const adminMe = createFastifyHandler({
  method: "GET",
  path: "/admin/me",
  options: { auth: "admin" },

  handler({ reply, ctx }) {
    requireUser(ctx);

    return AppResponse.success(reply, {
      data: {
        memberId: ctx.user.member_id,
        userId: ctx.user.user_id,
        name: ctx.user.name,
      },
    });
  },
});
