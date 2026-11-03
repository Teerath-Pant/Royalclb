import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

type AdminMe = { memberId: number; userId: string; name: string }

export const useAdminMe = () => useQuery({ queryKey: ['admin-me'], queryFn: () => api<AdminMe>('/auth/admin/me') })

export const useAdminLogin = () =>
  useMutation({ mutationFn: (body: { email: string; password: string }) => apiPost('/auth/admin/login', body) })

export function useVerifyAdminOtp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { email: string; otp: string }) => apiPost('/auth/admin/login/verify-otp', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-me'] }),
  })
}

export const useChangeAdminPassword = () =>
  useMutation({
    mutationFn: (body: { password: string; password1: string; password2: string }) =>
      apiPost('/auth/admin/change-password', body),
    meta: { silent: true },
  })

export function useAdminLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => apiPost('/auth/admin/logout'),
    onSuccess: () => qc.clear(),
  })
}
