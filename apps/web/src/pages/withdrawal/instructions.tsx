import { useSignals } from "@/lib/signal";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, ShieldCheck } from "lucide-react";

import {
  withdrawalNeedToTradeQueryOptions,
  withdrawalSettingsQueryOptions,
} from "@/queries/withdrawal";
import { formatAmount } from "@/utils/format-amount";

import { activeCurrency } from "./config";

export function Instructions() {
  useSignals();
  const { data: needToTrade } = useQuery(withdrawalNeedToTradeQueryOptions);
  const { data: settings } = useQuery(withdrawalSettingsQueryOptions);

  const isInr = activeCurrency.value === "INR";
  const usdToInrRate = settings?.usdToInrRate ?? 1;
  const needToTradeDisplay =
    isInr || usdToInrRate <= 0
      ? (needToTrade ?? 0)
      : (needToTrade ?? 0) / usdToInrRate;

  return (
    <div className="rounded-2xl bg-surface-card border border-border-card/60 p-5 shadow-md space-y-4 my-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-border-card/40">
        <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
          <ShieldCheck className="h-4 w-4 text-brand-gold" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-brand-gold">
            Withdrawal Guidelines
          </h3>
          <p className="text-[11px] text-text-muted">
            Important rules regarding fund transfers
          </p>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg border border-brand-gold/20 bg-surface-input-dark/60 px-3 py-2 text-xs text-text-subtle">
          <span className="text-brand-gold">◆</span>
          <span>
            Need to bet{" "}
            <span className="font-bold text-accent-salmon">
              {formatAmount(needToTradeDisplay, {
                symbol: isInr ? "₹" : "$",
              })}
            </span>{" "}
            to be able to withdraw
          </span>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-input-dark/60 border border-border-card/40">
          <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-brand-gold/15 text-brand-gold text-xs font-bold shrink-0 mt-0.5">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-white block">
              Withdrawal Hours & Limits
            </span>
            <p className="text-text-subtle leading-relaxed">
              Withdrawal requests are processed 24/7. Maximum withdrawals per
              day apply as per system limits.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-input-dark/60 border border-border-card/40">
          <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-brand-gold/15 text-brand-gold text-xs font-bold shrink-0 mt-0.5">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-white block">
              Processing & Charges
            </span>
            <p className="text-text-subtle leading-relaxed">
              A standard service charge fee applies to each request. Approved
              funds are transferred directly to your configured payment method.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-salmon/10 border border-accent-salmon/25">
          <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-accent-salmon/20 text-accent-salmon text-xs font-bold shrink-0 mt-0.5">
            <AlertTriangle className="h-3.5 w-3.5 text-accent-salmon" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-accent-salmon block">
              Account Safety Notice
            </span>
            <p className="text-text-subtle leading-relaxed">
              Ensure your destination account details are correctly configured
              in Withdrawal Methods before submitting a request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
