import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const get2fa = createFastifyHandler({
  method: "GET",
  path: "/2fa",
  options: { auth: "user" },

  handler({ reply, ctx }) {
    requireUser(ctx);

    return AppResponse.success(reply, {
      message: "2FA status fetched successfully",
      data: { enabled: Boolean(ctx.user.twoFactorEnabled) },
    });
  },
});
