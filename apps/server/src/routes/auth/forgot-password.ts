import * as v from "valibot";

import { EmailService } from "@/services/email.service";
import { OtpService } from "@/services/otp.service";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { fireAndForget } from "@/utils/fire-and-forget";

const PURPOSE = "forgot-password";
const phone = v.pipe(v.string(), v.regex(/^\d{10}$/u, "Enter a 10 digit phone number"));

export const forgotPasswordSendOtp = createFastifyHandler({
  method: "POST",
  path: "/forgot-password/send-otp",
  body: v.object({ phone }),

  async handler({ reply, body, ctx }) {
    const user = await ctx.db.meddolic_user_details.findFirst({
      where: { phone: body.phone },
      select: { email_id: true },
    });

    if (user) {
      const otp = await OtpService.generateOtp(PURPOSE, body.phone, 300);
      void fireAndForget(() =>
        EmailService.sendPasswordResetOtpEmail(user.email_id, otp, 5)
      );
    }

    // Same reply either way, so this route can't be used to discover registered phones.
    return AppResponse.success(reply, {
      message: "If this phone is registered, an OTP was sent to its email",
    });
  },
});

export const forgotPasswordReset = createFastifyHandler({
  method: "POST",
  path: "/forgot-password/reset",
  body: v.object({
    phone,
    otp: v.pipe(v.string(), v.length(6, "OTP must be 6 digits")),
    password: v.pipe(
      v.string(),
      v.minLength(4, "Password must be at least 4 characters"),
      v.maxLength(32, "Password must be at most 32 characters")
    ),
  }),

  async handler({ reply, body, ctx }) {
    await OtpService.verifyOtp(PURPOSE, body.phone, body.otp);

    await ctx.db.meddolic_user_details.updateMany({
      where: { phone: body.phone },
      data: { password: body.password },
    });

    return AppResponse.success(reply, { message: "Password changed successfully" });
  },
});
