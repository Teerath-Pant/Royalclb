import { StatusCodes, getReasonPhrase } from "http-status-codes";

export type ErrorCode = keyof typeof StatusCodes;

export type AppErrorOptions = {
  /** Overrides the default HTTP reason phrase for this status code. */
  message?: string;

  /**
   * Structured context logged server-side but NEVER sent to the client.
   * Use for debugging data (IDs, payloads) that shouldn't leak in responses.
   */
  context?: Record<string, unknown>;

  /** Original error that caused this one. Attached as `cause`, included in logs. */
  cause?: unknown;

  /**
   * Suppresses error-handler logging. Use for expected user-facing errors
   * (wrong password, etc.) that would pollute error dashboards.
   * @default false
   */
  silent?: boolean;

  /**
   * Marks the operation as safe to retry; error handler can set `Retry-After`.
   * @default false
   */
  retryable?: boolean;
};

/**
 * Structured application error carrying an HTTP status code.
 *
 * Throw anywhere — the global error handler catches it and sends a
 * consistent JSON error response.
 *
 * @example
 * throw new AppError("UNPROCESSABLE_ENTITY", { message: "Amount must be greater than zero" });
 * throw AppError.notFound({ message: "Deposit not found" });
 * throw AppError.conflict({ message: "Already processed", context: { depositId } });
 */
export class AppError extends Error {
  /** HTTP status code sent to the client. */
  readonly statusCode: number;

  /** Machine-readable code for clients and alerting rules. */
  readonly code: ErrorCode;

  /** Server-side only context — logged but never sent to clients. */
  readonly context: Record<string, unknown>;

  /** Whether the error handler should suppress logging for this error. */
  readonly silent: boolean;

  /** Whether the caller/gateway may safely retry the operation. */
  readonly retryable: boolean;

  /** ISO timestamp of when the error was created. */
  readonly timestamp: string;

  constructor(code: ErrorCode, options: AppErrorOptions = {}) {
    const statusCode = StatusCodes[code];
    const message = options.message ?? getReasonPhrase(statusCode);

    super(message, options.cause ? { cause: options.cause } : undefined);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.context = options.context ?? {};
    this.silent = options.silent ?? false;
    this.retryable = options.retryable ?? false;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Full payload for internal logging.
   * Includes `context`, `cause`, and `stack`.
   */
  toLog() {
    return {
      status: "error" as const,
      code: this.code,
      statusCode: this.statusCode,
      message: this.message,
      context: this.context,
      cause: this.cause,
      stack: this.stack,
      timestamp: this.timestamp,
    };
  }

  /** Narrows an unknown caught value to `AppError`. */
  static is(err: unknown): err is AppError {
    return err instanceof AppError;
  }

  /**
   * Checks whether a caught value is an `AppError` with a specific code.
   * @example
   * if (AppError.isCode(err, "CONFLICT")) { ... }
   */
  static isCode(err: unknown, code: ErrorCode): err is AppError {
    return AppError.is(err) && err.code === code;
  }

  /** 400 — malformed request or failed validation. */
  static badRequest(o?: AppErrorOptions) {
    return new AppError("BAD_REQUEST", o);
  }

  /** 401 — missing or invalid credentials. Silent by default. */
  static unauthorized(o?: AppErrorOptions) {
    return new AppError("UNAUTHORIZED", { silent: true, ...o });
  }

  /** 403 — authenticated but not permitted. Silent by default. */
  static forbidden(o?: AppErrorOptions) {
    return new AppError("FORBIDDEN", { silent: true, ...o });
  }

  /** 404 — resource not found or already processed. */
  static notFound(o?: AppErrorOptions) {
    return new AppError("NOT_FOUND", o);
  }

  /** 409 — state conflict, e.g. duplicate processing. */
  static conflict(o?: AppErrorOptions) {
    return new AppError("CONFLICT", o);
  }

  /** 422 — well-formed request that is semantically invalid. */
  static unprocessable(o?: AppErrorOptions) {
    return new AppError("UNPROCESSABLE_ENTITY", o);
  }

  /** 429 — rate limit exceeded. Retryable by default. */
  static tooManyRequests(o?: AppErrorOptions) {
    return new AppError("TOO_MANY_REQUESTS", { retryable: true, ...o });
  }

  /** 500 — unexpected server-side failure. */
  static internal(o?: AppErrorOptions) {
    return new AppError("INTERNAL_SERVER_ERROR", o);
  }

  /** 503 — downstream dependency unavailable. Retryable by default. */
  static serviceUnavailable(o?: AppErrorOptions) {
    return new AppError("SERVICE_UNAVAILABLE", { retryable: true, ...o });
  }
}
