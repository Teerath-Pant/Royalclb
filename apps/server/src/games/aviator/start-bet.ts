import { aviator_status, prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";
import { safeDecimal } from "@/utils/safe-decimal";

export function startBet() {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.aviator.findFirst({
      where: { status: aviator_status.BETTING },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return existing;
    }

    return tx.aviator.create({
      data: {
        maxFly: safeDecimal(0),
        maxPossibleFly: safeDecimal(0),
        bucketAmount: safeDecimal(0),
        totalBet: safeDecimal(0),
        status: aviator_status.BETTING,
        createdAt: Now().toISOString(),
      },
    });
  });
}
