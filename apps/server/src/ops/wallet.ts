import type dayjs from "dayjs";

import type {
  meddolic_user_details,
  Prisma,
  wallet_statements,
  wallet_statements_wallet_type,
} from "@/lib/prisma";

export type EntryParams = {
  userId: wallet_statements["user_id"];
  refId: wallet_statements["txn_id"];
  amount: wallet_statements["amount"];
  note: wallet_statements["note"];
  type: wallet_statements["type"];
  wallet: wallet_statements["wallet_type"];
  dt: dayjs.Dayjs;
};

const WALLET_FIELD = {
  BONUS_WALLET: "bonusWallet",
  FUND_WALLET: "fundWallet",
  WALLET: "wallet",
  SAFE_WALLET: "safeWallet",
  SAFE_INTEREST_WALLET: "safeInterestWallet",
} as const satisfies Record<
  wallet_statements_wallet_type,
  keyof meddolic_user_details
>;

export async function createWalletEntry(
  tx: Prisma.TransactionClient,
  { userId, refId, amount, note, type, wallet, dt }: EntryParams
) {
  const walletField = WALLET_FIELD[wallet];

  await tx.meddolic_user_details.update({
    where: { member_id: userId },
    data: {
      [walletField]: {
        [type === "CREDIT" ? "increment" : "decrement"]: amount,
      },
    },
    select: { [walletField]: true },
  });

  await tx.wallet_statements.create({
    data: {
      user_id: userId,
      txn_id: refId,
      amount,
      note,
      type,
      wallet_type: wallet,
      date_time: dt.toISOString(),
    },
    select: { id: true },
  });
}
