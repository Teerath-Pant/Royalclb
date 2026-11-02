import { EmailService } from "@/services/email.service";
import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { fireAndForget } from "@/utils/fire-and-forget";
import { maskEmail } from "@/utils/mask";
import { requireUser } from "@/utils/require-user";

export const sendWithdrawalOtp = createFastifyHandler({
  method: "POST",
  path: "/send-otp",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);

    if (!ctx.user.twoFactorEnabled) {
      throw AppError.badRequest({
        message: "Two-factor authentication is not enabled for your account",
      });
    }

    const otp = await OtpService.generateOtp(
      "withdrawal",
      ctx.user.email_id,
      300
    );

    void fireAndForget(() =>
      EmailService.sendWithdrawalOtpEmail(ctx.user.email_id, otp, 5)
    );

    return AppResponse.success(reply, {
      message: `OTP sent to ${maskEmail(ctx.user.email_id)}`,
    });
  },
});
