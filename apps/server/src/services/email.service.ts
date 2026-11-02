import path from "node:path";

import ejs from "ejs";
import { convert } from "html-to-text";

import { env } from "@/env";
import { logger } from "@/lib/logger";
import { transporter } from "@/lib/nodemailer";
import { AppError } from "@/utils/app-error";

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  data: Record<string, unknown>;
}

export const EmailService = {
  /**
   * Render an EJS template and send email with HTML and auto-generated text version.
   */
  async sendEmail({
    to,
    subject,
    templateName,
    data,
  }: SendEmailOptions): Promise<void> {
    const templatePath = path.join(
      process.cwd(),
      "email-templates",
      `${templateName}.ejs`
    );

    try {
      const html = await ejs.renderFile(templatePath, data);
      const text = convert(html, {
        wordwrap: 130,
      });

      await transporter.sendMail({
        from: `${env.APP_NAME} <${env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });

      logger.info(`[EmailService] Sent '${templateName}' email to ${to}`);
    } catch (error) {
      logger.error({ error }, `[EmailService] Failed to send email to ${to}`);
      throw AppError.internal({
        message:
          "Failed to send email. Please verify SMTP configuration or try again later.",
      });
    }
  },

  /**
   * Helper method to send registration OTP email.
   */
  async sendRegisterOtpEmail(
    email: string,
    otp: string,
    validMinutes = 5
  ): Promise<void> {
    await EmailService.sendEmail({
      to: email,
      subject: "Your Registration Verification Code",
      templateName: "otp-register",
      data: {
        otp,
        appName: env.APP_NAME,
        validMinutes,
      },
    });
  },

  /**
   * Helper method to send login OTP email.
   */
  async sendPasswordResetOtpEmail(
    email: string,
    otp: string,
    validMinutes = 5
  ): Promise<void> {
    await EmailService.sendEmail({
      to: email,
      subject: "Your Password Reset Code",
      templateName: "otp-verification",
      data: {
        otp,
        appName: env.APP_NAME,
        validMinutes,
        purposeText: "resetting your password",
      },
    });
  },

  async sendLoginOtpEmail(
    email: string,
    otp: string,
    validMinutes = 5
  ): Promise<void> {
    await EmailService.sendEmail({
      to: email,
      subject: "Your Login Verification Code",
      templateName: "otp-verification",
      data: {
        otp,
        appName: env.APP_NAME,
        validMinutes,
        purposeText: "logging in",
      },
    });
  },

  /**
   * Helper method to send admin login OTP email. Always sent to the fixed
   * security mailbox rather than the admin's own email.
   */
  async sendAdminLoginOtpEmail(otp: string, validMinutes = 5): Promise<void> {
    await EmailService.sendEmail({
      to: "Rizwan.rocks8@gmail.com",
      subject: "Admin Login Verification Code",
      templateName: "otp-verification",
      data: {
        otp,
        appName: env.APP_NAME,
        validMinutes,
        purposeText: "the admin login",
      },
    });
  },

  /**
   * Helper method to send withdrawal OTP email.
   */
  async sendWithdrawalOtpEmail(
    email: string,
    otp: string,
    validMinutes = 5
  ): Promise<void> {
    await EmailService.sendEmail({
      to: email,
      subject: "Your Withdrawal Verification Code",
      templateName: "otp-verification",
      data: {
        otp,
        appName: env.APP_NAME,
        validMinutes,
        purposeText: "your withdrawal request",
      },
    });
  },
} as const;
