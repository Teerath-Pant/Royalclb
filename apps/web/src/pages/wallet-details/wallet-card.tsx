import { RefreshCw, Wallet } from "lucide-react";
import { useCallback, useState } from "react";

import { formatAmount } from "@/utils/format-amount";

type WalletCardProps = {
  totalBalance: number | null;
  isPending: boolean;
  onRefresh: () => void;
};

export function WalletCard({
  totalBalance,
  isPending,
  onRefresh,
}: WalletCardProps) {
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = useCallback(() => {
    if (spinning) {
      return;
    }

    setSpinning(true);
    onRefresh();
    setTimeout(() => {
      setSpinning(false);
    }, 1000);
  }, [onRefresh, spinning]);

  return (
    <div
      className="w-full rounded-2xl bg-no-repeat bg-cover bg-center p-4 relative shadow-md my-2 flex flex-col justify-between"
      style={{
        backgroundImage:
          "url('/WINGO/gameassets/png/TotalAssetsBg-a504074b.png')",
        aspectRatio: "320 / 115",
      }}
    >
      <div className="flex items-center text-white text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <Wallet size={16} className="text-brand-gold-light" />
          <span>Total Balance</span>
        </div>
      </div>

      <div className="text-2xl font-extrabold text-brand-gold-light my-1 flex items-center gap-2">
        <span>{isPending ? "Loading…" : formatAmount(totalBalance ?? 0)}</span>
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
