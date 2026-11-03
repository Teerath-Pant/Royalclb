import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { activeTo, isGroup, menu } from '../config/menu'
import { useAdminLogout } from '../queries/auth'

export default function Sidebar({ menuOpen, onToggle }: { menuOpen: boolean; onToggle: () => void }) {
  const { pathname, search } = useLocation()
  const current = activeTo(pathname, search)
  const activeGroup = menu.find((e) => isGroup(e) && e.items.some((i) => i.to === current))?.id ?? null
  const [openGroup, setOpenGroup] = useState<string | null>(activeGroup)
  const logout = useAdminLogout()

  return (
    <div className="iq-sidebar">
      <div className="iq-sidebar-logo d-flex justify-content-between">
        <Link to="/dashboard">
          <span></span>
        </Link>
        <div className="iq-menu-bt-sidebar">
          <div className="iq-menu-bt align-self-center">
            <div className={`wrapper-menu${menuOpen ? ' open' : ''}`} onClick={onToggle}>
              <div className="main-circle">
                <i className="ri-more-fill"></i>
              </div>
              <div className="hover-circle">
                <i className="ri-more-2-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="sidebar-scrollbar">
        <nav className="iq-sidebar-menu">
          <ul id="iq-sidebar-toggle" className="iq-menu">
            <li className="iq-menu-title">
              <i className="ri-subtract-line"></i>
              <span>Menu</span>
            </li>
            {menu.map((entry) =>
              isGroup(entry) ? (
                <li key={entry.id} id={entry.id} className={entry.id === activeGroup ? 'active main-active' : ''}>
                  <a
                    href={`#${entry.id}Area`}
                    className={`iq-waves-effect${openGroup === entry.id ? '' : ' collapsed'}`}
                    aria-expanded={openGroup === entry.id}
                    onClick={(e) => {
                      e.preventDefault()
                      setOpenGroup(openGroup === entry.id ? null : entry.id)
                    }}
                  >
                    <i className={entry.icon}></i>
                    <span>{entry.label}</span>
                    <i className="ri-arrow-right-s-line iq-arrow-right"></i>
                  </a>
                  <ul id={`${entry.id}Area`} className={`iq-submenu collapse${openGroup === entry.id ? ' show' : ''}`}>
                    {entry.items.map((item) => (
                      <li key={item.to} className={item.to === current ? 'active' : ''}>
                        <Link to={item.to}>
                          <i className="fa fa-circle-o"></i> {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={entry.id} id={entry.id} className={entry.to === current ? 'active main-active' : ''}>
                  <Link to={entry.to} className="iq-waves-effect">
                    <i className={entry.icon}></i>
                    <span>{entry.label}</span>
                  </Link>
                </li>
              ),
            )}
            <li id="logout-button-root">
              <a
                href="#"
                className="iq-waves-effect"
                onClick={(e) => {
                  e.preventDefault()
                  logout.mutate()
                }}
              >
                <i className="ri-login-box-fill"></i>
                <span>Sign Out</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-3"></div>
      </div>
    </div>
  )
}
