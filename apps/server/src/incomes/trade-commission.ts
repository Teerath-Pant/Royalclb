import type dayjs from "dayjs";
import type { Decimal } from "decimal.js";

import type {
  Prisma,
  meddolic_config_trade_commission,
  PrismaClient,
} from "@/lib/prisma";
import { fundService } from "@/services/fund.service";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

type CreateParams = {
  userId: number;
  betAmount: Decimal;
  dt: dayjs.Dayjs;
};

let configCache: Map<number, meddolic_config_trade_commission> | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;
const MIN_RECHARGE_NEED = 500;

async function getConfigMap(db: Prisma.TransactionClient) {
  if (configCache && Date.now() - cacheTime < CACHE_TTL) {
    return configCache;
  }
  const configs = await db.meddolic_config_trade_commission.findMany();
  configCache = new Map(configs.map((c) => [c.level, c]));
  cacheTime = Date.now();
  return configCache;
}

export const TradeCommission = {
  async create(
    db: Prisma.TransactionClient,
    { userId, betAmount, dt }: CreateParams
  ) {
    const configMap = await getConfigMap(db);
    const maxLevel = Math.max(0, ...configMap.keys());

    const inviters = await db.meddolic_user_child_ids.findMany({
      where: {
        child_id: userId,
        level: { lte: maxLevel },
      },
      select: { member_id: true, level: true },
      orderBy: { member_id: "asc" },
    });

    const data: {
      member_id: number;
      child_id: number;
      level: number;
      bet_amount: Decimal;
      commission_percent: Decimal;
      commission: Decimal;
      date_time: Date;
      status: number;
    }[] = [];

    for (const inviter of inviters) {
      const config = configMap.get(inviter.level);
      if (!config) {
        continue;
      }

      const totalRecharge = await fundService.totalRecharge(db, {
        userId: inviter.member_id,
      });

      if (totalRecharge.lt(MIN_RECHARGE_NEED)) {
        continue;
      }

      const commissionPercent = config.commission_percent;
      const commission = betAmount.mul(commissionPercent).div(100);

      data.push({
        member_id: inviter.member_id,
        child_id: userId,
        level: config.level,
        bet_amount: betAmount,
        commission_percent: commissionPercent,
        commission,
        date_time: dt.toDate(),
        status: 0,
      });
    }

    if (data.length) {
      data.sort((a, b) =>
        a.member_id > b.member_id ? 1 : a.member_id < b.member_id ? -1 : 0
      );
      await db.meddolic_user_trade_commission.createMany({ data });
    }
  },

  async release(db: PrismaClient) {
    const dt = Now();

    const commissions = await db.meddolic_user_trade_commission.findMany({
      select: {
        id: true,
        member_id: true,
        commission: true,
      },
      where: {
        status: 0,
      },
    });

    for (const commission of commissions) {
      await db.$transaction(async (tx) => {
        await tx.meddolic_user_trade_commission.update({
          where: { id: commission.id },
          data: { status: 1 },
        });

        await walletService.entry2({
          tx,
          user_id: commission.member_id,
          txn_id: commission.id,
          amount: commission.commission,
          note: "Bet Commission",
          type: "CREDIT",
          wallet_type: "WALLET",
          dt,
        });
      });
    }
  },
};
