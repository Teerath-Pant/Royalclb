import type { Prisma } from "@/lib/prisma";
import { safeDecimal } from "@/utils/safe-decimal";

import { fundService } from "../services/fund.service";
import { getTotalBet } from "./bet";

export async function getNeedToTrade(
  tx: Prisma.TransactionClient,
  userId: number
) {
  const userDetail = await tx.meddolic_user_details.findUnique({
    where: { member_id: userId },
    select: {
      bonusWallet: true,
      fundWallet: true,
    },
  });

  const bonusWallet = safeDecimal(userDetail?.bonusWallet);
  const fundWallet = safeDecimal(userDetail?.fundWallet);

  return bonusWallet.plus(fundWallet);
}

export async function getDepositNeedToTrade(
  tx: Prisma.TransactionClient,
  userId: number
) {
  const [totalDeposit, totalBet] = await Promise.all([
    fundService.totalRecharge(tx, { userId }),
    getTotalBet(tx, { userId }),
  ]);
  const requiredBet = totalDeposit.times(2);
  const remainingBet = requiredBet.minus(totalBet);

  console.log("totalDeposit", totalDeposit.toNumber());
  console.log("totalBet", totalBet.toNumber());
  console.log("remainingBet", remainingBet.toNumber());
  console.log("requiredBet", requiredBet.toNumber());

  return remainingBet.gt(0) ? remainingBet : safeDecimal(0);
}
