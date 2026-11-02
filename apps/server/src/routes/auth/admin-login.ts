import * as v from "valibot";

import { EmailService } from "@/services/email.service";
import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { fireAndForget } from "@/utils/fire-and-forget";

export const adminLogin = createFastifyHandler({
  method: "POST",
  path: "/admin/login",
  body: v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.pipe(v.string(), v.minLength(1)),
  }),

  async handler({ reply, body, ctx }) {
    const user = await ctx.db.meddolic_user_details.findFirst({
      where: {
        email_id: body.email,
        password: body.password,
        user_type: 1,
      },
      select: {
        member_id: true,
      },
    });

    if (!user) {
      throw new AppError("BAD_REQUEST", {
        message: "Invalid email or password",
      });
    }

    const otp = await OtpService.generateOtp("admin-login", body.email, 300);

    void fireAndForget(() => EmailService.sendAdminLoginOtpEmail(otp, 5));

    return AppResponse.success(reply, {
      message: "OTP sent",
      data: { requiresOtp: true },
    });
  },
});
