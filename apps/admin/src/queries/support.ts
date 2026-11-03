import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

export type SupportSubject = { subjectId: number; subjectName: string }

export type SupportTicket = {
  index: number
  ticketId: number
  userId: string
  name: string
  ticketCode: string | null
  subjectId: number
  subjectName: string
  ticketMessage: string | null
  hasAttachment: boolean
  raiseDate: string
  actionDate: string
  ticketStatus: number
}

type Tickets = { totalPages: number; currentPage: number; total: number; data: SupportTicket[] }

export const useSupportSubjects = () =>
  useQuery({ queryKey: ['admin-support-subjects'], queryFn: () => api<SupportSubject[]>('/support/admin/subjects') })

export const useSupportTickets = (query: string, page: number, limit: number) =>
  useQuery({
    queryKey: ['admin-support-tickets', query, page, limit],
    queryFn: () => api<Tickets>(`/support/admin/tickets?${query}${query ? '&' : ''}page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  })

export function useUpdateSupportTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ticketId, ...body }: { ticketId: number; subjectId: number; ticketStatus: number }) =>
      apiPost(`/support/admin/tickets/${ticketId}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-support-tickets'] }),
  })
}

export const attachmentUrl = (ticketId: number) => `/api/support/admin/tickets/${ticketId}/attachment`
