import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[] }

export type AviatorGame = {
  index: number
  id: number
  bucketAmount: string
  maxFly: string
  users: number
  totalBet: string
  adminProfit: string
  adminProfitSign: number
  winningAmount: string
  userAmount: string
  status: string
  createdAt: string
  endedAt: string
}

export type AviatorBet = {
  index: number
  id: number
  uid: number | null
  name: string
  betAmount: string
  cashoutMultiplier: string | null
  winAmount: string
  tax: string
  netAmount: string
  status: string
  createdAt: string
}

export const useAviatorGames = (fromDate: string, toDate: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-aviator-games', fromDate, toDate, page, limit],
    queryFn: () =>
      api<Paged<AviatorGame> & { bucket: string | null }>(
        `/aviator/admin/games?from_date=${fromDate}&to_date=${toDate}&page=${page}&limit=${limit}`,
      ),
    placeholderData: keepPreviousData,
  })

export function useResetAviatorBucket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => apiPost('/aviator/admin/reset-bucket'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-aviator-games'] }),
  })
}

export const useAviatorBets = (sessionId: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-aviator-bets', sessionId, page, limit],
    queryFn: () => api<Paged<AviatorBet>>(`/aviator/admin/bets?sessionId=${sessionId}&page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  })
