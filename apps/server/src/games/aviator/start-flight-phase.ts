import { Decimal } from "decimal.js";

import { aviator_status, prisma } from "@/lib/prisma";
import { getAviatorBucketAmount } from "@/ops/aviator";
import { randomDecimal } from "@/utils/random-decimal";
import { safeDecimal } from "@/utils/safe-decimal";

export async function startFlightPhase(gameId: number) {
  await prisma.aviator.update({
    where: { id: gameId },
    data: { status: aviator_status.FLYING, flyingAt: new Date() },
    select: { id: true },
  });

  return prisma.$transaction(async (tx) => {
    const bucketAmount = await getAviatorBucketAmount(tx);

    const aggregate = await tx.aviatorBet.aggregate({
      where: { gameId },
      _sum: { betAmount: true },
    });

    const totalBet = safeDecimal(aggregate._sum.betAmount);

    let maxPossibleFly: Decimal;

    if (totalBet.equals(0)) {
      maxPossibleFly = randomDecimal(1, 20, true);
    } else {
      const ratio = bucketAmount.dividedBy(totalBet);
      const upperBound = Decimal.max(Decimal.min(ratio, 20), 1);
      maxPossibleFly = randomDecimal(1, upperBound, true);
    }

    maxPossibleFly = maxPossibleFly.toDecimalPlaces(2, Decimal.ROUND_DOWN);

    await tx.aviator.update({
      where: { id: gameId },
      data: {
        maxPossibleFly,
        bucketAmount,
        totalBet,
      },
      select: { id: true },
    });

    return {
      maxPossibleFly,
    };
  });
}
