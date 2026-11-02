import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { signToken } from "@/utils/jwt";

const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const impersonate = createFastifyHandler({
  method: "POST",
  path: "/admin/impersonate",
  options: { auth: "admin" },
  body: v.object({
    memberId: v.number(),
  }),

  async handler({ reply, body, ctx }) {
    const dt = Now();

    const user = await ctx.db.meddolic_user_details.findFirst({
      where: {
        member_id: body.memberId,
      },
      select: {
        member_id: true,
        user_id: true,
        name: true,
        user_type: true,
        account_status: true,
      },
    });

    if (!user) {
      throw new AppError("NOT_FOUND", {
        message: "User not found",
      });
    }

    if (user.account_status === 0) {
      throw new AppError("BAD_REQUEST", {
        message: "Account is blocked",
      });
    }

    const token = signToken({
      memberId: user.member_id,
      userType: user.user_type,
    });

    const expiresAt = dt.add(COOKIE_TTL_MS, "milliseconds");

    reply.setCookie("user_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: expiresAt.toDate(),
    });

    return AppResponse.success(reply, {
      message: "Impersonation successful",
      data: {
        memberId: user.member_id,
        userId: user.user_id,
        name: user.name,
      },
    });
  },
});
