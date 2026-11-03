import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export type WalletStatement = {
  index: number
  id: number
  name: string
  userId: string
  walletType: string
  date: string
  note: string
  type: string
  amount: string
}

type Statements = { totalPages: number; currentPage: number; total: number; data: WalletStatement[]; invalidUserId: boolean }

export const useWalletStatements = (query: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-wallet-statements', query, page, limit],
    queryFn: () => api<Statements>(`/user/admin/wallet-statements?${query}${query ? '&' : ''}page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  })
