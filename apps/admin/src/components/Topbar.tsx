import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminLogout } from '../queries/auth'

type Props = { name: string; userId: string; menuOpen: boolean; onToggle: () => void }

export default function Topbar({ name, userId, menuOpen, onToggle }: Props) {
  const [userOpen, setUserOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [fixed, setFixed] = useState(false)
  const logout = useAdminLogout()

  useEffect(() => {
    const onScroll = () => setFixed(window.scrollY >= 75)
    const close = () => setUserOpen(false)
    window.addEventListener('scroll', onScroll)
    document.addEventListener('click', close)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', close)
    }
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
    setFullscreen(!fullscreen)
  }

  return (
    <div className={`iq-top-navbar${fixed ? ' fixed-header' : ''}`}>
      <div className="iq-navbar-custom">
        <div className="iq-sidebar-logo">
          <div className="top-logo">
            <Link to="/dashboard" className="logo">
              <span>{import.meta.env.VITE_APP_NAME ?? 'Royalclub'}</span>
            </Link>
          </div>
        </div>
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-search-bar">
            <form onSubmit={(e) => e.preventDefault()} className="searchbox">
              <input type="text" className="text search-input" placeholder="Type here to search..." />
              <a className="search-link" href="#" onClick={(e) => e.preventDefault()}>
                <i className="ri-search-line"></i>
              </a>
            </form>
          </div>
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
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto navbar-list">
              <li className="nav-item iq-full-screen">
                <a
                  href="#"
                  className="iq-waves-effect"
                  id="btnFullscreen"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFullscreen()
                  }}
                >
                  <i className={fullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'}></i>
                </a>
              </li>
            </ul>
          </div>
          <ul className="navbar-list">
            <li className={userOpen ? 'iq-show' : ''}>
              <a
                href="#"
                className={`search-toggle iq-waves-effect d-flex align-items-center${userOpen ? ' active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setUserOpen(!userOpen)
                }}
              >
                <img src="/assets/images/user/1.jpg" className="img-fluid rounded mr-3" alt="user" />
                <div className="caption">
                  <h6 className="mb-0 line-height">{userId}</h6>
                </div>
              </a>
              <div className="iq-sub-dropdown iq-user-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="iq-card shadow-none m-0">
                  <div className="iq-card-body p-0 ">
                    <div className="bg-primary p-3">
                      <h5 className="mb-0 text-white line-height">Hello {name}</h5>
                      <span className="text-white font-size-12">{userId}</span>
                    </div>
                    <Link to="/changePassword" className="iq-sub-card iq-bg-primary-hover">
                      <div className="media align-items-center">
                        <div className="rounded iq-card-icon iq-bg-primary">
                          <i className="ri-lock-line"></i>
                        </div>
                        <div className="media-body ml-3">
                          <h6 className="mb-0 ">Password Settings</h6>
                          <p className="mb-0 font-size-12">Control your privacy parameters.</p>
                        </div>
                      </div>
                    </Link>
                    <div className="d-inline-block w-100 text-center p-3">
                      <a
                        className="bg-primary iq-sign-btn"
                        href="#"
                        role="button"
                        onClick={(e) => {
                          e.preventDefault()
                          logout.mutate()
                        }}
                      >
                        Sign out<i className="ri-login-box-line ml-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
