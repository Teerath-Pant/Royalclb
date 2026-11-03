import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[] }

export type Recharge = {
  id: number
  uid: number | null
  name: string
  amount: string
  utrNo: string | null
  type: string
  remark: string | null
  status: string
  createdAt: string
}

type RechargeFilters = { page: number; limit: number; search: string; fromDate: string; toDate: string; status: string }

export const useRecharges = ({ page, limit, search, fromDate, toDate, status }: RechargeFilters) =>
  useQuery({
    queryKey: ['admin-recharges', page, limit, search, fromDate, toDate, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.append('search', search)
      if (fromDate) params.append('fromDate', fromDate)
      if (toDate) params.append('toDate', toDate)
      if (status) params.append('status', status)
      return api<Paged<Recharge>>(`/fund/recharge-admin?${params}`)
    },
    placeholderData: keepPreviousData,
  })

export function useRechargeResponse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { id: number; remark: string; response: string }) => apiPost('/fund/recharge-admin', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-recharges'] }),
  })
}

export type OnlineDeposit = {
  index: number
  id: number
  username: string | null
  name: string
  amount: string
  createdAt: string
  status: string
}

export const useOnlineDeposits = (withdrawStatus: string, fromDate: string, toDate: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-online-deposits', withdrawStatus, fromDate, toDate, page, limit],
    queryFn: () =>
      api<Paged<OnlineDeposit>>(
        `/fund/online-deposit-admin?withdrawStatus=${withdrawStatus}&from_date=${fromDate}&to_date=${toDate}&page=${page}&limit=${limit}`,
      ),
    placeholderData: keepPreviousData,
  })

export const useSponserName = () =>
  useMutation({
    mutationFn: (sponserId: string) =>
      api<{ name: string }>(`/user/admin/sponser-name?sponser_id=${encodeURIComponent(sponserId)}`),
    meta: { silent: true },
  })

export const useFundTransfer = () =>
  useMutation({
    mutationFn: (body: { userId: string; amount: string }) => apiPost('/fund/transfer-admin', body),
    meta: { silent: true },
  })

export type FundTransfer = {
  index: number
  id: number
  sender: string
  receiver: string
  amount: string
  dateTime: string
}

export const useFundTransfers = (query: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-fund-transfers', query, page, limit],
    queryFn: () =>
      api<Paged<FundTransfer> & { invalidUserId: boolean }>(
        `/fund/transfer-history-admin?${query}${query ? '&' : ''}page=${page}&limit=${limit}`,
      ),
    placeholderData: keepPreviousData,
  })

export type UserWallet = { name: string; wallet: string; fundWallet: string; bonusWallet: string }

export const useUserWallet = () =>
  useMutation({
    mutationFn: (userId: string) => api<UserWallet>(`/fund/user-wallet-admin?userId=${encodeURIComponent(userId)}`),
    meta: { silent: true },
  })

export const useWalletDeduct = () =>
  useMutation({
    mutationFn: (body: { userId: string; wallet: string; amount: string }) => apiPost('/fund/wallet-deduct-admin', body),
    meta: { silent: true },
  })
