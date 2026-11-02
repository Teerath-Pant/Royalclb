import { useSignals } from "@/lib/signal";
import { CheckCircle, ShieldAlert, ShieldCheck } from "lucide-react";

import type { WithdrawalMethod } from "@/api/withdrawal-methods";
import { cn } from "@/utils/cn";

import { activeTab, METHOD_META } from "./config";

interface StatusCardProps {
  method?: WithdrawalMethod;
  isLoading?: boolean;
}

function maskString(str: string, visibleStart = 4, visibleEnd = 4): string {
  if (!str || str.length <= visibleStart + visibleEnd) {
    return str;
  }
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  return `${start}****${end}`;
}

export function StatusCard({ method, isLoading }: StatusCardProps) {
  useSignals();
  const currentTab = activeTab.value;
  const meta = METHOD_META[currentTab];

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-2 animate-pulse my-3">
        <div className="h-4 w-32 bg-surface-card-header rounded" />
        <div className="h-6 w-48 bg-surface-card-header rounded" />
      </div>
    );
  }

  const isConfigured = Boolean(method);

  return (
    <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-3 my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConfigured ? (
            <ShieldCheck className="h-5 w-5 text-accent-teal" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-brand-gold" />
          )}
          <span className="text-sm font-bold text-brand-gold">
            {meta.label} Account Status
          </span>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
            {
              "bg-accent-teal/10 border-accent-teal/30 text-accent-teal":
                isConfigured,
              "bg-surface-badge border-border-badge text-text-muted":
                !isConfigured,
            }
          )}
        >
          {isConfigured ? (
            <>
              <CheckCircle className="h-3 w-3" /> Configured
            </>
          ) : (
            "Not Set"
          )}
        </span>
      </div>

      {isConfigured && method ? (
        <div className="space-y-1.5 pt-1 text-xs border-t border-border-card/40">
          {method.type === "UPI" && (
            <div className="flex justify-between items-center py-1">
              <span className="text-text-muted">UPI ID</span>
              <span className="font-mono font-bold text-white">
                {maskString(method.details.upiId, 3, 3)}
              </span>
            </div>
          )}

          {method.type === "BANK" && (
            <>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-text-muted">Bank Name</span>
                <span className="font-bold text-white">
                  {method.details.bankName}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-text-muted">Account Holder</span>
                <span className="font-bold text-white">
                  {method.details.accountHolderName}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-text-muted">Account Number</span>
                <span className="font-mono font-bold text-white">
                  {maskString(method.details.accountNumber, 3, 4)}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-text-muted">IFSC Code</span>
                <span className="font-mono font-bold text-white">
                  {method.details.ifsc}
                </span>
              </div>
            </>
          )}

          {(method.type === "TRC20" || method.type === "BSC") && (
            <div className="flex justify-between items-center py-1">
              <span className="text-text-muted">Wallet Address</span>
              <span className="font-mono font-bold text-white">
                {maskString(method.details.walletAddress, 6, 6)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-text-subtle pt-1">
          No {meta.label} withdrawal details saved yet. Fill out the form below
          to configure your account.
        </p>
      )}
    </div>
  );
}
