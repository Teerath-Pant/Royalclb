import { Cron } from "croner";
import type { CronOptions } from "croner";

import { DailyDepositBonus } from "@/incomes/daily-deposit-bonus";
// import { DailyFundRoi } from "@/incomes/daily-fund-roi";
import { RebateBonus } from "@/incomes/rebate-bonus";
import { SalaryBonus } from "@/incomes/salary-bonus";
import { TradeCommission } from "@/incomes/trade-commission";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { settingsService } from "@/services/settings.service";
import { Now } from "@/utils/date";

import { SafeDeposit } from "./handle-safe-interest";
import { rotateSeed } from "./rotate-seed";

const cronOptions = (name: string): CronOptions => ({
  timezone: "Asia/Kolkata",
  protect: true,
  catch: (error: unknown) =>
    logger.error({ error }, `Error in cron job: ${name}`),
});

export const crons = [
  new Cron("1 0 * * *", cronOptions("mid-night"), async () => {
    logger.info(`Mid-Night CronJob Started ${Now().toString()}`);
    const dt = Now();
    const prevStart = dt.subtract(1, "day").startOf("day");
    const prevEnd = dt.subtract(1, "day").endOf("day");

    try {
      const users = await prisma.meddolic_user_details.findMany({
        select: {
          member_id: true,
          fundWallet: true,
          wallet: true,
          bonusWallet: true,
          safeWallet: true,
        },
      });

      const { rebateIncome } = await settingsService.get({
        rebateIncome: true,
      });

      for (const user of users) {
        await DailyDepositBonus.release(prisma, {
          userId: user.member_id,
          prevStart,
          prevEnd,
          dt,
        });

        await SalaryBonus.release(prisma, {
          userId: user.member_id,
          prevStart,
          prevEnd,
          dt,
        });

        // await DailyFundRoi.release(prisma, {
        //   userId: user.member_id,
        //   fundWallet: user.fundWallet,
        //   wallet: user.wallet,
        //   bonusWallet: user.bonusWallet,
        //   dt,
        // });

        await RebateBonus.release(prisma, {
          userId: user.member_id,
          rebatePercent: rebateIncome,
          prevStart,
          prevEnd,
          dt,
        });

        await SafeDeposit.release(prisma, {
          userId: user.member_id,
          safeWallet: user.safeWallet,
          dt,
        });
      }

      await TradeCommission.release(prisma);
    } catch (error) {
      logger.error({ error }, `Mid-Night CronJob Error`);
    } finally {
      logger.info(`Mid-Night CronJob Ended ${Now().toString()}`);
    }
  }),
  new Cron("*/10 * * * *", cronOptions("rotate-seed"), async () => {
    await rotateSeed(prisma);
  }),
];

void rotateSeed(prisma);
