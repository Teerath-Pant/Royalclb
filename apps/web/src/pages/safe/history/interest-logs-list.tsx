import { useInfiniteQuery } from "@tanstack/react-query";

import { safeInterestLogsQueryOptions } from "@/queries/safe";

import { EmptyState } from "./empty-state";
import { InterestLogCard } from "./interest-log-card";

export function InterestLogsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery(safeInterestLogsQueryOptions);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-text-muted text-sm">
        Loading interest logs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6 px-4 text-center bg-surface-card rounded-xl my-4 border border-border-card/40">
        <div className="text-accent-salmon text-sm mb-3">
          Failed to load interest logs
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="bg-transparent border border-brand-gold text-brand-gold rounded-xl py-1.5 px-4 text-xs font-bold cursor-pointer hover:bg-brand-gold/10 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const logs = data?.pages.flatMap((page) => page?.items ?? []) ?? [];

  if (logs.length === 0) {
    return <EmptyState message="No interest logs found" />;
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <InterestLogCard key={log.id} log={log} />
      ))}

      {hasNextPage && (
        <div className="text-center mt-4 mb-4">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full bg-surface-card hover:bg-[#382b3a] border border-brand-gold/30 text-brand-gold rounded-xl py-2.5 px-4 text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
