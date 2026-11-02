import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { $withdrawalFetch } from "@/api/withdrawal";
import type { WithdrawalStatus } from "@/constants/withdrawal";

const WITHDRAWAL_LIST_LIMIT = 20;

export const withdrawalSettingsQueryOptions = queryOptions({
  queryKey: ["withdrawal", "settings"],
  staleTime: 10 * 60 * 1000,
  queryFn: async () => {
    const { data } = await $withdrawalFetch("@get/settings");

    if (data === null) {
      throw new Error("Failed to fetch withdrawal settings");
    }

    return data;
  },
});

export const withdrawalNeedToTradeQueryOptions = queryOptions({
  queryKey: ["withdrawal", "need-to-trade"],
  staleTime: 60 * 1000,
  queryFn: async () => {
    const { data } = await $withdrawalFetch("@get/need-to-trade");

    if (data === null) {
      throw new Error("Failed to fetch withdrawal turnover requirement");
    }

    return data.needToTrade;
  },
});

export const withdrawalListQueryOptions = (status: WithdrawalStatus | null) =>
  infiniteQueryOptions({
    queryKey: ["withdrawal", "list", status ?? "all"],
    queryFn: async ({ pageParam }) => {
      const { data } = await $withdrawalFetch("@get/", {
        query: {
          page: Number(pageParam),
          limit: WITHDRAWAL_LIST_LIMIT,
          ...(status ? { status } : {}),
        },
      });

      if (data === null) {
        throw new Error("Failed to fetch withdrawal list");
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
