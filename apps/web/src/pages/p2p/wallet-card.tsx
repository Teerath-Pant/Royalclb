import { useQuery, useQueryClient } from "@tanstack/react-query";
import { History, RefreshCw, Wallet } from "lucide-react";
import { useCallback, useState } from "react";
import { useLocation } from "wouter";

import { walletQueryOptions } from "@/queries/wallet";
import { formatAmount } from "@/utils/format-amount";

export function WalletCard() {
  const queryClient = useQueryClient();
  const { data: wallets, isLoading } = useQuery(walletQueryOptions);
  const balance = wallets?.wallet ?? 0;

  const [, setLocation] = useLocation();
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = useCallback(() => {
    if (spinning) {
      return;
    }
    setSpinning(true);
    queryClient.invalidateQueries(walletQueryOptions);
    setTimeout(() => {
      setSpinning(false);
    }, 1000);
  }, [queryClient, spinning]);

  return (
    <div
      className="w-full rounded-2xl bg-no-repeat bg-cover bg-center p-4 relative shadow-md my-2 flex flex-col justify-between"
      style={{
        backgroundImage:
          "url('/WINGO/gameassets/png/TotalAssetsBg-a504074b.png')",
        aspectRatio: "320 / 115",
      }}
    >
      <div className="flex items-center justify-between text-white text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <Wallet size={16} className="text-brand-gold-light" />
          <span>Balance</span>
        </div>

        <button
          type="button"
          onClick={() => setLocation("/history")}
          className="flex items-center gap-1 text-accent-teal hover:underline text-xs font-semibold bg-transparent border-0 cursor-pointer p-0"
        >
          <History size={14} />
          <span>P2P History</span>
        </button>
      </div>

      <div className="text-2xl font-extrabold text-brand-gold-light my-1 flex items-center gap-2">
        <span>{isLoading ? "Loading…" : formatAmount(balance)}</span>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={spinning}
          className="border-0 bg-transparent text-brand-gold-light hover:text-white transition-colors cursor-pointer p-1 inline-flex items-center justify-center disabled:opacity-75"
          aria-label="Refresh balance"
        >
          <RefreshCw size={18} className={spinning ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex items-center">
        <img
          src="/WINGO/gameassets/png/cip-7e500e5e.png"
          alt="Chip"
          className="w-7 h-auto object-contain"
        />
      </div>
    </div>
  );
}
