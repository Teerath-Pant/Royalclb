import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import Fastify, { LogController } from "fastify";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";

import { appRouter } from "@/routes";

import { errorHandler } from "./handlers/error-handler";
import { notFoundHandler } from "./handlers/not-found-handler";
import { logger } from "./lib/logger";
import { loggingPlugin } from "./plugins/logging-plugin";

const logController = new LogController({ disableRequestLogging: true });

const app: FastifyInstance = Fastify({
  loggerInstance: logger as unknown as FastifyBaseLogger,
  // Disable Fastify's built-in automatic req/res logging — loggingPlugin handles HTTP request logging
  logController,
  trustProxy: true,
  genReqId: () => crypto.randomUUID(),
  // allow up to 20MB request bodies for base64 image uploads
  bodyLimit: 20 * 1024 * 1024,
});

app.setErrorHandler(errorHandler);
app.setNotFoundHandler(notFoundHandler);

await app.register(loggingPlugin);

await app.register(fastifyCors, {
  origin: "*",
});

await app.register(fastifyHelmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
});

await app.register(fastifyCookie);

app.decorateRequest("user", null);

app.get("/", (_req, reply) => {
  reply.send("Server is running");
});

await app.register(appRouter);

export { app };
