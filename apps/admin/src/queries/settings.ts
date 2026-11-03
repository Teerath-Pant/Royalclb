import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

type Popup = { dashboardImage: string | null; imageStatus: number | null }

export const usePopup = () => useQuery({ queryKey: ['admin-popup'], queryFn: () => api<Popup>('/settings/admin/popup') })

export function useUpdatePopupImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { fileName: string; image: string }) => apiPost('/settings/admin/popup/image', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-popup'] }),
  })
}

export function useUpdatePopupStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (imageStatus: number) => apiPost('/settings/admin/popup/status', { imageStatus }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-popup'] }),
  })
}

export const useTelegramLink = () =>
  useQuery({ queryKey: ['admin-link', 'telegram'], queryFn: () => api<{ link: string }>('/links?name=telegram') })

export function useUpdateTelegramLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (link: string) => apiPost('/links', { name: 'telegram', link }, 'PUT'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-link', 'telegram'] }),
  })
}
