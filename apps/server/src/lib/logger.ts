import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

const SENSITIVE_BODY_KEYS = new Set([
  "api_key",
  "apiKey",
  "secret",
  "password",
  "token",
  "accessToken",
  "privateKey",
  "signing_key",
  "signature",
  "cvv",
  "pan",
  "otp",
  "pin",
  "mpin",
]);

function scrubObject(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    out[key] = SENSITIVE_BODY_KEYS.has(key) ? "[Redacted]" : value;
  }
  return out;
}

const SENSITIVE_QUERY_KEYS = new Set([
  "apiKey",
  "api_key",
  "token",
  "access_token",
  "signature",
  "key",
  "secret",
]);

function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url);
    for (const key of u.searchParams.keys()) {
      if (SENSITIVE_QUERY_KEYS.has(key)) {
        u.searchParams.set(key, "[Redacted]");
      }
    }
    return u.toString();
  } catch {
    return url.replaceAll(
      /(?<prefix>[?&](?:apiKey|api_key|token|access_token|signature|key|secret)=)[^&]+/giu,
      "$<prefix>[Redacted]"
    );
  }
}

function sanitizeAxiosConfig(
  config: Record<string, unknown>
): Record<string, unknown> {
  const sanitized = { ...config };

  if (typeof sanitized.url === "string") {
    sanitized.url = sanitizeUrl(sanitized.url);
  }

  if (sanitized.params && typeof sanitized.params === "object") {
    sanitized.params = scrubObject(sanitized.params as Record<string, unknown>);
  }

  if (typeof sanitized.data === "string") {
    try {
      const parsed = JSON.parse(sanitized.data) as Record<string, unknown>;
      sanitized.data = JSON.stringify(scrubObject(parsed));
    } catch {
      sanitized.data = "[Redacted: unparseable body]";
    }
  } else if (sanitized.data && typeof sanitized.data === "object") {
    sanitized.data = scrubObject(sanitized.data as Record<string, unknown>);
  }

  if (sanitized.headers && typeof sanitized.headers === "object") {
    const headers = { ...(sanitized.headers as Record<string, unknown>) };
    for (const h of [
      "authorization",
      "x-api-key",
      "x-auth-token",
      "cookie",
      "x-cg-demo-api-key",
    ]) {
      if (headers[h]) {
        headers[h] = "[Redacted]";
      }
    }
    sanitized.headers = headers;
  }

  return sanitized;
}

function errorSerializer(err: unknown): unknown {
  if (!err || typeof err !== "object") {
    return err;
  }

  const e = err as Record<string, unknown>;
  const isAxios = "config" in e && ("isAxiosError" in e || "code" in e);

  if (!isAxios) {
    return pino.stdSerializers.err(err as Error);
  }

  return {
    message: e.message,
    name: e.name,
    code: e.code,
    stack: e.stack,
    config: e.config
      ? sanitizeAxiosConfig(e.config as Record<string, unknown>)
      : undefined,
    response: e.response
      ? (() => {
          const r = e.response as Record<string, unknown>;
          return {
            status: r.status,
            statusText: r.statusText,
            headers: r.headers,
          };
        })()
      : undefined,
  };
}

const REDACTED_PATHS = [
  "*.password",
  "*.passwordHash",
  "*.hashedPassword",
  "*.currentPassword",
  "*.newPassword",
  "*.token",
  "*.accessToken",
  "*.refreshToken",
  "*.idToken",
  "*.secret",
  "*.apiKey",
  "*.api_key",
  "*.privateKey",
  "*.signing_key",
  "*.cardNumber",
  "*.card_number",
  "*.cvv",
  "*.cvc",
  "*.pan",
  "*.accountNumber",
  "*.bankAccount",
  "*.ifsc",
  "*.upiId",
  "*.upi_id",
  "*.walletPin",
  "*.mpin",
  "*.ssn",
  "*.aadhaar",
  "*.pan_number",
  "*.dob",
  "*.dateOfBirth",
  "*.phone",
  "*.phoneNumber",
  "*.mobile",
  "*.email",
  "*.address",
  "req.headers.authorization",
  "req.headers.cookie",
  "req.headers['x-api-key']",
  "req.headers['x-auth-token']",
  "body.password",
  "body.token",
  "body.otp",
  "body.pin",
  "req.body.password",
  "req.body.token",
  "req.body.otp",
];

export type CreateLoggerOptions = {
  namespace?: string;
};

export function createLogger({
  namespace,
}: CreateLoggerOptions = {}): pino.Logger {
  const targets: pino.TransportTargetOptions[] = [];

  if (isDev) {
    targets.push({
      target: "pino-pretty",
      level: "debug",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    });
  } else {
    targets.push({
      target: "pino-roll",
      level: "info",
      options: {
        file: "logs/app.log",
        frequency: "daily",
        size: "50m",
        extension: ".log",
        dateFormat: "yyyy-MM-dd",
        mkdir: true,
      },
    });
  }

  const baseLogger = pino(
    {
      level: isDev ? "debug" : "info",
      redact: {
        paths: REDACTED_PATHS,
        censor: "[Redacted]",
      },
      serializers: {
        err: errorSerializer,
        req(request: {
          id?: unknown;
          method?: string;
          url?: string;
          ip?: string;
          headers?: Record<string, unknown>;
        }) {
          const headers = request.headers ?? {};
          return {
            id: request.id,
            method: request.method,
            url: request.url,
            remoteAddress: request.ip,
            headers: {
              host: headers.host,
              origin: headers.origin,
              referer: headers.referer,
              "user-agent": headers["user-agent"],
            },
          };
        },
      },
    },
    pino.transport({ targets })
  );

  return namespace ? baseLogger.child({ namespace }) : baseLogger;
}

export type Logger = ReturnType<typeof createLogger>;

export const logger = createLogger();
