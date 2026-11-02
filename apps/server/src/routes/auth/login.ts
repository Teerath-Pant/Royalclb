import * as v from "valibot";

import { EmailService } from "@/services/email.service";
import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { fireAndForget } from "@/utils/fire-and-forget";
import { signToken } from "@/utils/jwt";
import { maskEmail } from "@/utils/mask";

const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const login = createFastifyHandler({
  method: "POST",
  path: "/login",
  body: v.object({
    phone: v.pipe(v.string(), v.length(10)),
    password: v.pipe(v.string(), v.minLength(1)),
  }),

  async handler({ reply, body, ctx }) {
    const dt = Now();

    const user = await ctx.db.meddolic_user_details.findFirst({
      where: {
        phone: body.phone,
        password: body.password,
      },
      select: {
        member_id: true,
        user_type: true,
        account_status: true,
        email_id: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new AppError("BAD_REQUEST", {
        message: "Invalid phone or password",
      });
    }

    if (user.account_status === 0) {
      throw new AppError("BAD_REQUEST", {
        message: "Your account has been blocked",
      });
    }

    if (user.twoFactorEnabled) {
      const otp = await OtpService.generateOtp("login", user.email_id, 300);

      void fireAndForget(() =>
        EmailService.sendLoginOtpEmail(user.email_id, otp, 5)
      );

      return AppResponse.success(reply, {
        message: `OTP sent to ${maskEmail(user.email_id)}`,
        data: { requiresOtp: true },
      });
    }

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
      data: { requiresOtp: false },
    });
  },
});
