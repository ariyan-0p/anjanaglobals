import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Images, LogOut, ExternalLink, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './admin.css'

export default function AdminLayout() {
  const { user, status, logout } = useAuth()
  const location = useLocation()

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="admin-shell admin-shell--center">
        <p>Loading…</p>
      </div>
    )
  }

  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__dot" />
          <div>
            <strong>Anjana Globals</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/galleries" className="admin-nav__link">
            <Images size={17} aria-hidden />
            Galleries
          </NavLink>
          <NavLink to="/admin/blogs" className="admin-nav__link">
            <FileText size={17} aria-hidden />
            Blog posts
          </NavLink>
        </nav>

        <div className="admin-sidebar__foot">
          <a href="/" className="admin-nav__link admin-nav__link--ghost" target="_blank" rel="noreferrer">
            <ExternalLink size={15} aria-hidden />
            View site
          </a>
          <div className="admin-user">
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button type="button" onClick={logout} className="admin-btn admin-btn--ghost" title="Sign out">
              <LogOut size={15} aria-hidden />
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
