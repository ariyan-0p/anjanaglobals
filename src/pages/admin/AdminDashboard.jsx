import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Images,
  Inbox,
  Users,
  Briefcase,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit3,
} from 'lucide-react'
import { api, apiBase } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import './admin.css'

const DEST_LABELS = {
  dubai: '🇦🇪 Dubai',
  azerbaijan: '🇦🇿 Azerbaijan',
  singapore: '🇸🇬 Singapore',
  malaysia: '🇲🇾 Malaysia',
  bali: '🇮🇩 Bali',
}

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

function formatRelative(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/stats', { auth: true })
      .then(setStats)
      .catch((err) => setError(err.message || 'Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="admin-page admin-page--wide">
      <header className="admin-page__head">
        <div>
          <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p>Here's a quick look at what's happening on the site.</p>
        </div>
      </header>

      {error ? <div className="admin-alert"><span>{error}</span></div> : null}

      {loading ? (
        <div className="admin-stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-stat admin-stat--skeleton" />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="admin-stat-grid">
            <Link to="/admin/blogs" className="admin-stat">
              <div className="admin-stat__icon admin-stat__icon--primary">
                <FileText size={20} />
              </div>
              <div className="admin-stat__body">
                <span className="admin-stat__label">Blog posts</span>
                <strong className="admin-stat__value">{stats.blog.total}</strong>
                <span className="admin-stat__sub">
                  {stats.blog.published} published · {stats.blog.drafts} drafts
                </span>
              </div>
            </Link>

            <Link to="/admin/galleries" className="admin-stat">
              <div className="admin-stat__icon admin-stat__icon--accent">
                <Images size={20} />
              </div>
              <div className="admin-stat__body">
                <span className="admin-stat__label">Gallery images</span>
                <strong className="admin-stat__value">{stats.galleries.total}</strong>
                <span className="admin-stat__sub">across 5 destinations</span>
              </div>
            </Link>

            <div className="admin-stat">
              <div className="admin-stat__icon admin-stat__icon--info">
                <Inbox size={20} />
              </div>
              <div className="admin-stat__body">
                <span className="admin-stat__label">Leads</span>
                <strong className="admin-stat__value">{stats.leads}</strong>
                <span className="admin-stat__sub">total submissions</span>
              </div>
            </div>

            <div className="admin-stat">
              <div className="admin-stat__icon admin-stat__icon--success">
                <Users size={20} />
              </div>
              <div className="admin-stat__body">
                <span className="admin-stat__label">Newsletter</span>
                <strong className="admin-stat__value">{stats.subscribers}</strong>
                <span className="admin-stat__sub">subscribers</span>
              </div>
            </div>

            <div className="admin-stat">
              <div className="admin-stat__icon admin-stat__icon--violet">
                <Briefcase size={20} />
              </div>
              <div className="admin-stat__body">
                <span className="admin-stat__label">B2B Agents</span>
                <strong className="admin-stat__value">{stats.b2bAgents}</strong>
                <span className="admin-stat__sub">applications</span>
              </div>
            </div>
          </div>

          <div className="admin-row">
            <section className="admin-panel admin-panel--wide">
              <header className="admin-panel__head">
                <h2>Recent posts</h2>
                <div className="admin-panel__actions">
                  <Link to="/admin/blogs/new" className="admin-btn admin-btn--primary admin-btn--sm">
                    <Plus size={13} /> New post
                  </Link>
                  <Link to="/admin/blogs" className="admin-panel__link">
                    View all <ArrowRight size={13} />
                  </Link>
                </div>
              </header>
              {stats.recent.posts.length === 0 ? (
                <p className="admin-muted">No posts yet. Write your first one!</p>
              ) : (
                <ul className="admin-list">
                  {stats.recent.posts.map((p) => (
                    <li key={p._id} className="admin-list__item">
                      {p.coverThumbUrl ? (
                        <div
                          className="admin-list__thumb"
                          style={{ backgroundImage: `url(${absoluteUrl(p.coverThumbUrl)})` }}
                        />
                      ) : (
                        <div className="admin-list__thumb admin-list__thumb--empty">
                          <FileText size={16} />
                        </div>
                      )}
                      <div className="admin-list__body">
                        <Link to={`/admin/blogs/${p._id}/edit`} className="admin-list__title">
                          {p.title}
                        </Link>
                        <div className="admin-list__meta">
                          {p.category ? <span>{p.category}</span> : null}
                          <span className={`admin-status admin-status--${p.status}`}>{p.status}</span>
                          <span className="admin-muted">{formatRelative(p.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="admin-list__actions">
                        {p.status === 'published' ? (
                          <a
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-icon-btn"
                            title="View"
                          >
                            <ExternalLink size={13} />
                          </a>
                        ) : null}
                        <Link
                          to={`/admin/blogs/${p._id}/edit`}
                          className="admin-icon-btn"
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="admin-panel">
              <header className="admin-panel__head">
                <h2>Galleries</h2>
                <Link to="/admin/galleries" className="admin-panel__link">
                  Manage <ArrowRight size={13} />
                </Link>
              </header>
              <ul className="admin-list admin-list--simple">
                {Object.entries(stats.galleries.byDestination).map(([id, count]) => (
                  <li key={id} className="admin-list__item admin-list__item--row">
                    <span>{DEST_LABELS[id] || id}</span>
                    <strong className="admin-list__count">{count}</strong>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {stats.recent.leads.length > 0 ? (
            <section className="admin-panel">
              <header className="admin-panel__head">
                <h2>Recent leads</h2>
              </header>
              <ul className="admin-list">
                {stats.recent.leads.map((l) => (
                  <li key={l._id} className="admin-list__item">
                    <div className="admin-list__thumb admin-list__thumb--icon">
                      <Inbox size={16} />
                    </div>
                    <div className="admin-list__body">
                      <span className="admin-list__title">{l.name || 'Anonymous'}</span>
                      <div className="admin-list__meta">
                        <span>{l.email || l.phone || '—'}</span>
                        {l.source ? <span className="admin-tag">{l.source}</span> : null}
                        <span className="admin-muted">{formatRelative(l.createdAt)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
