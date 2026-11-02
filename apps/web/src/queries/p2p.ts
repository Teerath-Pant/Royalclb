import { queryOptions } from "@tanstack/react-query";

import { $p2pFetch } from "@/api/p2p";
import type { TransferHistoryResponse } from "@/api/p2p";
import { $userfetch } from "@/api/user";

export function p2pHistoryQueryOptions({
  page,
  limit = 10,
}: {
  page: number;
  limit?: number;
}) {
  return queryOptions<TransferHistoryResponse>({
    queryKey: ["p2p", "history", page, limit],
    queryFn: async () => {
      const { data, error } = await $p2pFetch("@get/transfer", {
        query: { page, limit },
      });

      if (error || !data?.data) {
        throw new Error(error?.message || "Failed to fetch P2P history");
      }

      return data.data;
    },
  });
}

export async function fetchUserName(id: string): Promise<string | null> {
  try {
    const { data, error } = await $userfetch("@get/name/:id", {
      params: { id },
    });

    if (error || !data?.data?.name) {
      return null;
    }

    return data.data.name;
  } catch {
    return null;
  }
}
