import * as v from "valibot";

import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { signToken } from "@/utils/jwt";

const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const verifyAdminLoginOtp = createFastifyHandler({
  method: "POST",
  path: "/admin/login/verify-otp",
  body: v.object({
    email: v.pipe(v.string(), v.email()),
    otp: v.pipe(v.string(), v.length(6)),
  }),

  async handler({ reply, body, ctx }) {
    const dt = Now();

    const user = await ctx.db.meddolic_user_details.findFirst({
      where: {
        email_id: body.email,
        user_type: 1,
      },
      select: {
        member_id: true,
        user_type: true,
      },
    });

    if (!user) {
      throw new AppError("BAD_REQUEST", { message: "Invalid email" });
    }

    await OtpService.verifyOtp("admin-login", body.email, body.otp);

    const token = signToken({
      memberId: user.member_id,
      userType: user.user_type,
    });

    const cookieName = "admin_token";
    const expiresAt = dt.add(COOKIE_TTL_MS, "milliseconds");

    reply.setCookie(cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: expiresAt.toDate(),
    });

    return AppResponse.success(reply, {
      message: "Login successful",
    });
  },
});
