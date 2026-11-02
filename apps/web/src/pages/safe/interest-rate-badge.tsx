import { useQuery } from "@tanstack/react-query";

import { safeSettingsQueryOptions } from "@/queries/safe";
import { formatAmount } from "@/utils/format-amount";

export function InterestRateBadge() {
  const { data } = useQuery(safeSettingsQueryOptions);
  const interestRate = data?.interestRate ?? 1;

  return (
    <div className="flex justify-center my-3">
      <div className="inline-flex items-center justify-center bg-surface-badge text-accent-salmon text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs border border-border-badge">
        Interest rate{" "}
        {formatAmount(interestRate, {
          position: "end",
          symbol: "%",
        })}
      </div>
    </div>
  );
}
