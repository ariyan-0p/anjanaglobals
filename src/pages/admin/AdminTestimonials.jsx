import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus, Trash2, Edit3, Star, GripVertical, Loader2, Save, X, ImagePlus,
} from 'lucide-react'
import { api, apiBase, getToken } from '../../lib/api'
import './admin.css'

const DESTINATIONS = [
  { id: 'dubai', name: '🇦🇪 Dubai' },
  { id: 'azerbaijan', name: '🇦🇿 Azerbaijan' },
  { id: 'singapore', name: '🇸🇬 Singapore' },
  { id: 'malaysia', name: '🇲🇾 Malaysia' },
  { id: 'bali', name: '🇮🇩 Bali' },
]

const TRIP_TYPES = ['', 'Honeymoon', 'Family', 'Group', 'MICE', 'FIT', 'Corporate']

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

const EMPTY_FORM = {
  name: '',
  location: '',
  rating: 5,
  tripType: '',
  tripDate: '',
  destinationId: '',
  message: '',
  isApproved: true,
  isFeatured: false,
  avatarUrl: '',
  avatarThumbUrl: '',
  avatarStorageKey: '',
  avatarThumbStorageKey: '',
}

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [destFilter, setDestFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef(null)
  const dragSrc = useRef(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ status: 'all' })
    if (destFilter !== 'all') params.set('destinationId', destFilter)
    api
      .get(`/testimonials/admin/all?${params.toString()}`, { auth: true })
      .then((res) => setItems(res.items))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [destFilter])

  useEffect(() => { load() }, [load])

  function openNew() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, destinationId: destFilter !== 'all' ? destFilter : '' })
    setShowForm(true)
  }

  function openEdit(item) {
    setEditingId(item._id)
    setForm({
      name: item.name || '',
      location: item.location || '',
      rating: item.rating || 5,
      tripType: item.tripType || '',
      tripDate: item.tripDate || '',
      destinationId: item.destinationId || '',
      message: item.message || '',
      isApproved: item.isApproved,
      isFeatured: item.isFeatured || false,
      avatarUrl: item.avatarUrl || '',
      avatarThumbUrl: item.avatarThumbUrl || '',
      avatarStorageKey: item.avatarStorageKey || '',
      avatarThumbStorageKey: item.avatarThumbStorageKey || '',
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    if (avatarInputRef.current) avatarInputRef.current.value = ''
  }

  async function uploadAvatar(file) {
    setAvatarUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${apiBase}/api/testimonials/admin/avatar`)
        const token = getToken()
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText))
          else {
            try { reject(new Error(JSON.parse(xhr.responseText).error || `HTTP ${xhr.status}`)) }
            catch { reject(new Error(`HTTP ${xhr.status}`)) }
          }
        }
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.send(fd)
      })
      setForm((f) => ({
        ...f,
        avatarUrl: res.avatarUrl,
        avatarThumbUrl: res.avatarThumbUrl,
        avatarStorageKey: res.avatarStorageKey,
        avatarThumbStorageKey: res.avatarThumbStorageKey,
      }))
    } catch (err) {
      setError(err.message || 'Avatar upload failed')
    } finally {
      setAvatarUploading(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  function clearAvatar() {
    setForm((f) => ({
      ...f, avatarUrl: '', avatarThumbUrl: '', avatarStorageKey: '', avatarThumbStorageKey: '',
    }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.message.trim()) { setError('Message is required'); return }
    setError('')
    setSubmitting(true)
    try {
      if (editingId) {
        await api.patch(`/testimonials/${editingId}`, form, { auth: true })
      } else {
        await api.post('/testimonials', form, { auth: true })
      }
      closeForm()
      load()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete testimonial from "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await api.delete(`/testimonials/${id}`, { auth: true })
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  // Drag-to-reorder within the visible list (per destination filter)
  function onDragStart(i) { dragSrc.current = i }
  function onDragOver(e, i) {
    e.preventDefault()
    const from = dragSrc.current
    if (from === null || from === i) return
    setItems((prev) => {
      const next = prev.slice()
      const [m] = next.splice(from, 1)
      next.splice(i, 0, m)
      dragSrc.current = i
      return next
    })
  }
  async function onDragEnd() {
    dragSrc.current = null
    if (destFilter === 'all') return // Only reorder when scoped to a destination
    try {
      await api.patch(
        '/testimonials/reorder',
        { destinationId: destFilter, order: items.filter((i) => i.destinationId === destFilter).map((i) => i._id) },
        { auth: true }
      )
    } catch (err) {
      setError(err.message || 'Reorder failed')
      load()
    }
  }

  const grouped = useMemo(() => {
    const map = {}
    for (const it of items) {
      const k = it.destinationId || 'unassigned'
      if (!map[k]) map[k] = []
      map[k].push(it)
    }
    return map
  }, [items])

  return (
    <div className="admin-page admin-page--wide">
      <header className="admin-page__head admin-page__head--row">
        <div>
          <h1>Client testimonials</h1>
          <p>Written reviews shown on the testimonials page, grouped by destination.</p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
          <Plus size={15} /> New testimonial
        </button>
      </header>

      <div className="admin-tabs">
        <button
          type="button"
          onClick={() => setDestFilter('all')}
          className={`admin-tab${destFilter === 'all' ? ' is-active' : ''}`}
        >
          All ({items.length})
        </button>
        {DESTINATIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDestFilter(d.id)}
            className={`admin-tab${destFilter === d.id ? ' is-active' : ''}`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {error ? (
        <div className="admin-alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Dismiss"><X size={14} /></button>
        </div>
      ) : null}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <p>No testimonials {destFilter !== 'all' ? `for ${DESTINATIONS.find((d) => d.id === destFilter)?.name}` : 'yet'}. Click <strong>New testimonial</strong> to add one.</p>
        </div>
      ) : (
        <ul className="testi-admin-grid">
          {items.map((item, idx) => (
            <li
              key={item._id}
              className="testi-admin-card"
              draggable={destFilter !== 'all'}
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
            >
              {destFilter !== 'all' ? (
                <div className="agent-card__handle" aria-hidden><GripVertical size={14} /></div>
              ) : null}
              <div className="testi-admin-card__head">
                {item.avatarThumbUrl || item.avatarUrl ? (
                  <img src={absoluteUrl(item.avatarThumbUrl || item.avatarUrl)} alt={item.name} className="testi-admin-card__avatar" />
                ) : (
                  <div className="testi-admin-card__avatar testi-admin-card__avatar--placeholder">
                    {item.name?.[0] || '?'}
                  </div>
                )}
                <div className="testi-admin-card__who">
                  <strong>{item.name}</strong>
                  {item.location ? <span className="admin-muted">{item.location}</span> : null}
                  <div className="testi-admin-card__stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} fill={i < item.rating ? '#c9a84c' : 'transparent'} color={i < item.rating ? '#c9a84c' : 'var(--admin-text-faint)'} />
                    ))}
                  </div>
                </div>
                <div className="testi-admin-card__actions">
                  <button type="button" className="admin-icon-btn" onClick={() => openEdit(item)} title="Edit"><Edit3 size={13} /></button>
                  <button
                    type="button"
                    className="admin-icon-btn admin-icon-btn--danger"
                    onClick={() => handleDelete(item._id, item.name)}
                    disabled={deletingId === item._id}
                    title="Delete"
                  >
                    {deletingId === item._id ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
              <p className="testi-admin-card__quote">&ldquo;{item.message}&rdquo;</p>
              <div className="testi-admin-card__meta">
                {item.destinationId ? <span className="admin-tag">{DESTINATIONS.find((d) => d.id === item.destinationId)?.name || item.destinationId}</span> : null}
                {item.tripType ? <span className="admin-tag">{item.tripType}</span> : null}
                {item.tripDate ? <span className="admin-tag">{item.tripDate}</span> : null}
                {!item.isApproved ? <span className="admin-status admin-status--draft">hidden</span> : null}
                {item.isFeatured ? <span className="admin-status admin-status--published">featured</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className="admin-modal" role="dialog" aria-modal="true" onClick={closeForm}>
          <form className="admin-modal__card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <header className="admin-modal__head">
              <h2>{editingId ? 'Edit testimonial' : 'New testimonial'}</h2>
              <button type="button" className="admin-icon-btn" onClick={closeForm} aria-label="Close"><X size={16} /></button>
            </header>

            <div className="admin-modal__body">
              <div className="admin-form-row">
                <label className="admin-field">
                  <span>Name *</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="e.g. Priya Sharma"
                  />
                </label>
                <label className="admin-field">
                  <span>Location</span>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Mumbai, India"
                  />
                </label>
              </div>

              <div className="admin-form-row">
                <label className="admin-field">
                  <span>Destination</span>
                  <select
                    value={form.destinationId}
                    onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value }))}
                  >
                    <option value="">— Unassigned —</option>
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </label>
                <label className="admin-field">
                  <span>Rating</span>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'star' : 'stars'}</option>)}
                  </select>
                </label>
              </div>

              <div className="admin-form-row">
                <label className="admin-field">
                  <span>Trip type</span>
                  <select
                    value={form.tripType}
                    onChange={(e) => setForm((f) => ({ ...f, tripType: e.target.value }))}
                  >
                    {TRIP_TYPES.map((t) => <option key={t} value={t}>{t || '— None —'}</option>)}
                  </select>
                </label>
                <label className="admin-field">
                  <span>Trip date</span>
                  <input
                    value={form.tripDate}
                    onChange={(e) => setForm((f) => ({ ...f, tripDate: e.target.value }))}
                    placeholder="e.g. December 2025"
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Message *</span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  maxLength={2000}
                  required
                  placeholder="Their review or quote…"
                />
              </label>

              <label className="admin-field">
                <span>Reviewer photo (optional)</span>
                <div className="admin-cover-row">
                  {form.avatarUrl ? (
                    <>
                      <img src={absoluteUrl(form.avatarThumbUrl || form.avatarUrl)} alt="" className="testi-admin-card__avatar" />
                      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={clearAvatar}>Remove</button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? <Loader2 size={13} className="spin" /> : <ImagePlus size={13} />}
                    {avatarUploading ? 'Uploading…' : form.avatarUrl ? 'Replace' : 'Upload photo'}
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    hidden
                    onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
                  />
                </div>
              </label>

              <div className="admin-form-row">
                <label className="admin-radio-row admin-radio-row--inline">
                  <input type="checkbox" checked={form.isApproved} onChange={(e) => setForm((f) => ({ ...f, isApproved: e.target.checked }))} />
                  <span>Show on the public site</span>
                </label>
                <label className="admin-radio-row admin-radio-row--inline">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} />
                  <span>Featured (pin to top)</span>
                </label>
              </div>
            </div>

            <footer className="admin-modal__foot">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeForm} disabled={submitting}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
                {submitting ? <><Loader2 size={14} className="spin" /> Saving…</> : <><Save size={14} /> Save</>}
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  )
}
