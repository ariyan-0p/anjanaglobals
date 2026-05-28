import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit3, Trash2, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { api, apiBase } from '../../lib/api'
import './admin.css'

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

const PAGE_SIZE = 30

export default function AdminBlogs() {
  const [items, setItems] = useState([])
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(PAGE_SIZE))
    params.set('status', status)
    if (q) params.set('q', q)
    api
      .get(`/blog/admin/all?${params.toString()}`, { auth: true })
      .then((res) => {
        setItems(res.items)
        setPages(res.pages)
        setTotal(res.total)
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [page, status, q])

  useEffect(() => {
    load()
  }, [load])

  function submitSearch(e) {
    e.preventDefault()
    setQ(search.trim())
    setPage(1)
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await api.delete(`/blog/${id}`, { auth: true })
      setItems((prev) => prev.filter((p) => p._id !== id))
      setTotal((t) => Math.max(0, t - 1))
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head admin-page__head--row">
        <div>
          <h1>Blog posts</h1>
          <p>
            {total} {total === 1 ? 'post' : 'posts'} total · Edit, delete, or write a new one.
          </p>
        </div>
        <Link to="/admin/blogs/new" className="admin-btn admin-btn--primary">
          <Plus size={15} /> New post
        </Link>
      </header>

      <div className="admin-toolbar">
        <form onSubmit={submitSearch} className="admin-search">
          <Search size={15} aria-hidden />
          <input
            type="search"
            placeholder="Search title or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="admin-filter">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatus(s)
                setPage(1)
              }}
              className={`admin-chip${status === s ? ' is-active' : ''}`}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error ? <div className="admin-alert"><span>{error}</span></div> : null}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <p>No posts found.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((post) => (
                <tr key={post._id}>
                  <td>
                    {post.coverThumbUrl || post.coverUrl ? (
                      <div
                        className="admin-table__thumb"
                        style={{ backgroundImage: `url(${absoluteUrl(post.coverThumbUrl || post.coverUrl)})` }}
                      />
                    ) : (
                      <div className="admin-table__thumb admin-table__thumb--empty" />
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/blogs/${post._id}/edit`} className="admin-table__title">
                      {post.title}
                    </Link>
                    <div className="admin-table__slug">/{post.slug}</div>
                  </td>
                  <td>{post.category || <span className="admin-muted">—</span>}</td>
                  <td>
                    <span className={`admin-status admin-status--${post.status}`}>{post.status}</span>
                  </td>
                  <td className="admin-table__date">{formatDate(post.publishedAt)}</td>
                  <td className="admin-table__actions">
                    {post.status === 'published' ? (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-icon-btn"
                        title="View live"
                      >
                        <ExternalLink size={14} />
                      </a>
                    ) : null}
                    <Link to={`/admin/blogs/${post._id}/edit`} className="admin-icon-btn" title="Edit">
                      <Edit3 size={14} />
                    </Link>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--danger"
                      onClick={() => handleDelete(post._id, post.title)}
                      disabled={deletingId === post._id}
                      title="Delete"
                    >
                      {deletingId === post._id ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <nav className="admin-pager">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="admin-btn admin-btn--ghost">
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="admin-muted">
            Page {page} of {pages}
          </span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="admin-btn admin-btn--ghost">
            Next <ChevronRight size={14} />
          </button>
        </nav>
      ) : null}
    </div>
  )
}
