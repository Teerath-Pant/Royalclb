import type dayjs from "dayjs";
import type { Decimal } from "decimal.js";

import type { PrismaClient } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";

const MIN_BALANCE_REQUIRED = 1000;
const ROI_PERCENT = 0.16;

type ReleaseParams = {
  userId: number;
  fundWallet: Decimal;
  wallet: Decimal;
  bonusWallet: Decimal;
  dt: dayjs.Dayjs;
};

export const DailyFundRoi = {
  async release(
    db: PrismaClient,
    { userId, fundWallet, wallet, bonusWallet, dt }: ReleaseParams
  ) {
    const totalWallet = fundWallet.plus(wallet).plus(bonusWallet);

    if (totalWallet.lt(MIN_BALANCE_REQUIRED)) {
      return;
    }

    const roi = totalWallet.mul(ROI_PERCENT).div(100);

    const entry = await db.dailyFundRoi.create({
      data: {
        userId,
        totalWallet,
        roiPercent: ROI_PERCENT,
        roi,
        createdAt: dt.toDate(),
      },
    });

    await walletService.entry2({
      tx: db,
      user_id: userId,
      txn_id: entry.id,
      amount: entry.roi,
      note: "Daily Fund Roi",
      type: "CREDIT",
      wallet_type: "BONUS_WALLET",
      dt,
    });
  },
};
