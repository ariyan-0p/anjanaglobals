import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react'
import { api, apiBase } from '../lib/api'
import './Blog.css'

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    api
      .get(`/blog/${slug}`)
      .then((res) => {
        if (!alive) return
        setData(res)
        setLoading(false)
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      .catch((err) => {
        if (!alive) return
        setError(err.status === 404 ? 'Post not found' : err.message || 'Failed to load')
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [slug])

  if (loading) {
    return (
      <main className="blog-detail">
        <div className="container">
          <div className="blog-skeleton blog-skeleton--hero" />
          <div className="blog-skeleton blog-skeleton--text" />
        </div>
      </main>
    )
  }

  if (error || !data?.post) {
    return (
      <main className="blog-detail">
        <div className="container">
          <h1>{error || 'Not found'}</h1>
          <p>
            <Link to="/blog">
              <ArrowLeft size={14} /> Back to all articles
            </Link>
          </p>
        </div>
      </main>
    )
  }

  const { post, related } = data

  return (
    <main className="blog-detail">
      <article>
        <header className="blog-detail__hero">
          {post.coverUrl ? (
            <div
              className="blog-detail__cover"
              style={{ backgroundImage: `url(${absoluteUrl(post.coverUrl)})` }}
              aria-hidden
            />
          ) : null}
          <div className="container blog-detail__hero-inner">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <Link to="/blog">Blog</Link>
              <span>›</span>
              <span className="breadcrumb__cur">{post.title}</span>
            </div>
            {post.category ? (
              <span className="blog-detail__cat">
                <Tag size={13} aria-hidden /> {post.category}
              </span>
            ) : null}
            <h1>{post.title}</h1>
            <p className="blog-detail__meta">
              <Calendar size={14} aria-hidden /> {formatDate(post.publishedAt)}
            </p>
          </div>
        </header>

        <section className="blog-detail__body container">
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />
        </section>
      </article>

      {related?.length ? (
        <section className="blog-related">
          <div className="container">
            <h2>Related articles</h2>
            <div className="blog-grid">
              {related.map((p) => (
                <Link key={p._id} to={`/blog/${p.slug}`} className="blog-card">
                  <div
                    className="blog-card__media"
                    style={{
                      backgroundImage: p.coverThumbUrl || p.coverUrl
                        ? `url(${absoluteUrl(p.coverThumbUrl || p.coverUrl)})`
                        : undefined,
                    }}
                  />
                  <div className="blog-card__body">
                    {p.category ? (
                      <span className="blog-card__cat">
                        <Tag size={11} aria-hidden /> {p.category}
                      </span>
                    ) : null}
                    <h3>{p.title}</h3>
                    {p.excerpt ? <p>{p.excerpt}</p> : null}
                    <span className="blog-card__date">
                      <Calendar size={12} aria-hidden /> {formatDate(p.publishedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="blog-detail__footer container">
        <Link to="/blog" className="blog-detail__back">
          <ArrowLeft size={15} /> All articles
        </Link>
        <Link to="/contact" className="btn-primary">
          Plan your trip <ArrowRight size={15} />
        </Link>
      </section>
    </main>
  )
}
