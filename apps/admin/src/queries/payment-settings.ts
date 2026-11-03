import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[] }

export type Upi = { id: number; upiId: string; views: number; status: string; createdAt: string }
export type WalletAddress = { id: number; address: string; views: number; status: string; createdAt: string }

export const useUpis = (status: string, search: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-upis', status, search, page, limit],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      return api<Paged<Upi>>(`/upi?${params}`)
    },
    placeholderData: keepPreviousData,
  })

export function useAddUpi() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (upiId: string) => apiPost('/upi', { upiId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-upis'] }),
  })
}

export function useSetUpiStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => apiPost(`/upi/${id}`, { status }, 'PATCH'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-upis'] }),
  })
}

export function useRemoveUpi() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiPost(`/upi/${id}`, undefined, 'DELETE'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-upis'] }),
  })
}

export const useWalletAddresses = (status: string, search: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-wallet-addresses', status, search, page, limit],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      return api<Paged<WalletAddress>>(`/wallet-address?${params}`)
    },
    placeholderData: keepPreviousData,
  })

export function useAddWalletAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (address: string) => apiPost('/wallet-address', { address }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-wallet-addresses'] }),
  })
}

export function useSetWalletAddressStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => apiPost(`/wallet-address/${id}`, { status }, 'PATCH'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-wallet-addresses'] }),
  })
}

export function useRemoveWalletAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiPost(`/wallet-address/${id}`, undefined, 'DELETE'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-wallet-addresses'] }),
  })
}
