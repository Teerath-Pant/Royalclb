export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

type Init = { method?: string; body?: unknown };

async function request(path: string, init: Init = {}) {
  const hasBody = init.body !== undefined;
  const res = await fetch(`/api${path}`, {
    method: init.method ?? "GET",
    credentials: "include",
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(init.body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const fieldErrors = json?.errors
      ? Object.values(json.errors).join("\n")
      : null;
    throw new ApiError(
      fieldErrors || json?.message || "Something went wrong",
      res.status
    );
  }
  return json as { message: string; data: unknown };
}

/** Reads from the Fastify API and unwraps `data`. */
export async function api<T>(path: string, init?: Init): Promise<T> {
  const { data } = await request(path, init);
  return data as T;
}

/** Writes to the Fastify API; the query client toasts the returned `message`. */
export function apiPost(path: string, body?: unknown, method = "POST") {
  return request(path, { method, body });
}
