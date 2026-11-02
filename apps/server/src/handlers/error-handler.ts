import { ValidationError } from "@jeetgr/fastify-forge";
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { codeFromStatus } from "@/utils/status-code-map";

export const errorHandler = async (
  err: FastifyError | Error | unknown,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err instanceof ValidationError) {
    const errors: Record<string, string> = {};

    for (const issue of err.issues) {
      const key =
        issue.path?.map((p) => (typeof p === "object" ? p.key : p)).join(".") ??
        "";
      if (!(key in errors)) {
        errors[key] = issue.message;
      }
    }

    req.log.warn({ reqId: req.id, errors }, err.message);

    return AppResponse.error(reply, {
      code: "BAD_REQUEST",
      message: err.message,
      errors,
    });
  }

  if (AppError.is(err)) {
    // `silent` errors (e.g. wrong password, auth failures) are expected noise —
    // log at `info` so they don't pollute error dashboards.
    // Non-silent 4xx go to `warn`, 5xx go to `error`.
    if (!err.silent) {
      const logPayload = { reqId: req.id, ...err.toLog() };

      if (err.statusCode >= 500) {
        req.log.error(logPayload, err.message);
      } else {
        req.log.warn(logPayload, err.message);
      }
    }

    // Attach Retry-After for retryable errors (rate limits, 503s).
    // Clients and gateways can use this to back off correctly.
    if (err.retryable) {
      await reply.header("Retry-After", "5");
    }

    return AppResponse.error(reply, {
      code: err.code,
      message: err.message,
    });
  }

  const fastifyErr = err as FastifyError;
  if (fastifyErr.statusCode) {
    const is5xx = fastifyErr.statusCode >= 500;

    if (is5xx) {
      req.log.error({ err, reqId: req.id }, fastifyErr.message);
    } else {
      req.log.warn({ err, reqId: req.id }, fastifyErr.message);
    }

    return AppResponse.error(reply, {
      code: codeFromStatus(
        fastifyErr.statusCode,
        is5xx ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST"
      ),
      message: is5xx ? "Internal server error" : fastifyErr.message,
    });
  }

  req.log.error({ err, reqId: req.id }, "Unhandled error");

  return AppResponse.error(reply, {
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};
