import * as v from "valibot";

import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { signToken } from "@/utils/jwt";

const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const verifyLoginOtp = createFastifyHandler({
  method: "POST",
  path: "/login/verify-otp",
  body: v.object({
    phone: v.pipe(v.string(), v.length(10)),
    otp: v.pipe(v.string(), v.length(6)),
  }),

  async handler({ reply, body, ctx }) {
    const dt = Now();

    const user = await ctx.db.meddolic_user_details.findFirst({
      where: { phone: body.phone },
      select: {
        member_id: true,
        user_type: true,
        account_status: true,
        email_id: true,
      },
    });

    if (!user) {
      throw new AppError("BAD_REQUEST", { message: "Invalid phone number" });
    }

    if (user.account_status === 0) {
      throw new AppError("BAD_REQUEST", {
        message: "Your account has been blocked",
      });
    }

    await OtpService.verifyOtp("login", user.email_id, body.otp);

    const token = signToken({
      memberId: user.member_id,
      userType: user.user_type,
    });

    const cookieName = "user_token";
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
