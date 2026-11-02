// oxlint-disable prefer-destructuring
import { BetterFetchError } from "@better-fetch/fetch";
import type { QueryKey } from "@tanstack/react-query";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { notyf } from "./notyf";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQueries?: QueryKey[];
      successMessage?: string;
      errorMessage?: string;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: true,
      retry: false,
    },
  },

  queryCache: new QueryCache({
    onError: (error) => {
      if ((error as { status?: number }).status === 401) {
        return;
      }

      let message = "Failed to fetch data";

      if (error instanceof BetterFetchError) {
        const errObj = error.error;

        if (
          errObj &&
          typeof errObj === "object" &&
          "message" in errObj &&
          typeof errObj.message === "string"
        ) {
          message = errObj.message;
        }
      } else {
        message = error.message;
      }

      notyf.error(message);
    },
  }),

  mutationCache: new MutationCache({
    onSuccess(data, _variable, _context, mutation) {
      if (mutation.meta?.successMessage) {
        notyf.success(mutation.meta.successMessage);
      }

      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        notyf.success(data.message);
      }
    },

    onError(error, _variable, _context, mutation) {
      let message = "Something went wrong";

      if (mutation.meta?.errorMessage) {
        message = mutation.meta.errorMessage;
      } else if (error instanceof BetterFetchError) {
        const errObj = error.error;

        if (
          errObj &&
          typeof errObj === "object" &&
          "message" in errObj &&
          typeof errObj.message === "string"
        ) {
          message = errObj.message;
        }
      } else {
        message = error.message;
      }

      notyf.error(message);
    },
    onSettled(_data, _error, _variable, _context, mutation) {
      const keys = mutation.meta?.invalidateQueries;

      if (Array.isArray(keys) && keys.length > 0) {
        for (const queryKey of keys) {
          queryClient.invalidateQueries({ queryKey });
        }
      }
    },
  }),
});
