import { useInfiniteQuery } from "@tanstack/react-query";
import { History, Loader2, Receipt } from "lucide-react";

import { rechargeHistoryInfiniteQueryOptions } from "@/queries/recharge";
import { cn } from "@/utils/cn";
import { formatAmount } from "@/utils/format-amount";
import { formatISTDate } from "@/utils/format-ist-date";

export function HistoryView() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
  } = useInfiniteQuery(rechargeHistoryInfiniteQueryOptions);

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="px-4 pb-8 space-y-4 my-3">
      {/* Container header */}
      <div className="flex items-center gap-2 mb-1">
        <History className="h-5 w-5 text-brand-gold" />
        <h2 className="text-base font-bold text-brand-gold">
          Recharge Records
        </h2>
      </div>

      {/* Loading state */}
      {isPending && (
        <div className="rounded-2xl bg-surface-card border border-border-card/60 p-8 text-center text-text-subtle text-sm">
          Loading history records...
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-2xl bg-surface-card border border-border-card/60 p-6 text-center text-accent-salmon text-sm">
          {error?.message || "Failed to load history"}
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isError && items.length === 0 && (
        <div className="rounded-2xl bg-surface-card border border-border-card/60 p-10 text-center space-y-3">
          <Receipt className="h-10 w-10 text-text-muted mx-auto opacity-50" />
          <p className="text-sm font-medium text-text-subtle">
            No recharge records found
          </p>
        </div>
      )}

      {/* Records list */}
      {!isPending && !isError && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isApproved =
              item.status.toLowerCase() === "success" ||
              item.status.toLowerCase() === "approved" ||
              item.status === "1";
            const isPendingStatus =
              item.status.toLowerCase() === "pending" || item.status === "0";

            const metadata = item.metadata ? JSON.parse(item.metadata) : null;
            const currency = metadata?.currency ?? item.type;

            return (
              <div
                key={item.id || index}
                className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-3"
              >
                {/* Header row */}
                <div className="flex items-center justify-between border-b border-border-card/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-surface-input px-2 py-0.5 text-xs font-bold text-brand-gold border border-border-card">
                      Recharge
                    </span>
                    <span className="text-xs font-semibold text-text-muted">
                      #{index + 1}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold",
                      {
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30":
                          isApproved,
                        "bg-amber-500/10 text-amber-400 border border-amber-500/30":
                          isPendingStatus,
                        "bg-accent-salmon/10 text-accent-salmon border border-accent-salmon/30":
                          !isApproved && !isPendingStatus,
                      }
                    )}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <span className="text-text-muted block text-[11px]">
                      Amount
                    </span>
                    <span className="font-extrabold text-brand-gold text-sm">
                      {formatAmount(item.amount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block text-[11px]">
                      Currency
                    </span>
                    <span className="font-semibold text-white">{currency}</span>
                  </div>

                  {item.utrNo && (
                    <div className="col-span-2">
                      <span className="text-text-muted block text-[11px]">
                        UTR No.
                      </span>
                      <span className="font-mono text-text-subtle font-medium break-all">
                        {item.utrNo}
                      </span>
                    </div>
                  )}

                  {item.remark && (
                    <div className="col-span-2">
                      <span className="text-text-muted block text-[11px]">
                        Remark
                      </span>
                      <span className="text-text-subtle font-medium">
                        {item.remark}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-text-muted block text-[11px]">
                      Created At
                    </span>
                    <span className="text-text-subtle font-medium">
                      {formatISTDate(item.createdAt)}
                    </span>
                  </div>

                  {item.respondedAt && (
                    <div>
                      <span className="text-text-muted block text-[11px]">
                        Responded At
                      </span>
                      <span className="text-text-subtle font-medium">
                        {formatISTDate(item.respondedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Load More Button */}
          {hasNextPage && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full rounded-xl bg-surface-card border border-border-card/60 py-3 text-xs font-bold text-brand-gold hover:bg-surface-card-header transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <span>Load more records</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
