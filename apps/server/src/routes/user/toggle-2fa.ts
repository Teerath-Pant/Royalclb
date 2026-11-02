import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const toggle2fa = createFastifyHandler({
  method: "PUT",
  path: "/2fa",
  options: { auth: "user" },
  body: v.object({
    enabled: v.boolean(),
  }),

  async handler({ reply, body, ctx }) {
    requireUser(ctx);

    await ctx.db.meddolic_user_details.update({
      where: { member_id: ctx.user.member_id },
      data: { twoFactorEnabled: body.enabled ? 1 : 0 },
    });

    return AppResponse.success(reply, {
      message: `Two-factor authentication ${body.enabled ? "enabled" : "disabled"}`,
      data: { enabled: body.enabled },
    });
  },
});
