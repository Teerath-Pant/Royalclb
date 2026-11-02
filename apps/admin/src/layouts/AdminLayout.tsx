import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

// original template: below 1300px sidebar is an off-canvas drawer, above it collapses to 80px icons
const isDesktop = () => window.innerWidth >= 1300

export default function AdminLayout() {
  const [open, setOpen] = useState(false) // mobile drawer
  const [collapsed, setCollapsed] = useState(false) // desktop 80px mode
  const { pathname, search } = useLocation()

  // close drawer after navigating on mobile
  useEffect(() => setOpen(false), [pathname, search])

  const toggle = () => (isDesktop() ? setCollapsed(!collapsed) : setOpen(!open))

  return (
    <>
      <Sidebar open={open} collapsed={collapsed} onClose={() => setOpen(false)} />
      {open && <div className="fixed inset-0 z-35 bg-black/40 xl:hidden" onClick={() => setOpen(false)} />}
      <Topbar collapsed={collapsed} onToggle={toggle} />
      <main
        className={`min-h-screen rounded-3xl bg-page px-3.75 pt-30 transition-[margin] sm:px-5 xl:rounded-r-none ${
          collapsed ? 'xl:ml-20 xl:peer-hover:ml-65' : 'xl:ml-65'
        }`}
      >
        <Outlet />
        <footer className="mx-0 mb-5 mt-6 flex flex-col items-center justify-between gap-1 rounded-3xl bg-white p-4 text-center text-sm shadow-sm lg:flex-row">
          <span>Privacy Policy · Terms of Use</span>
          <span>Copyright {new Date().getFullYear()} Royalclub All Rights Reserved.</span>
        </footer>
      </main>
    </>
  )
}
