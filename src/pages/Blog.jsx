import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Calendar, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import { api, apiBase } from '../lib/api'
import './Blog.css'

const PAGE_SIZE = 12

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

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)
  const category = searchParams.get('category') || ''
  const q = searchParams.get('q') || ''

  const [searchInput, setSearchInput] = useState(q)
  const [data, setData] = useState({ items: [], total: 0, pages: 1, categories: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setSearchInput(q)
  }, [q])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(PAGE_SIZE))
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    api
      .get(`/blog?${params.toString()}`)
      .then((res) => {
        if (!alive) return
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'Failed to load posts')
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [page, category, q])

  function setParams(next) {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (v === '' || v == null) params.delete(k)
      else params.set(k, String(v))
    })
    setSearchParams(params, { replace: false })
  }

  function handleSearch(e) {
    e.preventDefault()
    setParams({ q: searchInput.trim(), page: 1 })
  }

  const featured = useMemo(() => (page === 1 && !q && !category ? data.items[0] : null), [data.items, page, q, category])
  const rest = useMemo(() => (featured ? data.items.slice(1) : data.items), [data.items, featured])

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Blog</span>
          </div>
          <span className="tag tag-light">Anjana Globals Blog</span>
          <h1>Travel stories, guides &amp; B2B insights</h1>
          <p>
            Destination guides, travel tips, visa updates and industry insights from our team.
          </p>
          <form className="blog-search" onSubmit={handleSearch} role="search">
            <Search size={16} aria-hidden />
            <input
              type="search"
              placeholder="Search articles…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search blog"
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      </section>

      {data.categories?.length ? (
        <section className="blog-cats">
          <div className="container">
            <div className="blog-cats__row">
              <button
                type="button"
                className={`blog-chip${!category ? ' is-active' : ''}`}
                onClick={() => setParams({ category: '', page: 1 })}
              >
                All
              </button>
              {data.categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`blog-chip${category === c ? ' is-active' : ''}`}
                  onClick={() => setParams({ category: c, page: 1 })}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="blog-list">
        <div className="container">
          {error ? <p className="blog-error">{error}</p> : null}
          {loading ? (
            <div className="blog-skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="blog-skeleton" />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <div className="blog-empty">
              <p>No posts found{q ? ` for "${q}"` : ''}.</p>
              {(q || category) && (
                <button type="button" className="btn-secondary" onClick={() => setSearchParams({})}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {featured ? (
                <Link to={`/blog/${featured.slug}`} className="blog-feature">
                  <div
                    className="blog-feature__media"
                    style={{
                      backgroundImage: featured.coverUrl
                        ? `url(${absoluteUrl(featured.coverUrl)})`
                        : undefined,
                    }}
                  />
                  <div className="blog-feature__body">
                    {featured.category ? (
                      <span className="blog-card__cat">
                        <Tag size={12} aria-hidden /> {featured.category}
                      </span>
                    ) : null}
                    <h2>{featured.title}</h2>
                    {featured.excerpt ? <p>{featured.excerpt}</p> : null}
                    <span className="blog-card__date">
                      <Calendar size={13} aria-hidden /> {formatDate(featured.publishedAt)}
                    </span>
                  </div>
                </Link>
              ) : null}

              <div className="blog-grid">
                {rest.map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="blog-card">
                    <div
                      className="blog-card__media"
                      style={{
                        backgroundImage: post.coverThumbUrl || post.coverUrl
                          ? `url(${absoluteUrl(post.coverThumbUrl || post.coverUrl)})`
                          : undefined,
                      }}
                    />
                    <div className="blog-card__body">
                      {post.category ? (
                        <span className="blog-card__cat">
                          <Tag size={11} aria-hidden /> {post.category}
                        </span>
                      ) : null}
                      <h3>{post.title}</h3>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                      <span className="blog-card__date">
                        <Calendar size={12} aria-hidden /> {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {data.pages > 1 ? (
                <nav className="blog-pager" aria-label="Pagination">
                  <button
                    type="button"
                    onClick={() => setParams({ page: Math.max(1, page - 1) })}
                    disabled={page <= 1}
                    className="blog-pager__btn"
                  >
                    <ChevronLeft size={15} /> Prev
                  </button>
                  <span className="blog-pager__info">
                    Page {page} of {data.pages} · {data.total} posts
                  </span>
                  <button
                    type="button"
                    onClick={() => setParams({ page: Math.min(data.pages, page + 1) })}
                    disabled={page >= data.pages}
                    className="blog-pager__btn"
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
