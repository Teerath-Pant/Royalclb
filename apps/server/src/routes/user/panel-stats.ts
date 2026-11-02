import { getFundSettings } from "@/ops/fund-settings";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

/** Raw SUM()/COUNT() columns come back as Decimal or BigInt, which JSON can't all carry. */
function toNumbers(row: Record<string, unknown> | undefined) {
  return Object.fromEntries(
    Object.entries(row ?? {}).map(([key, value]) => [key, Number(value)])
  );
}

export const getWalletSummary = createFastifyHandler({
  method: "GET",
  path: "/wallet-summary",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const id = ctx.user.member_id;

    const [row] = await ctx.db.$queryRaw<Record<string, unknown>[]>`
      SELECT
        COALESCE((SELECT SUM(amount) FROM recharges WHERE userId = ${id} AND status = 'APPROVED'), 0) AS depositAmount,
        COALESCE((SELECT SUM(amount) FROM withdrawalRequests WHERE userId = ${id} AND status = 'APPROVED'), 0) AS totalWithdrawal,
        COALESCE((SELECT SUM(bonus) FROM meddolic_user_registration_bonus WHERE member_id = ${id} AND DATE(date_time) = CURDATE() AND status = 1), 0)
          + COALESCE((SELECT SUM(income) FROM meddolic_user_self_deposit_bonus WHERE member_id = ${id} AND DATE(date_time) = CURDATE() AND status = 1), 0)
          + COALESCE((SELECT SUM(commission) FROM meddolic_user_trade_commission WHERE member_id = ${id} AND DATE(date_time) = CURDATE() AND status = 1), 0)
          + COALESCE((SELECT SUM(salary) FROM meddolic_user_salary_bonus WHERE member_id = ${id} AND DATE(date_time) = CURDATE() AND release_status = 1), 0) AS todayIncome,
        COALESCE((SELECT SUM(bonus) FROM meddolic_user_registration_bonus WHERE member_id = ${id} AND status = 1), 0)
          + COALESCE((SELECT SUM(income) FROM meddolic_user_self_deposit_bonus WHERE member_id = ${id} AND status = 1), 0)
          + COALESCE((SELECT SUM(commission) FROM meddolic_user_trade_commission WHERE member_id = ${id} AND status = 1), 0)
          + COALESCE((SELECT SUM(salary) FROM meddolic_user_salary_bonus WHERE member_id = ${id} AND release_status = 1), 0) AS totalIncome,
        COALESCE((SELECT SUM(income) FROM meddolic_user_deposit_bonus WHERE member_id = ${id} AND deposit_number IN (1, 2)), 0) AS depBonus12,
        COALESCE((SELECT SUM(income) FROM meddolic_user_deposit_bonus WHERE member_id = ${id} AND deposit_number IN (3, 4, 5)), 0) AS depBonus345,
        COALESCE((SELECT SUM(bonus) FROM meddolic_user_daily_recharge_bonus WHERE member_id = ${id} AND status = 1), 0) AS dailyDepBonus,
        COALESCE((SELECT SUM(b.bonus) FROM meddolic_user_attendence_bonus a JOIN meddolic_config_attendence_bonus b ON a.day = b.day WHERE a.member_id = ${id}), 0) AS attendanceBonus,
        COALESCE((SELECT SUM(commission) FROM meddolic_user_trade_commission WHERE member_id = ${id} AND status = 1), 0) AS betCommission,
        COALESCE((SELECT SUM(rebate_income) FROM meddolic_user_rebate_income WHERE member_id = ${id}), 0) AS rebateIncome,
        COALESCE((SELECT SUM(bonus) FROM usdDepositBonus WHERE userId = ${id}), 0) AS usdDepositBonus
    `;

    const { bonusWallet, fundWallet, wallet } = ctx.user;

    return AppResponse.success(reply, {
      message: "Wallet summary fetched successfully",
      data: {
        ...toNumbers(row),
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
    const id = ctx.user.member_id;

    const [row] = await ctx.db.$queryRaw<Record<string, unknown>[]>`
      SELECT
        (SELECT COUNT(1) FROM meddolic_user_details WHERE sponser_id = ${id}) AS totalSponser,
        (SELECT COUNT(1) FROM meddolic_user_child_ids WHERE member_id = ${id} AND level BETWEEN 1 AND 9) AS totalTeam,
        COALESCE((SELECT SUM(amount) FROM recharges WHERE userId IN (SELECT member_id FROM meddolic_user_details WHERE sponser_id = ${id}) AND status = 'APPROVED'), 0) AS totalDirectDeposit,
        COALESCE((SELECT SUM(amount) FROM recharges WHERE userId IN (SELECT child_id FROM meddolic_user_child_ids WHERE member_id = ${id}) AND status = 'APPROVED'), 0) AS totalTeamDeposit,
        COALESCE((SELECT SUM(commission) FROM meddolic_user_trade_commission WHERE member_id = ${id} AND status = 1 AND DATE(date_time) = SUBDATE(CURDATE(), 1)), 0) AS yesterdayCommission
    `;

    return AppResponse.success(reply, {
      message: "Promotion stats fetched successfully",
      data: { ...toNumbers(row), referralCode: ctx.user.user_id },
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
