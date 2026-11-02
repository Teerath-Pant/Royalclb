import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { $safeFetch } from "@/api/safe";

export const safeBalanceQueryOptions = queryOptions({
  queryKey: ["safe", "balance"],
  queryFn: async () => {
    const { data } = await $safeFetch("@get/balance");

    if (data === null) {
      throw new Error("Failed to fetch safe balance");
    }

    return data;
  },
});

export const safeSettingsQueryOptions = queryOptions({
  queryKey: ["safe", "settings"],
  staleTime: 10 * 60 * 1000,
  queryFn: async () => {
    const { data } = await $safeFetch("@get/settings");

    if (data === null) {
      throw new Error("Failed to fetch safe settings");
    }

    return data;
  },
});

const TRANSACTIONS_LIMIT = 10;

export const safeTransactionsQueryOptions = infiniteQueryOptions({
  queryKey: ["safe", "transactions"],
  queryFn: async ({ pageParam }) => {
    const { data } = await $safeFetch("@get/transactions", {
      query: {
        page: String(pageParam),
        limit: String(TRANSACTIONS_LIMIT),
      },
    });

    if (data === null) {
      throw new Error("Failed to fetch safe transactions");
    }

    return data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    if (!lastPage) {
      return;
    }
    const totalPages = Math.ceil(lastPage.total / lastPage.limit);
    return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
  },
});

const INTEREST_LOGS_LIMIT = 10;

export const safeInterestLogsQueryOptions = infiniteQueryOptions({
  queryKey: ["safe", "interest-logs"],
  queryFn: async ({ pageParam }) => {
    const { data } = await $safeFetch("@get/interest-logs", {
      query: {
        page: String(pageParam),
        limit: String(INTEREST_LOGS_LIMIT),
      },
    });

    if (data === null) {
      throw new Error("Failed to fetch safe interest logs");
    }

    return data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    if (!lastPage) {
      return;
    }
    const totalPages = Math.ceil(lastPage.total / lastPage.limit);
    return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
  },
});

export const safeAccumulatedRevenueQueryOptions = queryOptions({
  queryKey: ["safe", "accumulated-revenue"],
  queryFn: async () => {
    const { data } = await $safeFetch("@get/accumulated-revenue");

    if (data === null) {
      throw new Error("Failed to fetch accumulated revenue");
    }

    return data;
  },
});
