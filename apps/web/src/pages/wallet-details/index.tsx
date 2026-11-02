import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { HeaderNav } from "@/components/header-nav";
import { Shell } from "@/components/shell";
import { queryClient } from "@/lib/query-client";
import { walletDetailsQueryOptions } from "@/queries/wallet-details";
import { back } from "@/utils/navigation";

import { QuickActions } from "./quick-actions";
import { WalletBreakdown } from "./wallet-breakdown";
import { WalletCard } from "./wallet-card";

function WalletDetailsHeader() {
  return (
    <HeaderNav title="Wallet Details" onBack={() => back("/wallet")} />
  );
}

function MainWalletDetailsView() {
  const qc = useQueryClient();
  const { data: details, isPending } = useQuery(walletDetailsQueryOptions);

  const handleRefresh = () => {
    qc.invalidateQueries(walletDetailsQueryOptions);
  };

  return (
    <main className="px-4 pb-8 space-y-4">
      <WalletCard
        totalBalance={details?.totalWallet ?? null}
        isPending={isPending}
        onRefresh={handleRefresh}
      />

      <QuickActions />

      <WalletBreakdown details={details} isPending={isPending} />
    </main>
  );
}

export default function WalletDetails() {
  return (
    <Shell>
      <WalletDetailsHeader />
      <MainWalletDetailsView />
    </Shell>
  );
}

