import type dayjs from "dayjs";
import type { Decimal } from "decimal.js";

import type { Prisma } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { createWalletEntry } from "@/ops/wallet";

type ReleaseParams = {
  userId: number;
  usdtDepositAmount: Decimal;
  dt: dayjs.Dayjs;
};

const CONFIG = [
  { min: 10, max: 6999, bonus: 0.03 },
  { min: 7000, max: Number.POSITIVE_INFINITY, bonus: 0.08 },
];

function getConfig({ usdtDepositAmount }: { usdtDepositAmount: Decimal }) {
  const target = CONFIG.find(
    (item) => usdtDepositAmount.gte(item.min) && usdtDepositAmount.lte(item.max)
  );

  if (target === undefined) {
    return null;
  }

  return target;
}

export const UsdDepositBonus = {
  async release(
    tx: Prisma.TransactionClient,
    { userId, usdtDepositAmount, dt }: ReleaseParams
  ) {
    const [config, { usdToInrRate }] = await Promise.all([
      getConfig({ usdtDepositAmount }),
      getFundSettings(tx, { usdToInrRate: true }),
    ]);

    if (config === null) {
      return;
    }

    const bonus = usdtDepositAmount.mul(config.bonus).mul(usdToInrRate);

    const entry = await tx.usdDepositBonus.create({
      data: {
        userId,
        depositAmount: usdtDepositAmount,
        bonus,
        createdAt: dt.toISOString(),
      },
    });

    await createWalletEntry(tx, {
      userId,
      refId: entry.id,
      amount: entry.bonus,
      note: "USDT Deposit Bonus",
      type: "CREDIT",
      wallet: "BONUS_WALLET",
      dt,
    });
  },
};
