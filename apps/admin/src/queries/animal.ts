import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[] }
type Filters = { page: number; limit: number; search: string; fromDate: string; toDate: string }

export type AnimalGame = {
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

export type AnimalBet = {
  index: number
  id: number
  uid: number | null
  name: string
  totalWallet: string
  betOn: string
  betAmount: string
  winAmount: string
  charge: string
  netWinAmount: string
  status: string
  dateTime: string
}

function toQuery(base: Record<string, string | number>, { page, limit, search, fromDate, toDate }: Filters) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), ...base } as Record<string, string>)
  if (search) params.append('search', search)
  if (fromDate) params.append('fromDate', fromDate)
  if (toDate) params.append('toDate', toDate)
  return params.toString()
}

export const useAnimalHistory = (interval: number, filters: Filters) =>
  useQuery({
    queryKey: ['admin-animal-history', interval, filters],
    queryFn: () => api<Paged<AnimalGame>>(`/animal/game-history-admin?${toQuery({ interval }, filters)}`),
    placeholderData: keepPreviousData,
  })

export const useAnimalBets = (gameId: string, filters: Filters) =>
  useQuery({
    queryKey: ['admin-animal-bets', gameId, filters],
    queryFn: () => api<Paged<AnimalBet>>(`/animal/bet-history-admin?${toQuery({ gameId }, filters)}`),
    placeholderData: keepPreviousData,
  })
