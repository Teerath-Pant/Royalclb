import { useQuery } from "@tanstack/react-query";

import {
  safeAccumulatedRevenueQueryOptions,
  safeBalanceQueryOptions,
} from "@/queries/safe";
import { formatAmount } from "@/utils/format-amount";

export function Stats() {
  const { data: wallets } = useQuery(safeBalanceQueryOptions);
  const { data: accumulatedData } = useQuery(
    safeAccumulatedRevenueQueryOptions
  );

  const stakeInterestWallet = wallets?.safeInterestWallet ?? 0;
  const accumulatedRevenue = accumulatedData ?? 0;

  return (
    <div className="grid grid-cols-2 py-2 mb-4 border-b border-border-card/50">
      {/* Generated revenue */}
      <div className="text-center pr-3 border-r border-border-card">
        <div className="text-accent-salmon text-xl font-extrabold tracking-tight mb-1">
          {formatAmount(stakeInterestWallet)}
        </div>
        <div className="text-text-subtle text-xs font-medium">
          Generated revenue
        </div>
      </div>

      {/* Accumulated revenue */}
      <div className="text-center pl-3">
        <div className="text-white text-xl font-extrabold tracking-tight mb-1">
          {formatAmount(accumulatedRevenue)}
        </div>
        <div className="text-text-subtle text-xs font-medium">
          Accumulated revenue
        </div>
      </div>
    </div>
  );
}
