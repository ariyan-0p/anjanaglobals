import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Search, Inbox, Mail, Phone, MessageCircle, Trash2, Loader2,
  ChevronLeft, ChevronRight, ExternalLink, RefreshCw, X,
} from 'lucide-react'
import { api } from '../../lib/api'
import './admin.css'

const STATUS_OPTIONS = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'converted', label: 'Converted' },
  { id: 'lost', label: 'Lost' },
]

const SOURCE_LABEL = {
  popup: 'Popup',
  contact: 'Contact form',
  package: 'Package',
  b2b: 'B2B Agent',
  destination: 'Destination',
  'destination-rail': 'Destination',
  other: 'Other',
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'just now'
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    const days = Math.floor(hr / 24)
    if (days < 14) return `${days}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

const PAGE_SIZE = 30

export default function AdminLeads() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(PAGE_SIZE))
    if (status) params.set('status', status)
    if (source) params.set('source', source)
    if (q) params.set('q', q)
    api
      .get(`/leads?${params.toString()}`, { auth: true })
      .then((res) => {
        setItems(res.items)
        setTotal(res.total)
      })
      .catch((err) => setError(err.message || 'Failed to load leads'))
      .finally(() => setLoading(false))
  }, [page, status, source, q])

  useEffect(() => { load() }, [load])

  function submitSearch(e) {
    e.preventDefault()
    setQ(search.trim())
    setPage(1)
  }

  async function updateStatus(id, newStatus) {
    try {
      const updated = await api.patch(`/leads/${id}`, { status: newStatus }, { auth: true })
      setItems((prev) => prev.map((l) => (l._id === id ? updated : l)))
      if (selected?._id === id) setSelected(updated)
    } catch (err) {
      setError(err.message || 'Update failed')
    }
  }

  async function deleteLead(id, name) {
    if (!window.confirm(`Delete lead from "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/leads/${id}`, { auth: true })
      setItems((prev) => prev.filter((l) => l._id !== id))
      setTotal((t) => Math.max(0, t - 1))
      if (selected?._id === id) setSelected(null)
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const counts = useMemo(() => {
    const map = { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 }
    items.forEach((l) => { if (map[l.status] !== undefined) map[l.status]++ })
    return map
  }, [items])

  return (
    <div className="admin-page admin-page--wide">
      <header className="admin-page__head admin-page__head--row">
        <div>
          <h1>Lead inbox</h1>
          <p>
            {total} {total === 1 ? 'lead' : 'leads'} total · {counts.new} new on this page.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={load}>
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      <div className="admin-toolbar">
        <form onSubmit={submitSearch} className="admin-search">
          <Search size={15} aria-hidden />
          <input
            type="search"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="admin-filter">
          <button
            type="button"
            className={`admin-chip${!status ? ' is-active' : ''}`}
            onClick={() => { setStatus(''); setPage(1) }}
          >
            All status
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`admin-chip${status === s.id ? ' is-active' : ''}`}
              onClick={() => { setStatus(s.id); setPage(1) }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <select
          value={source}
          onChange={(e) => { setSource(e.target.value); setPage(1) }}
          className="admin-source-select"
        >
          <option value="">All sources</option>
          {Object.entries(SOURCE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {error ? <div className="admin-alert"><span>{error}</span><button type="button" onClick={() => setError('')} aria-label="Dismiss"><X size={14} /></button></div> : null}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <Inbox size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
          <p>No leads yet{q || status || source ? ' for this filter' : ''}.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Destination</th>
                <th>Source</th>
                <th>Status</th>
                <th>When</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <button
                      type="button"
                      className="admin-table__title"
                      style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
                      onClick={() => setSelected(lead)}
                    >
                      {lead.name}
                    </button>
                  </td>
                  <td>
                    <div className="leads-contact">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} title={lead.email}>
                          <Mail size={11} /> {lead.email}
                        </a>
                      ) : null}
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} title={lead.phone}>
                          <Phone size={11} /> {lead.phone}
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td>{lead.destination || <span className="admin-muted">—</span>}</td>
                  <td><span className="admin-tag">{SOURCE_LABEL[lead.source] || lead.source}</span></td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead._id, e.target.value)}
                      className={`leads-status leads-status--${lead.status}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="admin-table__date">{formatDate(lead.createdAt)}</td>
                  <td className="admin-table__actions">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={() => setSelected(lead)}
                      title="View details"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--danger"
                      onClick={() => deleteLead(lead._id, lead.name)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
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
          <span className="admin-muted">Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="admin-btn admin-btn--ghost">
            Next <ChevronRight size={14} />
          </button>
        </nav>
      ) : null}

      {selected ? (
        <div className="admin-modal" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <div className="admin-modal__card" onClick={(e) => e.stopPropagation()}>
            <header className="admin-modal__head">
              <div>
                <h2>{selected.name}</h2>
                <p className="admin-muted">{SOURCE_LABEL[selected.source] || selected.source} · {formatDate(selected.createdAt)}</p>
              </div>
              <button type="button" className="admin-icon-btn" onClick={() => setSelected(null)} aria-label="Close">
                <X size={16} />
              </button>
            </header>
            <div className="admin-modal__body">
              <div className="leads-detail">
                {selected.email ? (
                  <a href={`mailto:${selected.email}`} className="leads-detail__row">
                    <Mail size={14} /> {selected.email}
                  </a>
                ) : null}
                {selected.phone ? (
                  <>
                    <a href={`tel:${selected.phone}`} className="leads-detail__row">
                      <Phone size={14} /> {selected.phone}
                    </a>
                    <a
                      href={`https://wa.me/${selected.phone.replace(/[^\d+]/g, '').replace(/^\+/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="leads-detail__row leads-detail__row--wa"
                    >
                      <MessageCircle size={14} /> WhatsApp {selected.phone}
                    </a>
                  </>
                ) : null}
                {selected.destination ? (
                  <div className="leads-detail__row">
                    <strong>Destination:</strong> {selected.destination}
                  </div>
                ) : null}
                {selected.message ? (
                  <div className="leads-detail__msg">
                    <strong>Message</strong>
                    <p>{selected.message}</p>
                  </div>
                ) : null}
                {selected.meta?.referer ? (
                  <p className="admin-muted" style={{ fontSize: 11 }}>
                    Submitted from: {selected.meta.referer}
                  </p>
                ) : null}
              </div>
            </div>
            <footer className="admin-modal__foot">
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected._id, e.target.value)}
                className={`leads-status leads-status--${selected.status}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--danger"
                onClick={() => deleteLead(selected._id, selected.name)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  )
}
