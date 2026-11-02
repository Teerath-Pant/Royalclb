import { infiniteQueryOptions } from "@tanstack/react-query";

import { $giftCodeFetch } from "@/api/gift-code";

const CLAIM_HISTORY_LIMIT = 10;

async function fetchClaimHistoryPage({ pageParam }: { pageParam: number }) {
  const data = await $giftCodeFetch("@get/claim-history", {
    query: { page: String(pageParam), limit: String(CLAIM_HISTORY_LIMIT) },
  });
  if (!data) {
    return { items: [], totalPages: 1, currentPage: pageParam };
  }
  return data.data;
}

export const claimHistoryQueryOptions = infiniteQueryOptions({
  queryKey: ["gift-claim-history"],
  queryFn: fetchClaimHistoryPage,
  initialPageParam: 1,
  getNextPageParam: (lastPage) =>
    lastPage.currentPage < lastPage.totalPages
      ? lastPage.currentPage + 1
      : undefined,
});
