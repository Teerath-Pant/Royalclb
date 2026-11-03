import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

export type GiftCode = {
  id: number
  code: string
  amount: string
  maxClaims: number
  claimedCount: number
  expiresAt: string
  status: string
  createdAt: string
}

type GiftCodes = { totalPages: number; currentPage: number; total: number; items: GiftCode[] }

export const useGiftCodes = (status: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-gift-codes', status, page, limit],
    queryFn: () => api<GiftCodes>(`/gift-codes/admin?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
    placeholderData: keepPreviousData,
  })

export function useCreateGiftCode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { code: string; amount: number; maxClaims: number }) => apiPost('/gift-codes/admin', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-gift-codes'] }),
  })
}

export function useDeleteGiftCode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiPost(`/gift-codes/admin/${id}`, undefined, 'DELETE'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-gift-codes'] }),
  })
}
