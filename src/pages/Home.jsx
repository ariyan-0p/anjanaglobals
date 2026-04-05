import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, MapPin, Clock, Star, Users, Award, Headphones,
  ChevronRight, Play, CheckCircle, Globe, TrendingUp
} from 'lucide-react'
import { destinations } from '../data/destinations'
import { packages } from '../data/packages'

/* ── Hero slides ──────────────────────────────── */
const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
    dest: 'Dubai, UAE',
    tag: 'Middle East',
  },
  {
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
    dest: 'Bali, Indonesia',
    tag: 'Southeast Asia',
  },
  {
    image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1920&q=80',
    dest: 'Singapore',
    tag: 'City State',
  },
  {
    image: 'https://images.unsplash.com/photo-1570214476695-8f09e2e1cc87?w=1920&q=80',
    dest: 'Baku, Azerbaijan',
    tag: 'Land of Fire',
  },
  {
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80',
    dest: 'Kuala Lumpur, Malaysia',
    tag: 'Truly Asia',
  },
]

const stats = [
  { value: '20+', label: 'Years of Excellence', icon: <Award size={22} /> },
  { value: '5', label: 'Exotic Destinations', icon: <Globe size={22} /> },
  { value: '500+', label: 'Travel Partners', icon: <Users size={22} /> },
  { value: '50K+', label: 'Happy Travellers', icon: <Star size={22} /> },
  { value: '24/7', label: 'Dedicated Support', icon: <Headphones size={22} /> },
]

const featuredPackages = packages.slice(0, 4)

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Travel Agent, Mumbai',
    text: 'Anjna Global has been our go-to DMC partner for Dubai for the last 8 years. Their response time is unmatched and their on-ground team is exceptional.',
    rating: 5,
    avatar: 'PS',
    dest: 'Dubai',
  },
  {
    name: 'Rahul Mehta',
    role: 'Operations Head, Delhi Travels',
    text: 'The MICE program they put together for our corporate client in Singapore was absolutely flawless — from transfers to the gala dinner setup.',
    rating: 5,
    avatar: 'RM',
    dest: 'Singapore',
  },
  {
    name: 'Sunita & Vikram Patel',
    role: 'Honeymooners, Ahmedabad',
    text: 'Our Bali honeymoon was pure magic. Every little detail was perfect — the pool villa, the candle dinner by the rice terraces... truly unforgettable.',
    rating: 5,
    avatar: 'VP',
    dest: 'Bali',
  },
]

/* ── Hooks ────────────────────────────────────── */
function useCounter(target, isVisible) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isVisible) return
    const num = parseInt(target.replace(/\D/g, ''))
    if (!num) { setCount(target); return }
    let start = 0
    const duration = 1800
    const step = duration / num
    const timer = setInterval(() => {
      start += Math.ceil(num / (duration / 30))
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [isVisible, target])
  return count
}

function StatItem({ stat, isVisible }) {
  const num = parseInt(stat.value.replace(/\D/g, ''))
  const count = useCounter(stat.value, isVisible)
  const suffix = stat.value.replace(/[0-9]/g, '')
  const display = num ? `${count}${suffix}` : stat.value

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '0 24px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ color: '#C8102E' }}>{stat.icon}</div>
      <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'white', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
        {display}
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center' }}>
        {stat.label}
      </div>
    </div>
  )
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)
  const intervalRef = useRef(null)

  /* Auto-advance hero */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(s => (s + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [])

  /* Stats intersection */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const goToSlide = (i) => {
    setCurrentSlide(i)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 5000)
  }

  return (
    <main>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden' }}>
        {/* Slides */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              background: `url(${slide.image}) center/cover no-repeat`,
              opacity: i === currentSlide ? 1 : 0,
              transition: 'opacity 1.2s ease',
              transform: i === currentSlide ? 'scale(1.04)' : 'scale(1)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '1.2s, 8s',
            }}
          />
        ))}

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(10,15,30,0.85) 0%, rgba(10,15,30,0.4) 60%, rgba(10,15,30,0.2) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to top, rgba(10,15,30,0.6), transparent)',
        }} />

        {/* Content */}
        <div className="container" style={{
          position: 'relative', zIndex: 2,
          height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          paddingTop: '100px',
        }}>
          <div style={{ maxWidth: '680px' }}>
            {/* Current dest tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(200,16,46,0.2)',
              border: '1px solid rgba(200,16,46,0.4)',
              borderRadius: '100px',
              padding: '6px 16px', marginBottom: '24px',
              animation: 'fadeInUp 0.6s ease',
            }}>
              <MapPin size={12} color="#C8102E" />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {heroSlides[currentSlide].tag} — {heroSlides[currentSlide].dest}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              color: 'white',
              fontWeight: '900',
              lineHeight: '1.08',
              marginBottom: '24px',
              animation: 'fadeInUp 0.7s ease',
            }}>
              Beyond Destinations.
              <br />
              <span style={{ color: '#C8102E' }}>Exceptional</span> Experiences.
            </h1>

            <p style={{
              fontSize: '18px', color: 'rgba(255,255,255,0.75)',
              lineHeight: '1.7', marginBottom: '36px',
              fontFamily: "'Inter', sans-serif",
              animation: 'fadeInUp 0.8s ease',
              maxWidth: '520px',
            }}>
              Your trusted DMC partner across the Middle East & Asia. Serving travel professionals and discerning travellers since 2003 — with unforgettable experiences across Dubai, Singapore, Malaysia, Bali & Azerbaijan.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', animation: 'fadeInUp 0.9s ease' }}>
              <Link to="/destinations" className="btn-primary" style={{ fontSize: '13px', padding: '15px 34px' }}>
                Explore Destinations <ArrowRight size={16} />
              </Link>
              <Link to="/b2b" className="btn-outline-white" style={{ fontSize: '13px', padding: '14px 34px' }}>
                Trade Partners
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '8px', zIndex: 3,
        }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                width: i === currentSlide ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === currentSlide ? '#C8102E' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.4s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Destination quick-jump */}
        <div style={{
          position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 3,
        }}>
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                background: i === currentSlide ? '#C8102E' : 'rgba(255,255,255,0.15)',
                border: i === currentSlide ? '1px solid #C8102E' : '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: '100px',
                padding: '6px 14px',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
              }}
            >
              {slide.dest.split(',')[0]}
            </button>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: '#0A0F1E', padding: '36px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-around',
            flexWrap: 'wrap', gap: '24px',
          }}>
            {stats.map((stat, i) => (
              <StatItem key={i} stat={stat} isVisible={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DESTINATIONS
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', background: 'white' }}>
        <div className="container">
          <div style={{ marginBottom: '56px' }}>
            <span className="tag">Our Destinations</span>
            <h2 className="section-heading" style={{ maxWidth: '520px' }}>
              Five Extraordinary Worlds Await You
            </h2>
            <p className="section-sub">
              From the golden dunes of Dubai to the emerald rice fields of Bali — every destination we offer is a masterpiece waiting to be explored.
            </p>
          </div>

          {/* Featured (big) card + grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Big card */}
            <DestCard dest={destinations[0]} big />

            {/* Right grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {destinations.slice(1).map(dest => (
                <DestCard key={dest.id} dest={dest} />
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/destinations" className="btn-primary">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', background: '#F8F7F4' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Left text */}
            <div>
              <span className="tag">What We Do</span>
              <h2 className="section-heading">
                Complete Travel Solutions for Every Need
              </h2>
              <p className="section-sub" style={{ marginBottom: '32px' }}>
                Whether you're a travel agent building packages for your clients, or a corporate looking for a seamless incentive trip — we have you covered from start to finish.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                {[
                  'FIT & Customised Itineraries',
                  'Group Tours (10 – 500+ pax)',
                  'MICE & Corporate Events',
                  'Honeymoon & Romance Packages',
                  'Visa Assistance & Documentation',
                  'Premium Transfers & Luxury Coaches',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={18} color="#C8102E" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/services" className="btn-primary">
                Explore All Services <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: service cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: '✈️', title: 'FIT Packages', desc: 'Tailored individual & couple itineraries' },
                { icon: '👥', title: 'Group Tours', desc: 'Seamless experiences for groups of 10–500+' },
                { icon: '💼', title: 'MICE', desc: 'World-class meetings, conferences & events' },
                { icon: '💍', title: 'Honeymoons', desc: 'Romantic escapes crafted to perfection' },
                { icon: '📄', title: 'Visa Support', desc: 'Complete documentation & processing' },
                { icon: '🚗', title: 'Transfers', desc: 'Luxury transport across all destinations' },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'
                    e.currentTarget.style.borderColor = 'rgba(200,16,46,0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{s.icon}</div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          B2B SECTION
      ════════════════════════════════════════ */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, #0A0F1E 0%, #1D3461 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200,16,46,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(184,150,62,0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <span className="tag tag-light">For Travel Professionals</span>
              <h2 className="section-heading section-heading-light" style={{ marginBottom: '20px' }}>
                Your Trusted DMC Partner in the Field
              </h2>
              <p className="section-sub section-sub-light" style={{ marginBottom: '36px' }}>
                Join 500+ travel agencies, tour operators, and corporate travel managers who rely on Anjna Global for seamless operations, competitive net rates, and on-ground excellence.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                {[
                  { icon: <TrendingUp size={18} />, label: 'Best Net Rates', desc: 'Direct hotel & supplier contracts' },
                  { icon: <Headphones size={18} />, label: 'Dedicated BDM', desc: 'Personal business development manager' },
                  { icon: <Clock size={18} />, label: '2-Hour Response', desc: 'Fast quotes, every time' },
                  { icon: <Star size={18} />, label: 'Priority Access', desc: 'Pre-allocated inventory & early releases' },
                ].map((b, i) => (
                  <div key={i} style={{
                    padding: '20px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <div style={{ color: '#C8102E', marginBottom: '8px' }}>{b.icon}</div>
                    <p style={{ color: 'white', fontWeight: '700', fontSize: '14px', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>{b.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{b.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/b2b" className="btn-primary">
                  Become a Partner <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-outline-white">
                  Get Trade Rates
                </Link>
              </div>
            </div>

            {/* Right: partner card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(10px)',
            }}>
              <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '24px', fontFamily: "'Playfair Display', serif" }}>
                Why Partners Choose Us
              </h3>
              {[
                { pct: '98%', label: 'Partner Satisfaction Rate' },
                { pct: '2hr', label: 'Average Quote Response Time' },
                { pct: '500+', label: 'Active Travel Partners' },
                { pct: '5★', label: 'Average Destination Rating' },
                { pct: '20+', label: 'Years of Industry Trust' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 0',
                  borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>{item.label}</span>
                  <span style={{ color: '#C8102E', fontWeight: '800', fontSize: '20px', fontFamily: "'Inter', sans-serif" }}>{item.pct}</span>
                </div>
              ))}

              <div style={{ marginTop: '28px', padding: '20px', background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '12px' }}>
                <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.6' }}>
                  🏆 <strong>IATA Accredited · TAAI Member</strong><br />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Ministry of Tourism (India) Recognised DMC</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED PACKAGES
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="tag">Popular Packages</span>
              <h2 className="section-heading">Handpicked Experiences</h2>
              <p className="section-sub">Our most loved tour packages — crafted to deliver maximum value and unforgettable memories.</p>
            </div>
            <Link to="/packages" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C8102E', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px', flexShrink: 0 }}>
              View All Packages <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {featuredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', background: '#F8F7F4' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '56px' }}>
            <span className="tag">Client Stories</span>
            <h2 className="section-heading">What Our Partners & Travellers Say</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Thousands of satisfied partners and travellers trust Anjna Global for their most important journeys.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  background: 'white', borderRadius: '16px', padding: '36px 32px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} size={15} fill="#B8963E" color="#B8963E" />
                  ))}
                </div>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.75', marginBottom: '28px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C8102E, #1D3461)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '14px', color: '#1A1A2E', fontFamily: "'Inter', sans-serif" }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280' }}>{t.role}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', padding: '4px 10px', background: '#F8F7F4', borderRadius: '100px', fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>
                    {t.dest}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section style={{
        position: 'relative', padding: '120px 0',
        background: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80) center/cover no-repeat',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,15,30,0.9) 0%, rgba(29,52,97,0.85) 100%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="tag tag-light" style={{ marginBottom: '16px' }}>Start Planning Today</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'white', fontWeight: '900',
            marginBottom: '20px', maxWidth: '700px', margin: '0 auto 20px',
          }}>
            Let's Build Something <span style={{ color: '#C8102E' }}>Extraordinary</span> Together
          </h2>
          <p style={{
            fontSize: '17px', color: 'rgba(255,255,255,0.7)',
            maxWidth: '520px', margin: '0 auto 40px',
            lineHeight: '1.75', fontFamily: "'Inter', sans-serif",
          }}>
            Whether you need a tailor-made itinerary or a full MICE event — our team is ready to make it happen.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ padding: '16px 40px', fontSize: '14px' }}>
              Get a Free Quote <ArrowRight size={16} />
            </Link>
            <Link to="/packages" className="btn-outline-white" style={{ padding: '15px 40px', fontSize: '14px' }}>
              Browse Packages
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ── Sub-components ────────────────────────────── */

function DestCard({ dest, big }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/destinations/${dest.id}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'block',
        height: big ? '480px' : '220px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `url(${dest.image}) center/cover no-repeat`,
        transform: hovered ? 'scale(1.07)' : 'scale(1)',
        transition: 'transform 0.6s ease',
      }} />

      {/* Gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.1) 60%)',
      }} />

      {/* Packages badge */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        background: 'rgba(200,16,46,0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '100px',
        padding: '5px 12px',
        fontSize: '11px', fontWeight: '700', color: 'white', letterSpacing: '0.5px',
        fontFamily: "'Inter', sans-serif",
      }}>
        {dest.packages} Packages
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: big ? '28px' : '16px' }}>
        <div style={{ fontSize: big ? '22px' : '16px', marginBottom: '4px' }}>{dest.flag}</div>
        <h3 style={{
          color: 'white', fontWeight: '700',
          fontSize: big ? '26px' : '18px',
          marginBottom: '4px',
        }}>
          {dest.name}
        </h3>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: big ? '14px' : '12px',
          marginBottom: big ? '16px' : '0',
          lineHeight: '1.5',
          display: big ? 'block' : hovered ? 'block' : 'none',
          transition: 'all 0.3s',
        }}>
          {dest.shortDesc}
        </p>
        {big && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#C8102E', color: 'white', padding: '8px 18px',
            borderRadius: '4px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px',
            textTransform: 'uppercase', opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s ease',
            fontFamily: "'Inter', sans-serif",
          }}>
            Explore <ArrowRight size={12} />
          </div>
        )}
      </div>
    </Link>
  )
}

function PackageCard({ pkg }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'white',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.14)' : '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `url(${pkg.image}) center/cover`,
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.6s ease',
        }} />
        {pkg.tag && (
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            background: pkg.tagColor || '#C8102E',
            color: 'white', padding: '4px 12px',
            borderRadius: '100px', fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif",
          }}>
            {pkg.tag}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <MapPin size={13} color="#6B7280" />
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', letterSpacing: '0.5px' }}>
            {pkg.destinationName}
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280' }}>
            <Clock size={12} /> {pkg.duration}
          </span>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px' }}>
          {pkg.title}
        </h3>

        <div style={{ marginBottom: '20px' }}>
          {pkg.highlights.slice(0, 3).map(h => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle size={13} color="#10B981" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#4B5563' }}>{h}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>Starting from</p>
            <p style={{ fontSize: '22px', fontWeight: '800', color: '#C8102E', fontFamily: "'Inter', sans-serif" }}>{pkg.price}</p>
            <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{pkg.priceNote}</p>
          </div>
          <Link to="/contact" className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
            Enquire <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
