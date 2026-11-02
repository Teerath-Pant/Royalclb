import type { Prisma } from "@/lib/prisma";
import { safeDecimal } from "@/utils/safe-decimal";

import { getTotalBet } from "./bet";

export async function getTotalSafeWithdraw(
  tx: Prisma.TransactionClient,
  userId: number
) {
  const aggregate = await tx.safeTransactions.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId,
      type: "withdraw",
    },
  });

  return safeDecimal(aggregate._sum.amount);
}

export async function checkSafeWithdrawEligibility(
  tx: Prisma.TransactionClient,
  userId: number,
  amount: Prisma.Decimal
): Promise<boolean> {
  const [totalBet, totalWithdraw] = await Promise.all([
    getTotalBet(tx, { userId }),
    getTotalSafeWithdraw(tx, userId),
  ]);

  const leftBet = totalBet.minus(totalWithdraw.times(2));

  if (leftBet.lt(amount)) {
    return false;
  }

  return true;
}
