import { queryOptions } from "@tanstack/react-query";

import { $userfetch } from "@/api/user";

type Wallets = {
  bonusWallet: number;
  fundWallet: number;
  wallet: number;
  totalWallet: number;
};

const EMPTY_WALLETS: Wallets = {
  bonusWallet: 0,
  fundWallet: 0,
  wallet: 0,
  totalWallet: 0,
};

async function fetchWallets(): Promise<Wallets> {
  try {
    const { data, error } = await $userfetch("@get/wallets");

    if (error || data === null || data.data === null) {
      return EMPTY_WALLETS;
    }

    return data.data;
  } catch {
    return EMPTY_WALLETS;
  }
}

export const walletQueryOptions = queryOptions({
  queryKey: ["wallets"],
  queryFn: fetchWallets,
});
