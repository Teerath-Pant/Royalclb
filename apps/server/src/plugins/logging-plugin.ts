import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyRequest {
    _logStart: number;
  }
}

// Routes to exclude from HTTP request logs (avoids log spam from scrapers & health checks)
const EXCLUDED_LOG_ROUTES = new Set(["/metrics", "/health"]);

function plugin(app: FastifyInstance) {
  // Decorate each request with high-res log start timestamp
  app.decorateRequest("_logStart", 0);

  app.addHook("onRequest", (req, _reply, done) => {
    req._logStart = performance.now();
    done();
  });

  app.addHook("onResponse", (req, reply, done) => {
    const defaultRoute = req.routeOptions?.url ?? "unknown";

    // Normalize tRPC procedure routes for log output
    const [pathname] = req.url.split("?");
    const route =
      pathname &&
      (pathname.startsWith("/trpc") ||
        pathname.includes("/trpc/") ||
        defaultRoute.includes("/trpc"))
        ? pathname
        : defaultRoute;

    // Skip logging excluded endpoints (/health, /metrics)
    if (
      EXCLUDED_LOG_ROUTES.has(route) ||
      (Boolean(pathname) && EXCLUDED_LOG_ROUTES.has(pathname as string))
    ) {
      done();
      return;
    }

    const responseTimeMs = Math.round(performance.now() - req._logStart);
    const { statusCode } = reply;
    const { method, url, ip, id: reqId, user } = req;
    const userAgent = req.headers["user-agent"];

    const userId = user?.member_id;

    const logPayload = {
      reqId,
      method,
      url,
      route,
      statusCode,
      responseTimeMs,
      ip,
      ...(userId && userId !== -1 ? { userId } : {}),
      ...(userAgent ? { userAgent } : {}),
    };

    const logMsg = `HTTP ${method} ${route} -> ${statusCode} (${responseTimeMs}ms)`;

    if (statusCode >= 500) {
      req.log.error(logPayload, logMsg);
    } else if (statusCode >= 400) {
      req.log.warn(logPayload, logMsg);
    } else {
      req.log.info(logPayload, logMsg);
    }

    done();
  });
}

export const loggingPlugin = fp(plugin, {
  name: "logging-plugin",
  fastify: "5.x",
});
