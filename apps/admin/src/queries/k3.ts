import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[] }
type Filters = { page: number; limit: number; search: string; fromDate: string; toDate: string }

export type K3Game = {
  index: number
  id: number
  game_id: string
  date_time: string
  users: number
  total_bet: string
  admin_profit: string
  total_win_amount: string
  total_net_win_amount: string
}

export type K3Bet = {
  index: number
  id: number
  uid: number | null
  name: string
  totalWallet: string
  betOn: string | number | null
  betAmount: string
  winAmount: string
  charge: string
  netWinAmount: string
  status: number
  dateTime: string
}

export const useK3Mode = (interval: number) =>
  useQuery({
    queryKey: ['admin-k3-mode', interval],
    queryFn: () => api<{ mode: string | null }>(`/k3/settings/mode?interval=${interval}`),
  })

export const useSetK3Mode = (interval: number) =>
  useMutation({
    mutationFn: (mode: string) => apiPost('/k3/settings/mode', { interval, mode }, 'PUT'),
  })

export const useK3History = (interval: number, { page, limit, search, fromDate, toDate }: Filters) =>
  useQuery({
    queryKey: ['admin-k3-history', interval, page, limit, search, fromDate, toDate],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), interval: String(interval) })
      if (search) params.append('search', search)
      if (fromDate) params.append('fromDate', fromDate)
      if (toDate) params.append('toDate', toDate)
      return api<Paged<K3Game>>(`/k3/game-history-admin?${params}`)
    },
    placeholderData: keepPreviousData,
  })

export const useK3Bets = (sessionId: string, page: number, limit: number, search: string) =>
  useQuery({
    queryKey: ['admin-k3-bets', sessionId, page, limit, search],
    queryFn: () => {
      const params = new URLSearchParams({ sessionId, page: String(page), limit: String(limit) })
      if (search) params.append('search', search)
      return api<Paged<K3Bet> & { gameId: string | null; interval: number | null }>(`/k3/bet-history-admin?${params}`)
    },
    placeholderData: keepPreviousData,
  })
