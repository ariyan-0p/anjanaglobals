import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Images, FileText, LogOut, ExternalLink } from 'lucide-react'
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
          <span className="admin-nav__group">Overview</span>
          <NavLink to="/admin" end className="admin-nav__link">
            <LayoutDashboard size={16} aria-hidden />
            Dashboard
          </NavLink>

          <span className="admin-nav__group">Content</span>
          <NavLink to="/admin/blogs" className="admin-nav__link">
            <FileText size={16} aria-hidden />
            Blog posts
          </NavLink>
          <NavLink to="/admin/galleries" className="admin-nav__link">
            <Images size={16} aria-hidden />
            Galleries
          </NavLink>
        </nav>

        <div className="admin-sidebar__foot">
          <a
            href="/"
            className="admin-nav__link admin-nav__link--ghost"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={14} aria-hidden />
            View site
          </a>
          <div className="admin-user">
            <div style={{ minWidth: 0 }}>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="admin-icon-btn"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={15} />
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
