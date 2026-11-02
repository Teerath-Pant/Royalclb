import { queryOptions } from "@tanstack/react-query";

import { $userfetch } from "@/api/user";

export type WalletDetails = {
  bonusWallet: number;
  fundWallet: number;
  wallet: number;
  totalWallet: number;
  totalDeposit: number;
  totalWithdrawal: number;
};

const EMPTY_WALLET_DETAILS: WalletDetails = {
  bonusWallet: 0,
  fundWallet: 0,
  wallet: 0,
  totalWallet: 0,
  totalDeposit: 0,
  totalWithdrawal: 0,
};

async function fetchWalletDetails(): Promise<WalletDetails> {
  try {
    const { data, error } = await $userfetch("@get/wallet-details");

    if (error || data === null || data.data === null) {
      return EMPTY_WALLET_DETAILS;
    }

    return data.data;
  } catch {
    return EMPTY_WALLET_DETAILS;
  }
}

export const walletDetailsQueryOptions = queryOptions({
  queryKey: ["wallet-details"],
  queryFn: fetchWalletDetails,
});
