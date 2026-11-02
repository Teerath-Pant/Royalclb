import nodemailer from "nodemailer";

import { env } from "@/env";
import { logger } from "@/lib/logger";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

void (async () => {
  try {
    await transporter.verify();
    logger.info("[Nodemailer] SMTP server is ready to send messages");
  } catch (error) {
    logger.warn({ error }, "[Nodemailer] Transporter connection check failed");
  }
})();
