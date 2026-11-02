import { Lock, Maximize, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

// Floating white bar like the original: fixed, rounded, offset by sidebar width on desktop
export default function Topbar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <header
      className={`fixed inset-x-3.75 top-5 z-30 flex min-h-18 items-center gap-3 rounded-3xl bg-white px-4 shadow-md transition-[left] sm:px-6 xl:right-7.5 ${
        collapsed ? 'xl:left-27.5 xl:peer-hover:left-72.5' : 'xl:left-72.5'
      }`}
    >
      <button onClick={onToggle} className="cursor-pointer text-primary" aria-label="Toggle menu">
        <Menu />
      </button>
      <input
        type="text"
        placeholder="Type here to search..."
        className="hidden w-72 rounded-full bg-page px-4 py-2 text-sm outline-none md:block"
      />
      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={() => document.documentElement.requestFullscreen()}
          className="hidden cursor-pointer text-primary sm:block"
          aria-label="Fullscreen"
        >
          <Maximize size={20} />
        </button>
        <div className="group relative">
          <button className="cursor-pointer text-sm font-semibold text-ink">admin</button>
          <div className="invisible absolute right-0 top-full z-50 w-60 overflow-hidden rounded-xl bg-white shadow-lg group-hover:visible group-focus-within:visible sm:w-64">
            <div className="bg-primary p-4 text-white">
              <h5 className="font-semibold">Hello Admin</h5>
              <span className="text-xs">admin</span>
            </div>
            <Link to="/changePassword" className="flex items-center gap-3 p-4 text-sm hover:bg-page">
              <Lock size={18} className="text-primary" /> Password Settings
            </Link>
            <Link to="/login" className="m-3 block rounded bg-primary py-2 text-center text-sm text-white">
              Sign out
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
