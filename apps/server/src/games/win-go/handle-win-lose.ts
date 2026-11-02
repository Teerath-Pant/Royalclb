import type { Dayjs } from "dayjs";
import type { Decimal } from "decimal.js";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import type { winGoBets } from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { PrismaClientKnownRequestError } from "../../../generated/prisma/internal/prismaNamespace";
import { calculateWinAmount } from "./calculate-win-amount";

type HandleWinAndLose = {
  id: number;
  winNumber: number;
};

type BetResult =
  | { status: "fulfilled"; betId: number }
  | { status: "rejected"; betId: number; error: unknown };

const calcNetAmount = (winAmount: Decimal, adminTax: Decimal) => {
  const tax = winAmount.mul(adminTax).div(100);
  const netAmount = winAmount.sub(tax);
  return { tax, netAmount };
};

// Groups winners by userId and processes each user's bets sequentially,
// while still running different users' bets in parallel (batchSize at a time).
// This prevents concurrent writes to the same wallet row (fixes Prisma P2039 / MySQL 1020).
const processInBatchesByUser = async <T extends { bet: winGoBets }>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<void>
): Promise<void> => {
  const byUser = new Map<number, T[]>();
  for (const item of items) {
    const uid = item.bet.userId;
    if (!byUser.has(uid)) {
      byUser.set(uid, []);
    }
    byUser.get(uid)?.push(item);
  }

  const userGroups = [...byUser.values()];

  for (let i = 0; i < userGroups.length; i += batchSize) {
    const batch = userGroups.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (userItems) => {
        for (const item of userItems) {
          await fn(item);
        }
      })
    );
  }
};

const processWinner = async (
  bet: winGoBets,
  winAmount: Decimal,
  adminTax: Decimal,
  dt: Dayjs
): Promise<void> => {
  const { tax, netAmount } = calcNetAmount(winAmount, adminTax);

  await prisma.$transaction(async (tx) => {
    await tx.winGoBets.update({
      where: { id: bet.id },
      data: {
        winAmount,
        charge: tax,
        netWinAmount: netAmount,
        status: "WIN",
        resultDateTime: dt.toISOString(),
      },
    });

    await walletService.entry2({
      tx,
      user_id: bet.userId,
      txn_id: bet.id,
      amount: netAmount,
      note: "WIN (WinGo)",
      type: "CREDIT",
      dt,
      wallet_type: "WALLET",
    });
  });
};

const processWinnerSafe = async (
  bet: winGoBets,
  winAmount: Decimal,
  adminTax: Decimal,
  dt: Dayjs,
  retries = 3
): Promise<BetResult> => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      await processWinner(bet, winAmount, adminTax, dt);
      return { status: "fulfilled", betId: bet.id };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        const isLockConflict =
          error.code === "P2039" ||
          (error.meta?.driverAdapterError as { cause?: { code?: number } })
            ?.cause?.code === 1020;

        if (isLockConflict && attempt < retries) {
          // small backoff before retry, in case of a wallet-row race
          // from a concurrent flow outside this batch (e.g. deposit/withdraw)
          // oxlint-disable-next-line promise/avoid-new
          await new Promise((resolve) =>
            // oxlint-disable-next-line no-promise-executor-return
            setTimeout(resolve, 50 * (attempt + 1))
          );
          continue;
        }
      }

      logger.error(
        {
          error,
        },
        `[WinGo] Failed to process winner bet ${bet.id}:`
      );
      return { status: "rejected", betId: bet.id, error };
    }
  }

  // unreachable, but TS needs it
  return {
    status: "rejected",
    betId: bet.id,
    error: new Error("max retries exceeded"),
  };
};

export const handleWinAndLose = async ({ id, winNumber }: HandleWinAndLose) => {
  const dt = Now();

  await prisma.winGo.update({
    where: { id },
    data: { winNumber, status: "COMPLETED" },
  });

  const [bets, { platformCharge }] = await Promise.all([
    prisma.winGoBets.findMany({
      where: { gameId: id, status: "PENDING" },
    }),
    getFundSettings(prisma, { platformCharge: true }),
  ]);

  const betsWithAmounts = bets.map((bet) => ({
    bet,
    winAmount: calculateWinAmount({ winNumber, ...bet }),
  }));

  const winners = betsWithAmounts.filter(({ winAmount }) =>
    winAmount.greaterThan(0)
  );

  const losers = betsWithAmounts.filter(
    ({ winAmount }) => !winAmount.greaterThan(0)
  );

  // All losers in one query — identical updates
  await prisma.winGoBets.updateMany({
    where: { id: { in: losers.map(({ bet }) => bet.id) } },
    data: { status: "LOSE", resultDateTime: dt.toISOString() },
  });

  const betResults: BetResult[] = [];

  await processInBatchesByUser(winners, 10, async ({ bet, winAmount }) => {
    const result = await processWinnerSafe(bet, winAmount, platformCharge, dt);
    betResults.push(result);
  });

  const failed = betResults.filter((r) => r.status === "rejected");

  if (failed.length > 0) {
    logger.error(
      `[WinGo] Game ${id}: ${failed.length}/${winners.length} winner bets failed: ${failed
        .map((r) => r.betId)
        .join(", ")}`
    );
  }
};
