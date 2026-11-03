import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

export type Withdrawal = {
  id: number
  userId: number
  type: string
  currency: string
  originalAmount: string
  amount: string
  charge: string
  netAmount: string
  destinationSnapshot: string | null
  status: string
  rejectionReason: string | null
  transactionRef: string | null
  requestedAt: string
  meddolic_user_details?: { name: string; member_id: number }
}

type Withdrawals = { totalPages: number; currentPage: number; total: number; data: Withdrawal[] }

export const useWithdrawals = (status: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-withdrawals', status, page, limit],
    queryFn: () => api<Withdrawals>(`/withdrawal/admin?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
    placeholderData: keepPreviousData,
  })

export function useApproveWithdrawal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, transactionRef }: { id: number; transactionRef: string }) =>
      apiPost(`/withdrawal/admin/${id}/approve`, { transactionRef }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }),
  })
}

export function useRejectWithdrawal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: number; rejectionReason: string }) =>
      apiPost(`/withdrawal/admin/${id}/reject`, { rejectionReason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }),
  })
}
