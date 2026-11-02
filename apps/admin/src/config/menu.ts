import {
  CalendarDays,
  CircleDollarSign,
  Gamepad2,
  Image,
  Mail,
  Settings,
  UserPlus,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type MenuItem = { label: string; to: string }
export type MenuGroup = { label: string; icon: LucideIcon; items: MenuItem[] }
export type MenuEntry = MenuGroup | (MenuItem & { icon: LucideIcon })

// Mirrors Admin/include/menu.php (commented-out entries are skipped, as in the original)
export const menu: MenuEntry[] = [
  { label: 'Dashboard', to: '/dashboard', icon: CalendarDays },
  {
    label: 'User Management',
    icon: UserPlus,
    items: [
      { label: 'View Member', to: '/viewMember' },
      { label: 'Search Member', to: '/searchMember' },
    ],
  },
  {
    label: 'Win Go',
    icon: Gamepad2,
    items: [
      { label: 'Game History (30 Sec)', to: '/winGo?interval=0.5' },
      { label: 'Game History (1 Min)', to: '/winGo?interval=1' },
      { label: 'Game History (3 Min)', to: '/winGo?interval=3' },
      { label: 'Game History (5 Min)', to: '/winGo?interval=5' },
    ],
  },
  {
    label: 'K3',
    icon: Gamepad2,
    items: [1, 3, 5, 10].map((m) => ({
      label: `Game History (${m} Min)`,
      to: `/gameHistoryK3?interval=${m}`,
    })),
  },
  { label: 'Dragon Tiger', icon: Gamepad2, items: [{ label: 'Game History', to: '/gameHistoryDT' }] },
  { label: 'Animal Roulette', icon: Gamepad2, items: [{ label: 'Game History', to: '/animal' }] },
  { label: 'Aviator', icon: Gamepad2, items: [{ label: 'Game History', to: '/gameHistoryAviator' }] },
  {
    label: 'Fund Manager',
    icon: Mail,
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
    label: 'App Banner',
    icon: Image,
    items: [
      { label: 'Update Banner', to: '/bannerUpdate' },
      { label: 'Update Notice', to: '/newsUpdate' },
    ],
  },
  { label: 'Withdraw', icon: CircleDollarSign, items: [{ label: 'Withdrawals', to: '/withdrawals' }] },
  {
    label: 'Support',
    icon: Mail,
    items: [
      { label: 'New Tickets', to: '/newSupportTicket' },
      { label: 'Support Tickets', to: '/supportTicket' },
    ],
  },
  { label: 'Wallet', icon: Wallet, items: [{ label: 'Wallet Statement', to: '/walletStatement' }] },
  {
    label: 'Settings',
    icon: Settings,
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
