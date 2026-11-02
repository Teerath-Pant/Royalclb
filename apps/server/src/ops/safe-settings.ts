import type { Prisma } from "@/lib/prisma";
import { AppError } from "@/utils/app-error";

const SAFE_ID = 1;

export async function getSafeSetting<T extends Prisma.safeSettingsSelect>(
  tx: Prisma.TransactionClient,
  select: T
): Promise<Prisma.safeSettingsGetPayload<{ select: T }>> {
  const settings = await tx.safeSettings.findUnique({
    select,
    where: { id: SAFE_ID },
  });

  if (!settings) {
    throw AppError.internal({ message: "No safe settings found" });
  }

  return settings;
}

export async function setSafeSetting(
  tx: Prisma.TransactionClient,
  data: Prisma.safeSettingsUpdateInput
) {
  return await tx.safeSettings.update({
    data,
    where: { id: SAFE_ID },
  });
}
