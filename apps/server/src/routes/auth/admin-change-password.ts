import * as v from "valibot";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const changeAdminPassword = createFastifyHandler({
  method: "POST",
  path: "/admin/change-password",
  options: { auth: "admin" },
  body: v.object({
    password: v.string(),
    password1: v.string(),
    password2: v.string(),
  }),

  async handler({ reply, body, ctx }) {
    requireUser(ctx);

    if (body.password2 !== body.password1) {
      throw new AppError("BAD_REQUEST", { message: "New passwords do not match!!!" });
    }

    if (ctx.user.password !== body.password) {
      throw new AppError("BAD_REQUEST", { message: "Incorrect Current Password!!!" });
    }

    await ctx.db.meddolic_user_details.updateMany({
      where: { member_id: ctx.user.member_id, user_type: 1 },
      data: { password: body.password1 },
    });

    return AppResponse.success(reply, {
      message: "Login Password Updated Successfully!!!\nNow please login again with new password. ",
    });
  },
});
