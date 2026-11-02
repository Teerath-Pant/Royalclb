import * as v from "valibot";

import type { PrismaClient } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { withColumnScale } from "@/utils/decimal-scale";
import { pageQuery, paged } from "@/utils/page-query";
import { requireUser } from "@/utils/require-user";

type IncomeConfig = {
  model: keyof PrismaClient;
  /** Column holding the owner's member ID. */
  owner: string;
  orderBy: string;
  select: string[];
  where?: Record<string, unknown>;
  /** Column holding the member who generated this income, returned as `from`. */
  from?: string;
};

const bonusSelect = ["recharge_amount", "bonus_percent", "bonus", "date_time"];
const depositSelect = ["deposit_number", "deposit_amount", "income", "date_time"];

// One entry per legacy PHP income page; `where` mirrors that page's SQL.
const INCOME_TYPES = {
  "daily-rebate": {
    model: "meddolic_user_rebate_income",
    owner: "member_id",
    orderBy: "date_time",
    select: ["total_bet", "rebate_percent", "rebate_income", "date_time"],
  },
  "daily-recharge": {
    model: "meddolic_user_daily_recharge_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: ["total_recharge", "bonus", "date_time"],
    where: { status: 1 },
  },
  "daily-fund-roi": {
    model: "dailyFundRoi",
    owner: "userId",
    orderBy: "createdAt",
    select: ["totalWallet", "roiPercent", "roi", "createdAt"],
  },
  "deposit-bonus": {
    model: "meddolic_user_deposit_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: depositSelect,
    from: "income_from",
  },
  "deposit-bonus-1-2": {
    model: "meddolic_user_deposit_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: depositSelect,
    where: { deposit_number: { in: [1, 2] } },
    from: "income_from",
  },
  "deposit-bonus-3-4-5": {
    model: "meddolic_user_deposit_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: depositSelect,
    where: { deposit_number: { in: [3, 4, 5] } },
    from: "income_from",
  },
  "usd-deposit-bonus": {
    model: "usdDepositBonus",
    owner: "userId",
    orderBy: "createdAt",
    select: ["depositAmount", "bonus", "createdAt"],
  },
  level: {
    model: "meddolic_user_trade_commission",
    owner: "member_id",
    orderBy: "date_time",
    select: ["level", "bet_amount", "commission_percent", "commission", "date_time"],
    where: { status: 1 },
    from: "child_id",
  },
  referral: {
    model: "meddolic_user_referral_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: bonusSelect,
    where: { status: 1 },
    from: "income_from",
  },
  "referral-level": {
    model: "meddolic_user_level_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: ["level", ...bonusSelect],
    where: { status: 1 },
    from: "child_id",
  },
  rescue: {
    model: "meddolic_user_rescue_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: ["total_loss", "bonus", "date_time"],
    where: { status: 1 },
  },
  salary: {
    model: "meddolic_user_salary_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: ["salary", "release_date"],
    where: { release_status: 1 },
  },
  "winning-streak": {
    model: "meddolic_user_winning_streak_bonus",
    owner: "member_id",
    orderBy: "date_time",
    select: ["streak", "bonus", "date_time"],
    where: { status: 1 },
  },
} as const satisfies Record<string, IncomeConfig>;

type IncomeDelegate = {
  count(args: { where: object }): Promise<number>;
  findMany(args: object): Promise<Record<string, unknown>[]>;
};

export const listIncome = createFastifyHandler({
  method: "GET",
  path: "/:type",
  options: { auth: "user" },
  params: v.object({
    type: v.picklist(
      Object.keys(INCOME_TYPES) as (keyof typeof INCOME_TYPES)[],
      "Unknown income type"
    ),
  }),
  searchParams: v.object(pageQuery),

  async handler({ reply, params, searchParams, ctx }) {
    requireUser(ctx);
    const { page, limit } = searchParams;
    const config: IncomeConfig = INCOME_TYPES[params.type];

    // The models differ per type, but the config above is the only input here.
    const delegate = ctx.db[config.model] as unknown as IncomeDelegate;
    const where = { ...config.where, [config.owner]: ctx.user.member_id };
    const select = Object.fromEntries(
      [...config.select, "id", ...(config.from ? [config.from] : [])].map(
        (column) => [column, true]
      )
    );

    const [total, rows] = await Promise.all([
      delegate.count({ where }),
      delegate.findMany({
        where,
        select,
        orderBy: { [config.orderBy]: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const fromKey = config.from;
    const fromUsers = fromKey
      ? await ctx.db.meddolic_user_details.findMany({
          where: {
            member_id: { in: [...new Set(rows.map((r) => r[fromKey] as number))] },
          },
          select: { member_id: true, uid: true, name: true, user_id: true },
        })
      : [];
    const fromById = new Map(fromUsers.map((u) => [u.member_id, u]));

    const data = rows.map((raw) => {
      const row = withColumnScale(config.model as string, raw);
      if (!fromKey) {
        return row;
      }
      const { [fromKey]: fromId, ...rest } = row;
      const from = fromById.get(fromId as number);
      return {
        ...rest,
        fromId,
        from: from ? { uid: from.uid, name: from.name, userId: from.user_id } : null,
      };
    });

    return AppResponse.success(reply, {
      message: "Income history fetched successfully",
      data: paged(data, total, page, limit),
    });
  },
});
