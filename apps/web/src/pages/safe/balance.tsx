import { useQuery } from "@tanstack/react-query";
import { Check, CreditCard } from "lucide-react";

import {
  safeBalanceQueryOptions,
  safeSettingsQueryOptions,
} from "@/queries/safe";
import { formatAmount } from "@/utils/format-amount";

export function Balance() {
  const { data } = useQuery(safeBalanceQueryOptions);
  const { data: settings } = useQuery(safeSettingsQueryOptions);

  const safeWallet = data?.safeWallet ?? 0;
  const interestRate = settings?.interestRate ?? 0;
  const dailyAccruedInterest = (safeWallet * interestRate) / 100;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-card-teal-start via-card-teal-mid to-card-teal-end p-4 shadow-lg text-gray-950 my-3">
      {/* Top row */}
      <div className="flex items-center justify-between">
        {/* Coin Icon */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fcd34d] border border-[#fef08a] shadow-xs text-amber-900 font-extrabold text-xs">
          🪙
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1 rounded-full border border-gray-950/20 bg-gray-950/10 px-2.5 py-0.5 text-[11px] font-semibold text-gray-950">
          <Check className="h-3.5 w-3.5 stroke-3" />
          <span>Financial security</span>
        </div>
      </div>

      {/* Main Balance */}
      <div className="my-3 text-3xl font-extrabold tracking-tight text-gray-950">
        {formatAmount(safeWallet)}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs font-medium text-gray-950/90 pt-1">
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 opacity-80" />
          <span>
            24-hour estimated revenue{" "}
            <strong className="font-bold text-gray-950">
              {formatAmount(dailyAccruedInterest)}
            </strong>
          </span>
        </div>

        <div className="tracking-widest font-bold text-gray-950/70 text-[11px]">
          **** ****
        </div>
      </div>
    </div>
  );
}
