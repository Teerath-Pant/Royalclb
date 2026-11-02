import { useQuery, useQueryClient } from "@tanstack/react-query";

import { walletQueryOptions } from "@/queries/wallet";

export function useWallet() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(walletQueryOptions);

  return {
    balance: data?.totalWallet ?? null,
    isPending,
    refresh: () => queryClient.invalidateQueries(walletQueryOptions),
  };
}
