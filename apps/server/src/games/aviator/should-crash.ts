import type { Decimal } from "decimal.js";

import { aviatorBet_status, prisma } from "@/lib/prisma";
import { getAviatorBucketAmount } from "@/ops/aviator";
import { safeDecimal } from "@/utils/safe-decimal";

export async function shouldCrash(gameId: number, currentMultiplier: Decimal) {
  const [bucketAmount, aggregate] = await Promise.all([
    getAviatorBucketAmount(prisma),
    prisma.aviatorBet.aggregate({
      where: { gameId, status: aviatorBet_status.PENDING },
      _max: { betAmount: true },
    }),
  ]);

  const maxBetAmount = safeDecimal(aggregate._max.betAmount);
  const maxPossibleCashout = maxBetAmount.mul(currentMultiplier);

  return maxPossibleCashout.gt(bucketAmount);
}
