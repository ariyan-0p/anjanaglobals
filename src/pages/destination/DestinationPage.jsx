import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, Calendar, MapPin, ShieldCheck, Clock, Globe,
  Plane, FileCheck, ChevronDown, Copy, Check, MessageCircle, ExternalLink,
  Building2, Crown, Bus, Ticket,
} from 'lucide-react'

import { getDestination } from '../../data/destinations'
import { getDestinationBrief } from '../../data/destinationBriefs'
import { hotelPartners } from '../../data/hotelPartners'
import { api, apiBase } from '../../lib/api'
import './DestinationPage.css'

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

// ────────────────────────────────────────────────────────────────
// HERO — DMC positioning
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

        <span className="dp-hero__brand">
          <ShieldCheck size={13} aria-hidden /> Anjna Global · On-ground DMC
        </span>
        <span className="dp-hero__flag">{destination.flag}</span>
        <h1 className="dp-hero__title">{destination.name}</h1>
        <p className="dp-hero__tagline">Your {destination.name} DMC on the ground</p>

        <p className="dp-hero__services">
          Transfers · Hotels · Attraction Tickets · Visa · MICE
          <span className="dp-hero__b2b">— net B2B rates for travel agents</span>
        </p>

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
// SECTION 2 — WHAT WE DO FOR TRAVEL AGENTS (4 boxes)
// ────────────────────────────────────────────────────────────────
const WHAT_WE_DO_ICON = {
  transfers: <Bus size={20} aria-hidden />,
  hotels: <Building2 size={20} aria-hidden />,
  attractions: <Ticket size={20} aria-hidden />,
  visa: <FileCheck size={20} aria-hidden />,
}

function WhatWeDo({ items, destinationName }) {
  if (!items?.length) return null
  return (
    <section className="dp-section dp-wwd" id="services">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">What we do for travel agents</span>
          <h2>Everything on the ground in {destinationName}, handled by us</h2>
          <p>One DMC for the whole trip — you quote, we deliver. Net B2B rates, no consolidator in the chain.</p>
        </header>
        <div className="dp-wwd__grid">
          {items.map((it) => (
            <article key={it.title} className="dp-wwd__box">
              <span className="dp-wwd__icon">{WHAT_WE_DO_ICON[it.icon]}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// SECTION 3 — WHY OUR RATES ARE BETTER (3 trust points)
// ────────────────────────────────────────────────────────────────
function WhyOurRates({ points }) {
  if (!points?.length) return null
  const top = points.slice(0, 3)
  return (
    <section className="dp-section dp-section--alt" id="trust">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow dp-eyebrow--gold">
            <ShieldCheck size={13} aria-hidden /> Why our rates are better
          </span>
          <h2>You're buying direct from the operator</h2>
          <p>We own the product on the ground — that's where your margin comes from.</p>
        </header>
        <div className="dp-trust-grid">
          {top.map((p) => (
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
// SECTION 4 — TOP-SELLING PRODUCTS
// ────────────────────────────────────────────────────────────────
function TopSellingProducts({ experiences, destination, onQuote }) {
  if (!experiences?.length) return null
  const top = experiences.slice(0, 6)
  const pool = destination.galleryImages || []
  return (
    <section className="dp-section" id="products">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Top-selling products</span>
          <h2>What agents actually book</h2>
          <p>Individually bookable — drop any of these straight into a client quote. Starting net B2B rates shown.</p>
        </header>
        <div className="dp-exp-grid">
          {top.map((e, idx) => (
            <ExperienceCard
              key={e.key}
              exp={e}
              onQuote={onQuote}
              fallbackImage={pool.length ? pool[idx % pool.length] : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ exp, onQuote, fallbackImage }) {
  const image = exp.image || fallbackImage
  return (
    <article className="dp-exp">
      {image ? (
        <div
          className="dp-exp__media"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        >
          {exp.badge ? <span className="dp-exp__badge">{exp.badge}</span> : null}
        </div>
      ) : null}
      <div className="dp-exp__body">
        <header className="dp-exp__head">
          <h3>{exp.name}</h3>
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
      </div>
    </article>
  )
}

// ────────────────────────────────────────────────────────────────
// PRICING TIERS (kept extra)
// ────────────────────────────────────────────────────────────────
function PricingTiers({ tiers, onQuote }) {
  if (!tiers?.length) return null
  return (
    <section className="dp-section dp-section--alt" id="pricing">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Starting B2B rates</span>
          <h2>Pick a tier, build your quote</h2>
          <p>Net rates · twin sharing · request a live quote for actual pax + dates.</p>
        </header>
        <div className="dp-tier-grid">
          {tiers.map((t, idx) => (
            <article key={t.name} className={`dp-tier${t.isPopular ? ' is-popular' : ''}`}>
              {t.image ? (
                <div
                  className="dp-tier__media"
                  style={{ backgroundImage: `url(${t.image})` }}
                  aria-hidden
                >
                  {t.isPopular ? <span className="dp-tier__pop">Most booked</span> : null}
                  <span className="dp-tier__media-tag">
                    <Crown size={12} aria-hidden /> Tier {idx + 1}
                  </span>
                </div>
              ) : (
                <>{t.isPopular ? <span className="dp-tier__pop">Most booked</span> : null}</>
              )}
              <div className="dp-tier__body">
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
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

// ────────────────────────────────────────────────────────────────
// SECTION 5 — SAMPLE ITINERARIES (ready to quote)
// ────────────────────────────────────────────────────────────────
function ItinerarySection({ itineraries, destinationName, onQuote }) {
  if (!itineraries?.length) return null
  return (
    <section className="dp-section" id="itineraries">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">Sample itineraries</span>
          <h2>Ready to quote — copy-paste into your client proposal</h2>
          <p>Day-by-day plans with hotel category and starting price. Open one and copy the text.</p>
        </header>
        <div className="dp-itin-list">
          {itineraries.map((it, idx) => (
            <ItineraryCard
              key={it.key}
              itinerary={it}
              destinationName={destinationName}
              onQuote={onQuote}
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────
// HOTEL INVENTORY (kept extra)
// ────────────────────────────────────────────────────────────────
function HotelInventory({ destinationId, destinationName }) {
  const all = hotelPartners[destinationId] || []
  const hasStars = all.some((h) => typeof h.stars === 'number')
  const [filter, setFilter] = useState('all')

  if (all.length === 0) return null

  const filtered = filter === 'all' ? all : all.filter((h) => h.stars === filter)

  return (
    <section className="dp-section dp-section--alt" id="hotels">
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
// PHOTO JOURNEY (kept extra) — /api/galleries with dest fallback
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
    <section className="dp-section" id="moments">
      <div className="container">
        <header className="dp-head">
          <span className="dp-eyebrow">On the ground</span>
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
// STICKY QUOTE RAIL (kept)
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
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        source: 'destination',
        destination: destination.id,
        message: `${intent || ''}${form.notes ? ' — ' + form.notes : ''}`.trim(),
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
        <p className="dp-rail__sub">Avg quote response within 2 hours. We'll send firm net rates for your actual pax + dates.</p>

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
// CINEMATIC BAND — full-bleed image with an overlaid headline
// ────────────────────────────────────────────────────────────────
function CinematicBand({ image, eyebrow, title, subtitle, cta, onCta, variant = 'feature' }) {
  if (!image) return null
  return (
    <section className={`dp-band dp-band--${variant}`} style={{ backgroundImage: `url(${image})` }}>
      <div className="dp-band__overlay" />
      <div className="container dp-band__inner">
        {eyebrow ? <span className="dp-band__eyebrow">{eyebrow}</span> : null}
        {title ? <h2 className="dp-band__title">{title}</h2> : null}
        {subtitle ? <p className="dp-band__sub">{subtitle}</p> : null}
        {cta ? (
          <button type="button" className="dp-btn dp-btn--primary dp-band__cta" onClick={onCta}>
            {cta} <ArrowRight size={15} aria-hidden />
          </button>
        ) : null}
      </div>
    </section>
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

  const accentStyle = {
    '--dp-accent': brief.accentColor || '#1f3b75',
    '--dp-accent-ink': brief.accentInk || '#ffffff',
  }

  // Photo for the closing cinematic CTA band — only when a destination
  // actually has enough real photos (avoids repeating the hero).
  const gallery = destination.galleryImages || []
  const bandCta = gallery.length >= 3 ? gallery[gallery.length - 1] : null

  return (
    <main className="dp" style={accentStyle}>
      <Hero destination={destination} brief={brief} />

      <div className="dp-body container">
        <div className="dp-body__main">
          <WhatWeDo items={brief.whatWeDo} destinationName={destination.name} />
          <WhyOurRates points={brief.trustPoints} />
          <TopSellingProducts
            experiences={brief.experiences}
            destination={destination}
            onQuote={openQuote}
          />
          <PricingTiers tiers={brief.pricingTiers} onQuote={openQuote} />
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
        </div>

        <div className="dp-body__rail" ref={railRef}>
          <StickyQuoteRail
            destination={destination}
            brief={brief}
            intent={quoteIntent}
          />
        </div>
      </div>

      <CinematicBand
        image={bandCta}
        eyebrow="Ready when you are"
        title={`Let's build your ${destination.name} quote`}
        subtitle="Avg. quote response within 2 hours. Net B2B rates for your actual pax and dates."
        cta="Get a live quote"
        onCta={() => openQuote('')}
        variant="cta"
      />

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
