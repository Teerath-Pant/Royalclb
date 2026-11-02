import path from "node:path";

import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import * as v from "valibot";

const envPath = path.join(import.meta.dirname, "..", "..", "..", ".env");

expand(config({ path: envPath }));

export const env = createEnv({
  server: {
    NODE_ENV: v.optional(
      v.picklist(["development", "production", "test"]),
      "development"
    ),

    PORT: v.pipe(v.string(), v.transform(Number), v.number()),

    APP_NAME: v.string(),
    APP_PREFIX: v.string(),
    APP_URL: v.pipe(v.string(), v.url()),

    DB_HOST: v.string(),
    DB_PORT: v.pipe(v.string(), v.transform(Number), v.number()),
    DB_NAME: v.string(),
    DB_USER: v.string(),
    DB_PASS: v.string(),

    DATABASE_URL: v.string(),

    REDIS_HOST: v.string(),
    REDIS_PORT: v.pipe(v.string(), v.transform(Number), v.number()),
    REDIS_PASSWORD: v.string(),

    FARADPAY_URL: v.pipe(v.string(), v.url()),
    FARADPAY_API_KEY: v.string(),

    FARADPAY_URL_TRX: v.pipe(v.string(), v.url()),
    FARADPAY_API_KEY_TRX: v.string(),

    SMTP_HOST: v.string(),
    SMTP_PORT: v.pipe(v.string(), v.transform(Number), v.number()),
    SMTP_USER: v.string(),
    SMTP_PASS: v.string(),

    JWT_SECRET: v.string(),
  },
  runtimeEnv: process.env,
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
