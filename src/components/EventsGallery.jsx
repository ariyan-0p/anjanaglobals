import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { api, apiBase } from '../lib/api'
import './EventsGallery.css'

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

const INITIAL = 12

// Events & Exhibitions gallery for the About page. Reads the shared
// 'events' gallery bucket (managed in Admin → Galleries → Events).
// Renders nothing until the bucket has photos.
export default function EventsGallery() {
  const [items, setItems] = useState(null)
  const [shown, setShown] = useState(INITIAL)
  const [lightbox, setLightbox] = useState(-1)

  useEffect(() => {
    let alive = true
    api.get('/galleries/events')
      .then((r) => alive && setItems(r.items || []))
      .catch(() => alive && setItems([]))
    return () => { alive = false }
  }, [])

  const photos = useMemo(
    () => (items || []).map((i) => ({
      src: absoluteUrl(i.url),
      alt: i.alt || i.caption || 'Anjna Global event & exhibition',
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

  if (!items || items.length === 0) return null

  const visible = photos.slice(0, shown)

  return (
    <section className="evg-section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <span className="tag">Out & About</span>
          <h2 className="section-heading">Events & Exhibitions</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            From travel trade shows to partner meets — moments from where we show up for our partners and the industry.
          </p>
        </div>

        <div className="evg-mason">
          {visible.map((img, idx) => (
            <button
              key={`${idx}-${img.src}`}
              type="button"
              className="evg-item"
              onClick={() => setLightbox(idx)}
              aria-label="View photo"
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              {img.caption ? <span className="evg-cap">{img.caption}</span> : null}
            </button>
          ))}
        </div>

        {shown < photos.length ? (
          <div className="evg-more-wrap">
            <button type="button" className="evg-more" onClick={() => setShown((s) => s + INITIAL)}>
              Show more
            </button>
          </div>
        ) : null}
      </div>

      {lightbox >= 0 ? createPortal(
        <div className="evg-lb" role="dialog" aria-modal="true" onClick={() => setLightbox(-1)}>
          <button className="evg-lb__x" type="button" aria-label="Close" onClick={() => setLightbox(-1)}>
            <X size={22} />
          </button>
          <button
            className="evg-lb__nav evg-lb__nav--prev"
            type="button"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + photos.length) % photos.length) }}
          >
            <ChevronLeft size={26} />
          </button>
          <figure className="evg-lb__fig" onClick={(e) => e.stopPropagation()}>
            <img src={photos[lightbox].src} alt={photos[lightbox].alt} />
            {photos[lightbox].caption ? <figcaption>{photos[lightbox].caption}</figcaption> : null}
          </figure>
          <button
            className="evg-lb__nav evg-lb__nav--next"
            type="button"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % photos.length) }}
          >
            <ChevronRight size={26} />
          </button>
          <span className="evg-lb__count">{lightbox + 1} / {photos.length}</span>
        </div>,
        document.body
      ) : null}
    </section>
  )
}
