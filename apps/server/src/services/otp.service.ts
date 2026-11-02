import { redis } from "@/lib/redis";
import { AppError } from "@/utils/app-error";

function getKey(purpose: string, identifier: string): string {
  return `otp:${purpose}:${identifier.toLowerCase().trim()}`;
}

function getCooldownKey(purpose: string, identifier: string): string {
  return `otp_cooldown:${purpose}:${identifier.toLowerCase().trim()}`;
}

export const OtpService = {
  /**
   * Check if an active OTP send cooldown exists for this identifier.
   * Throws 429 if the request is made before the cooldown expires.
   */
  async checkCooldown(purpose: string, identifier: string): Promise<void> {
    const cooldownKey = getCooldownKey(purpose, identifier);
    const ttl = await redis.ttl(cooldownKey);
    if (ttl > 0) {
      throw AppError.tooManyRequests({
        message: `Please wait ${ttl} second${ttl > 1 ? "s" : ""} before requesting a new verification code.`,
      });
    }
  },

  /**
   * Generate a numeric OTP code and store in Redis with an expiration TTL and optional cooldown TTL.
   */
  async generateOtp(
    purpose: string,
    identifier: string,
    ttlSeconds = 300,
    cooldownSeconds = 60
  ): Promise<string> {
    await OtpService.checkCooldown(purpose, identifier);

    const code = Math.floor(100_000 + Math.random() * 900_000).toString();
    const key = getKey(purpose, identifier);
    const cooldownKey = getCooldownKey(purpose, identifier);

    await redis.set(key, code, "EX", ttlSeconds);
    if (cooldownSeconds > 0) {
      await redis.set(cooldownKey, "1", "EX", cooldownSeconds);
    }

    return code;
  },

  /**
   * Verify an OTP code against Redis storage.
   */
  async verifyOtp(
    purpose: string,
    identifier: string,
    code: string,
    consumeOnSuccess = true
  ): Promise<boolean> {
    const key = getKey(purpose, identifier);
    const storedCode = await redis.get(key);

    if (!storedCode) {
      throw AppError.badRequest({
        message: "OTP code has expired or is invalid",
      });
    }

    if (storedCode !== code.trim()) {
      throw AppError.badRequest({ message: "Invalid OTP code" });
    }

    if (consumeOnSuccess) {
      await redis.del(key);
      const cooldownKey = getCooldownKey(purpose, identifier);
      await redis.del(cooldownKey);
    }

    return true;
  },
} as const;
