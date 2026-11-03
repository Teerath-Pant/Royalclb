export type MenuItem = { label: string; to: string }
export type MenuGroup = { id: string; label: string; icon: string; items: MenuItem[] }
export type MenuLink = MenuItem & { id: string; icon: string }
export type MenuEntry = MenuGroup | MenuLink

export const menu: MenuEntry[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: 'ri-calendar-event-fill' },
  {
    id: 'member',
    label: 'User Management',
    icon: 'ri-user-add-fill',
    items: [
      { label: 'View Member', to: '/viewMember' },
      { label: 'Search Member', to: '/searchMember' },
    ],
  },
  {
    id: 'winGo',
    label: 'Win Go',
    icon: 'ri-user-add-fill',
    items: [
      { label: 'Game History (30 Sec)', to: '/winGo?interval=0.5' },
      { label: 'Game History (1 Min)', to: '/winGo?interval=1' },
      { label: 'Game History (3 Min)', to: '/winGo?interval=3' },
      { label: 'Game History (5 Min)', to: '/winGo?interval=5' },
    ],
  },
  {
    id: 'k3',
    label: 'K3',
    icon: 'ri-user-add-fill',
    items: [1, 3, 5, 10].map((m) => ({ label: `Game History (${m} Min)`, to: `/gameHistoryK3?interval=${m}` })),
  },
  {
    id: 'dragonTiger',
    label: 'Dragon Tiger',
    icon: 'ri-user-add-fill',
    items: [{ label: 'Game History', to: '/gameHistoryDT' }],
  },
  {
    id: 'animal',
    label: 'Animal Roulette',
    icon: 'ri-user-add-fill',
    items: [{ label: 'Game History', to: '/animal' }],
  },
  {
    id: 'aviator',
    label: 'Aviator',
    icon: 'ri-user-add-fill',
    items: [{ label: 'Game History', to: '/gameHistoryAviator' }],
  },
  {
    id: 'transfer',
    label: 'Fund Manager',
    icon: 'ri-mail-open-fill',
    items: [
      { label: 'Fund Request Details', to: '/recharges' },
      { label: 'Deposit Online History', to: '/funddepositHistory' },
      { label: 'Gift Codes', to: '/gift-codes' },
      { label: 'Fund Transfer', to: '/fundTransfer' },
      { label: 'Fund Transfer History', to: '/fundTransferHistory' },
      { label: 'Wallet Deduction', to: '/walletDeduct' },
    ],
  },
  {
    id: 'banner',
    label: 'App Banner',
    icon: 'ri-mail-open-fill',
    items: [
      { label: 'Update Banner', to: '/bannerUpdate' },
      { label: 'Update Notice', to: '/newsUpdate' },
    ],
  },
  {
    id: 'withdraw',
    label: 'Withdraw',
    icon: 'ri-money-dollar-circle-fill',
    items: [{ label: 'Withdrawals', to: '/withdrawals' }],
  },
  {
    id: 'support',
    label: 'Support',
    icon: 'fa fa-envelope',
    items: [
      { label: 'New Tickets', to: '/newSupportTicket' },
      { label: 'Support Tickets', to: '/supportTicket' },
    ],
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: 'ri-wallet-fill',
    items: [{ label: 'Wallet Statement', to: '/walletStatement' }],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'ri-wallet-fill',
    items: [
      { label: 'Upi Settings', to: '/upi' },
      { label: 'Wallet Address Settings', to: '/wallet-address' },
      { label: 'Popup Update', to: '/popupUpdate' },
      { label: 'Other Settings', to: '/otherSettings' },
      { label: 'Links Settings', to: '/linksSettings' },
    ],
  },
]

export const isGroup = (e: MenuEntry): e is MenuGroup => 'items' in e

export function activeTo(pathname: string, search: string) {
  if (pathname === '/viewMemberDetails') return '/viewMember'
  if (pathname === '/winGoBets') return `/winGo?interval=${new URLSearchParams(search).get('interval') ?? 0.5}`
  if (pathname === '/betHistoryK3') return `/gameHistoryK3?interval=${new URLSearchParams(search).get('interval')}`
  if (pathname === '/betHistoryDT') return '/gameHistoryDT'
  if (pathname === '/animalBets') return '/animal'
  if (pathname === '/betHistoryAviator') return '/gameHistoryAviator'
  if (['/viewActiveMember', '/viewInActiveMember', '/activeIncomeUserMember'].includes(pathname)) return '/viewMember'
  if (pathname === '/walletOutstanding') return '/walletStatement'
  return pathname + search
}
