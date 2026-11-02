import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";

import { withdrawalNeedToTradeQueryOptions } from "@/queries/withdrawal";
import { formatAmount } from "@/utils/format-amount";

const INSTRUCTIONS = [
  "If the transfer time is up, please fill out the deposit form again.",
  "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
  "If you transfer the wrong amount, our company will not be responsible for the lost amount!",
  "Note: do not cancel the deposit order after the money has been transferred.",
];

export function Instructions() {
  const { data: needToTrade } = useQuery(withdrawalNeedToTradeQueryOptions);

  return (
    <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-3 my-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-brand-gold" />
        <h2 className="text-sm font-bold text-brand-gold-light">
          P2P Transfer instructions
        </h2>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-brand-gold/20 bg-surface-input-dark/60 px-3 py-2 text-xs text-text-subtle">
        <span className="text-brand-gold">◆</span>
        <span>
          Need to bet{" "}
          <span className="font-bold text-accent-salmon">
            {formatAmount(needToTrade ?? 0, { symbol: "₹" })}
          </span>{" "}
          to be able to transfer
        </span>
      </div>

      {/* Instructions inner box */}
      <div className="rounded-xl border border-border-card/80 bg-surface-input p-3.5 space-y-2.5">
        {INSTRUCTIONS.map((instruction, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-brand-gold text-xs mt-0.5 shrink-0">◆</span>
            <p className="text-xs text-text-subtle leading-relaxed font-medium">
              {instruction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
