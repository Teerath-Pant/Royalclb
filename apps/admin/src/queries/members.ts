import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

export type Member = {
  memberId: number
  uid: number | null
  userId: string | null
  name: string
  phone: string
  password: string
  sponser: string
  fundWallet: string
  wallet: string
  bonusWallet: string
  totalWallet: string
  dateTime: string
  accountStatus: number
}

type Members = { invalidUserId: boolean; data: Member[]; total: number; currentPage: number; totalPages: number }

export const MEMBERS_PER_PAGE = 50

export const useMembers = (userId: string, page: number) =>
  useQuery({
    queryKey: ['admin-members', userId, page],
    queryFn: () => api<Members>(`/user/admin/members?user_id=${encodeURIComponent(userId)}&page=${page}&limit=${MEMBERS_PER_PAGE}`),
    placeholderData: keepPreviousData,
  })

export function useSetMemberStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { memberId: number; blockStatus: number }) => apiPost('/user/admin/members/status', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-members'] }),
  })
}

export const useImpersonate = () =>
  useMutation({
    mutationFn: (memberId: number) => apiPost('/auth/admin/impersonate', { memberId }),
    onSuccess: () => window.open('/home', '_blank'),
  })

export type MemberDetails = {
  memberId: number
  userId: string | null
  name: string
  phone: string
  emailId: string
  sponser: string
  dateOfJoining: string
  password: string
}

export const useMemberDetails = (userId: string) =>
  useQuery({
    queryKey: ['admin-member-details', userId],
    queryFn: () => api<MemberDetails | null>(`/user/admin/members/details?user_id=${encodeURIComponent(userId)}`),
  })

export function useUpdateMemberDetails() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { memberId: number; name: string; phone: string; emailId: string; password: string }) =>
      apiPost('/user/admin/members/details', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-member-details'] })
      qc.invalidateQueries({ queryKey: ['admin-members'] })
    },
  })
}

export type SearchedMember = {
  memberId: number
  userId: string | null
  name: string
  phone: string
  sponserUserId: string
  sponserName: string
  dateOfJoining: string
  password: string
}

export const useSearchMembers = (search: string | null) =>
  useQuery({
    queryKey: ['admin-members-search', search],
    queryFn: () => api<SearchedMember[]>(`/user/admin/members/search?search_value=${encodeURIComponent(search ?? '')}`),
    enabled: search !== null,
  })
