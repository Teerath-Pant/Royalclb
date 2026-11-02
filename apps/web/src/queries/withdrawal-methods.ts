import { queryOptions } from "@tanstack/react-query";

import { $withdrawalMethodFetch } from "@/api/withdrawal-methods";

export const withdrawalMethodsQueryOptions = queryOptions({
  queryKey: ["withdrawal-methods"],
  queryFn: async () => {
    const { data } = await $withdrawalMethodFetch("@get/");

    if (data === null) {
      throw new Error("Failed to fetch withdrawal methods");
    }

    return data;
  },
});
