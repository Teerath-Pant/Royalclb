import type { Decimal } from "decimal.js";

import { getFundSettings } from "@/ops/fund-settings";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { istDayRange } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const getWalletSummary = createFastifyHandler({
  method: "GET",
  path: "/wallet-summary",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const { db } = ctx;
    const member_id = ctx.user.member_id;
    const today = { date_time: istDayRange() };

    const [
      deposit,
      withdrawal,
      regToday,
      regTotal,
      selfToday,
      selfTotal,
      tradeToday,
      tradeTotal,
      salaryToday,
      salaryTotal,
      depBonus12,
      depBonus345,
      dailyDep,
      attendance,
      attendanceConfig,
      rebate,
      usdDeposit,
    ] = await Promise.all([
      db.recharges.aggregate({ where: { userId: member_id, status: "APPROVED" }, _sum: { amount: true } }),
      db.withdrawalRequests.aggregate({ where: { userId: member_id, status: "APPROVED" }, _sum: { amount: true } }),
      db.meddolic_user_registration_bonus.aggregate({ where: { member_id, status: 1, ...today }, _sum: { bonus: true } }),
      db.meddolic_user_registration_bonus.aggregate({ where: { member_id, status: 1 }, _sum: { bonus: true } }),
      db.meddolic_user_self_deposit_bonus.aggregate({ where: { member_id, status: 1, ...today }, _sum: { income: true } }),
      db.meddolic_user_self_deposit_bonus.aggregate({ where: { member_id, status: 1 }, _sum: { income: true } }),
      db.meddolic_user_trade_commission.aggregate({ where: { member_id, status: 1, ...today }, _sum: { commission: true } }),
      db.meddolic_user_trade_commission.aggregate({ where: { member_id, status: 1 }, _sum: { commission: true } }),
      db.meddolic_user_salary_bonus.aggregate({ where: { member_id, release_status: 1, ...today }, _sum: { salary: true } }),
      db.meddolic_user_salary_bonus.aggregate({ where: { member_id, release_status: 1 }, _sum: { salary: true } }),
      db.meddolic_user_deposit_bonus.aggregate({ where: { member_id, deposit_number: { in: [1, 2] } }, _sum: { income: true } }),
      db.meddolic_user_deposit_bonus.aggregate({ where: { member_id, deposit_number: { in: [3, 4, 5] } }, _sum: { income: true } }),
      db.meddolic_user_daily_recharge_bonus.aggregate({ where: { member_id, status: 1 }, _sum: { bonus: true } }),
      db.meddolic_user_attendence_bonus.findMany({ where: { member_id }, select: { day: true } }),
      db.meddolic_config_attendence_bonus.findMany({ select: { day: true, bonus: true } }),
      db.meddolic_user_rebate_income.aggregate({ where: { member_id }, _sum: { rebate_income: true } }),
      db.usdDepositBonus.aggregate({ where: { userId: member_id }, _sum: { bonus: true } }),
    ]);

    // Same as the old join: each claimed day is paired with every config row for that day.
    const bonusByDay = new Map<number, Decimal>();
    for (const { day, bonus } of attendanceConfig) {
      bonusByDay.set(day, (bonusByDay.get(day) ?? safeDecimal(0)).plus(bonus));
    }
    const attendanceBonus = attendance.reduce(
      (total, { day }) => total.plus(bonusByDay.get(day) ?? 0),
      safeDecimal(0)
    );

    const todayIncome = safeDecimal(regToday._sum.bonus)
      .plus(safeDecimal(selfToday._sum.income))
      .plus(safeDecimal(tradeToday._sum.commission))
      .plus(safeDecimal(salaryToday._sum.salary));
    const totalIncome = safeDecimal(regTotal._sum.bonus)
      .plus(safeDecimal(selfTotal._sum.income))
      .plus(safeDecimal(tradeTotal._sum.commission))
      .plus(safeDecimal(salaryTotal._sum.salary));

    const { bonusWallet, fundWallet, wallet } = ctx.user;

    return AppResponse.success(reply, {
      message: "Wallet summary fetched successfully",
      data: {
        depositAmount: safeDecimal(deposit._sum.amount).toNumber(),
        totalWithdrawal: safeDecimal(withdrawal._sum.amount).toNumber(),
        todayIncome: todayIncome.toNumber(),
        totalIncome: totalIncome.toNumber(),
        depBonus12: safeDecimal(depBonus12._sum.income).toNumber(),
        depBonus345: safeDecimal(depBonus345._sum.income).toNumber(),
        dailyDepBonus: safeDecimal(dailyDep._sum.bonus).toNumber(),
        attendanceBonus: attendanceBonus.toNumber(),
        betCommission: safeDecimal(tradeTotal._sum.commission).toNumber(),
        rebateIncome: safeDecimal(rebate._sum.rebate_income).toNumber(),
        usdDepositBonus: safeDecimal(usdDeposit._sum.bonus).toNumber(),
        totalWallet: bonusWallet.plus(fundWallet).plus(wallet).toFixed(2),
      },
    });
  },
});

export const getPromotion = createFastifyHandler({
  method: "GET",
  path: "/promotion",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const { db } = ctx;
    const member_id = ctx.user.member_id;

    const [totalSponser, totalTeam, team, directDeposit, yesterday] = await Promise.all([
      db.meddolic_user_details.count({ where: { sponser_id: member_id } }),
      db.meddolic_user_child_ids.count({ where: { member_id, level: { gte: 1, lte: 9 } } }),
      db.meddolic_user_child_ids.findMany({ where: { member_id }, select: { child_id: true } }),
      db.recharges.aggregate({
        where: { status: "APPROVED", meddolic_user_details: { sponser_id: member_id } },
        _sum: { amount: true },
      }),
      db.meddolic_user_trade_commission.aggregate({
        where: { member_id, status: 1, date_time: istDayRange(-1) },
        _sum: { commission: true },
      }),
    ]);

    const teamDeposit = await db.recharges.aggregate({
      where: { status: "APPROVED", userId: { in: team.map((t) => t.child_id) } },
      _sum: { amount: true },
    });

    return AppResponse.success(reply, {
      message: "Promotion stats fetched successfully",
      data: {
        totalSponser,
        totalTeam,
        totalDirectDeposit: safeDecimal(directDeposit._sum.amount).toNumber(),
        totalTeamDeposit: safeDecimal(teamDeposit._sum.amount).toNumber(),
        yesterdayCommission: safeDecimal(yesterday._sum.commission).toNumber(),
        referralCode: ctx.user.user_id,
      },
    });
  },
});

export const getFirstDepositBonus = createFastifyHandler({
  method: "GET",
  path: "/first-deposit-bonus",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const [tiers, first, { usdToInrRate }] = await Promise.all([
      ctx.db.meddolic_config_first_recharge_bonus.findMany({
        select: { recharge_amount: true, member_bonus: true },
        orderBy: { recharge_amount: "desc" },
      }),
      ctx.db.recharges.findFirst({
        where: { userId: ctx.user.member_id, status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        select: { amount: true },
      }),
      getFundSettings(ctx.db, { usdToInrRate: true }),
    ]);

    const rate = usdToInrRate.gt(0) ? usdToInrRate.toNumber() : 1;
    const firstDeposit = first?.amount.toNumber() ?? 0;
    // Tiers are sorted high to low, so the first one the deposit reaches is the one earned.
    const earned = tiers.find((t) => t.recharge_amount.toNumber() <= firstDeposit);

    return AppResponse.success(reply, {
      message: "First deposit bonus fetched successfully",
      data: {
        usdToInrRate: rate,
        eligibleFirstDeposit: earned?.recharge_amount.toNumber() ?? 0,
        tiers: tiers.map((tier) => ({
          deposit: tier.recharge_amount.toNumber() / rate,
          bonus: tier.member_bonus.toNumber() / rate,
          deposit_raw: tier.recharge_amount.toNumber(),
          bonus_raw: tier.member_bonus.toNumber(),
          is_eligible: tier === earned,
        })),
      },
    });
  },
});

export const getHome = createFastifyHandler({
  method: "GET",
  path: "/home",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const [banners, news, link, misc, approvedRechargeCount, { usdToInrRate }] = await Promise.all([
      ctx.db.meddolic_config_banner_details.findMany({
        where: { status: 1 },
        select: { payment_id: true, paymentImage: true },
        orderBy: { payment_id: "desc" },
      }),
      ctx.db.meddolic_config_news_list.findFirst({
        where: { newStatus: 1 },
        select: { news: true },
      }),
      ctx.db.links.findUnique({ where: { id: 1 }, select: { link: true } }),
      ctx.db.meddolic_config_misc_setting.findFirst({
        select: { dashboardImage: true, imageStatus: true },
      }),
      ctx.db.recharges.count({
        where: { userId: ctx.user.member_id, status: "APPROVED" },
      }),
      getFundSettings(ctx.db, { usdToInrRate: true }),
    ]);

    return AppResponse.success(reply, {
      message: "Home data fetched successfully",
      data: {
        banners: banners.map((b) => ({ id: b.payment_id, image: b.paymentImage })),
        news: news?.news ?? null,
        miscConfig: misc,
        approvedRechargeCount,
        usdToInrRate: usdToInrRate.gt(0) ? usdToInrRate.toNumber() : 90,
        telegramLink: link?.link || "https://t.me/",
      },
    });
  },
});
