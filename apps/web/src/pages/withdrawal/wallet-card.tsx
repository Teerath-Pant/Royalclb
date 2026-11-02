import { useSignals } from "@/lib/signal";
import { useQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";

import { walletQueryOptions } from "@/queries/wallet";
import { withdrawalSettingsQueryOptions } from "@/queries/withdrawal";
import { formatAmount } from "@/utils/format-amount";

import { activeCurrency } from "./config";

export function WalletCard() {
  useSignals();
  const { data: wallets, isLoading } = useQuery(walletQueryOptions);
  const { data: settings } = useQuery(withdrawalSettingsQueryOptions);

  const balanceInr = wallets?.wallet ?? 0;
  const isInr = activeCurrency.value === "INR";
  const usdToInrRate = settings?.usdToInrRate ?? 1;

  const balance =
    isInr || usdToInrRate <= 0 ? balanceInr : balanceInr / usdToInrRate;

  return (
    <div className="rounded-2xl bg-linear-to-r from-surface-card-header via-surface-card to-surface-card-header border border-border-card/80 p-4 shadow-lg space-y-2 my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
            <Wallet className="h-4 w-4 text-brand-gold fill-brand-gold/20" />
          </div>
          <span className="text-xs font-bold text-text-subtle">
            Available Balance
          </span>
        </div>
      </div>

      <div className="pt-1">
        {isLoading ? (
          <div className="h-8 w-32 bg-surface-input-dark rounded animate-pulse" />
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white tracking-tight">
              {formatAmount(balance, { symbol: isInr ? "₹" : "$" })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
