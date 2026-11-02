import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock, Copy, XCircle } from "lucide-react";
import { useState } from "react";

import type { WithdrawalItem } from "@/api/withdrawal";
import type { WithdrawalStatus } from "@/constants/withdrawal";
import { notyf } from "@/lib/notyf";
import {
  withdrawalListQueryOptions,
  withdrawalSettingsQueryOptions,
} from "@/queries/withdrawal";
import { cn } from "@/utils/cn";
import { formatAmount } from "@/utils/format-amount";

const STATUS_FILTERS: { label: string; value: WithdrawalStatus | null }[] = [
  { label: "All", value: null },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

function handleCopyRef(ref: string) {
  navigator.clipboard.writeText(ref);
  notyf.success("Transaction reference copied");
}

export function HistoryView() {
  const [selectedStatus, setSelectedStatus] = useState<WithdrawalStatus | null>(
    null
  );

  const { data: settings } = useQuery(withdrawalSettingsQueryOptions);
  const usdToInrRate = settings?.usdToInrRate ?? 1;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(withdrawalListQueryOptions(selectedStatus));

  const items: WithdrawalItem[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-3 my-3 px-4">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_FILTERS.map((filter) => {
          const isActive = selectedStatus === filter.value;
          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => setSelectedStatus(filter.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border",
                {
                  "bg-linear-to-r from-gold-btn-start via-gold-btn-mid to-gold-btn-end border-gold-btn-border text-brand-gold-dark shadow-xs":
                    isActive,
                  "bg-surface-card border-border-card/60 text-text-subtle hover:bg-surface-card-hover":
                    !isActive,
                }
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-surface-card border border-border-card/60 p-4 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="rounded-2xl bg-surface-card border border-border-card/60 p-8 text-center space-y-2">
          <Clock className="h-8 w-8 text-text-muted mx-auto opacity-50" />
          <p className="text-sm font-bold text-text-subtle">
            No {selectedStatus ? selectedStatus.toLowerCase() : ""} withdrawal
            history found
          </p>
          <p className="text-xs text-text-muted">
            Your withdrawal requests will appear here once submitted.
          </p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => {
            const isPending = item.status === "PENDING";
            const isApproved = item.status === "APPROVED";
            const isRejected = item.status === "REJECTED";
            const isUsd = item.currency === "USD";
            const symbol = isUsd ? "$" : "₹";

            // For USD, originalAmount is what user requested, amount is INR conversion
            // For INR, amount is what user requested
            let displayAmount = Number(item.amount);
            if (isUsd) {
              if (item.originalAmount && Number(item.originalAmount) > 0) {
                // Use originalAmount if it exists
                displayAmount = Number(item.originalAmount);
              } else if (usdToInrRate > 0) {
                // For old records without originalAmount, convert INR amount back to USD
                displayAmount = Number(item.amount) / usdToInrRate;
              }
            }

            // For USD withdrawals, convert charge and netAmount from INR to USD
            let displayCharge = Number(item.charge);
            let displayNetAmount = Number(item.netAmount);
            if (isUsd && usdToInrRate > 0) {
              displayCharge /= usdToInrRate;
              displayNetAmount /= usdToInrRate;
            }

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-3"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white uppercase px-2 py-0.5 rounded bg-surface-card-header border border-border-card/40">
                      {item.type} (
                      {item.currency === "USD" ? "USDT" : item.currency})
                    </span>
                    <span className="text-[11px] text-text-muted font-mono">
                      #{item.id}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border",
                      {
                        "bg-brand-gold/10 border-brand-gold/30 text-brand-gold":
                          isPending,
                        "bg-accent-teal/10 border-accent-teal/30 text-accent-teal":
                          isApproved,
                        "bg-accent-salmon/10 border-accent-salmon/30 text-accent-salmon":
                          isRejected,
                      }
                    )}
                  >
                    {isPending && <Clock className="h-3 w-3" />}
                    {isApproved && <CheckCircle2 className="h-3 w-3" />}
                    {isRejected && <XCircle className="h-3 w-3" />}
                    {item.status}
                  </span>
                </div>

                {/* Amount breakdown grid */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-surface-input-dark/60 border border-border-card/30 text-xs">
                  <div>
                    <span className="text-[11px] text-text-muted block">
                      Requested
                    </span>
                    <span className="font-bold text-white">
                      {formatAmount(Number(displayAmount), { symbol })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">
                      Fee Charge
                    </span>
                    <span className="font-bold text-accent-salmon">
                      - {formatAmount(displayCharge, { symbol })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted block">
                      Net Amount
                    </span>
                    <span className="font-black text-brand-gold">
                      {formatAmount(displayNetAmount, { symbol })}
                    </span>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="flex justify-between items-center text-[11px] text-text-subtle pt-0.5">
                  <span>
                    Requested: {new Date(item.requestedAt).toLocaleString()}
                  </span>
                  {item.processedAt && (
                    <span>
                      Processed: {new Date(item.processedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Rejection / Ref banners */}
                {isRejected && item.rejectionReason && (
                  <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-accent-salmon/10 border border-accent-salmon/20 text-xs text-accent-salmon">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <p className="leading-tight">
                      <strong>Reason:</strong> {item.rejectionReason}
                    </p>
                  </div>
                )}

                {isApproved && item.transactionRef && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent-teal/10 border border-accent-teal/20 text-xs text-accent-teal">
                    <span className="font-mono truncate">
                      Ref: {item.transactionRef}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyRef(item.transactionRef ?? "")}
                      className="flex items-center gap-1 text-[11px] font-bold underline cursor-pointer shrink-0 ml-2"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-2.5 rounded-xl bg-surface-card border border-border-card/60 text-xs font-bold text-brand-gold hover:bg-surface-card-hover transition-colors cursor-pointer"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
}
