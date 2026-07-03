import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Camera, Star, Play, Video as VideoIcon, Sparkles, Quote, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { destinations } from '../data/destinations'
import { useAllGalleries } from '../hooks/useGalleries'
import { api, apiBase } from '../lib/api'
import './Testimonials.css'

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

function Stars({ rating = 5 }) {
  return (
    <div className="t-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? '#B8963E' : 'transparent'}
          color={i < rating ? '#B8963E' : '#D4D4D4'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const initial = (review.name || '?').trim().charAt(0).toUpperCase()
  const avatar = review.avatarThumbUrl || review.avatarUrl
  return (
    <article className={`t-review${review.isFeatured ? ' is-featured' : ''}`}>
      <Quote size={18} aria-hidden className="t-review__quote" />
      <p className="t-review__text">{review.message}</p>
      <div className="t-review__foot">
        {avatar ? (
          <img src={absoluteUrl(avatar)} alt={review.name} className="t-review__avatar" />
        ) : (
          <div className="t-review__avatar t-review__avatar--placeholder">{initial}</div>
        )}
        <div className="t-review__who">
          <strong>{review.name}</strong>
          {review.location ? <span>{review.location}</span> : null}
          <Stars rating={review.rating} />
        </div>
        {(review.tripType || review.tripDate) && (
          <div className="t-review__tags">
            {review.tripType ? <span className="t-chip">{review.tripType}</span> : null}
            {review.tripDate ? <span className="t-chip t-chip--ghost">{review.tripDate}</span> : null}
          </div>
        )}
      </div>
    </article>
  )
}

const MOMENTS_INITIAL = 28

function MomentsShowcase() {
  const [items, setItems] = useState(null)
  const [shown, setShown] = useState(MOMENTS_INITIAL)
  const [lightbox, setLightbox] = useState(-1)

  useEffect(() => {
    let alive = true
    api
      .get('/galleries/moments')
      .then((r) => alive && setItems(r.items || []))
      .catch(() => alive && setItems([]))
    return () => { alive = false }
  }, [])

  const photos = useMemo(
    () =>
      (items || []).map((i) => ({
        src: absoluteUrl(i.url),
        alt: i.alt || i.caption || 'Happy traveller with Anjna Global',
        caption: i.caption || '',
      })),
    [items]
  )

  useEffect(() => {
    if (lightbox < 0) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(-1)
      else if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % photos.length)
      else if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + photos.length) % photos.length)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lightbox, photos.length])

  // Only render when we actually have client photos in the shared bucket.
  if (!items || items.length === 0) return null

  const visible = photos.slice(0, shown)

  return (
    <section className="t-moments">
      <div className="container">
        <header className="t-section-head">
          <span className="tag">Happy travellers</span>
          <h2>Real moments from real trips</h2>
          <p>Faces, smiles and memories from journeys we've put together — a small window into the trips we're proud of.</p>
        </header>

        <div className="t-moments__mason">
          {visible.map((img, idx) => (
            <button
              key={`${idx}-${img.src}`}
              type="button"
              className="t-moments__item"
              onClick={() => setLightbox(idx)}
              aria-label="View photo"
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              {img.caption ? <span className="t-moments__cap">{img.caption}</span> : null}
            </button>
          ))}
        </div>

        {shown < photos.length ? (
          <div className="t-moments__more-wrap">
            <button
              type="button"
              className="t-moments__more"
              onClick={() => setShown((s) => s + MOMENTS_INITIAL)}
            >
              Show more moments
            </button>
          </div>
        ) : null}
      </div>

      {lightbox >= 0 ? createPortal(
        <div className="t-lb" role="dialog" aria-modal="true" onClick={() => setLightbox(-1)}>
          <button className="t-lb__x" type="button" aria-label="Close" onClick={() => setLightbox(-1)}>
            <X size={22} />
          </button>
          <button
            className="t-lb__nav t-lb__nav--prev"
            type="button"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + photos.length) % photos.length) }}
          >
            <ChevronLeft size={26} />
          </button>
          <figure className="t-lb__fig" onClick={(e) => e.stopPropagation()}>
            <img src={photos[lightbox].src} alt={photos[lightbox].alt} />
            {photos[lightbox].caption ? <figcaption>{photos[lightbox].caption}</figcaption> : null}
          </figure>
          <button
            className="t-lb__nav t-lb__nav--next"
            type="button"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % photos.length) }}
          >
            <ChevronRight size={26} />
          </button>
          <span className="t-lb__count">{lightbox + 1} / {photos.length}</span>
        </div>,
        document.body
      ) : null}
    </section>
  )
}

function AgentVoicesSection() {
  const [voices, setVoices] = useState([])
  const [playing, setPlaying] = useState(null)
  const [errors, setErrors] = useState({})
  const videoRefs = useRef({})

  useEffect(() => {
    let alive = true
    api
      .get('/agent-voices')
      .then((res) => alive && setVoices(res.items || []))
      .catch(() => alive && setVoices([]))
    return () => { alive = false }
  }, [])

  function handlePlay(id) {
    setPlaying(id)
    Object.entries(videoRefs.current).forEach(([k, node]) => {
      if (!node) return
      if (k === id) {
        node.play().catch(() => {})
      } else {
        node.pause()
        try { node.currentTime = 0 } catch { /* noop */ }
      }
    })
  }

  function handlePause(id) {
    if (playing === id) setPlaying(null)
  }

  if (voices.length === 0) return null

  return (
    <section className="t-agents">
      <div className="container">
        <header className="t-section-head">
          <span className="tag">Agent voices</span>
          <h2>Hear it from our team</h2>
          <p>Real insights from our destination experts across operations, planning and guest experience.</p>
        </header>

        <div className="t-agent-grid">
          {voices.map((agent, idx) => {
            const isPlaying = playing === agent._id
            const hasError = errors[agent._id]
            return (
              <article key={agent._id} className={`t-agent-card${isPlaying ? ' is-playing' : ''}`}>
                <div className="t-agent-card__media">
                  <span className="t-agent-card__index">0{idx + 1}</span>
                  {agent.desk ? (
                    <span className="t-agent-card__desk">
                      <Sparkles size={12} aria-hidden /> {agent.desk}
                    </span>
                  ) : null}
                  {hasError ? (
                    <div className="t-agent-card__fallback">
                      <VideoIcon size={22} />
                      <p>Video unavailable</p>
                    </div>
                  ) : (
                    <video
                      ref={(node) => { videoRefs.current[agent._id] = node }}
                      src={absoluteUrl(agent.videoUrl)}
                      playsInline
                      preload="metadata"
                      controls={isPlaying}
                      onPlay={() => setPlaying(agent._id)}
                      onPause={() => handlePause(agent._id)}
                      onEnded={() => handlePause(agent._id)}
                      onError={() => setErrors((p) => ({ ...p, [agent._id]: true }))}
                    />
                  )}
                  {!isPlaying && !hasError ? (
                    <button
                      type="button"
                      className="t-agent-card__cover"
                      onClick={() => handlePlay(agent._id)}
                      aria-label={`Play video from ${agent.name}`}
                    >
                      <span className="t-agent-card__play"><Play size={18} aria-hidden /></span>
                      <span className="t-agent-card__cover-label">Watch testimonial</span>
                    </button>
                  ) : null}
                </div>
                <div className="t-agent-card__body">
                  <h3>{agent.name}</h3>
                  {agent.role ? <p className="t-agent-card__role">{agent.role}</p> : null}
                  {agent.quote ? (
                    <p className="t-agent-card__quote">
                      <span aria-hidden>"</span>{agent.quote}<span aria-hidden>"</span>
                    </p>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Testimonials() {
  const { data: galleries } = useAllGalleries()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    let alive = true
    api
      .get('/testimonials')
      .then((res) => alive && setReviews(res.items || []))
      .catch(() => alive && setReviews([]))
    return () => { alive = false }
  }, [])

  function imagesFor(dest) {
    const apiItems = galleries?.[dest.id]
    if (apiItems && apiItems.length > 0) {
      return apiItems.map((item) => ({
        src: item.url,
        alt: item.alt || item.caption || `${dest.name} travel moment`,
        caption: item.caption || '',
      }))
    }
    return (dest.galleryImages || []).map((src, idx) => ({
      src,
      alt: `${dest.name} travel moment ${idx + 1}`,
      caption: '',
    }))
  }

  function reviewsFor(destId) {
    return reviews.filter((r) => r.destinationId === destId)
  }

  return (
    <main className="testimonials-page">
      <section className="testimonials-page__hero">
        <div className="container testimonials-page__hero-inner">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Testimonials</span>
          </div>
          <span className="tag tag-light">Client & team voices</span>
          <h1>Real journeys, real teams, real promises kept</h1>
          <p>
            Watch our destination specialists, browse photo moments from real trips, and read
            what travellers say about working with Anjna Global.
          </p>
        </div>
      </section>

      {/* Shared happy-traveller moments */}
      <MomentsShowcase />

      {/* Agent video testimonials */}
      <AgentVoicesSection />

      {/* Destination tabs */}
      <section className="testimonials-page__tabs-wrap">
        <div className="container">
          <div className="testimonials-page__tabs" aria-label="Destination jump links">
            {destinations.map((dest) => (
              <a key={dest.id} href={`#${dest.id}`} className="testimonials-page__tab">
                <span>{dest.flag}</span>
                {dest.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Per-destination sections */}
      <section className="testimonials-page__content">
        <div className="container">
          {destinations.map((dest) => {
            const images = imagesFor(dest)
            const destReviews = reviewsFor(dest.id)
            const hasContent = images.length > 0 || destReviews.length > 0
            if (!hasContent) return null
            return (
              <article key={dest.id} id={dest.id} className="testi-destination">
                <header className="testi-destination__head">
                  <div>
                    <p className="testi-destination__meta">
                      <MapPin size={14} />
                      {dest.flag} {dest.name}, {dest.country}
                    </p>
                    <h2>{dest.tagline}</h2>
                    <p>{dest.shortDesc}</p>
                  </div>
                  <Link to={`/destinations/${dest.id}`} className="testi-destination__link">
                    View {dest.name} page <ArrowRight size={15} />
                  </Link>
                </header>

                {images.length > 0 ? (
                  <div className="testi-gallery">
                    {images.map((img, idx) => (
                      <figure
                        key={`${dest.id}-${idx}-${img.src}`}
                        className={`testi-gallery__item${idx === 0 ? ' is-featured' : ''}`}
                      >
                        <img src={img.src} alt={img.alt} loading="lazy" />
                        {img.caption ? <figcaption>{img.caption}</figcaption> : null}
                      </figure>
                    ))}
                  </div>
                ) : null}

                {destReviews.length > 0 ? (
                  <div className="testi-reviews">
                    <h3 className="testi-reviews__heading">
                      <Star size={15} fill="#B8963E" color="#B8963E" /> What travellers say about {dest.name}
                    </h3>
                    <div className="testi-reviews__grid">
                      {destReviews.map((r) => <ReviewCard key={r._id} review={r} />)}
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}

          <div className="testimonials-page__footnote">
            <Camera size={15} />
            <p>
              Want to share your own journey? <Link to="/contact">Drop us a note</Link> — we
              love hearing from our travellers.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
