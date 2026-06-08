import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, Calendar, MapPin, ShieldCheck, Star, Clock, Globe,
  Plane, FileCheck, ChevronDown, Copy, Check, MessageCircle, ExternalLink,
} from 'lucide-react'

import { getDestination } from '../../data/destinations'
import { getDestinationBrief } from '../../data/destinationBriefs'
import { hotelPartners } from '../../data/hotelPartners'
import { api, apiBase } from '../../lib/api'
import './DestinationPage.css'

const TRIP_TYPE_ORDER = ['fit', 'family', 'honeymoon', 'mice', 'group']

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

// ────────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────────
function Hero({ destination, brief }) {
  const heroImage = destination.heroImage || destination.image
  return (
    <header className="dp-hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="dp-hero__overlay" />
      <div className="container dp-hero__inner">
        <div className="dp-hero__breadcrumb">
          <Link to="/">Home</Link>
          <span>·</span>
          <Link to="/destinations">Destinations</Link>
          <span>·</span>
          <span>{destination.name}</span>
        </div>
        <span className="dp-hero__flag">{destination.flag}</span>
        <h1 className="dp-hero__title">{destination.name}</h1>
        <p className="dp-hero__tagline">{destination.tagline}</p>
        <p className="dp-hero__sub">{destination.shortDesc}</p>

        <div className="dp-hero__glance" role="list">
          {brief.atGlance.bestMonths ? (
            <span className="dp-glance" role="listitem">
              <Calendar size={13} aria-hidden /> <strong>Best:</strong> {brief.atGlance.bestMonths}
            </span>
          ) : null}
          {brief.atGlance.visa ? (
            <span className="dp-glance" role="listitem">
              <FileCheck size={13} aria-hidden /> <strong>Visa:</strong> {brief.atGlance.visa}
            </span>
          ) : null}
          {brief.atGlance.currency ? (
            <span className="dp-glance" role="listitem">
              <Globe size={13} aria-hidden /> <strong>Currency:</strong> {brief.atGlance.currency}
            </span>
          ) : null}
          {brief.atGlance.flightTime ? (
            <span className="dp-glance" role="listitem">
              <Plane size={13} aria-hidden /> <strong>Flight:</strong> {brief.atGlance.flightTime}
            </span>
          ) : null}
          {brief.atGlance.timezone ? (
            <span className="dp-glance" role="listitem">
              <Clock size={13} aria-hidden /> {brief.atGlance.timezone}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  )
}

// ────────────────────────────────────────────────────────────────
// STORY — narrative chapters
// ────────────────────────────────────────────────────────────────
function Story({ chapters }) {
  if (!chapters?.length) return null
  return (
    <section className="dp-section dp-story">
      <div className="container">
        <div className="dp-story__grid">
          {chapters.map((c) => (
            <article key={c.heading} className="dp-story__chapter">
              <h2>{c.heading}</h2>
              <p>{c.paragraph}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// PRICING TIERS
// ────────────────────────────────────────────────────────────────
function PricingTiers({ tiers, onQuote }) {
  if (!tiers?.length) return null
  return (
    <section className="dp-section dp-section--alt" id="pricing">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Starting B2B rates</span>
          <h2>Pick a tier, build your quote</h2>
          <p>Net rates · twin sharing · request live quote for actual pax + dates.</p>
        </header>
        <div className="dp-tier-grid">
          {tiers.map((t) => (
            <article key={t.name} className={`dp-tier${t.isPopular ? ' is-popular' : ''}`}>
              {t.isPopular ? <span className="dp-tier__pop">Most booked</span> : null}
              <header>
                <h3>{t.name}</h3>
                <p className="dp-tier__sub">{t.subtitle}</p>
              </header>
              <div className="dp-tier__price">
                <strong>{t.price}</strong>
                <span>{t.perPaxNote}</span>
              </div>
              <ul className="dp-tier__includes">
                {t.includes?.map((inc) => (
                  <li key={inc}>
                    <Check size={13} aria-hidden /> {inc}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="dp-btn dp-btn--ghost"
                onClick={() => onQuote(`Quote for ${t.name} tier`)}
              >
                Get this quote <ArrowRight size={14} aria-hidden />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// TRIP TYPE TABS + EXPERIENCES + LINKED ITINERARY
// ────────────────────────────────────────────────────────────────
function TripTypeSection({ brief, onQuote }) {
  const availableTypes = TRIP_TYPE_ORDER.filter((k) => brief.tripTypes?.[k])
  const [active, setActive] = useState(availableTypes[0] || 'fit')

  if (availableTypes.length === 0) return null

  const cfg = brief.tripTypes[active]
  const linkedExperiences = (cfg.productKeys || [])
    .map((k) => brief.experiences.find((e) => e.key === k))
    .filter(Boolean)
  const linkedItinerary = cfg.itineraryKey
    ? brief.itineraries?.find((i) => i.key === cfg.itineraryKey)
    : null

  return (
    <section className="dp-section" id="trips">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Curated by trip type</span>
          <h2>What your client books determines what we curate</h2>
          <p>Different segments book different products. Pick the type to see the right shortlist.</p>
        </header>

        <div className="dp-tabs" role="tablist">
          {availableTypes.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={active === k}
              className={`dp-tab${active === k ? ' is-active' : ''}`}
              onClick={() => setActive(k)}
            >
              {brief.tripTypes[k].label}
            </button>
          ))}
        </div>

        <div className="dp-tab-panel">
          <p className="dp-tab-blurb">{cfg.blurb}</p>
          <div className="dp-exp-grid">
            {linkedExperiences.map((e) => (
              <ExperienceCard key={e.key} exp={e} onQuote={onQuote} />
            ))}
          </div>
          {linkedItinerary ? (
            <div className="dp-tab-itin">
              <p className="dp-eyebrow dp-eyebrow--gold">Suggested itinerary for this segment</p>
              <ItineraryCard itinerary={linkedItinerary} destinationName={brief.quoteIntent} onQuote={onQuote} defaultOpen />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ exp, onQuote }) {
  return (
    <article className="dp-exp">
      <header className="dp-exp__head">
        <h3>{exp.name}</h3>
        {exp.badge ? <span className="dp-exp__badge">{exp.badge}</span> : null}
      </header>
      <p className="dp-exp__meta">{[exp.duration, exp.includes].filter(Boolean).join(' · ')}</p>
      <footer className="dp-exp__foot">
        <span className="dp-exp__price">
          <span>From</span> {exp.price || 'On request'}
        </span>
        <button
          type="button"
          className="dp-btn dp-btn--text"
          onClick={() => onQuote(`Quote ${exp.name}`)}
        >
          Quote <ArrowRight size={12} aria-hidden />
        </button>
      </footer>
    </article>
  )
}

// ────────────────────────────────────────────────────────────────
// ITINERARY ACCORDION
// ────────────────────────────────────────────────────────────────
function ItineraryCard({ itinerary, destinationName, onQuote, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  function buildCopyText() {
    const lines = []
    lines.push(`${destinationName ? destinationName + ' — ' : ''}${itinerary.name}`)
    lines.push(`${itinerary.nights} · ${itinerary.hotelCategory || ''}`)
    if (itinerary.price) lines.push(`Starting B2B rate: ${itinerary.price}`)
    lines.push('')
    if (itinerary.summary) {
      lines.push(itinerary.summary)
      lines.push('')
    }
    itinerary.days?.forEach((d) => {
      lines.push(`Day ${d.day} — ${d.title}`)
      d.items?.forEach((it) => lines.push(`• ${it}`))
      lines.push('')
    })
    lines.push('— Quote prepared by Anjna Global · anjnaglobal.com')
    return lines.join('\n')
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildCopyText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      // ignore — fallback would be a textarea trick if needed
    }
  }

  return (
    <article className={`dp-itin${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="dp-itin__summary"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="dp-itin__title">
          <strong>{itinerary.name}</strong>
          <span>
            {itinerary.nights}
            {itinerary.hotelCategory ? <> · {itinerary.hotelCategory}</> : null}
          </span>
        </div>
        <div className="dp-itin__price">
          {itinerary.price ? <strong>From {itinerary.price}</strong> : null}
          <ChevronDown size={16} className="dp-itin__chev" aria-hidden />
        </div>
      </button>
      {open ? (
        <div className="dp-itin__body">
          {itinerary.summary ? <p className="dp-itin__summary-text">{itinerary.summary}</p> : null}
          <ol className="dp-itin__days">
            {itinerary.days?.map((d) => (
              <li key={d.day}>
                <span className="dp-itin__day-num">Day {d.day}</span>
                <div className="dp-itin__day-body">
                  <strong>{d.title}</strong>
                  <ul>{d.items?.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
          <div className="dp-itin__actions">
            <button
              type="button"
              className="dp-btn dp-btn--ghost dp-btn--sm"
              onClick={copy}
              aria-live="polite"
            >
              {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
              {copied ? 'Copied to clipboard' : 'Copy itinerary text'}
            </button>
            <button
              type="button"
              className="dp-btn dp-btn--primary dp-btn--sm"
              onClick={() => onQuote(`Quote ${itinerary.name}`)}
            >
              Request live quote <ArrowRight size={13} aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </article>
  )
}

function ItinerarySection({ itineraries, destinationName, onQuote }) {
  if (!itineraries?.length) return null
  return (
    <section className="dp-section dp-section--alt" id="itineraries">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Ready-to-quote itineraries</span>
          <h2>Copy-paste these into your client proposal</h2>
          <p>Day-by-day plans your agents can drop straight into a quote.</p>
        </header>
        <div className="dp-itin-list">
          {itineraries.map((it) => (
            <ItineraryCard
              key={it.key}
              itinerary={it}
              destinationName={destinationName}
              onQuote={onQuote}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// HOTEL INVENTORY
// ────────────────────────────────────────────────────────────────
function HotelInventory({ destinationId, destinationName }) {
  const all = hotelPartners[destinationId] || []
  const hasStars = all.some((h) => typeof h.stars === 'number')
  const [filter, setFilter] = useState('all')

  if (all.length === 0) return null

  const filtered = filter === 'all' ? all : all.filter((h) => h.stars === filter)

  return (
    <section className="dp-section" id="hotels">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Hotel inventory</span>
          <h2>{all.length} partner hotels in {destinationName}</h2>
          <p>All direct contracts. Allotments held — no consolidators in the chain.</p>
        </header>

        {hasStars ? (
          <div className="dp-tabs" role="tablist">
            <button
              type="button"
              className={`dp-tab${filter === 'all' ? ' is-active' : ''}`}
              onClick={() => setFilter('all')}
              role="tab"
              aria-selected={filter === 'all'}
            >
              All
            </button>
            {[5, 4, 3].map((s) => (
              <button
                key={s}
                type="button"
                className={`dp-tab${filter === s ? ' is-active' : ''}`}
                onClick={() => setFilter(s)}
                role="tab"
                aria-selected={filter === s}
              >
                {'★'.repeat(s)}
              </button>
            ))}
          </div>
        ) : null}

        <div className="dp-hotel-grid">
          {filtered.map((h) => (
            <div key={h.name} className="dp-hotel" title={h.name}>
              {h.logo ? (
                <img src={h.logo} alt={h.name} loading="lazy" />
              ) : (
                <span>{h.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// PHOTO JOURNEY — uses /api/galleries with fallback to dest.galleryImages
// ────────────────────────────────────────────────────────────────
function PhotoJourney({ destination }) {
  const [apiImages, setApiImages] = useState(null)

  useEffect(() => {
    let alive = true
    api
      .get(`/galleries/${destination.id}`)
      .then((res) => alive && setApiImages(res.items || []))
      .catch(() => alive && setApiImages([]))
    return () => { alive = false }
  }, [destination.id])

  const images = useMemo(() => {
    if (apiImages && apiImages.length > 0) {
      return apiImages.map((i) => ({
        src: absoluteUrl(i.url),
        alt: i.alt || i.caption || `${destination.name} moment`,
        caption: i.caption || '',
      }))
    }
    return (destination.galleryImages || []).map((src, idx) => ({
      src,
      alt: `${destination.name} moment ${idx + 1}`,
      caption: '',
    }))
  }, [apiImages, destination])

  if (images.length === 0) return null

  return (
    <section className="dp-section dp-section--alt" id="moments">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Real client moments</span>
          <h2>{destination.name} through our travellers' lenses</h2>
        </header>
        <div className="dp-photo-grid">
          {images.map((img, idx) => (
            <figure key={`${img.src}-${idx}`} className={`dp-photo${idx === 0 ? ' is-feature' : ''}`}>
              <img src={img.src} alt={img.alt} loading="lazy" />
              {img.caption ? <figcaption>{img.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// TRUST STRIP
// ────────────────────────────────────────────────────────────────
function TrustStrip({ points }) {
  if (!points?.length) return null
  return (
    <section className="dp-section" id="trust">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow dp-eyebrow--gold">
            <ShieldCheck size={13} aria-hidden /> Why we own this destination
          </span>
        </header>
        <div className="dp-trust-grid">
          {points.map((p) => (
            <article key={p.title} className="dp-trust">
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// STICKY QUOTE RAIL  (desktop right rail / mobile bottom bar)
// ────────────────────────────────────────────────────────────────
function StickyQuoteRail({ destination, brief, intent }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !(form.phone.trim() || form.email.trim())) {
      setError('Name and phone or email are required.')
      return
    }
    setError('')
    setSending(true)
    try {
      await api.post('/leads', {
        ...form,
        source: 'destination-rail',
        destination: destination.id,
        message: `${intent || ''}${form.notes ? ' — ' + form.notes : ''}`,
      })
      setDone(true)
    } catch (err) {
      setError(err.message || 'Could not send. Try the contact page.')
    } finally {
      setSending(false)
    }
  }

  return (
    <aside className="dp-rail" aria-label="Quick quote">
      <div className="dp-rail__card">
        <p className="dp-rail__eyebrow">
          <MessageCircle size={13} aria-hidden /> Get a live quote
        </p>
        <h3>{destination.flag} {destination.name}</h3>
        <p className="dp-rail__sub">Avg quote response within 2 hours. Indicative tiers above; we'll send firm rates for your actual pax + dates.</p>

        {done ? (
          <p className="dp-rail__done">
            <Check size={14} aria-hidden /> Sent. Our {destination.name} desk will respond within 2 hours.
          </p>
        ) : (
          <form onSubmit={submit} className="dp-rail__form">
            {intent ? <p className="dp-rail__intent">For: {intent}</p> : null}
            <input
              type="text"
              required
              placeholder="Your name *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              aria-label="Your name"
            />
            <input
              type="tel"
              placeholder="Phone or WhatsApp"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              aria-label="Phone"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              aria-label="Email"
            />
            <textarea
              rows={2}
              placeholder="Pax, dates, hotel category…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              aria-label="Trip notes"
            />
            {error ? <p className="dp-rail__error">{error}</p> : null}
            <button type="submit" disabled={sending} className="dp-btn dp-btn--primary dp-btn--block">
              {sending ? 'Sending…' : 'Request live quote'} <ArrowRight size={14} aria-hidden />
            </button>
          </form>
        )}

        <div className="dp-rail__alts">
          <a href="tel:+911242786999" className="dp-rail__alt">
            +91-124-2786999
          </a>
          <a
            href="https://wa.me/919958801627"
            target="_blank"
            rel="noreferrer"
            className="dp-rail__alt dp-rail__alt--wa"
          >
            WhatsApp <ExternalLink size={11} aria-hidden />
          </a>
        </div>
      </div>
    </aside>
  )
}

// ────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────
export default function DestinationPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const destination = getDestination(slug)
  const brief = getDestinationBrief(slug)
  const [quoteIntent, setQuoteIntent] = useState('')
  const railRef = useRef(null)

  useEffect(() => {
    if (!destination) navigate('/destinations', { replace: true })
  }, [destination, navigate])

  if (!destination || !brief) {
    return (
      <main className="container" style={{ padding: '120px 0' }}>
        <h1>Destination not found</h1>
        <Link to="/destinations">Back to destinations</Link>
      </main>
    )
  }

  function openQuote(intent = '') {
    setQuoteIntent(intent)
    if (railRef.current) {
      railRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const input = railRef.current.querySelector('input[type="text"]')
      input?.focus()
    }
  }

  return (
    <main className="dp">
      <Hero destination={destination} brief={brief} />

      <div className="dp-body container">
        <div className="dp-body__main">
          <Story chapters={brief.story} />
          <PricingTiers tiers={brief.pricingTiers} onQuote={openQuote} />
          <TripTypeSection brief={brief} onQuote={openQuote} />
          <ItinerarySection
            itineraries={brief.itineraries}
            destinationName={destination.name}
            onQuote={openQuote}
          />
          <HotelInventory
            destinationId={destination.id}
            destinationName={destination.name}
          />
          <PhotoJourney destination={destination} />
          <TrustStrip points={brief.trustPoints} />
        </div>

        <div className="dp-body__rail" ref={railRef}>
          <StickyQuoteRail
            destination={destination}
            brief={brief}
            intent={quoteIntent}
          />
        </div>
      </div>

      {/* Mobile-only sticky bottom CTA */}
      <div className="dp-bottom-bar">
        <span>
          <MapPin size={14} aria-hidden /> {destination.flag} {destination.name}
        </span>
        <button
          type="button"
          className="dp-btn dp-btn--primary dp-btn--sm"
          onClick={() => openQuote('')}
        >
          Get live quote <ArrowRight size={13} aria-hidden />
        </button>
      </div>
    </main>
  )
}
