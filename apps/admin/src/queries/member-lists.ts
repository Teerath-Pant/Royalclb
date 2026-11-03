import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export type ListedMember = {
  index: number
  memberId: number
  userId: string | null
  name: string
  phone: string
  sponser: string
  dateTime: string
  activationDate: string
  topupFlag: number
  accountStatus: number
}

export type WalletOutstandingRow = {
  index: number
  memberId: number
  name: string
  userId: string | null
  dateTime: string
  wallet: string
  fundWallet: string
}

type Paged<T> = { totalPages: number; currentPage: number; total: number; data: T[]; invalidUserId: boolean }

const useList = <T>(key: string, path: string, query: string, page: number, limit: number) =>
  useQuery({
    queryKey: [key, query, page, limit],
    queryFn: () => api<Paged<T>>(`${path}?${query}${query ? '&' : ''}page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  })

export const useActiveMembers = (query: string, page: number, limit: number) =>
  useList<ListedMember>('admin-active-members', '/user/admin/members/active', query, page, limit)

export const useInActiveMembers = (query: string, page: number, limit: number) =>
  useList<ListedMember>('admin-inactive-members', '/user/admin/members/inactive', query, page, limit)

export const useMembersByJoinDate = (query: string, page: number, limit: number) =>
  useList<ListedMember>('admin-members-by-join-date', '/user/admin/members/by-join-date', query, page, limit)

export const useWalletOutstanding = (query: string, page: number, limit: number) =>
  useList<WalletOutstandingRow>('admin-wallet-outstanding', '/user/admin/wallet-outstanding', query, page, limit)
