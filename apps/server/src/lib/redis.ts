import Redis from "ioredis";

import { env } from "@/env";

import { logger } from "./logger";

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: 0,
});

// Without a handler, ioredis connection errors surface only as rejected
// commands (each caller sees them individually). Log them once here so a Redis
// outage — during which the rate limiter falls back to its in-memory counter —
// is visible in monitoring. Throttle the log so a flapping connection can't
// spam the log pipeline.
let lastRedisErrorLoggedAt = 0;
redis.on("error", (error) => {
  const now = Date.now();
  if (now - lastRedisErrorLoggedAt < 5000) {
    return;
  }
  lastRedisErrorLoggedAt = now;
  logger.error({ error }, "[Redis] connection error");
});
