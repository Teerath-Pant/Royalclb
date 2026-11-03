import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

export type Banner = { id: number; image: string | null }
export type News = { id: number; news: string; addDate: string }

export const useBanners = () => useQuery({ queryKey: ['admin-banners'], queryFn: () => api<Banner[]>('/settings/admin/banners') })

export function useAddBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { fileName: string; image: string }) => apiPost('/settings/admin/banners', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-banners'] }),
  })
}

export function useDeleteBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiPost(`/settings/admin/banners/${id}`, undefined, 'DELETE'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-banners'] }),
  })
}

export const useNews = () => useQuery({ queryKey: ['admin-news'], queryFn: () => api<News[]>('/settings/admin/news') })

export function useAddNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (news: string) => apiPost('/settings/admin/news', { news }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-news'] }),
  })
}

export function useDeleteNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiPost(`/settings/admin/news/${id}`, undefined, 'DELETE'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-news'] }),
  })
}
