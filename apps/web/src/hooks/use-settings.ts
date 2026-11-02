import { useQuery, useQueryClient } from "@tanstack/react-query";

import { settingsQueryOptions } from "@/queries/settings";

export function useSettings() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(settingsQueryOptions);

  return {
    settings: data,
    isPending,
    refresh: () => queryClient.invalidateQueries(settingsQueryOptions),
  };
}
