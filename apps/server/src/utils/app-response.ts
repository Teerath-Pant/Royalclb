import type { FastifyReply } from "fastify";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import type { ErrorCode } from "./app-error";

export type AppResponseBody<T = undefined> = {
  success: boolean;
  code: ErrorCode;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
} & (T extends undefined ? { data?: never } : { data: T });

type SuccessOptions<T = undefined> = {
  code?: ErrorCode;
  message?: string;
  data?: T;
};

type ErrorOptions = {
  code: ErrorCode;
  message?: string;
  /** Field-level validation errors, e.g. { email: "Invalid email" }. */
  errors?: Record<string, string>;
};

/**
 * Builds a consistent success/error JSON body and sends it via a
 * Fastify reply. Mirrors `AppError`'s code-driven design.
 *
 * @example
 * return AppResponse.success(reply, { data: deposit });
 * return AppResponse.success(reply, { code: "CREATED", data: deposit });
 * return AppResponse.error(reply, { code: "NOT_FOUND", message: "Deposit not found" });
 */
export class AppResponse {
  readonly success: boolean;
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly message: string;
  readonly timestamp: string;
  readonly data?: unknown;
  readonly errors?: Record<string, string>;

  private constructor(
    success: boolean,
    code: ErrorCode,
    message?: string,
    data?: unknown,
    errors?: Record<string, string>
  ) {
    this.success = success;
    this.statusCode = StatusCodes[code];
    this.code = code;
    this.message = message ?? getReasonPhrase(this.statusCode);
    this.timestamp = new Date().toISOString();
    if (data !== undefined) {
      this.data = data;
    }
    if (errors !== undefined) {
      this.errors = errors;
    }
  }

  toJSON(): AppResponseBody<unknown> {
    const body: Record<string, unknown> = {
      success: this.success,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
    };
    if (this.data !== undefined) {
      body.data = this.data;
    }
    if (this.errors !== undefined) {
      body.errors = this.errors;
    }
    return body as AppResponseBody<unknown>;
  }

  send(reply: FastifyReply): ReturnType<FastifyReply["send"]> {
    return reply.status(this.statusCode).send(this.toJSON());
  }

  static success<T = undefined>(
    reply: FastifyReply,
    { code = "OK", message, data }: SuccessOptions<T> = {}
  ): ReturnType<FastifyReply["send"]> {
    return new AppResponse(true, code, message, data).send(reply);
  }

  static error(
    reply: FastifyReply,
    { code, message, errors }: ErrorOptions
  ): ReturnType<FastifyReply["send"]> {
    return new AppResponse(false, code, message, undefined, errors).send(reply);
  }
}
