import type dayjs from "dayjs";

import type { Prisma } from "@/lib/prisma";
import { settingsService } from "@/services/settings.service";
import { walletService } from "@/services/wallet.service";

type ReleaseParams = {
  userId: number;
  dt: dayjs.Dayjs;
};

export const RegistrationBonus = {
  async release(db: Prisma.TransactionClient, { userId, dt }: ReleaseParams) {
    const { registration_bonus } = await settingsService.get(
      { registration_bonus: true },
      db
    );

    const entry = await db.meddolic_user_registration_bonus.create({
      data: {
        member_id: userId,
        bonus: registration_bonus,
        date_time: dt.toISOString(),
      },
    });

    await walletService.entry2({
      tx: db,
      user_id: userId,
      txn_id: entry.id,
      amount: entry.bonus,
      note: "Registration Bonus",
      type: "CREDIT",
      wallet_type: "BONUS_WALLET",
      dt,
    });
  },
};
