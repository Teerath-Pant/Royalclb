import type dayjs from "dayjs";
import type Decimal from "decimal.js";

import type { Prisma } from "@/lib/prisma";
import { getSafeSetting } from "@/ops/safe-settings";
import { createWalletEntry } from "@/ops/wallet";

type ReleaseParams = {
  userId: number;
  safeWallet: Decimal;
  dt: dayjs.Dayjs;
};

export const SafeDeposit = {
  async release(
    db: Prisma.TransactionClient,
    { userId, safeWallet, dt }: ReleaseParams
  ) {
    const { interestRate } = await getSafeSetting(db, { interestRate: true });

    const interest = safeWallet.mul(interestRate).div(100);

    if (interest.lte(0)) {
      return;
    }

    await db.$transaction(async (tx) => {
      const entry = await tx.safeInterestLogs.create({
        data: {
          userId,
          amount: interest,
          walletBalanceAtTime: safeWallet,
          date: dt.toDate(),
          createdAt: dt.toDate(),
        },
      });

      await createWalletEntry(tx, {
        userId,
        refId: entry.id,
        amount: entry.amount,
        note: "Safe deposit interest",
        type: "CREDIT",
        wallet: "SAFE_INTEREST_WALLET",
        dt,
      });
    });
  },
};
