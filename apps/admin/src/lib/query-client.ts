import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from './api'
import { notyf } from './notyf'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: { silent?: boolean }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000, retry: false } },

  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) return
      notyf.error(error.message || 'Failed to fetch data')
    },
  }),

  mutationCache: new MutationCache({
    onSuccess: (data, _variables, _context, mutation) => {
      const message = (data as { message?: string } | undefined)?.message
      if (message && !mutation.meta?.silent) notyf.success(message)
    },
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.silent) notyf.error(error.message || 'Something went wrong')
    },
  }),
})
