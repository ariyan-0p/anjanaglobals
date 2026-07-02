import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, Calendar, MapPin, ShieldCheck, Clock, Globe, Plane, FileCheck,
  ChevronDown, Copy, Check, MessageCircle, ExternalLink, Crown,
  Car, Building2, Ticket, Sparkles, TrendingUp, Boxes, Zap,
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

const WHATWEDO_ICON = {
  transfers: <Car size={22} aria-hidden />,
  hotels: <Building2 size={22} aria-hidden />,
  attractions: <Ticket size={22} aria-hidden />,
  visa: <FileCheck size={22} aria-hidden />,
}

// ═══════════════════════════════════════════════════════════════
// HERO — full-screen, gradient depth, floating glass glance chips
// ═══════════════════════════════════════════════════════════════
function Hero({ destination, brief, onQuote }) {
  const heroImage = destination.heroImage || destination.image
  const glance = brief.atGlance || {}
  const chips = [
    glance.bestMonths && { icon: <Calendar size={14} />, label: 'Best', value: glance.bestMonths },
    glance.visa && { icon: <FileCheck size={14} />, label: 'Visa', value: glance.visa },
    glance.flightTime && { icon: <Plane size={14} />, label: 'Flight', value: glance.flightTime },
    glance.currency && { icon: <Globe size={14} />, label: 'Currency', value: glance.currency },
  ].filter(Boolean)

  return (
    <header className="dpx-hero">
      <div className="dpx-hero__bg" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="dpx-hero__mesh" aria-hidden />
      <div className="dpx-hero__scrim" aria-hidden />

      <div className="container dpx-hero__inner">
        <div className="dpx-hero__crumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/destinations">Destinations</Link><span>/</span>
          <span>{destination.name}</span>
        </div>

        <span className="dpx-hero__badge">
          <ShieldCheck size={13} aria-hidden /> Anjna Global · Your DMC for travel agents
        </span>

        <h1 className="dpx-hero__title">
          <span className="dpx-hero__flag">{destination.flag}</span>
          {destination.name}
        </h1>
        <p className="dpx-hero__tag">{destination.tagline}</p>
        <p className="dpx-hero__sub">
          Net B2B rates, own ground handling and 2-hour quotes for travel agents — plus tailor-made trips for direct travellers.
        </p>

        <div className="dpx-hero__cta">
          <button type="button" className="dpx-btn dpx-btn--grad" onClick={() => onQuote('Travel agent — net rates')}>
            Get net B2B rates <ArrowRight size={16} aria-hidden />
          </button>
          <button type="button" className="dpx-btn dpx-btn--glass" onClick={() => onQuote('')}>
            Plan a trip
          </button>
        </div>

        {chips.length > 0 && (
          <div className="dpx-hero__chips">
            {chips.map((c) => (
              <div key={c.label} className="dpx-chip">
                <span className="dpx-chip__ic">{c.icon}</span>
                <span className="dpx-chip__tx"><strong>{c.label}</strong>{c.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="dpx-hero__fade" aria-hidden />
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION HEADING
// ═══════════════════════════════════════════════════════════════
function Heading({ eyebrow, title, sub, light }) {
  return (
    <header className={`dpx-head${light ? ' is-light' : ''}`}>
      {eyebrow && <span className="dpx-eyebrow">{eyebrow}</span>}
      {title && <h2>{title}</h2>}
      {sub && <p>{sub}</p>}
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════
// WHAT WE DO — 4 floating glass cards
// ═══════════════════════════════════════════════════════════════
function WhatWeDo({ items, destinationName }) {
  if (!items?.length) return null
  return (
    <section className="dpx-section" id="dpx-services">
      <div className="container">
        <Heading
          eyebrow="What we do for travel agents"
          title={`Your ground handling in ${destinationName}`}
          sub="One DMC for transfers, stays, attractions and visas — direct-contracted, net B2B rates."
        />
        <div className="dpx-do-grid">
          {items.map((it, i) => (
            <article key={it.title} className="dpx-do" style={{ '--i': i }}>
              <span className="dpx-do__icon">{WHATWEDO_ICON[it.icon] || <Sparkles size={22} />}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// WHY OUR RATES — 3 numbered gradient cards
// ═══════════════════════════════════════════════════════════════
function WhyRates({ points }) {
  if (!points?.length) return null
  const icons = [<Boxes size={20} />, <TrendingUp size={20} />, <Zap size={20} />, <ShieldCheck size={20} />]
  return (
    <section className="dpx-section dpx-section--tint">
      <div className="container">
        <Heading eyebrow="Why our rates are better" title="We own the product — no middlemen" />
        <div className="dpx-why-grid">
          {points.map((p, i) => (
            <article key={p.title} className="dpx-why">
              <span className="dpx-why__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="dpx-why__ic">{icons[i % icons.length]}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// TOP-SELLING PRODUCTS — image cards w/ net price
// ═══════════════════════════════════════════════════════════════
function TopProducts({ experiences, onQuote }) {
  if (!experiences?.length) return null
  return (
    <section className="dpx-section" id="dpx-products">
      <div className="container">
        <Heading
          eyebrow="Top-selling products"
          title="What agents actually book"
          sub="Starting net B2B rates — request a live quote for your pax and dates."
        />
        <div className="dpx-prod-grid">
          {experiences.map((e) => (
            <article key={e.key} className="dpx-prod">
              {e.image ? (
                <div className="dpx-prod__media" style={{ backgroundImage: `url(${e.image})` }}>
                  {e.badge && <span className="dpx-prod__badge">{e.badge}</span>}
                </div>
              ) : null}
              <div className="dpx-prod__body">
                <h3>{e.name}</h3>
                <p className="dpx-prod__meta">{[e.duration, e.includes].filter(Boolean).join(' · ')}</p>
                <div className="dpx-prod__foot">
                  <span className="dpx-prod__price"><span>from</span> {e.price || 'On request'}</span>
                  <button type="button" className="dpx-btn dpx-btn--mini" onClick={() => onQuote(`Quote ${e.name}`)}>
                    Quote <ArrowRight size={12} aria-hidden />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// PACKAGE TIERS — 3D elevated middle
// ═══════════════════════════════════════════════════════════════
function Tiers({ tiers, onQuote }) {
  if (!tiers?.length) return null
  return (
    <section className="dpx-section dpx-section--tint" id="dpx-tiers">
      <div className="container">
        <Heading eyebrow="Package tiers" title="Pick a tier, build your quote" sub="Net rates · twin sharing · indicative — we confirm live." />
        <div className="dpx-tier-grid">
          {tiers.map((t, idx) => (
            <article key={t.name} className={`dpx-tier${t.isPopular ? ' is-pop' : ''}`}>
              {t.isPopular && <span className="dpx-tier__flag"><Crown size={12} aria-hidden /> Most booked</span>}
              <h3>{t.name}</h3>
              <p className="dpx-tier__sub">{t.subtitle}</p>
              <div className="dpx-tier__price"><strong>{t.price}</strong><span>{t.perPaxNote}</span></div>
              <ul className="dpx-tier__list">
                {t.includes?.map((inc) => <li key={inc}><Check size={13} aria-hidden /> {inc}</li>)}
              </ul>
              <button type="button" className={`dpx-btn ${t.isPopular ? 'dpx-btn--grad' : 'dpx-btn--glass-dark'} dpx-btn--block`} onClick={() => onQuote(`Quote ${t.name} tier`)}>
                Get this quote <ArrowRight size={14} aria-hidden />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ITINERARY
// ═══════════════════════════════════════════════════════════════
function ItineraryCard({ itinerary, destinationName, onQuote, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  function buildCopyText() {
    const l = []
    l.push(`${destinationName ? destinationName + ' — ' : ''}${itinerary.name}`)
    l.push(`${itinerary.nights} · ${itinerary.hotelCategory || ''}`)
    if (itinerary.price) l.push(`Starting B2B rate: ${itinerary.price}`)
    l.push('')
    if (itinerary.summary) { l.push(itinerary.summary); l.push('') }
    itinerary.days?.forEach((d) => {
      l.push(`Day ${d.day} — ${d.title}`)
      d.items?.forEach((it) => l.push(`• ${it}`))
      l.push('')
    })
    l.push('— Quote prepared by Anjna Global · anjnaglobal.com')
    return l.join('\n')
  }
  async function copy() {
    try { await navigator.clipboard.writeText(buildCopyText()); setCopied(true); setTimeout(() => setCopied(false), 2200) } catch { /* noop */ }
  }

  return (
    <article className={`dpx-itin${open ? ' is-open' : ''}`}>
      <button type="button" className="dpx-itin__sum" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <div className="dpx-itin__title">
          <strong>{itinerary.name}</strong>
          <span>{itinerary.nights}{itinerary.hotelCategory ? ` · ${itinerary.hotelCategory}` : ''}</span>
        </div>
        <div className="dpx-itin__right">
          {itinerary.price && <strong>from {itinerary.price}</strong>}
          <ChevronDown size={18} className="dpx-itin__chev" aria-hidden />
        </div>
      </button>
      {open && (
        <div className="dpx-itin__body">
          {itinerary.summary && <p className="dpx-itin__lead">{itinerary.summary}</p>}
          <ol className="dpx-itin__days">
            {itinerary.days?.map((d) => (
              <li key={d.day}>
                <span className="dpx-itin__day">Day {d.day}</span>
                <div><strong>{d.title}</strong><ul>{d.items?.map((it) => <li key={it}>{it}</li>)}</ul></div>
              </li>
            ))}
          </ol>
          <div className="dpx-itin__act">
            <button type="button" className="dpx-btn dpx-btn--glass-dark dpx-btn--mini" onClick={copy}>
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy itinerary'}
            </button>
            <button type="button" className="dpx-btn dpx-btn--grad dpx-btn--mini" onClick={() => onQuote(`Quote ${itinerary.name}`)}>
              Request quote <ArrowRight size={13} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

function Itineraries({ itineraries, destinationName, onQuote }) {
  if (!itineraries?.length) return null
  return (
    <section className="dpx-section" id="dpx-itin">
      <div className="container">
        <Heading eyebrow="Ready-to-quote itineraries" title="Copy-paste into your client proposal" sub="Day-by-day plans your agents can drop straight into a quote." />
        <div className="dpx-itin-list">
          {itineraries.map((it, i) => (
            <ItineraryCard key={it.key} itinerary={it} destinationName={destinationName} onQuote={onQuote} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// HOTEL INVENTORY
// ═══════════════════════════════════════════════════════════════
function HotelInventory({ destinationId, destinationName }) {
  const all = hotelPartners[destinationId] || []
  const hasStars = all.some((h) => typeof h.stars === 'number')
  const [filter, setFilter] = useState('all')
  if (all.length === 0) return null
  const filtered = filter === 'all' ? all : all.filter((h) => h.stars === filter)

  return (
    <section className="dpx-section dpx-section--tint" id="dpx-hotels">
      <div className="container">
        <Heading eyebrow="Hotel inventory" title={`${all.length} partner hotels in ${destinationName}`} sub="All direct contracts — allotments held, no consolidators." />
        {hasStars && (
          <div className="dpx-pills">
            <button type="button" className={`dpx-pill${filter === 'all' ? ' is-on' : ''}`} onClick={() => setFilter('all')}>All</button>
            {[5, 4, 3].map((s) => (
              <button key={s} type="button" className={`dpx-pill${filter === s ? ' is-on' : ''}`} onClick={() => setFilter(s)}>{'★'.repeat(s)}</button>
            ))}
          </div>
        )}
        <div className="dpx-hotel-grid">
          {filtered.map((h) => (
            <div key={h.name} className="dpx-hotel" title={h.name}>
              {h.logo ? <img src={h.logo} alt={h.name} loading="lazy" /> : <span>{h.name}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// PHOTO GALLERY — masonry
// ═══════════════════════════════════════════════════════════════
function Gallery({ destination }) {
  const [apiImages, setApiImages] = useState(null)
  useEffect(() => {
    let alive = true
    api.get(`/galleries/${destination.id}`).then((r) => alive && setApiImages(r.items || [])).catch(() => alive && setApiImages([]))
    return () => { alive = false }
  }, [destination.id])

  const images = useMemo(() => {
    if (apiImages && apiImages.length > 0) return apiImages.map((i) => ({ src: absoluteUrl(i.url), alt: i.alt || i.caption || `${destination.name}`, caption: i.caption || '' }))
    return (destination.galleryImages || []).map((src, idx) => ({ src, alt: `${destination.name} ${idx + 1}`, caption: '' }))
  }, [apiImages, destination])

  if (images.length === 0) return null
  return (
    <section className="dpx-section" id="dpx-gallery">
      <div className="container">
        <Heading eyebrow="On the ground" title={`${destination.name} in frames`} />
        <div className="dpx-mason">
          {images.map((img, idx) => (
            <figure key={`${img.src}-${idx}`} className="dpx-mason__item">
              <img src={img.src} alt={img.alt} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// TRAVEL-AGENT PARTNER BAND (B2B focus)
// ═══════════════════════════════════════════════════════════════
function AgentBand({ destinationName, onQuote }) {
  const perks = [
    { ic: <TrendingUp size={18} aria-hidden />, t: 'Net B2B rates', d: 'Direct contracts — real margin, no consolidator markup.' },
    { ic: <Clock size={18} aria-hidden />, t: '2-hour quotes', d: 'Fast turnaround so you can close the client.' },
    { ic: <ShieldCheck size={18} aria-hidden />, t: 'Dedicated desk', d: 'A named ops contact for every file, 24/7 on-ground support.' },
    { ic: <Boxes size={18} aria-hidden />, t: 'Ready inventory', d: 'Held hotel allotments and pre-booked attraction tickets.' },
  ]
  return (
    <section className="dpx-agent" id="dpx-agents">
      <div className="dpx-agent__mesh" aria-hidden />
      <div className="container dpx-agent__inner">
        <div className="dpx-agent__head">
          <span className="dpx-eyebrow is-light">For travel agents</span>
          <h2>Sell {destinationName} on our rates, not someone else's</h2>
          <p>We're the DMC on the ground — you keep the client, we handle everything from arrival to departure.</p>
        </div>
        <div className="dpx-agent__grid">
          {perks.map((p) => (
            <div key={p.t} className="dpx-agent__perk">
              <span className="dpx-agent__ic">{p.ic}</span>
              <div><strong>{p.t}</strong><span>{p.d}</span></div>
            </div>
          ))}
        </div>
        <div className="dpx-agent__cta">
          <button type="button" className="dpx-btn dpx-btn--grad" onClick={() => onQuote('Travel agent — net rates')}>
            Get net rates <ArrowRight size={15} aria-hidden />
          </button>
          <Link to="/b2b" className="dpx-btn dpx-btn--glass">Become a partner</Link>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// FULL-WIDTH QUOTE SECTION (replaces the rail)
// ═══════════════════════════════════════════════════════════════
function QuoteSection({ destination, intent, sectionRef }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !(form.phone.trim() || form.email.trim())) {
      setError('Name and phone or email are required.'); return
    }
    setError(''); setSending(true)
    try {
      await api.post('/leads', {
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        source: 'destination', destination: destination.id,
        message: `${intent || ''}${form.notes ? ' — ' + form.notes : ''}`.trim(),
      })
      setDone(true)
    } catch (err) { setError(err.message || 'Could not send. Try the contact page.') }
    finally { setSending(false) }
  }

  return (
    <section className="dpx-quote" id="dpx-quote" ref={sectionRef}>
      <div className="dpx-quote__mesh" aria-hidden />
      <div className="container dpx-quote__inner">
        <div className="dpx-quote__left">
          <span className="dpx-eyebrow is-light">Request a quote</span>
          <h2>Let's build your {destination.flag} {destination.name} quote</h2>
          <p>Travel agents get firm net B2B rates; direct travellers get a tailor-made plan — either way our {destination.name} desk replies fast for your actual pax and dates.</p>
          <ul className="dpx-quote__usp">
            <li><Clock size={16} aria-hidden /> Avg. response within 2 hours</li>
            <li><TrendingUp size={16} aria-hidden /> Net B2B rates for travel agents</li>
            <li><ShieldCheck size={16} aria-hidden /> On-ground team, dependable ops</li>
          </ul>
          <div className="dpx-quote__alt">
            <a href="tel:+911242786999"><Plane size={14} aria-hidden /> +91-124-2786999</a>
            <a href="https://wa.me/919958801627" target="_blank" rel="noreferrer" className="is-wa">
              <MessageCircle size={14} aria-hidden /> WhatsApp <ExternalLink size={11} aria-hidden />
            </a>
          </div>
        </div>

        <div className="dpx-quote__card">
          {done ? (
            <div className="dpx-quote__done">
              <span className="dpx-quote__tick"><Check size={26} /></span>
              <h3>Request sent</h3>
              <p>Our {destination.name} desk will respond within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              {intent && <p className="dpx-quote__intent">For: {intent}</p>}
              <label>Your name *<input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Full name" /></label>
              <div className="dpx-quote__row">
                <label>Phone / WhatsApp<input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91…" /></label>
                <label>Email<input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@agency.com" /></label>
              </div>
              <label>Pax, dates, hotel category<textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="e.g. 2 adults, Dec 12–16, 4★ twin" /></label>
              {error && <p className="dpx-quote__err">{error}</p>}
              <button type="submit" className="dpx-btn dpx-btn--grad dpx-btn--block" disabled={sending}>
                {sending ? 'Sending…' : 'Request live quote'} <ArrowRight size={15} aria-hidden />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function DestinationPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const destination = getDestination(slug)
  const brief = getDestinationBrief(slug)
  const [quoteIntent, setQuoteIntent] = useState('')
  const quoteRef = useRef(null)

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
    if (quoteRef.current) {
      quoteRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => quoteRef.current?.querySelector('input')?.focus(), 500)
    }
  }

  const accentStyle = {
    '--dp-accent': brief.accentColor || '#6d28d9',
    '--dp-accent-ink': brief.accentInk || '#ffffff',
  }

  return (
    <main className="dpx" style={accentStyle}>
      <Hero destination={destination} brief={brief} onQuote={openQuote} />
      <WhatWeDo items={brief.whatWeDo} destinationName={destination.name} />
      <WhyRates points={brief.trustPoints} />
      <AgentBand destinationName={destination.name} onQuote={openQuote} />
      <TopProducts experiences={brief.experiences} onQuote={openQuote} />
      <Tiers tiers={brief.pricingTiers} onQuote={openQuote} />
      <Itineraries itineraries={brief.itineraries} destinationName={destination.name} onQuote={openQuote} />
      <HotelInventory destinationId={destination.id} destinationName={destination.name} />
      <Gallery destination={destination} />
      <QuoteSection destination={destination} intent={quoteIntent} sectionRef={quoteRef} />

      <div className="dpx-bar">
        <span><MapPin size={14} aria-hidden /> {destination.flag} {destination.name}</span>
        <button type="button" className="dpx-btn dpx-btn--grad dpx-btn--mini" onClick={() => openQuote('')}>
          Get live quote <ArrowRight size={13} aria-hidden />
        </button>
      </div>
    </main>
  )
}
