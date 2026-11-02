import type { Prisma } from "@/lib/prisma";
import { AppError } from "@/utils/app-error";

const ID = 1;

export async function getFundSettings<T extends Prisma.fundSettingsSelect>(
  tx: Prisma.TransactionClient,
  select: T
): Promise<Prisma.fundSettingsGetPayload<{ select: T }>> {
  const settings = await tx.fundSettings.findUnique({
    select,
    where: { id: ID },
  });

  if (!settings) {
    throw AppError.internal({ message: "No fund settings found" });
  }

  return settings;
}

export async function setFundSettings(
  tx: Prisma.TransactionClient,
  data: Prisma.fundSettingsUpdateInput
) {
  return await tx.fundSettings.update({
    data,
    where: { id: ID },
  });
}
