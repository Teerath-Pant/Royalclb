import * as v from "valibot";

import { EmailService } from "@/services/email.service";
import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { fireAndForget } from "@/utils/fire-and-forget";

export const sendOtp = createFastifyHandler({
  method: "POST",
  path: "/send-otp",
  body: v.object({
    email: v.pipe(v.string(), v.email("Invalid email address")),
  }),

  async handler({ reply, body, ctx }) {
    const existingEmail = await ctx.db.meddolic_user_details.count({
      where: {
        email_id: body.email,
      },
    });

    if (existingEmail > 0) {
      throw new AppError("BAD_REQUEST", {
        message: "Email address is already registered",
      });
    }

    const otp = await OtpService.generateOtp("register", body.email, 300);

    void fireAndForget(() =>
      EmailService.sendRegisterOtpEmail(body.email, otp, 5)
    );

    return AppResponse.success(reply, {
      message: "OTP sent successfully",
    });
  },
});
