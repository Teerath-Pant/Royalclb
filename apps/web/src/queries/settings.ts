import { queryOptions } from "@tanstack/react-query";

import { $settingsfetch } from "@/api/settings";

export const settingsQueryOptions = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await $settingsfetch("@get/");

    if (error) {
      throw new Error(error.message ?? "Failed to fetch settings");
    }

    return data.data;
  },
});
