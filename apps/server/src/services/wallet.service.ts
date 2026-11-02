import type dayjs from "dayjs";

import { Prisma, prisma } from "@/lib/prisma";
import type {
  wallet_statements_wallet_type,
  meddolic_user_details,
  meddolic_user_wallet_statement,
  wallet_statements,
} from "@/lib/prisma";

export type CalculateWalletDeductionsParams = {
  betAmount: Prisma.Decimal;
  bonusWallet: Prisma.Decimal;
  wallet: Prisma.Decimal;
  fundWallet: Prisma.Decimal;
};

export type UpdateWalletsParams = {
  userId: meddolic_user_details["member_id"];
  betAmount: Prisma.Decimal;
  fundWalletDeduction: Prisma.Decimal;
  walletDeduction: Prisma.Decimal;
  bonusWalletDeduction: Prisma.Decimal;
  dateTime: dayjs.Dayjs;
  txnId: number;
  db?: Prisma.TransactionClient;
};

export type EntryParams = {
  userId: meddolic_user_details["member_id"];
  amount: Prisma.Decimal;
  statementId: meddolic_user_wallet_statement["wallet_statement_id"];
  txnId: meddolic_user_wallet_statement["trn_id"];
  dateTime: dayjs.Dayjs;
  walletType?: "wallet" | "bonusWallet" | "fundWallet";
  type?: "credit" | "debit";
};

type Entry2Params = Pick<
  wallet_statements,
  "user_id" | "txn_id" | "amount" | "note" | "type" | "wallet_type"
> & {
  dt: dayjs.Dayjs;
  tx?: Prisma.TransactionClient;
};

function getWalletNameByType(walletType: wallet_statements_wallet_type) {
  if (walletType === "BONUS_WALLET") {
    return "bonusWallet";
  }
  if (walletType === "FUND_WALLET") {
    return "fundWallet";
  }
  return "wallet";
}

export const walletService = {
  // CALCULATE WALLET DEDUCTIONS
  calculateWalletDeductions: ({
    betAmount,
    bonusWallet,
    wallet,
    fundWallet,
  }: CalculateWalletDeductionsParams) => {
    const fundWalletDeduction = Prisma.Decimal.min(fundWallet, betAmount);
    let remainingAmount = betAmount.minus(fundWalletDeduction);

    const bonusWalletDeduction = Prisma.Decimal.min(
      bonusWallet,
      remainingAmount
    );
    remainingAmount = remainingAmount.minus(bonusWalletDeduction);

    const walletDeduction = Prisma.Decimal.min(wallet, remainingAmount);
    return {
      fundWalletDeduction,
      walletDeduction,
      bonusWalletDeduction,
    };
  },

  // UPDATE WALLETS
  updateWallets: async ({
    userId,
    betAmount,
    fundWalletDeduction,
    walletDeduction,
    bonusWalletDeduction,
    dateTime,
    txnId,
    db = prisma,
  }: UpdateWalletsParams) => {
    await Promise.all([
      db.meddolic_user_details.update({
        where: {
          member_id: userId,
        },
        data: {
          fundWallet: {
            decrement: fundWalletDeduction,
          },
          wallet: {
            decrement: walletDeduction,
          },
          bonusWallet: {
            decrement: bonusWalletDeduction,
          },
        },
      }),
      db.meddolic_user_wallet_statement.create({
        data: {
          member_id: userId,
          wallet_statement_id: 12,
          deb_cr: 1,
          amount: betAmount,
          date_time: dateTime.toISOString(),
          trn_id: txnId,
        },
      }),
    ]);
  },

  updateWallets2: async ({
    userId,
    fundWalletDeduction,
    bonusWalletDeduction,
    walletDeduction,
    dateTime,
    txnId,
    note,
    db = prisma,
  }: Omit<UpdateWalletsParams, "betAmount"> & { note: string }) => {
    await Promise.all([
      db.meddolic_user_details.update({
        where: {
          member_id: userId,
        },
        data: {
          fundWallet: {
            decrement: fundWalletDeduction,
          },
          wallet: {
            decrement: walletDeduction,
          },
          bonusWallet: {
            decrement: bonusWalletDeduction,
          },
        },
      }),
      ...(fundWalletDeduction.greaterThan(0)
        ? [
            db.wallet_statements.create({
              data: {
                user_id: userId,
                txn_id: txnId,
                amount: fundWalletDeduction,
                note,
                type: "DEBIT",
                wallet_type: "FUND_WALLET",
                date_time: dateTime.toISOString(),
              },
            }),
          ]
        : []),
      ...(bonusWalletDeduction.greaterThan(0)
        ? [
            db.wallet_statements.create({
              data: {
                user_id: userId,
                txn_id: txnId,
                amount: bonusWalletDeduction,
                note,
                type: "DEBIT",
                wallet_type: "BONUS_WALLET",
                date_time: dateTime.toISOString(),
              },
            }),
          ]
        : []),
      ...(walletDeduction.greaterThan(0)
        ? [
            db.wallet_statements.create({
              data: {
                user_id: userId,
                txn_id: txnId,
                amount: walletDeduction,
                note,
                type: "DEBIT",
                wallet_type: "WALLET",
                date_time: dateTime.toISOString(),
              },
            }),
          ]
        : []),
    ]);
  },

  // ENTRY
  entry: async ({
    userId,
    amount,
    statementId,
    txnId,
    dateTime,
    walletType = "wallet",
    type = "credit",
  }: EntryParams) => {
    const walletIncrement: Record<
      string,
      { increment: Prisma.Decimal } | { decrement: Prisma.Decimal }
    > = {};

    if (walletType === "wallet") {
      walletIncrement.wallet =
        type === "credit" ? { increment: amount } : { decrement: amount };
    }
    if (walletType === "bonusWallet") {
      walletIncrement.bonusWallet =
        type === "credit" ? { increment: amount } : { decrement: amount };
    }
    if (walletType === "fundWallet") {
      walletIncrement.fundWallet =
        type === "credit" ? { increment: amount } : { decrement: amount };
    }

    await Promise.all([
      prisma.meddolic_user_wallet_statement.create({
        data: {
          member_id: userId,
          wallet_statement_id: statementId,
          deb_cr: type === "credit" ? 2 : 1,
          amount,
          date_time: dateTime.toISOString(),
          trn_id: txnId,
        },
      }),
      prisma.meddolic_user_details.update({
        data: walletIncrement,
        where: {
          member_id: userId,
        },
      }),
    ]);
  },

  // ENTRY 2
  entry2: async ({
    user_id,
    txn_id,
    amount,
    note,
    type,
    wallet_type,
    dt,
    tx = prisma,
  }: Entry2Params) => {
    const walletName = getWalletNameByType(wallet_type);

    await tx.wallet_statements.create({
      data: {
        user_id,
        txn_id,
        amount,
        note,
        type,
        wallet_type,
        date_time: dt.toISOString(),
      },
    });
    await tx.meddolic_user_details.update({
      where: { member_id: user_id },
      data: {
        [walletName]: {
          [type === "CREDIT" ? "increment" : "decrement"]: amount,
        },
      },
    });
  },
};
