import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[] }
type Filters = { page: number; limit: number; search: string; fromDate: string; toDate: string }

export type DragonTigerGame = {
  index: number
  id: number
  period_id: string
  date_time: string
  users: number
  total_bet: string
  admin_profit: string
  total_win_amount: string
  total_net_win_amount: string
}

export type DragonTigerBet = {
  index: number
  id: number
  uid: number | null
  name: string
  total_wallet: string
  bet_on: string
  bet_amount: string
  win_amount: string
  charge: string
  net_win_amount: string
  status: string
  date_time: string
}

function toQuery(base: Record<string, string | number>, { page, limit, search, fromDate, toDate }: Filters) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), ...base } as Record<string, string>)
  if (search) params.append('search', search)
  if (fromDate) params.append('fromDate', fromDate)
  if (toDate) params.append('toDate', toDate)
  return params.toString()
}

export const useDragonTigerHistory = (filters: Filters) =>
  useQuery({
    queryKey: ['admin-dt-history', filters],
    queryFn: () => api<Paged<DragonTigerGame>>(`/dragon-tiger/game-history-admin?${toQuery({}, filters)}`),
    placeholderData: keepPreviousData,
  })

export const useDragonTigerBets = (gameId: string, filters: Filters) =>
  useQuery({
    queryKey: ['admin-dt-bets', gameId, filters],
    queryFn: () =>
      api<Paged<DragonTigerBet> & { totalBet: string }>(`/dragon-tiger/bet-history-admin?${toQuery({ gameId }, filters)}`),
    placeholderData: keepPreviousData,
  })
