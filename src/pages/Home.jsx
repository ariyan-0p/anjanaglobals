import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, MapPin, Clock, Star, Users, Award, Headphones,
  ChevronRight, CheckCircle, Globe, TrendingUp, Plane, Building2, Heart, Video, Sparkles, Play,
} from 'lucide-react'
import { destinations } from '../data/destinations'
import { packages } from '../data/packages'
import { homepagePartners } from '../data/hotelPartners'
import HotelPartners from '../components/HotelPartners'
import heroImgDubai from '../assets/Dubai.jpg'
import heroImgBali from '../assets/Bali.jpg'
import heroImgSingapore from '../assets/singapore.jpg'
import heroImgBaku from '../assets/baku.jpg'
import heroImgKualaLumpur from '../assets/Kualalumpur.jpg'
import agentVideo1 from '../assets/WhatsApp Video 2026-04-13 at 10.52.42 AM.mp4'
import agentVideo2 from '../assets/WhatsApp Video 2026-04-13 at 10.54.40 AM.mp4'
import './Home.css'

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

const stats = [
  { value: 'Since 2013', label: 'Trusted DMC', icon: <Award size={20} strokeWidth={1.75} /> },
  { value: '5', label: 'Signature destinations', icon: <Globe size={20} strokeWidth={1.75} /> },
  { value: '2500+', label: 'Travel partners across India', icon: <Users size={20} strokeWidth={1.75} /> },
  { value: '24/7', label: 'Dedicated support', icon: <Headphones size={20} strokeWidth={1.75} /> },
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
  {
    icon: <Plane size={20} strokeWidth={1.75} />,
    title: 'FIT & bespoke trips',
    desc: 'Tailored itineraries for individuals, couples, and private groups.',
  },
  {
    icon: <Building2 size={20} strokeWidth={1.75} />,
    title: 'Groups & MICE',
    desc: 'Seamless logistics for incentives, conferences, and large movements.',
  },
  {
    icon: <Heart size={20} strokeWidth={1.75} />,
    title: 'Celebrations',
    desc: 'Honeymoons and milestone journeys with end-to-end care.',
  },
]

const serviceChecks = [
  'Visa assistance & documentation',
  'Premium transfers & luxury coaches',
  'On-ground teams across every destination',
  'Net rates for trade partners',
]

const agentVoices = [
  {
    id: 'agent-1',
    name: 'Riya Malhotra',
    role: 'Senior Destination Specialist',
    desk: 'Dubai Desk',
    quote: 'Every journey we design is built for smooth on-ground execution and fast response times.',
    src: agentVideo1,
  },
  {
    id: 'agent-2',
    name: 'Vikash Nair',
    role: 'Group Operations Lead',
    desk: 'Bali Desk',
    quote: 'Our promise is simple: transparent planning, dependable operations, and measurable guest delight.',
    src: agentVideo2,
  },
]

const homeMoments = destinations.map((dest) => ({
  id: dest.id,
  name: dest.name,
  flag: dest.flag,
  country: dest.country,
  tagline: dest.tagline,
  image: dest.galleryImages?.[0] || dest.image,
}))

function useCounter(target, enabled, isVisible) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!enabled || !isVisible) return
    const head = String(target).match(/^(\d+)/)
    const num = head ? parseInt(head[1], 10) : 0
    if (!num) return
    let start = 0
    const timer = setInterval(() => {
      start += Math.ceil(num / (1800 / 30))
      if (start >= num) {
        setCount(num)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [enabled, isVisible, target])
  return count
}

function StatItem({ stat, isVisible }) {
  const suffix = stat.value.replace(/^\d+/, '')
  const shouldAnimate = /^\d+/.test(stat.value) && !stat.value.includes('/')
  const count = useCounter(stat.value, shouldAnimate, isVisible)
  const display = shouldAnimate ? `${count}${suffix}` : stat.value

  return (
    <div className="home-stat">
      <div className="home-stat__icon">{stat.icon}</div>
      <div className="home-stat__value">{display}</div>
      <div className="home-stat__label">{stat.label}</div>
    </div>
  )
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [querySubmitted, setQuerySubmitted] = useState(false)
  const [agentVideoErrors, setAgentVideoErrors] = useState({})
  const [playingAgentId, setPlayingAgentId] = useState(null)
  const agentVideoRefs = useRef({})
  const statsRef = useRef(null)
  const intervalRef = useRef(null)

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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(s => (s + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.25 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const goToSlide = (i) => {
    setCurrentSlide(i)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 6000)
  }

  const featuredPackages = packages.slice(0, 3)

  const handleHomeQuerySubmit = (e) => {
    e.preventDefault()
    setQuerySubmitted(true)
  }


  return (
    <main className="home">
      <section className="home-hero">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.image}
            className="home-hero__slide"
            style={{
              backgroundImage: `url(${slide.image})`,
              opacity: i === currentSlide ? 1 : 0,
              transform: i === currentSlide ? 'scale(1.03)' : 'scale(1)',
              pointerEvents: 'none',
            }}
          />
        ))}
        <div className="home-hero__overlay" />
        <div className="home-hero__fade" />

        <div className="container home-hero__inner">
          <div key={currentSlide} className="home-hero__content" style={{ maxWidth: '44rem' }}>
            <div className="home-hero__badge">
              <MapPin size={13} color="#C8102E" aria-hidden />
              <span>
                {heroSlides[currentSlide].tag} · {heroSlides[currentSlide].dest}
              </span>
            </div>

            <h1 className="home-hero__title">
              {heroSlides[currentSlide].title}
              <br />
              <span className="home-hero__title-accent">{heroSlides[currentSlide].accent}</span>
            </h1>

            <div className="home-hero__actions">
              <Link to="/destinations" className="btn-primary">
                Explore destinations <ArrowRight size={16} aria-hidden />
              </Link>
              <Link to="/b2b" className="btn-outline-white">
                Partner with us
              </Link>
            </div>
          </div>
        </div>

        <div className="home-hero__dots" role="tablist" aria-label="Hero slides">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentSlide}
              className={`home-hero__dot${i === currentSlide ? ' is-active' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </section>

      <section className="home-trust-strip" aria-label="Trust highlights">
        <div className="home-trust-strip__track">
          {[...trustSignals, ...trustSignals].map((signal, i) => (
            <div key={`${signal}-${i}`} className="home-trust-strip__item">
              <Star size={14} aria-hidden />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </section>

      <section ref={statsRef} className="home-stats">
        <div className="container">
          <div className="home-stats__grid">
            {stats.map(s => (
              <StatItem key={s.label} stat={s} isVisible={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--destinations" style={{ background: '#fff' }}>
        <div className="container">
          <header className="home-section__head">
            <span className="tag">Destinations</span>
            <h2 className="section-heading">Where we excel</h2>
            <p className="section-sub">
              Five hand-picked regions — each with dedicated teams, vetted suppliers, and itineraries
              refined over years of operation.
            </p>
          </header>

          <div className="home-dest-grid">
            <DestCardLarge dest={destinations[0]} />
            <div className="home-dest-grid__small">
              {destinations.slice(1).map(d => (
                <DestCardSmall key={d.id} dest={d} />
              ))}
            </div>
          </div>

          <div className="home-dest-cta">
            <Link to="/destinations" className="btn-primary">
              View all destinations <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-section--surface home-section--services">
        <div className="container">
          <div className="home-services">
            <div>
              <span className="tag">Services</span>
              <h2 className="section-heading">Everything in one place</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                From first quote to last transfer — one partner, one workflow, clear ownership at
                every step.
              </p>
              <div className="home-services__checks">
                {serviceChecks.map(line => (
                  <div key={line} className="home-services__check">
                    <CheckCircle size={18} color="#C8102E" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <Link to="/services" className="btn-primary">
                All services <ArrowRight size={16} aria-hidden />
              </Link>
            </div>

            <div className="home-services__pillars">
              {servicePillars.map(p => (
                <div key={p.title} className="home-pillar">
                  <div className="home-pillar__icon">{p.icon}</div>
                  <h3 className="home-pillar__title">{p.title}</h3>
                  <p className="home-pillar__desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-b2b">
        <div className="home-b2b__bg" aria-hidden />
        <div className="container">
          <div className="home-b2b__grid">
            <div>
              <span className="tag tag-light">For travel professionals</span>
              <h2 className="section-heading section-heading-light" style={{ marginBottom: '14px' }}>
                Built for agencies & operators
              </h2>
              <p className="section-sub section-sub-light" style={{ marginBottom: 0 }}>
                Competitive net rates, fast quotes, and reliable execution — so you can sell with
                confidence.
              </p>

              <div className="home-b2b__list">
                {[
                  { icon: <TrendingUp size={18} />, t: 'Strong net rates', d: 'Direct hotel & supplier relationships.' },
                  { icon: <Headphones size={18} />, t: 'Dedicated BDM', d: 'A single point of contact for your desk.' },
                  { icon: <Clock size={18} />, t: 'Rapid turnaround', d: 'Quotes and revisions without the wait.' },
                ].map(item => (
                  <div key={item.t} className="home-b2b__list-item">
                    {item.icon}
                    <div>
                      <strong>{item.t}</strong>
                      <span>{item.d}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/b2b" className="btn-primary">
                  B2B overview <ArrowRight size={16} aria-hidden />
                </Link>
                <Link to="/contact" className="btn-outline-white">
                  Request trade rates
                </Link>
              </div>
            </div>

            <aside className="home-b2b__panel">
              <h3>At a glance</h3>
              {[
                { label: 'Partner satisfaction', val: '98%' },
                { label: 'Avg. quote response', val: '2h' },
                { label: 'Active partners', val: '2000+' },
              ].map(row => (
                <div key={row.label} className="home-b2b__metric">
                  <span>{row.label}</span>
                  <span>{row.val}</span>
                </div>
              ))}
              <div className="home-b2b__badge">
                <p>
                  <strong>IATA · TAAI</strong> — Ministry of Tourism (India) recognised DMC
                </p>
                <small>Credentials you can share with confidence.</small>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#fff' }}>
        <div className="container">
          <header className="home-section__head home-section__head--row">
            <div>
              <span className="tag">Packages</span>
              <h2 className="section-heading">Popular journeys</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                A sample of itineraries travellers book most often — fully customisable.
              </p>
            </div>
            <Link to="/packages" className="home-section__link">
              View all packages <ArrowRight size={16} aria-hidden />
            </Link>
          </header>

          <div className="home-packages-grid">
            {featuredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-agent-voices">
        <div className="container">
          <header className="home-section__head text-center" style={{ marginBottom: 'clamp(1.5rem,4vw,2.4rem)' }}>
            <span className="tag">Agent voices</span>
            <h2 className="section-heading" style={{ margin: '0 auto 10px' }}>
              What our agents say about us
            </h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Real insights from our destination experts across operations, planning, and guest experience.
            </p>
          </header>

          <div className="home-agent-voices__stage">
            {agentVoices.map((agent, index) => {
              const isPlaying = playingAgentId === agent.id
              const hasError = agentVideoErrors[agent.id]
              return (
                <article
                  key={agent.id}
                  className={`home-agent-tile${isPlaying ? ' is-playing' : ''}`}
                  style={{ '--tile-index': index }}
                >
                  <div className="home-agent-tile__frame">
                    <span className="home-agent-tile__index">0{index + 1}</span>
                    <span className="home-agent-tile__desk">
                      <Sparkles size={13} aria-hidden />
                      {agent.desk}
                    </span>

                    {hasError ? (
                      <div className="home-agent-tile__fallback">
                        <Video size={22} />
                        <p>Video unavailable</p>
                      </div>
                    ) : (
                      <video
                        ref={(node) => { agentVideoRefs.current[agent.id] = node }}
                        className="home-agent-tile__video"
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
                        className="home-agent-tile__cover"
                        onClick={() => handleAgentPlay(agent.id)}
                        aria-label={`Play video from ${agent.name}`}
                      >
                        <span className="home-agent-tile__play">
                          <Play size={20} aria-hidden />
                        </span>
                        <span className="home-agent-tile__cover-label">Watch testimonial</span>
                      </button>
                    ) : null}
                  </div>

                  <div className="home-agent-tile__panel">
                    <div className="home-agent-tile__panel-head">
                      <div>
                        <h3>{agent.name}</h3>
                        <p>{agent.role}</p>
                      </div>
                    </div>
                    <p className="home-agent-tile__quote">
                      <span aria-hidden>"</span>{agent.quote}<span aria-hidden>"</span>
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="home-section home-section--light home-moments">
        <div className="container">
          <header className="home-section__head text-center" style={{ marginBottom: 'clamp(2rem,4vw,2.75rem)' }}>
            <span className="tag">Testimonials</span>
            <h2 className="section-heading" style={{ margin: '0 auto 10px' }}>
              Client moments
            </h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Explore photo stories from all five destinations and jump directly to any location.
            </p>
            <div style={{ marginTop: '14px' }}>
              <Link to="/testimonials" className="home-section__link" style={{ justifyContent: 'center' }}>
                Explore all destination moments <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </header>

          <div className="home-moments__tabs">
            {homeMoments.map((dest) => (
              <Link key={`tab-${dest.id}`} to={`/destinations/${dest.id}`} className="home-moments__tab">
                <span>{dest.flag}</span>
                {dest.name}
              </Link>
            ))}
          </div>

          <div className="home-moments__grid">
            {homeMoments.map((dest) => (
              <Link key={dest.id} to={`/testimonials#${dest.id}`} className="home-moment-card">
                <div className="home-moment-card__img" style={{ backgroundImage: `url(${dest.image})` }} />
                <div className="home-moment-card__overlay" />
                <div className="home-moment-card__body">
                  <p className="home-moment-card__meta">{dest.flag} {dest.name}, {dest.country}</p>
                  <h3>{dest.tagline}</h3>
                  <span className="home-moment-card__cta">
                    View gallery <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="home-moments__footer">
            <Link to="/testimonials" className="btn-primary">
              Open full testimonials page <ArrowRight size={16} aria-hidden />
            </Link>
            <div className="home-moments__dest-links">
              {homeMoments.map((dest) => (
                <Link key={`quick-${dest.id}`} to={`/destinations/${dest.id}`}>
                  {dest.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-query">
        <div className="container">
          <div className="home-query__wrap">
            <div>
              <span className="tag">Quick query</span>
              <h2 className="section-heading">Tell us your plan, we will call you back</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Share your details and travel requirement. Our team will get in touch shortly with
                options tailored for you.
              </p>
            </div>

            {querySubmitted ? (
              <div className="home-query__success">
                <h3>Thanks! Query received.</h3>
                <p>Our team will contact you shortly.</p>
                <button type="button" className="btn-primary" onClick={() => setQuerySubmitted(false)}>
                  Submit another query
                </button>
              </div>
            ) : (
              <form className="home-query__form" onSubmit={handleHomeQuerySubmit}>
                <div className="home-query__grid">
                  <input type="text" placeholder="Full name *" required />
                  <input type="tel" placeholder="Phone / WhatsApp *" required />
                </div>
                <div className="home-query__grid">
                  <input type="email" placeholder="Email ID *" required />
                  <select defaultValue="">
                    <option value="" disabled>
                      Destination (optional)
                    </option>
                    <option>Dubai</option>
                    <option>Azerbaijan</option>
                    <option>Singapore</option>
                    <option>Malaysia</option>
                    <option>Bali</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <textarea rows={4} placeholder="Travel dates / requirements (optional)" />
                <button type="submit" className="btn-primary home-query__submit">
                  Submit query
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <HotelPartners
        hotels={homepagePartners}
        eyebrow="Hospitality partners"
        heading="A few of our hotel partners"
        subtitle="Across Dubai, Singapore, Baku and beyond — we work with chains and boutique properties to deliver consistent stays for every traveller."
        background="white"
      />

      <section className="home-cta">
        <div
          className="home-cta__bg"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80)',
          }}
        />
        <div className="home-cta__overlay" />
        <div className="container home-cta__inner">
          <span className="tag tag-light" style={{ marginBottom: 12 }}>Get started</span>
          <h2>
            Plan something <span style={{ color: '#C8102E' }}>memorable</span>
          </h2>
          <p>
            Tell us your brief — FIT, group, or corporate — and we&apos;ll respond with a clear,
            actionable proposal.
          </p>
          <div className="home-cta__actions">
            <Link to="/contact" className="btn-primary" style={{ padding: '15px 32px' }}>
              Request a quote <ArrowRight size={16} aria-hidden />
            </Link>
            <Link to="/packages" className="btn-outline-white" style={{ padding: '14px 32px' }}>
              Browse packages
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function DestCardLarge({ dest }) {
  return (
    <Link to={`/destinations/${dest.id}`} className="home-card-dest home-card-dest--lg">
      <div className="home-card-dest__img" style={{ backgroundImage: `url(${dest.image})` }} />
      <div className="home-card-dest__grad" />
      <span className="home-card-dest__badge">{dest.packages} packages</span>
      <div className="home-card-dest__body">
        <div className="home-card-dest__flag">{dest.flag}</div>
        <h3>{dest.name}</h3>
        <p>{dest.shortDesc}</p>
        <span className="home-card-dest__cta">
          Explore <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  )
}

function DestCardSmall({ dest }) {
  const hasImage = Boolean(dest.image)
  return (
    <Link to={`/destinations/${dest.id}`} className="home-card-dest home-card-dest--sm">
      {hasImage ? (
        <div className="home-card-dest__img" style={{ backgroundImage: `url(${dest.image})` }} />
      ) : (
        <div className="home-card-dest__placeholder">
          <Video size={22} aria-hidden />
          <span>No photo yet</span>
        </div>
      )}
      <div className="home-card-dest__grad" />
      <span className="home-card-dest__badge">{dest.packages} pkgs</span>
      <div className="home-card-dest__body">
        <div className="home-card-dest__flag">{dest.flag}</div>
        <h3>{dest.name}</h3>
      </div>
    </Link>
  )
}

function PackageCard({ pkg }) {
  return (
    <div className="home-card-pkg">
      <div className="home-card-pkg__img">
        <div className="home-card-pkg__img-inner" style={{ backgroundImage: `url(${pkg.image})` }} />
        {pkg.tag && (
          <span className="home-card-pkg__tag" style={{ background: pkg.tagColor || '#C8102E' }}>
            {pkg.tag}
          </span>
        )}
      </div>
      <div className="home-card-pkg__body">
        <div className="home-card-pkg__meta">
          <MapPin size={13} color="#6B7280" aria-hidden />
          <span style={{ fontWeight: 600 }}>{pkg.destinationName}</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} aria-hidden /> {pkg.duration}
          </span>
        </div>
        <h3>{pkg.title}</h3>
        <div className="home-card-pkg__highlights">
          {pkg.highlights.slice(0, 3).map(h => (
            <div key={h}>
              <CheckCircle size={13} color="#10B981" aria-hidden />
              <span>{h}</span>
            </div>
          ))}
        </div>
        <div className="home-card-pkg__foot">
          <div>
            <div className="home-card-pkg__price-label">From</div>
            <div className="home-card-pkg__price">{pkg.price}</div>
            <div className="home-card-pkg__note">{pkg.priceNote}</div>
          </div>
          <Link to="/contact" className="btn-primary" style={{ padding: '10px 18px', fontSize: 13 }}>
            Enquire <ChevronRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}
