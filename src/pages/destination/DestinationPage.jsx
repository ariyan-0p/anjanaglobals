import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
          <ShieldCheck size={13} aria-hidden /> Anjna Global · Your travel partner on the ground
        </span>

        <h1 className="dpx-hero__title">
          <span className="dpx-hero__flag">{destination.flag}</span>
          {destination.name}
        </h1>
        <p className="dpx-hero__tag">{destination.tagline}</p>
        <p className="dpx-hero__sub">
          Special partner rates, our own ground team and 2-hour quotes for travel partners — plus tailor-made trips for holidaymakers.
        </p>

        <div className="dpx-hero__cta">
          <button type="button" className="dpx-btn dpx-btn--grad" onClick={() => onQuote('Partner — special rates')}>
            Get partner rates <ArrowRight size={16} aria-hidden />
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
          eyebrow="What we handle on the ground"
          title={`Your ground handling in ${destinationName}`}
          sub="One partner for transfers, stays, attractions and visas — direct contracts, best rates."
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
          title="Most-booked experiences"
          sub="Starting partner rates — request a quote for your group and dates."
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
                  <span className="dpx-prod__price"><span>Starting from</span> {e.price || 'On request'}</span>
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
        <Heading eyebrow="Package tiers" title="Pick a tier, build your quote" sub="Per person · twin sharing · indicative — we confirm on request." />
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
    if (itinerary.price) l.push(`Starting partner rate: ${itinerary.price}`)
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
        <Heading eyebrow="Ready-to-quote itineraries" title="Copy-paste into your client proposal" sub="Day-by-day plans you can drop straight into a client quote." />
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
        <Heading eyebrow="Where you'll stay" title={destinationId === 'dubai' ? '150+ Hotel partners in Dubai and Abu Dhabi' : `${all.length} partner hotels in ${destinationName}`} sub="Direct contracts with every property — rooms held for you, no middlemen." />
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
// HAPPY TRAVELLERS — shared client-photo trust gallery
// (masonry + lightbox + load-more). Reads the shared 'moments' bucket,
// falls back to this destination's own gallery photos.
// ═══════════════════════════════════════════════════════════════
const HAPPY_INITIAL = 24

function HappyTravellers({ destination }) {
  const [apiImages, setApiImages] = useState(null)
  const [shown, setShown] = useState(HAPPY_INITIAL)
  const [lightbox, setLightbox] = useState(-1)

  useEffect(() => {
    let alive = true
    setApiImages(null)
    // Each destination shows its OWN client photos (per-destination bucket),
    // not a mixed set. Manage these under Admin → Galleries → the matching tab.
    api.get(`/galleries/${destination.id}`)
      .then((r) => alive && setApiImages(r.items || []))
      .catch(() => alive && setApiImages([]))
    return () => { alive = false }
  }, [destination.id])

  const images = useMemo(() => {
    if (apiImages && apiImages.length > 0) {
      return apiImages.map((i) => ({ src: absoluteUrl(i.url), alt: i.alt || i.caption || 'Happy traveller with Anjna Global', caption: i.caption || '' }))
    }
    // Fallback to this destination's photos until the shared gallery is filled.
    return (destination.galleryImages || []).map((src, idx) => ({ src, alt: `${destination.name} ${idx + 1}`, caption: '' }))
  }, [apiImages, destination])

  // Keyboard nav for the lightbox
  useEffect(() => {
    if (lightbox < 0) return
    function onKey(e) {
      if (e.key === 'Escape') setLightbox(-1)
      else if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % images.length)
      else if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightbox, images.length])

  if (images.length === 0) return null
  const visible = images.slice(0, shown)

  return (
    <section className="dpx-section dpx-section--tint" id="dpx-moments">
      <div className="container">
        <Heading
          eyebrow="Happy travellers"
          title="Real moments from real trips"
          sub={`${images.length}+ travellers have explored the world with Anjna Global — here are some of their moments.`}
        />
        <div className="dpx-mason">
          {visible.map((img, idx) => (
            <figure
              key={`${img.src}-${idx}`}
              className="dpx-mason__item is-clickable"
              onClick={() => setLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setLightbox(idx) }}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
              <span className="dpx-mason__zoom" aria-hidden>⤢</span>
            </figure>
          ))}
        </div>

        {shown < images.length && (
          <div className="dpx-moments__more">
            <button type="button" className="dpx-btn dpx-btn--glass-dark" onClick={() => setShown((s) => s + 24)}>
              Show more moments <ChevronDown size={15} aria-hidden />
            </button>
          </div>
        )}
      </div>

      {lightbox >= 0 && createPortal(
        <div className="dpx-lb" role="dialog" aria-modal="true" onClick={() => setLightbox(-1)}>
          <button type="button" className="dpx-lb__x" onClick={() => setLightbox(-1)} aria-label="Close">✕</button>
          <button type="button" className="dpx-lb__nav dpx-lb__nav--prev" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + images.length) % images.length) }} aria-label="Previous">‹</button>
          <figure className="dpx-lb__fig" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox].src} alt={images[lightbox].alt} />
            {images[lightbox].caption && <figcaption>{images[lightbox].caption}</figcaption>}
            <span className="dpx-lb__count">{lightbox + 1} / {images.length}</span>
          </figure>
          <button type="button" className="dpx-lb__nav dpx-lb__nav--next" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % images.length) }} aria-label="Next">›</button>
        </div>,
        document.body
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// FAQ — partner questions (city-templated)
// ═══════════════════════════════════════════════════════════════
function buildFaqs(city) {
  return [
    { q: `Why should I choose Anjna Global for my ${city} bookings?`, a: `Because we understand what matters to you — competitive pricing, quick replies, smooth operations and reliable support. We've spent over 13 years working exclusively with travel partners, and our focus is simple: help you close more bookings while ensuring your clients travel without hassle.` },
    { q: `How fast can you share a ${city} quotation?`, a: `Most individual quotations are shared within 2 hours. Customised itineraries and group proposals may take a little longer, but we always work with urgency because we know every minute counts when your client is ready to book.` },
    { q: `Can you customise packages according to my client's budget?`, a: `Absolutely. Every client has different expectations. Whether it's a budget holiday, honeymoon, luxury trip, family vacation or corporate travel, we'll design an itinerary that fits both your client's budget and your business goals.` },
    { q: `Do you work only with travel partners?`, a: `Yes. Anjna Global is a specialist destination company that works exclusively with travel partners and tour operators — and we're committed to protecting your client relationships.` },
    { q: `Will you contact my client directly?`, a: `Never. Your client is your client. We communicate through you unless you specifically ask us to coordinate directly for operational reasons. Maintaining your trust is more important than any single booking.` },
    { q: `What if my client faces an issue while travelling in ${city}?`, a: `Our support doesn't end after confirmation. Our operations team stays available throughout the trip to help with transfers, hotel concerns, flight changes or any on-ground requirement — so you always have someone to rely on.` },
    { q: `Can I book only hotels, transfers or sightseeing with you?`, a: `Of course. Whether you need a complete package or just a hotel, airport transfer, attraction tickets, visa or sightseeing, we're happy to help. Book only what you need.` },
    { q: `Do you handle group departures and large events?`, a: `Yes. From family groups and student tours to corporate incentives, conferences, exhibitions and destination weddings, our team has the experience to manage groups of all sizes with seamless execution.` },
    { q: `I'm a small travel agency. Will I get the same support?`, a: `Definitely. Every successful partnership starts with one booking. Whether you send one passenger or one hundred, you'll receive the same attention, quick responses and dedicated support from our team.` },
    { q: `What makes Anjna Global different from other ${city} companies?`, a: `We don't believe in overpromising. We believe in answering calls, replying on time, offering honest advice and delivering exactly what we've committed. That's how we've built lasting relationships with travel partners across India.` },
    { q: `This is my first booking with Anjna Global. What if something goes wrong?`, a: `Every long-term partnership starts with a first booking. We'll guide you through every step — from quotation to your client's return — and if any operational challenge arises, our team resolves it quickly. Our job is to make your first experience smooth enough that you confidently send us your second.` },
  ]
}

function FaqItem({ item, open, onToggle }) {
  return (
    <article className={`dpx-faq${open ? ' is-open' : ''}`}>
      <button type="button" className="dpx-faq__q" onClick={onToggle} aria-expanded={open}>
        <span>{item.q}</span>
        <ChevronDown size={18} className="dpx-faq__chev" aria-hidden />
      </button>
      {open && <div className="dpx-faq__a"><p>{item.a}</p></div>}
    </article>
  )
}

function Faq({ city }) {
  const faqs = buildFaqs(city)
  const [open, setOpen] = useState(0)
  return (
    <section className="dpx-section dpx-section--tint" id="dpx-faq">
      <div className="container">
        <Heading eyebrow="Partner FAQ" title="Working with us on your bookings" sub="Straight answers to the questions travel partners ask us most." />
        <div className="dpx-faq-list">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} item={f} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
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
    { ic: <TrendingUp size={18} aria-hidden />, t: 'Special partner rates', d: 'Direct contracts — real margin, no middleman markup.' },
    { ic: <Clock size={18} aria-hidden />, t: '2-hour quotes', d: 'Fast turnaround so you can close the client.' },
    { ic: <ShieldCheck size={18} aria-hidden />, t: 'Dedicated desk', d: 'A named ops contact for every file, 24/7 on-ground support.' },
    { ic: <Boxes size={18} aria-hidden />, t: 'Ready availability', d: 'Rooms and attraction tickets held ready — faster confirmations.' },
  ]
  return (
    <section className="dpx-agent" id="dpx-agents">
      <div className="dpx-agent__mesh" aria-hidden />
      <div className="container dpx-agent__inner">
        <div className="dpx-agent__head">
          <span className="dpx-eyebrow is-light">For our partners</span>
          <h2>Sell {destinationName} on our rates, not someone else's</h2>
          <p>We're your team on the ground — you keep the client, we handle everything from arrival to departure.</p>
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
          <button type="button" className="dpx-btn dpx-btn--grad" onClick={() => onQuote('Partner — special rates')}>
            Get partner rates <ArrowRight size={15} aria-hidden />
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
          <p>Partners get special rates; holidaymakers get a tailor-made plan — either way our {destination.name} team replies fast for your dates and group size.</p>
          <ul className="dpx-quote__usp">
            <li><Clock size={16} aria-hidden /> Avg. response within 2 hours</li>
            <li><TrendingUp size={16} aria-hidden /> Special rates for travel partners</li>
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
              <label>Guests, dates, hotel category<textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="e.g. 2 adults, Dec 12–16, 4★ twin" /></label>
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

  // Company brand accent (red → navy) applied consistently across all destinations.
  const accentStyle = {
    '--dp-accent': '#C8102E',
    '--dp-accent-2': '#27406F',
    '--dp-accent-ink': '#ffffff',
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
      <HappyTravellers destination={destination} />
      <Faq city={destination.name} />
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
