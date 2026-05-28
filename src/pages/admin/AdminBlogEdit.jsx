import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Save, Trash2, ImagePlus, X, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react'
import { api, apiBase, getToken } from '../../lib/api'
import RichTextEditor from './RichTextEditor'
import './admin.css'

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

function slugifyClient(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120)
}

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: '',
  status: 'published',
  coverUrl: '',
  coverThumbUrl: '',
  coverStorageKey: '',
  coverThumbStorageKey: '',
}

export default function AdminBlogEdit() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const [post, setPost] = useState(EMPTY)
  const [original, setOriginal] = useState(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [coverUploading, setCoverUploading] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (isNew) return
    setLoading(true)
    api
      .get(`/blog/admin/${id}`, { auth: true })
      .then((res) => {
        setPost(res)
        setOriginal(res)
        setSlugManuallyEdited(true) // existing posts: don't auto-rewrite slug on title edit
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load')
        setLoading(false)
      })
  }, [id, isNew])

  function patch(p) {
    setPost((prev) => {
      const next = { ...prev, ...p }
      if (!slugManuallyEdited && p.title !== undefined) {
        next.slug = slugifyClient(p.title)
      }
      return next
    })
  }

  function onSlugChange(value) {
    setSlugManuallyEdited(true)
    setPost((prev) => ({ ...prev, slug: slugifyClient(value) }))
  }

  async function uploadCover(file) {
    setCoverUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('image', file)
    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${apiBase}/api/blog/admin/cover`)
        const token = getToken()
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const payload = JSON.parse(xhr.responseText)
            setPost((prev) => ({
              ...prev,
              coverUrl: payload.coverUrl,
              coverThumbUrl: payload.coverThumbUrl,
              coverStorageKey: payload.coverStorageKey,
              coverThumbStorageKey: payload.coverThumbStorageKey,
            }))
            resolve()
          } else {
            try {
              const e = JSON.parse(xhr.responseText)
              reject(new Error(e.error || `Upload failed (${xhr.status})`))
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`))
            }
          }
        }
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.send(formData)
      })
    } catch (err) {
      setError(err.message || 'Cover upload failed')
    } finally {
      setCoverUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function clearCover() {
    setPost((prev) => ({
      ...prev,
      coverUrl: '',
      coverThumbUrl: '',
      coverStorageKey: '',
      coverThumbStorageKey: '',
    }))
  }

  async function save() {
    if (!post.title.trim()) {
      setError('Title is required')
      return
    }
    if (!post.body || post.body.trim() === '' || post.body === '<p></p>') {
      setError('Body cannot be empty')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: post.title.trim(),
        slug: post.slug || slugifyClient(post.title),
        excerpt: post.excerpt,
        body: post.body,
        category: post.category.trim(),
        status: post.status,
        coverUrl: post.coverUrl,
        coverThumbUrl: post.coverThumbUrl,
        coverStorageKey: post.coverStorageKey,
        coverThumbStorageKey: post.coverThumbStorageKey,
      }
      if (isNew) {
        const created = await api.post('/blog', payload, { auth: true })
        navigate(`/admin/blogs/${created._id}/edit`, { replace: true })
      } else {
        const updated = await api.patch(`/blog/${id}`, payload, { auth: true })
        setPost(updated)
        setOriginal(updated)
      }
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${original?.title || 'this post'}"? This cannot be undone.`)) return
    try {
      await api.delete(`/blog/${id}`, { auth: true })
      navigate('/admin/blogs', { replace: true })
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-muted">Loading…</p>
      </div>
    )
  }

  return (
    <div className="admin-page admin-page--wide">
      <header className="admin-page__head admin-page__head--row">
        <div>
          <Link to="/admin/blogs" className="admin-back">
            <ArrowLeft size={14} /> All posts
          </Link>
          <h1>{isNew ? 'New post' : 'Edit post'}</h1>
        </div>
        <div className="admin-actions">
          {!isNew && post.status === 'published' ? (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn--ghost"
            >
              <ExternalLink size={14} /> View
            </a>
          ) : null}
          {!isNew ? (
            <button type="button" className="admin-btn admin-btn--ghost admin-btn--danger" onClick={handleDelete}>
              <Trash2 size={14} /> Delete
            </button>
          ) : null}
          <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      {error ? (
        <div className="admin-alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <label className="admin-field">
            <span>Title</span>
            <input
              value={post.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Untitled post"
              className="admin-input-lg"
            />
          </label>

          <label className="admin-field">
            <span>Body</span>
            <RichTextEditor value={post.body} onChange={(html) => patch({ body: html })} />
          </label>
        </div>

        <aside className="admin-editor-side">
          <div className="admin-card-sm">
            <h3>Cover image</h3>
            {post.coverUrl ? (
              <div className="admin-cover-preview">
                <img src={absoluteUrl(post.coverThumbUrl || post.coverUrl)} alt="" />
                <button type="button" onClick={clearCover} className="admin-btn admin-btn--ghost admin-btn--sm">
                  Remove
                </button>
              </div>
            ) : (
              <div className="admin-cover-empty">No cover image</div>
            )}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={coverUploading}
            >
              {coverUploading ? <Loader2 size={14} className="spin" /> : <ImagePlus size={14} />}
              {coverUploading ? 'Uploading…' : post.coverUrl ? 'Replace' : 'Upload cover'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
            />
          </div>

          <div className="admin-card-sm">
            <h3>Status</h3>
            <div className="admin-radio-row">
              <label className={`admin-radio${post.status === 'published' ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={post.status === 'published'}
                  onChange={() => patch({ status: 'published' })}
                />
                Published
              </label>
              <label className={`admin-radio${post.status === 'draft' ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={post.status === 'draft'}
                  onChange={() => patch({ status: 'draft' })}
                />
                Draft
              </label>
            </div>
          </div>

          <div className="admin-card-sm">
            <h3>Slug</h3>
            <label className="admin-field admin-field--sm">
              <span>URL handle</span>
              <input
                value={post.slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </label>
            {post.slug ? (
              <p className="admin-hint admin-hint--code">/blog/{post.slug}</p>
            ) : null}
          </div>

          <div className="admin-card-sm">
            <h3>Category</h3>
            <label className="admin-field admin-field--sm">
              <span>Category</span>
              <input
                value={post.category}
                onChange={(e) => patch({ category: e.target.value })}
                placeholder="e.g. Destinations"
              />
            </label>
          </div>

          <div className="admin-card-sm">
            <h3>Excerpt</h3>
            <label className="admin-field admin-field--sm">
              <span>Short summary (shown on listing pages)</span>
              <textarea
                rows={4}
                value={post.excerpt}
                onChange={(e) => patch({ excerpt: e.target.value })}
                maxLength={580}
                placeholder="2–3 sentences…"
              />
            </label>
            <p className="admin-hint">{post.excerpt.length}/580</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
