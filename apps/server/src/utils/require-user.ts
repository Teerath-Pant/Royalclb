import type { meddolic_user_details as User } from "@/lib/prisma";

import { AppError } from "./app-error";

export function requireUser<C extends { user: User | null }>(
  ctx: C
): asserts ctx is C & { user: User } {
  if (!ctx.user) {
    throw AppError.unauthorized();
  }
}
