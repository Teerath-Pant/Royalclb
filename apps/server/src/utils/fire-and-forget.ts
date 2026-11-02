import { logger } from "@/lib/logger";

export async function fireAndForget(
  fn: () => Promise<unknown>,
  onError?: (err: unknown) => void
) {
  try {
    await fn();
  } catch (error) {
    logger.error(
      { error, fnName: fn.name || "anonymous" },
      "fireAndForget error"
    );
    onError?.(error);
  }
}
