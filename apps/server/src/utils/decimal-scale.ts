import { Prisma } from "@/lib/prisma";

/** Decimal(precision, scale) of the columns the legacy pages show; generated from prisma/schema.prisma. */
const SCALES: Record<string, Record<string, number>> = {
  "meddolic_user_rebate_income": {
    "total_bet": 2,
    "rebate_percent": 2,
    "rebate_income": 2
  },
  "meddolic_user_daily_recharge_bonus": {
    "total_recharge": 2,
    "bonus": 2
  },
  "dailyFundRoi": {
    "totalWallet": 2,
    "roiPercent": 2,
    "roi": 2
  },
  "meddolic_user_deposit_bonus": {
    "deposit_amount": 2,
    "income": 2
  },
  "usdDepositBonus": {
    "depositAmount": 2,
    "bonus": 2
  },
  "meddolic_user_trade_commission": {
    "bet_amount": 2,
    "commission_percent": 2,
    "commission": 4
  },
  "meddolic_user_level_bonus": {
    "recharge_amount": 2,
    "bonus_percent": 2,
    "bonus": 2
  },
  "meddolic_user_referral_bonus": {
    "recharge_amount": 2,
    "bonus_percent": 2,
    "bonus": 2
  },
  "meddolic_user_rescue_bonus": {
    "total_loss": 2,
    "bonus": 2
  },
  "meddolic_user_salary_bonus": {
    "salary": 2
  },
  "meddolic_user_winning_streak_bonus": {
    "bonus": 2
  },
  "wallet_statements": {
    "amount": 4
  },
  "meddolic_user_attendence_bonus": {
    "bonus": 2
  },
  "meddolic_config_attendence_bonus": {
    "bet_need": 2,
    "bonus": 2
  }
};

/**
 * Decimal columns written back with the scale the database stores them at ("10.00", not "10"),
 * which is how the PHP pages printed them.
 */
export function withColumnScale<T extends Record<string, unknown>>(model: string, row: T): T {
  const scales = SCALES[model] ?? {};
  const out: Record<string, unknown> = { ...row };
  for (const [field, scale] of Object.entries(scales)) {
    const value = out[field];
    if (Prisma.Decimal.isDecimal(value)) {
      out[field] = (value as Prisma.Decimal).toFixed(scale);
    }
  }
  return out as T;
}
