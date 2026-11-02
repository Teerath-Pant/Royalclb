import { ChevronRight, Circle, LogOut, Minus, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { isGroup, menu, type MenuGroup } from '../config/menu'

const itemCls = (active: boolean) =>
  `flex items-center gap-2.5 rounded-2xl p-3.5 text-sm ${
    active ? 'bg-white text-primary' : 'text-white hover:bg-black/10'
  }`

// Desktop collapsed (80px, icons only) shows labels again while sidebar is hovered — like the original
function Group({ group, current, lbl }: { group: MenuGroup; current: string; lbl: string }) {
  const hasActive = group.items.some((i) => i.to === current)
  const [open, setOpen] = useState(hasActive)
  const Icon = group.icon

  return (
    <li>
      <button onClick={() => setOpen(!open)} className={`${itemCls(hasActive)} w-full cursor-pointer`}>
        <Icon size={18} className="shrink-0" />
        <span className={lbl}>{group.label}</span>
        <ChevronRight size={16} className={`ml-auto transition-transform ${lbl} ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <ul className="mt-1">
          {group.items.map((i) => (
            <li key={i.to}>
              <Link
                to={i.to}
                className={`flex items-center gap-2 py-2.5 pl-6 text-sm ${
                  i.to === current ? 'bg-primary-light text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                <Circle size={8} className="shrink-0" /> <span className={lbl}>{i.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

type Props = { open: boolean; collapsed: boolean; onClose: () => void }

export default function Sidebar({ open, collapsed, onClose }: Props) {
  const { pathname, search } = useLocation()
  const current = pathname + search
  const lbl = collapsed ? 'xl:hidden xl:group-hover/side:inline' : ''

  return (
    <aside
      className={`group/side peer fixed inset-y-0 left-0 z-40 w-65 overflow-y-auto overflow-x-hidden bg-linear-to-r from-primary to-primary-dark pb-6 transition-[width,transform] xl:translate-x-0 ${
        open ? '' : '-translate-x-full'
      } ${collapsed ? 'xl:w-20 xl:hover:w-65' : ''}`}
    >
      <div className="flex items-center justify-between p-5 text-xl font-bold text-white">
        <span className={lbl}>Royalclub</span>
        <button onClick={onClose} className="cursor-pointer xl:hidden" aria-label="Close menu">
          <X />
        </button>
      </div>
      <ul className="space-y-1 px-4">
        <li className="flex items-center px-3 py-2 text-sm font-medium text-white">
          {collapsed && <Minus size={20} className="hidden xl:block xl:group-hover/side:hidden" />}
          <span className={lbl}>Menu</span>
        </li>
        {menu.map((e) =>
          isGroup(e) ? (
            <Group key={e.label} group={e} current={current} lbl={lbl} />
          ) : (
            <li key={e.to}>
              <Link to={e.to} className={itemCls(e.to === current)}>
                <e.icon size={18} className="shrink-0" />
                <span className={lbl}>{e.label}</span>
              </Link>
            </li>
          ),
        )}
        <li>
          <Link to="/login" className={itemCls(false)}>
            <LogOut size={18} className="shrink-0" />
            <span className={lbl}>Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  )
}
