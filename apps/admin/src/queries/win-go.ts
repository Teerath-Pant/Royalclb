import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[] }

export type WinGoGame = {
  index: number
  id: number
  period: string
  dateTime: string
  users: number
  totalBet: string
  adminProfit: string
  totalWinAmount: string
  totalNetWinAmount: string
}

export type WinGoBet = {
  index: number
  id: number
  uid: number | null
  name: string
  totalWallet: string
  betOn: string | number
  betAmount: string
  winAmount: string
  charge: string
  netWinAmount: string
  status: string
  dateTime: string
}

type Filters = { page: number; limit: number; search: string; fromDate: string; toDate: string }

function toQuery(base: Record<string, string | number>, { page, limit, search, fromDate, toDate }: Filters) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), ...base } as Record<string, string>)
  if (search) params.append('search', search)
  if (fromDate) params.append('fromDate', fromDate)
  if (toDate) params.append('toDate', toDate)
  return params.toString()
}

export const useWinGoMode = (interval: number) =>
  useQuery({
    queryKey: ['admin-game-mode', 'WIN_GO', interval],
    queryFn: () => api<{ mode: string | null }>(`/game-settings/mode?interval=${interval}&game=WIN_GO`),
  })

export const useSetWinGoMode = (interval: number) =>
  useMutation({
    mutationFn: (mode: string) => apiPost('/game-settings/mode', { interval, game: 'WIN_GO', mode }, 'PUT'),
  })

export const useWinGoHistory = (interval: number, filters: Filters) =>
  useQuery({
    queryKey: ['admin-win-go-history', interval, filters],
    queryFn: () => api<Paged<WinGoGame>>(`/win-go/game-history-admin?${toQuery({ interval }, filters)}`),
    placeholderData: keepPreviousData,
  })

export const useWinGoBets = (gameId: string, filters: Filters) =>
  useQuery({
    queryKey: ['admin-win-go-bets', gameId, filters],
    queryFn: () =>
      api<Paged<WinGoBet> & { totalBet: string; totalBetOnEveryOption: Record<string, string> }>(
        `/win-go/bet-history-admin?${toQuery({ gameId }, filters)}`,
      ),
    placeholderData: keepPreviousData,
  })
