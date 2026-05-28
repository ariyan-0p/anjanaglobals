import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  Loader2,
  Save,
  X,
  Video as VideoIcon,
  Upload,
} from 'lucide-react'
import { api, apiBase, getToken } from '../../lib/api'
import './admin.css'

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

const EMPTY_FORM = { name: '', role: '', desk: '', quote: '', isActive: true, videoFile: null }

export default function AdminAgentVoices() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [deletingId, setDeletingId] = useState(null)
  const fileRef = useRef(null)
  const dragSrc = useRef(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    api
      .get('/agent-voices/admin/all', { auth: true })
      .then((res) => setItems(res.items))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openNew() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(item) {
    setEditingId(item._id)
    setForm({
      name: item.name || '',
      role: item.role || '',
      desk: item.desk || '',
      quote: item.quote || '',
      isActive: item.isActive,
      videoFile: null,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setForm(EMPTY_FORM)
    setEditingId(null)
    setProgress(0)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function submitForm(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    if (!editingId && !form.videoFile) {
      setError('Video file is required')
      return
    }
    setError('')
    setSubmitting(true)
    setProgress(0)

    const data = new FormData()
    data.append('name', form.name.trim())
    data.append('role', form.role.trim())
    data.append('desk', form.desk.trim())
    data.append('quote', form.quote.trim())
    data.append('isActive', String(form.isActive))
    if (form.videoFile) data.append('video', form.videoFile)

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const url = editingId
          ? `${apiBase}/api/agent-voices/${editingId}`
          : `${apiBase}/api/agent-voices`
        xhr.open(editingId ? 'PATCH' : 'POST', url)
        const token = getToken()
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else {
            try {
              const p = JSON.parse(xhr.responseText)
              reject(new Error(p.error || `Failed (${xhr.status})`))
            } catch {
              reject(new Error(`Failed (${xhr.status})`))
            }
          }
        }
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.send(data)
      })
      closeForm()
      load()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSubmitting(false)
      setProgress(0)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await api.delete(`/agent-voices/${id}`, { auth: true })
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

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
    try {
      await api.patch('/agent-voices/reorder', { order: items.map((i) => i._id) }, { auth: true })
    } catch (err) {
      setError(err.message || 'Reorder failed')
      load()
    }
  }

  return (
    <div className="admin-page admin-page--wide">
      <header className="admin-page__head admin-page__head--row">
        <div>
          <h1>Agent voices</h1>
          <p>Manage the "What our agents say about us" video testimonials shown on the home page.</p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
          <Plus size={15} /> New agent
        </button>
      </header>

      {error ? (
        <div className="admin-alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ) : null}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <p>No agent voices yet. Click <strong>New agent</strong> to upload your first video.</p>
        </div>
      ) : (
        <ul className="agent-grid">
          {items.map((item, idx) => (
            <li
              key={item._id}
              className="agent-card"
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
            >
              <div className="agent-card__handle" aria-hidden>
                <GripVertical size={14} />
              </div>
              <div className="agent-card__video">
                <video src={absoluteUrl(item.videoUrl)} controls preload="metadata" />
              </div>
              <div className="agent-card__body">
                <div className="agent-card__row">
                  <strong>{item.name}</strong>
                  {!item.isActive ? <span className="admin-status admin-status--draft">hidden</span> : null}
                </div>
                <p className="agent-card__role">
                  {item.role}
                  {item.desk ? <> · <span>{item.desk}</span></> : null}
                </p>
                {item.quote ? <p className="agent-card__quote">&ldquo;{item.quote}&rdquo;</p> : null}
              </div>
              <div className="agent-card__actions">
                <button
                  type="button"
                  className="admin-icon-btn"
                  onClick={() => openEdit(item)}
                  title="Edit"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn--danger"
                  onClick={() => handleDelete(item._id, item.name)}
                  disabled={deletingId === item._id}
                  title="Delete"
                >
                  {deletingId === item._id ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className="admin-modal" role="dialog" aria-modal="true" onClick={closeForm}>
          <form className="admin-modal__card" onClick={(e) => e.stopPropagation()} onSubmit={submitForm}>
            <header className="admin-modal__head">
              <h2>{editingId ? 'Edit agent voice' : 'New agent voice'}</h2>
              <button type="button" className="admin-icon-btn" onClick={closeForm} aria-label="Close">
                <X size={16} />
              </button>
            </header>

            <div className="admin-modal__body">
              <label className="admin-field">
                <span>Name *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="e.g. Riya Malhotra"
                />
              </label>

              <div className="admin-form-row">
                <label className="admin-field">
                  <span>Role</span>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="e.g. Senior Destination Specialist"
                  />
                </label>
                <label className="admin-field">
                  <span>Desk</span>
                  <input
                    value={form.desk}
                    onChange={(e) => setForm((f) => ({ ...f, desk: e.target.value }))}
                    placeholder="e.g. Dubai Desk"
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Quote</span>
                <textarea
                  rows={3}
                  value={form.quote}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  maxLength={600}
                  placeholder="A short quote shown below the video…"
                />
              </label>

              <label className="admin-field">
                <span>
                  Video file {editingId ? '(leave empty to keep current)' : '*'}
                </span>
                <div className="admin-file-picker">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, videoFile: e.target.files?.[0] || null }))
                    }
                  />
                  {form.videoFile ? (
                    <div className="admin-file-picker__chip">
                      <VideoIcon size={13} />
                      <span>
                        {form.videoFile.name} · {(form.videoFile.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  ) : (
                    <p className="admin-hint">MP4 / MOV / WebM, max 100MB</p>
                  )}
                </div>
              </label>

              <label className="admin-radio-row admin-radio-row--inline">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <span>Show on the public site</span>
              </label>

              {submitting && progress > 0 ? (
                <div className="admin-progress">
                  <div className="admin-progress__bar" style={{ width: `${progress}%` }} />
                </div>
              ) : null}
            </div>

            <footer className="admin-modal__foot">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={closeForm} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={14} className="spin" /> {progress > 0 ? `Uploading ${progress}%` : 'Saving…'}
                  </>
                ) : (
                  <>
                    {editingId ? <Save size={14} /> : <Upload size={14} />}
                    {editingId ? 'Save changes' : 'Upload'}
                  </>
                )}
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  )
}
