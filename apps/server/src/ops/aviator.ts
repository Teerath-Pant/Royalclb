import type { Decimal } from "decimal.js";

import type { Prisma } from "@/lib/prisma";
import { safeDecimal } from "@/utils/safe-decimal";

export async function getAviatorSettings(tx: Prisma.TransactionClient) {
  const settings = await tx.aviatorSettings.findFirst();

  if (!settings) {
    return await tx.aviatorSettings.create({
      data: {
        bucket: safeDecimal(0),
      },
    });
  }

  return settings;
}

type SetParams = {
  data: Prisma.aviatorSettingsUpdateInput;
};

export async function setAviatorSettings(
  tx: Prisma.TransactionClient,
  params: SetParams
) {
  const settings = await tx.aviatorSettings.updateMany({
    data: params.data,
  });

  return settings;
}

export async function getAviatorBucketAmount(tx: Prisma.TransactionClient) {
  const { bucket } = await getAviatorSettings(tx);
  return bucket;
}

export async function updateAviatorBucketAmount(
  tx: Prisma.TransactionClient,
  amount: string | number | Decimal
) {
  return await setAviatorSettings(tx, {
    data: { bucket: safeDecimal(amount) },
  });
}

export async function incrementAviatorBucketAmount(
  tx: Prisma.TransactionClient,
  amount: string | number | Decimal
) {
  return await setAviatorSettings(tx, {
    data: { bucket: { increment: amount } },
  });
}

export async function decrementAviatorBucketAmount(
  tx: Prisma.TransactionClient,
  amount: string | number | Decimal
) {
  return await setAviatorSettings(tx, {
    data: { bucket: { decrement: amount } },
  });
}
