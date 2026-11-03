import { Suspense, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAdminMe } from '../queries/auth'

export default function AdminLayout() {
  const me = useAdminMe()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('sidebar-main', menuOpen)
    return () => document.body.classList.remove('sidebar-main')
  }, [menuOpen])

  if (me.isError) return <Navigate to="/login" replace />
  if (!me.data) return null

  const toggle = () => setMenuOpen(!menuOpen)

  return (
    <div className="wrapper">
      <Sidebar menuOpen={menuOpen} onToggle={toggle} />
      <div id="content-page" className="content-page">
        <Topbar name={me.data.name} userId={me.data.userId} menuOpen={menuOpen} onToggle={toggle} />
        <Suspense>
          <Outlet />
        </Suspense>
        <footer className="bg-white iq-footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#" onClick={(e) => e.preventDefault()}>Terms of Use</a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 text-right">
                Copyright {new Date().getFullYear()} <a href="#" onClick={(e) => e.preventDefault()}>{import.meta.env.VITE_APP_NAME ?? 'Royalclub'}</a> All Rights Reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
