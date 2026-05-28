import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Upload, Trash2, GripVertical, ImagePlus, Loader2, X, Save } from 'lucide-react'
import { api, getToken, apiBase } from '../../lib/api'
import './admin.css'

const DESTINATIONS = [
  { id: 'dubai', name: 'Dubai', flag: '🇦🇪' },
  { id: 'azerbaijan', name: 'Azerbaijan', flag: '🇦🇿' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬' },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'bali', name: 'Bali', flag: '🇮🇩' },
]

function absoluteUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${apiBase}${path}`
}

export default function AdminGalleries() {
  const [activeId, setActiveId] = useState(DESTINATIONS[0].id)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({ caption: '', alt: '' })
  const [deletingId, setDeletingId] = useState(null)
  const fileInputRef = useRef(null)
  const dragSrcIndex = useRef(null)

  const load = useCallback(async (destinationId) => {
    setLoading(true)
    setError('')
    try {
      const { items: list } = await api.get(`/galleries/${destinationId}`)
      setItems(list)
    } catch (err) {
      setError(err.message || 'Failed to load')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(activeId)
  }, [activeId, load])

  // Multi-file upload via XHR for progress
  async function uploadFiles(files) {
    const valid = Array.from(files).filter((f) => /^image\/(jpe?g|png|webp|gif)$/i.test(f.type))
    if (!valid.length) {
      setError('No valid images selected (jpg, png, webp, gif only)')
      return
    }
    setError('')
    setUploading(true)
    setUploadProgress(0)
    const formData = new FormData()
    valid.forEach((f) => formData.append('images', f))

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${apiBase}/api/galleries/${activeId}/images`)
      const token = getToken()
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const payload = JSON.parse(xhr.responseText)
            setItems((prev) => [...prev, ...payload.items])
            resolve()
          } catch (e) {
            reject(e)
          }
        } else {
          try {
            const payload = JSON.parse(xhr.responseText)
            reject(new Error(payload.error || `Upload failed (${xhr.status})`))
          } catch {
            reject(new Error(`Upload failed (${xhr.status})`))
          }
        }
      }
      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(formData)
    }).catch((err) => setError(err.message || 'Upload failed'))

    setUploading(false)
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleFileInput(e) {
    if (e.target.files?.length) uploadFiles(e.target.files)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (uploading) return
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this image? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/galleries/${activeId}/images/${id}`, { auth: true })
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  function startEdit(item) {
    setEditingId(item._id)
    setEditDraft({ caption: item.caption || '', alt: item.alt || '' })
  }

  async function saveEdit(id) {
    try {
      const updated = await api.patch(`/galleries/${activeId}/images/${id}`, editDraft, { auth: true })
      setItems((prev) => prev.map((i) => (i._id === id ? { ...i, ...updated } : i)))
      setEditingId(null)
    } catch (err) {
      setError(err.message || 'Save failed')
    }
  }

  function cancelEdit() {
    setEditingId(null)
  }

  // Drag-to-reorder
  function onDragStart(idx) {
    dragSrcIndex.current = idx
  }
  function onDragOverItem(e, idx) {
    e.preventDefault()
    const from = dragSrcIndex.current
    if (from === null || from === idx) return
    setItems((prev) => {
      const next = prev.slice()
      const [moved] = next.splice(from, 1)
      next.splice(idx, 0, moved)
      dragSrcIndex.current = idx
      return next
    })
  }
  async function onDragEnd() {
    dragSrcIndex.current = null
    try {
      await api.patch(
        `/galleries/${activeId}/reorder`,
        { order: items.map((i) => i._id) },
        { auth: true }
      )
    } catch (err) {
      setError(err.message || 'Reorder failed')
      load(activeId)
    }
  }

  const activeDest = useMemo(() => DESTINATIONS.find((d) => d.id === activeId), [activeId])

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Client moment galleries</h1>
          <p>Manage destination photo galleries shown on the testimonials page and home moments.</p>
        </div>
      </header>

      <div className="admin-tabs">
        {DESTINATIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActiveId(d.id)}
            className={`admin-tab${activeId === d.id ? ' is-active' : ''}`}
          >
            <span>{d.flag}</span>
            {d.name}
          </button>
        ))}
      </div>

      <section
        className={`admin-dropzone${dragOver ? ' is-over' : ''}${uploading ? ' is-uploading' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <ImagePlus size={28} aria-hidden />
        <div>
          <strong>Drop images here</strong>
          <p>or click to browse. JPG / PNG / WebP / GIF, up to 15MB each, max 20 files at a time.</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 size={15} className="spin" /> Uploading {uploadProgress}%
            </>
          ) : (
            <>
              <Upload size={15} /> Choose files
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={handleFileInput}
        />
        {uploading ? (
          <div className="admin-progress">
            <div className="admin-progress__bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        ) : null}
      </section>

      {error ? (
        <div className="admin-alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ) : null}

      <section className="admin-grid-wrap">
        <div className="admin-grid-wrap__head">
          <h2>
            {activeDest?.flag} {activeDest?.name} <span className="admin-count">({items.length})</span>
          </h2>
          <p className="admin-hint">Drag to reorder · click an image to edit caption</p>
        </div>

        {loading ? (
          <p className="admin-muted">Loading…</p>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <p>No images yet. Upload some above.</p>
          </div>
        ) : (
          <ul className="admin-grid">
            {items.map((item, idx) => (
              <li
                key={item._id}
                className={`admin-card${editingId === item._id ? ' is-editing' : ''}`}
                draggable={editingId !== item._id}
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOverItem(e, idx)}
                onDragEnd={onDragEnd}
              >
                <div className="admin-card__handle" aria-hidden>
                  <GripVertical size={14} />
                </div>
                <button
                  type="button"
                  className="admin-card__media"
                  onClick={() => (editingId === item._id ? null : startEdit(item))}
                  aria-label="Edit caption"
                >
                  <img src={absoluteUrl(item.thumbUrl)} alt={item.alt || item.caption || ''} loading="lazy" />
                </button>
                {editingId === item._id ? (
                  <div className="admin-card__edit">
                    <label className="admin-field admin-field--sm">
                      <span>Caption</span>
                      <input
                        value={editDraft.caption}
                        onChange={(e) => setEditDraft((d) => ({ ...d, caption: e.target.value }))}
                        maxLength={240}
                        placeholder="Optional caption"
                      />
                    </label>
                    <label className="admin-field admin-field--sm">
                      <span>Alt text</span>
                      <input
                        value={editDraft.alt}
                        onChange={(e) => setEditDraft((d) => ({ ...d, alt: e.target.value }))}
                        maxLength={240}
                        placeholder="For screen readers"
                      />
                    </label>
                    <div className="admin-card__actions">
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelEdit}>
                        Cancel
                      </button>
                      <button type="button" className="admin-btn admin-btn--primary" onClick={() => saveEdit(item._id)}>
                        <Save size={13} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-card__meta">
                    <p className="admin-card__cap" title={item.caption}>
                      {item.caption || <em className="admin-muted">No caption</em>}
                    </p>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--danger"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      aria-label="Delete image"
                    >
                      {deletingId === item._id ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
