import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  History,
  Loader2,
  Receipt,
} from "lucide-react";
import { useState } from "react";

import { p2pHistoryQueryOptions } from "@/queries/p2p";
import { cn } from "@/utils/cn";
import { formatAmount } from "@/utils/format-amount";
import { formatISTDate } from "@/utils/format-ist-date";

export function HistoryView() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isPending, isError, error, refetch } = useQuery(
    p2pHistoryQueryOptions({ page, limit })
  );

  const items = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.currentPage ?? page;

  return (
    <div className="px-4 pb-8 space-y-4 my-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <History className="h-5 w-5 text-brand-gold" />
        <h2 className="text-base font-bold text-brand-gold">
          P2P Transfer Records
        </h2>
      </div>

      {/* Loading state */}
      {isPending && (
        <div className="rounded-2xl bg-surface-card border border-border-card/60 p-8 text-center text-text-subtle text-sm flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
          <span>Loading history records...</span>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-2xl bg-surface-card border border-border-card/60 p-6 text-center space-y-3">
          <div className="text-accent-salmon text-sm">
            {error?.message || "Failed to load history"}
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="border border-brand-gold text-brand-gold rounded-xl py-1.5 px-4 text-xs font-bold cursor-pointer hover:bg-brand-gold/10 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isError && items.length === 0 && (
        <div className="rounded-2xl bg-surface-card border border-border-card/60 p-10 text-center space-y-3">
          <Receipt className="h-10 w-10 text-text-muted mx-auto opacity-50" />
          <p className="text-sm font-medium text-text-subtle">
            No P2P transfer records found
          </p>
        </div>
      )}

      {/* Records list */}
      {!isPending && !isError && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isSenderMe = item.sender.uid === item.uid;
            const isReceiverMe = item.receiver.uid === item.uid;
            const serialNo = (currentPage - 1) * limit + index + 1;

            return (
              <div
                key={`${item.dateTime}-${serialNo}`}
                className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-3"
              >
                {/* Header row */}
                <div className="flex items-center justify-between border-b border-border-card/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-surface-input px-2 py-0.5 text-xs font-bold text-brand-gold border border-border-card">
                      P2P Transfer
                    </span>
                  </div>

                  <span className="text-xs font-bold text-brand-gold-light">
                    S.NO #{serialNo}
                  </span>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
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
                      Charge
                    </span>
                    <span className="font-semibold text-text-subtle">
                      {formatAmount(item.charge)}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block text-[11px]">
                      Net Amount
                    </span>
                    <span className="font-bold text-white">
                      {formatAmount(item.netAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block text-[11px]">
                      Date Time
                    </span>
                    <span className="text-text-subtle font-medium">
                      {formatISTDate(item.dateTime)}
                    </span>
                  </div>

                  <div className="col-span-2 border-t border-border-card/40 pt-2 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-[11px]">
                        Sender:
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          isSenderMe
                            ? "text-brand-gold font-bold bg-brand-gold/10 px-1.5 py-0.5 rounded border border-brand-gold/30"
                            : "text-white"
                        )}
                      >
                        {item.sender.uid} ({item.sender.name})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-[11px]">
                        Receiver:
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          isReceiverMe
                            ? "text-accent-teal font-bold bg-accent-teal/10 px-1.5 py-0.5 rounded border border-accent-teal/30"
                            : "text-white"
                        )}
                      >
                        {item.receiver.uid} ({item.receiver.name})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex items-center justify-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="h-9 w-9 rounded-xl bg-surface-card border border-border-card flex items-center justify-center text-brand-gold hover:bg-surface-card-header disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-xs font-semibold text-text-subtle">
                <span className="text-brand-gold font-bold">{currentPage}</span>
                {" / "}
                <span>{totalPages}</span>
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-9 w-9 rounded-xl bg-surface-card border border-border-card flex items-center justify-center text-brand-gold hover:bg-surface-card-header disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
