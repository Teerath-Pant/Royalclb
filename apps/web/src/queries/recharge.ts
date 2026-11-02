import { infiniteQueryOptions } from "@tanstack/react-query";

import { $rechargefetch } from "@/api/recharge";

const RECHARGE_HISTORY_LIMIT = 10;

export const rechargeHistoryInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ["recharge", "history"],
  queryFn: async ({ pageParam }) => {
    const { data } = await $rechargefetch("@get/recharge", {
      query: {
        page: Number(pageParam),
        limit: RECHARGE_HISTORY_LIMIT,
      },
    });

    if (data === null) {
      throw new Error("Failed to fetch recharge history");
    }

    return data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    if (!lastPage) {
      return;
    }
    const currentPage = lastPage.currentPage ?? 1;
    const totalPages = lastPage.totalPages ?? 1;
    return currentPage < totalPages ? currentPage + 1 : undefined;
  },
});
