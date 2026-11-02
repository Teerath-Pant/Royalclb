import type dayjs from "dayjs";

import type { Prisma, PrismaClient, meddolic_game_k3_bets } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";

export function isInteger(str: string): boolean {
  return /^[+-]?\d+$/u.test(str);
}

export function isBigSmall(str: string): boolean {
  return /^[bs]$/u.test(str);
}

export function isOddEven(str: string): boolean {
  return /^[oe]$/u.test(str);
}

type PlaceBetEntryParams = {
  gameId: meddolic_game_k3_bets["id"];
  userId: meddolic_game_k3_bets["member_id"];
  betAmount: Prisma.Decimal;
  column: keyof Pick<
    meddolic_game_k3_bets,
    | "number"
    | "big_small"
    | "odd_even"
    | "identical_2"
    | "different_2"
    | "identical_3"
    | "any_identical_3"
    | "different_3"
    | "any_consecutive_3"
  >;
  value: unknown;
  dateTime: dayjs.Dayjs;
};

export async function placeBetEntry(
  db: PrismaClient,
  { gameId, userId, betAmount, column, value, dateTime }: PlaceBetEntryParams
) {
  let newValue: unknown;

  switch (column) {
    case "number": {
      newValue = Number(value);
      break;
    }
    case "big_small": {
      newValue = Number(value);
      break;
    }
    case "odd_even": {
      newValue = Number(value);
      break;
    }
    case "identical_2": {
      newValue = String(value);
      break;
    }
    case "different_2": {
      newValue = String(value);
      break;
    }
    case "identical_3": {
      newValue = String(value);
      break;
    }
    case "any_identical_3": {
      newValue = Number(value);
      break;
    }
    case "different_3": {
      newValue = String(value);
      break;
    }
    case "any_consecutive_3": {
      newValue = Number(value);
      break;
    }
    default: {
      throw new Error("Invalid case");
    }
  }

  const k3Bet = await db.meddolic_game_k3_bets.create({
    data: {
      session_id: gameId,
      member_id: userId,
      bet_amount: betAmount,
      [column]: newValue,
      date_time: dateTime.toISOString(),
    },
    select: {
      id: true,
    },
  });

  const txnId = k3Bet.id;

  const user = await db.meddolic_user_details.findUnique({
    where: { member_id: userId },
    select: {
      bonusWallet: true,
      wallet: true,
      fundWallet: true,
    },
  });

  if (!user) {
    throw AppError.notFound({ message: "User not found" });
  }

  const { bonusWallet, wallet, fundWallet } = user;

  const { walletDeduction, fundWalletDeduction, bonusWalletDeduction } =
    walletService.calculateWalletDeductions({
      betAmount,
      bonusWallet,
      wallet,
      fundWallet,
    });

  await walletService.updateWallets({
    userId,
    fundWalletDeduction,
    walletDeduction,
    bonusWalletDeduction,
    betAmount,
    txnId,
    dateTime,
  });
}
