import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

type Dashboard = {
  totalUser: number | null
  activeMember: number | null
  inActiveMember: number | null
  workingWallet: string | null
  fundWallet: string | null
  totalActiveIncome: number | null
  fundRequest: string | null
  totalPendingWithdraw: string | null
  totalWithdraw: string | null
}

export const useDashboard = () => useQuery({ queryKey: ['admin-dashboard'], queryFn: () => api<Dashboard>('/user/admin/dashboard') })
