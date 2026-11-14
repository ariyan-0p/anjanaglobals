import { Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, MapPin, Clock, Headphones, TrendingUp, CheckCircle, Video, Sparkles, Play,
} from 'lucide-react'
import { destinations } from '../data/destinations'
import { packages } from '../data/packages'
import { homepagePartners } from '../data/hotelPartners'
import HotelPartners from '../components/HotelPartners'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { onReady } from '../motion/ready'
import { startTrail } from '../motion/imageTrail'
import logoColor from '../assets/Anjna Global Logo final.png'
import heroImgDubai from '../assets/Dubai.jpg'
import heroImgBali from '../assets/Bali.jpg'
import heroImgSingapore from '../assets/singapore.jpg'
import heroImgBaku from '../assets/baku.jpg'
import heroImgKualaLumpur from '../assets/Kualalumpur.jpg'
import dubaiMarinaDusk from '../assets/destinations/dubai/03.jpg'
import bakuOldCityFlameTowers from '../assets/destinations/azerbaijan/03.jpg'
import sgSupertreeGrove from '../assets/destinations/singapore/05.jpg'
import myBlueMosque from '../assets/destinations/malaysia/03.jpg'
import baliTempleGates from '../assets/destinations/bali/03.jpg'
import { api, apiBase } from '../lib/api'
import './Home.css'

// Per-destination override for the "Client moments" card image only
// (does not affect destination-page gallery order or heroes).
// Each shot is chosen to match that destination's tagline.
const MOMENT_IMAGE_OVERRIDE = {
  dubai: dubaiMarinaDusk,          // Marina at dusk — "Where Dreams Touch the Sky"
  azerbaijan: bakuOldCityFlameTowers, // Old City + Flame Towers — "Land of Fire & Heritage"
  singapore: sgSupertreeGrove,     // Supertree Grove — "The Garden City of Asia"
  malaysia: myBlueMosque,          // Blue Mosque — "Truly Asia — Infinitely Diverse"
  bali: baliTempleGates,           // Temple gates — "Island of the Gods"
}

function absoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${apiBase}${url}`
}

const heroImgBaliFresh = `${heroImgBali}?v=2`

const heroSlides = [
  {
    image: heroImgDubai,
    dest: 'Dubai, UAE',
    tag: 'Middle East',
    title: 'The destination specialist trusted by',
    accent: 'partners and travellers',
  },
  {
    image: heroImgBaliFresh,
    dest: 'Bali, Indonesia',
    tag: 'Southeast Asia',
    title: 'We plan journeys with',
    accent: 'precision and warmth',
  },
  {
    image: heroImgSingapore,
    dest: 'Singapore',
    tag: 'City State',
    title: 'From first quote to final transfer,',
    accent: 'everything just works',
  },
  {
    image: heroImgBaku,
    dest: 'Baku, Azerbaijan',
    tag: 'Land of Fire',
    title: 'Built on reliability and relationships —',
    accent: 'trusted since 2013',
  },
  {
    image: heroImgKualaLumpur,
    dest: 'Kuala Lumpur, Malaysia',
    tag: 'Truly Asia',
    title: 'One brand. Five destinations.',
    accent: 'consistently exceptional delivery',
  },
]

const SLIDE_MS = 6500

const stats = [
  { value: 'Since 2013', label: 'Trusted DMC' },
  { value: '5', label: 'Signature destinations', count: true },
  { value: '2500+', label: 'Travel partners across India', count: true },
  { value: '24/7', label: 'Dedicated support' },
]

const trustSignals = [
  'Trusted Since 2013',
  '2500+ Travel Partners across India',
  '24/7 Operational Support',
  'Dedicated On-ground Teams',
  'Transparent Net Rates',
  'Fast Turnaround Quotations',
]

const servicePillars = [
  { title: 'FIT & bespoke trips', desc: 'Tailored itineraries for individuals, couples, and private groups.' },
  { title: 'Groups & MICE', desc: 'Seamless logistics for incentives, conferences, and large movements.' },
  { title: 'Celebrations', desc: 'Honeymoons and milestone journeys with end-to-end care.' },
]

const serviceChecks = [
  'Visa assistance & documentation',
  'Premium transfers & luxury coaches',
  'On-ground teams across every destination',
  'Net rates for trade partners',
]

const homeMoments = destinations.map((dest) => ({
  id: dest.id,
  name: dest.name,
  flag: dest.flag,
  country: dest.country,
  tagline: dest.tagline,
  image: MOMENT_IMAGE_OVERRIDE[dest.id] || dest.galleryImages?.[0] || dest.image,
}))

function Marquee({ items, className = '' }) {
  const track = items.map((t, i) => (
    <span key={`${t}-${i}`} className="mq__item">
      <span>{t}</span>
      <i aria-hidden>✦</i>
    </span>
  ))
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee__track">{track}</div>
      <div className="marquee__track" aria-hidden>{track}</div>
    </div>
  )
}

/* Headline rendered word-by-word so slide changes can mask-reveal it. */
function HeroHeadline({ slide, headRef }) {
  const words = (str, cls) =>
    str.split(' ').map((w, i) => (
      <Fragment key={`${cls}-${i}`}>
        <span className="hw"><span className={`hw__i ${cls}`}>{w}</span></span>{' '}
      </Fragment>
    ))
  return (
    <h1 className="hero__title" ref={headRef}>
      {words(slide.title, '')}
      <br />
      {words(slide.accent, 'is-accent')}
    </h1>
  )
}

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(-1)
  const [querySubmitted, setQuerySubmitted] = useState(false)
  const [querySubmitting, setQuerySubmitting] = useState(false)
  const [queryError, setQueryError] = useState('')
  const [agentVideoErrors, setAgentVideoErrors] = useState({})
  const [playingAgentId, setPlayingAgentId] = useState(null)
  const [agentVoices, setAgentVoices] = useState([])
  const agentVideoRefs = useRef({})

  const heroRef = useRef(null)
  const trailRef = useRef(null)
  const slidesRef = useRef(null)
  const headRef = useRef(null)
  const slideEls = useRef([])
  const timer = useRef(null)
  const busy = useRef(false)
  const currentRef = useRef(0)
  const introDone = useRef(false)
  const destRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    let alive = true
    api
      .get('/agent-voices')
      .then((res) => {
        if (!alive) return
        setAgentVoices(
          (res.items || []).map((a) => ({
            id: a._id,
            name: a.name,
            role: a.role,
            desk: a.desk,
            quote: a.quote,
            src: absoluteUrl(a.videoUrl),
          }))
        )
      })
      .catch(() => {
        if (alive) setAgentVoices([])
      })
    return () => {
      alive = false
    }
  }, [])

  const handleAgentPlay = (id) => {
    setPlayingAgentId(id)
    Object.entries(agentVideoRefs.current).forEach(([key, node]) => {
      if (!node) return
      if (key === id) {
        node.play().catch(() => {})
      } else {
        node.pause()
        try { node.currentTime = 0 } catch { /* noop */ }
      }
    })
  }

  const handleAgentPause = (id) => {
    if (playingAgentId === id) setPlayingAgentId(null)
  }

  /* ── Hero: slide change = old words rise out, new image wipes in, new words rise in ── */
  const animateWordsIn = useCallback(() => {
    const words = headRef.current?.querySelectorAll('.hw__i')
    if (!words?.length) return
    gsap.fromTo(words, { yPercent: 118 }, { yPercent: 0, duration: 1.2, stagger: 0.045, ease: 'expo.out' })
  }, [])

  const goTo = useCallback((next) => {
    if (busy.current || next === currentRef.current) return
    busy.current = true
    const from = currentRef.current
    const reduce = prefersReducedMotion()
    const swap = () => {
      currentRef.current = next
      setPrev(from)
      setCurrent(next)
    }
    if (reduce) { swap(); busy.current = false; return }

    const outWords = headRef.current?.querySelectorAll('.hw__i')
    gsap.to(outWords, {
      yPercent: -118,
      duration: 0.55,
      stagger: 0.02,
      ease: 'power3.in',
      onComplete: swap,
    })
  }, [])

  // After React commits the new slide: wipe the image in and reveal the headline.
  useLayoutEffect(() => {
    if (!introDone.current) return
    const el = slideEls.current[current]
    if (el) {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0% 0% 0% 100%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }
      )
      gsap.fromTo(el.firstElementChild, { scale: 1.25 }, { scale: 1.02, duration: 2.4, ease: 'expo.out' })
    }
    const words = headRef.current?.querySelectorAll('.hw__i')
    if (words?.length) gsap.set(words, { yPercent: 118 })
    animateWordsIn()
    const t = setTimeout(() => { busy.current = false }, 1500)
    return () => clearTimeout(t)
  }, [current, animateWordsIn])

  // Auto-advance
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => goTo((current + 1) % heroSlides.length), SLIDE_MS)
    return () => clearTimeout(timer.current)
  }, [current, goTo])

  // First-load intro: the preloader's logo dive calls markReady() as the photo
  // floods the screen, and the headline reveal rides that moment.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headRef.current?.querySelectorAll('.hw__i')
      const bg = slideEls.current[0]?.firstElementChild
      if (prefersReducedMotion()) { introDone.current = true; return }
      gsap.set(words, { yPercent: 118 })
      gsap.set('.hero [data-hero-in]', { opacity: 0, y: 28 })
      if (bg) gsap.set(bg, { scale: 1.3 })
      onReady(() => {
        const tl = gsap.timeline({ onComplete: () => { introDone.current = true } })
        if (bg) tl.to(bg, { scale: 1.02, duration: 2.6, ease: 'expo.out' }, 0)
        tl.to(words, { yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'expo.out' }, 0.1)
        tl.to('.hero [data-hero-in]', { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out' }, 0.5)
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // Cursor photo trail + gentle depth parallax on the slideshow (fine pointers only).
  useEffect(() => {
    const host = heroRef.current
    if (!host) return undefined
    const stopTrail = startTrail(host, trailRef.current, heroSlides.map((x) => x.image))
    let stopParallax = () => {}
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion() && slidesRef.current) {
      const qx = gsap.quickTo(slidesRef.current, 'x', { duration: 1.2, ease: 'power3' })
      const qy = gsap.quickTo(slidesRef.current, 'y', { duration: 1.2, ease: 'power3' })
      const move = (e) => {
        qx((e.clientX / window.innerWidth - 0.5) * -26)
        qy((e.clientY / window.innerHeight - 0.5) * -18)
      }
      window.addEventListener('pointermove', move, { passive: true })
      stopParallax = () => window.removeEventListener('pointermove', move)
    }
    return () => { stopTrail(); stopParallax() }
  }, [])

  /* ── Horizontal destinations (desktop): the section is made tall, the inner
        stage is CSS-sticky, and scroll progress drives the track sideways. No
        GSAP pin wrapper, so React can unmount the section cleanly. ── */
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const section = destRef.current
      const track = trackRef.current
      if (!section || !track) return
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 1)
      const setHeight = () => { section.style.height = `${dist() * 1.05 + window.innerHeight}px` }
      setHeight()
      const st = { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true, onRefreshInit: setHeight }
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: st })
      section.querySelectorAll('.dest__panel .px').forEach((px) => {
        gsap.fromTo(px, { xPercent: -9 }, {
          xPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: px.closest('.dest__panel'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        })
      })
      gsap.to('.dest__bar i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true } })
      return () => { section.style.height = '' }
    })
    return () => mm.revert()
  }, [])

  // B2B / agent specials lead the section, then the retail favourites.
  const featuredPackages = [
    ...packages.filter((p) => p.homeFeatured),
    ...packages.filter((p) => !p.b2b).slice(0, 3),
  ]

  const handleHomeQuerySubmit = async (e) => {
    e.preventDefault()
    setQueryError('')
    setQuerySubmitting(true)
    const fd = new FormData(e.currentTarget)
    try {
      await api.post('/leads', {
        name: (fd.get('name') || '').toString().trim(),
        phone: (fd.get('phone') || '').toString().trim(),
        email: (fd.get('email') || '').toString().trim(),
        destination: (fd.get('destination') || '').toString(),
        message: (fd.get('message') || '').toString().trim(),
        source: 'popup',
      })
      setQuerySubmitted(true)
    } catch (err) {
      setQueryError(err.message || 'Could not send. Please try again.')
    } finally {
      setQuerySubmitting(false)
    }
  }

  const slide = heroSlides[current]

  return (
    <main className="home">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" ref={heroRef} data-nav="dark">
        <div className="hero__slides" ref={slidesRef} aria-hidden>
          {heroSlides.map((s, i) => (
            <div
              key={s.image}
              ref={(n) => { slideEls.current[i] = n }}
              className="hero__slide"
              style={{ zIndex: i === current ? 2 : i === prev ? 1 : 0, visibility: i === current || i === prev ? 'visible' : 'hidden' }}
            >
              <div className="hero__img" style={{ backgroundImage: `url(${s.image})` }} />
            </div>
          ))}
        </div>
        <div className="hero__shade" />
        <div className="hero__trail" ref={trailRef} aria-hidden />

        <div className="wrap hero__inner">
          <p className="hero__tag mono" data-hero-in key={`tag-${current}`}>
            <MapPin size={13} aria-hidden /> {slide.tag} · {slide.dest}
          </p>

          <HeroHeadline key={current} slide={slide} headRef={headRef} />

          <div className="hero__foot">
            <div className="hero__actions" data-hero-in>
              <Link to="/destinations" className="btn" data-magnetic>
                Explore destinations <ArrowUpRight size={14} aria-hidden />
              </Link>
              <Link to="/b2b" className="btn btn--ghost" data-magnetic>
                Partner with us <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>

            <div className="hero__index" data-hero-in role="tablist" aria-label="Hero slides">
              {heroSlides.map((s, i) => (
                <button
                  key={s.dest}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  className={`hero__idx${i === current ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                >
                  <span className="mono">0{i + 1}</span>
                  <span className="hero__idx-name">{s.dest.split(',')[0]}</span>
                  <span className="hero__idx-bar"><i key={i === current ? `a-${current}` : 'x'} style={{ animationDuration: `${SLIDE_MS}ms` }} /></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero__seal" data-hero-in aria-hidden>
          <svg viewBox="0 0 200 200" className="hero__seal-ring">
            <defs><path id="sealPath" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" /></defs>
            <text><textPath href="#sealPath" startOffset="0">FABULOUSLY PLANNED · REMEMBERED ALWAYS · SINCE 2013 · </textPath></text>
          </svg>
          <span className="hero__seal-mark" style={{ backgroundImage: `url(${logoColor})` }} />
        </div>

        <div className="hero__scroll mono" data-hero-in aria-hidden>
          Scroll <span />
        </div>

      </section>

      {/* ── TRUST MARQUEE ─────────────────────────────────── */}
      <section className="mq" aria-label="Trust highlights">
        <Marquee items={trustSignals} />
      </section>

      {/* ── STATEMENT + STATS ─────────────────────────────── */}
      <section className="sec statement">
        <div className="wrap">
          <p className="eyebrow">The Anjna promise</p>
          <p className="statement__text d-m" data-scrub>
            From first quote to final transfer, everything just works. Built on reliability and relationships —
            trusted since 2013. One brand. Five destinations. Consistently exceptional delivery.
          </p>

          <div className="stats" data-stagger>
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat__v" {...(s.count ? { 'data-count': true } : {})}>{s.value}</div>
                <div className="stat__l mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS — pinned horizontal scroll ───────── */}
      <section className="dest on-ink" ref={destRef} data-nav="dark">
        <div className="dest__pin">
          <header className="dest__head wrap">
            <div>
              <span className="eyebrow eyebrow--light">Destinations</span>
              <h2 className="d-m" data-split>Where we <em>excel</em></h2>
            </div>
            <p className="lead" data-fade>
              Five hand-picked regions — each with dedicated teams, vetted suppliers, and itineraries
              refined over years of operation.
            </p>
          </header>

          <div className="dest__track" ref={trackRef}>
            {destinations.map((d, i) => (
              <Link key={d.id} to={`/destinations/${d.id}`} className="dest__panel" data-cursor="Explore">
                <div className="dest__media media">
                  <div className="px" style={{ backgroundImage: `url(${d.image})` }} />
                  <div className="dest__shade" />
                </div>
                <div className="dest__top">
                  <span className="dest__no">0{i + 1}</span>
                  <span className="dest__pk mono">{d.packages} packages</span>
                </div>
                <div className="dest__body">
                  <span className="dest__flag">{d.flag}</span>
                  <h3>{d.name}</h3>
                  <p>{d.shortDesc}</p>
                  <span className="dest__cta mono">Explore <ArrowUpRight size={14} aria-hidden /></span>
                </div>
              </Link>
            ))}
            <div className="dest__panel dest__panel--end">
              <p className="d-s">Five destinations.<br /><em>One partner.</em></p>
              <Link to="/destinations" className="btn btn--light" data-magnetic>
                View all destinations <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="dest__bar wrap" aria-hidden><span><i /></span></div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────── */}
      <section className="sec svc">
        <div className="wrap svc__grid">
          <div className="svc__lead">
            <span className="eyebrow">Services</span>
            <h2 className="d-m" data-split>Everything in <em>one place</em></h2>
            <p className="lead" data-fade>
              From first quote to last transfer — one partner, one workflow, clear ownership at every step.
            </p>
            <ul className="svc__checks" data-stagger>
              {serviceChecks.map((line) => (
                <li key={line}>
                  <CheckCircle size={18} aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link to="/services" className="btn" data-magnetic>
              All services <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="svc__list">
            {servicePillars.map((p, i) => (
              <article key={p.title} className="pillar" data-fade>
                <span className="pillar__no mono">0{i + 1}</span>
                <div>
                  <h3 className="d-s">{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
                <ArrowUpRight className="pillar__arrow" size={28} aria-hidden />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B ───────────────────────────────────────────── */}
      <section className="sec b2b on-ink" data-nav="dark">
        <div className="b2b__glow" aria-hidden />
        <div className="wrap b2b__grid">
          <div>
            <span className="eyebrow eyebrow--light">For travel professionals</span>
            <h2 className="d-l" data-split>Built for agencies <em>&amp; operators</em></h2>
            <p className="lead" data-fade>
              Competitive net rates, fast quotes, and reliable execution — so you can sell with confidence.
            </p>

            <div className="b2b__list" data-stagger>
              {[
                { icon: <TrendingUp size={20} />, t: 'Strong net rates', d: 'Direct hotel & supplier relationships.' },
                { icon: <Headphones size={20} />, t: 'Dedicated BDM', d: 'A single point of contact for your desk.' },
                { icon: <Clock size={20} />, t: 'Rapid turnaround', d: 'Quotes and revisions without the wait.' },
              ].map((item) => (
                <div key={item.t} className="b2b__item">
                  <span>{item.icon}</span>
                  <div>
                    <strong>{item.t}</strong>
                    <p>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="b2b__actions">
              <Link to="/b2b" className="btn btn--light" data-magnetic>
                B2B overview <ArrowUpRight size={14} aria-hidden />
              </Link>
              <Link to="/contact" className="btn btn--ghost" data-magnetic>
                Request trade rates <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
          </div>

          <aside className="b2b__panel" data-fade>
            <h3 className="mono">At a glance</h3>
            {[
              { label: 'Partner satisfaction', val: '98%' },
              { label: 'Avg. quote response', val: '2h' },
              { label: 'Active partners', val: '2000+' },
            ].map((row) => (
              <div key={row.label} className="b2b__metric">
                <span className="b2b__val" data-count>{row.val}</span>
                <span className="mono">{row.label}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* ── PACKAGES ──────────────────────────────────────── */}
      <section className="sec pkgs">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Packages</span>
              <h2 className="d-m" data-split>Popular <em>journeys</em></h2>
              <p className="lead" data-fade>
                A sample of itineraries travellers book most often — fully customisable.
              </p>
            </div>
            <Link to="/packages" className="link-u" data-fade>
              View all packages <ArrowUpRight size={16} aria-hidden />
            </Link>
          </header>

          <div className="pkgs__grid" data-stagger="0.12">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT VOICES ──────────────────────────────────── */}
      {agentVoices.length > 0 ? (
        <section className="sec voices on-ink" data-nav="dark">
          <div className="wrap">
            <header className="head">
              <span className="eyebrow eyebrow--light">Agent voices</span>
              <h2 className="d-m" data-split>What our agents <em>say about us</em></h2>
              <p className="lead" data-fade>
                Real insights from our destination experts across operations, planning, and guest experience.
              </p>
            </header>

            <div className="voices__grid" data-stagger="0.14">
              {agentVoices.map((agent, index) => {
                const isPlaying = playingAgentId === agent.id
                const hasError = agentVideoErrors[agent.id]
                return (
                  <article key={agent.id} className={`voice${isPlaying ? ' is-playing' : ''}`}>
                    <div className="voice__frame">
                      <span className="voice__index mono">0{index + 1}</span>
                      <span className="voice__desk mono">
                        <Sparkles size={12} aria-hidden />
                        {agent.desk}
                      </span>

                      {hasError ? (
                        <div className="voice__fallback">
                          <Video size={22} />
                          <p>Video unavailable</p>
                        </div>
                      ) : (
                        <video
                          ref={(node) => { agentVideoRefs.current[agent.id] = node }}
                          className="voice__video"
                          playsInline
                          preload="metadata"
                          controls={isPlaying}
                          onPlay={() => setPlayingAgentId(agent.id)}
                          onPause={() => handleAgentPause(agent.id)}
                          onEnded={() => handleAgentPause(agent.id)}
                          onError={() => setAgentVideoErrors((prev) => ({ ...prev, [agent.id]: true }))}
                        >
                          <source src={agent.src} type="video/mp4" />
                        </video>
                      )}

                      {!isPlaying && !hasError ? (
                        <button
                          type="button"
                          className="voice__cover"
                          onClick={() => handleAgentPlay(agent.id)}
                          aria-label={`Play video from ${agent.name}`}
                          data-cursor="Play"
                        >
                          <span className="voice__play"><Play size={22} aria-hidden /></span>
                          <span className="voice__cover-label mono">Watch testimonial</span>
                        </button>
                      ) : null}
                    </div>

                    <div className="voice__meta">
                      <div>
                        <h3>{agent.name}</h3>
                        <p className="mono">{agent.role}</p>
                      </div>
                      <p className="voice__quote">
                        <span aria-hidden>“</span>{agent.quote}<span aria-hidden>”</span>
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── CLIENT MOMENTS ────────────────────────────────── */}
      <section className="sec moments">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Testimonials</span>
              <h2 className="d-m" data-split>Client <em>moments</em></h2>
              <p className="lead" data-fade>
                Explore photo stories from all five destinations and jump directly to any location.
              </p>
            </div>
            <Link to="/testimonials" className="link-u" data-fade>
              Explore all destination moments <ArrowUpRight size={16} aria-hidden />
            </Link>
          </header>

          <div className="moments__tabs" data-fade>
            {homeMoments.map((dest) => (
              <Link key={`tab-${dest.id}`} to={`/destinations/${dest.id}`} className="chip">
                <span>{dest.flag}</span>
                {dest.name}
              </Link>
            ))}
          </div>

          <div className="moments__grid">
            {homeMoments.map((dest, i) => (
              <Link key={dest.id} to={`/testimonials#${dest.id}`} className={`moment moment--${i + 1}`} data-cursor="View">
                <div className="media moment__media" data-wipe data-parallax="8">
                  <div className="px" style={{ backgroundImage: `url(${dest.image})` }} />
                </div>
                <div className="moment__body">
                  <p className="mono">{dest.flag} {dest.name}, {dest.country}</p>
                  <h3>{dest.tagline}</h3>
                  <span className="moment__cta mono">View gallery <ArrowUpRight size={13} aria-hidden /></span>
                </div>
              </Link>
            ))}
          </div>

          <div className="moments__foot" data-fade>
            <Link to="/testimonials" className="btn" data-magnetic>
              Open full testimonials page <ArrowUpRight size={14} aria-hidden />
            </Link>
            <div className="moments__links">
              {homeMoments.map((dest) => (
                <Link key={`quick-${dest.id}`} to={`/destinations/${dest.id}`}>{dest.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK QUERY ───────────────────────────────────── */}
      <section className="sec query sec--paper">
        <div className="wrap query__wrap">
          <div>
            <span className="eyebrow">Quick query</span>
            <h2 className="d-m" data-split>Tell us your plan, <em>we will call you back</em></h2>
            <p className="lead" data-fade>
              Share your details and travel requirement. Our team will get in touch shortly with
              options tailored for you.
            </p>
          </div>

          {querySubmitted ? (
            <div className="query__success">
              <h3 className="d-s">Thanks! Query received.</h3>
              <p>Our team will contact you shortly.</p>
              <button type="button" className="btn btn--plain" onClick={() => setQuerySubmitted(false)}>
                Submit another query
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={handleHomeQuerySubmit}>
              <div className="form__row">
                <label className="field"><span>Full name *</span><input name="name" type="text" required /></label>
                <label className="field"><span>Phone / WhatsApp *</span><input name="phone" type="tel" required /></label>
              </div>
              <div className="form__row">
                <label className="field"><span>Email ID *</span><input name="email" type="email" required /></label>
                <label className="field">
                  <span>Destination (optional)</span>
                  <select name="destination" defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Dubai</option>
                    <option>Azerbaijan</option>
                    <option>Singapore</option>
                    <option>Malaysia</option>
                    <option>Bali</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
              </div>
              <label className="field"><span>Travel dates / requirements (optional)</span><textarea name="message" rows={3} /></label>
              {queryError ? <p className="form__error">{queryError}</p> : null}
              <button type="submit" className="btn" disabled={querySubmitting}>
                {querySubmitting ? 'Sending…' : 'Submit query'} <ArrowUpRight size={14} aria-hidden />
              </button>
            </form>
          )}
        </div>
      </section>

      <HotelPartners
        hotels={homepagePartners}
        eyebrow="Hospitality partners"
        heading="A few of our hotel partners"
        subtitle="Across Dubai, Singapore, Baku and beyond — we work with chains and boutique properties to deliver consistent stays for every traveller."
        background="white"
      />

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="cta on-ink" data-nav="dark">
        <div className="cta__bg media" data-parallax="12">
          <div
            className="px"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80)' }}
          />
        </div>
        <div className="cta__shade" />
        <div className="wrap cta__inner">
          <span className="eyebrow eyebrow--light">Get started</span>
          <h2 className="d-xl" data-split>
            Plan something <em>memorable</em>
          </h2>
          <p className="lead" data-fade>
            Tell us your brief — FIT, group, or corporate — and we&apos;ll respond with a clear,
            actionable proposal.
          </p>
          <div className="cta__actions" data-fade>
            <Link to="/contact" className="btn" data-magnetic>
              Request a quote <ArrowUpRight size={14} aria-hidden />
            </Link>
            <Link to="/packages" className="btn btn--ghost" data-magnetic>
              Browse packages <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function PackageCard({ pkg }) {
  return (
    <article className="pcard">
      <div className="pcard__media media">
        <div className="px pcard__img" style={{ backgroundImage: `url(${pkg.image})` }} />
        {pkg.tag && (
          <span className="pcard__tag mono" style={{ background: pkg.tagColor || 'var(--red)' }}>
            {pkg.tag}
          </span>
        )}
      </div>
      <div className="pcard__body">
        <div className="pcard__meta mono">
          <span><MapPin size={12} aria-hidden /> {pkg.destinationName}</span>
          <span>{pkg.landOnly ? <Sparkles size={12} aria-hidden /> : <Clock size={12} aria-hidden />} {pkg.duration}</span>
        </div>
        <h3>{pkg.title}</h3>
        <ul className="pcard__hl">
          {pkg.highlights.slice(0, pkg.maxHighlights || 3).map((h) => (
            <li key={h}><CheckCircle size={13} aria-hidden /><span>{h}</span></li>
          ))}
        </ul>
        <div className="pcard__foot">
          <div>
            <span className="mono">From</span>
            <div className="pcard__price">{pkg.price}</div>
            <div className="pcard__note">{pkg.priceNote}</div>
          </div>
          <Link to="/contact" className="pcard__btn" aria-label={`Enquire about ${pkg.title}`}>
            Enquire <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
