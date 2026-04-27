import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronRight, MapPin, Calendar, DollarSign, Globe, Clock, Plane,
  CheckCircle, Star, Award, Users, TrendingUp, Headphones,
  Plane as PlaneIcon, Heart, Building2, Sun, FileCheck,
} from 'lucide-react'
import { getDestination } from '../data/destinations'
import { getPackagesByDestination } from '../data/packages'
import baliHero from '../assets/Bali.jpg'
import './DestinationPage.css'

const heroSlides = [
  {
    image: baliHero,
    badge: 'Indonesia · Southeast Asia',
    title: 'Bali —',
    accent: 'island of the gods',
  },
  {
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&q=80',
    badge: 'Sacred Ubud',
    title: 'Where rituals',
    accent: 'still shape the day',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    badge: 'Sea-cliff Sunsets',
    title: 'An ocean ending',
    accent: 'unlike any other',
  },
]

const trustSignals = [
  'Private villa specialists',
  'On-ground team since 2010',
  'Visa on arrival assistance',
  'Certified trekking guides',
  '24/7 destination support',
  '120+ villas & resorts contracted',
]

const stats = [
  { icon: <Award size={20} strokeWidth={1.75} />, value: '14+', label: 'Years on the ground' },
  { icon: <Building2 size={20} strokeWidth={1.75} />, value: '120+', label: 'Villas & resorts' },
  { icon: <Users size={20} strokeWidth={1.75} />, value: '8,500+', label: 'Travellers hosted' },
  { icon: <Headphones size={20} strokeWidth={1.75} />, value: '2 hrs', label: 'Avg. quote response' },
]

const signatureExperiences = [
  {
    tag: 'Sacred',
    title: 'Sunrise at Mount Batur',
    desc: 'A pre-dawn trek up an active volcano, followed by breakfast cooked over volcanic steam — Bali at its most magical.',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
  },
  {
    tag: 'Cultural',
    title: 'Tegalalang Rice Terraces',
    desc: 'Walk the emerald subak terraces in Ubud at golden hour — a UNESCO-recognised heritage of Balinese agriculture.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  },
  {
    tag: 'Spiritual',
    title: 'Tirta Empul Water Temple',
    desc: 'Take part in the centuries-old purification ritual under sacred springs, guided by a local priest.',
    image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80',
  },
  {
    tag: 'Coastal',
    title: 'Tanah Lot Sunset',
    desc: 'A sea temple carved on a wave-hammered rock — arguably the most photographed sunset in Indonesia.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    tag: 'Adventure',
    title: 'Nusa Penida Day Trip',
    desc: 'Speedboat across to the dramatic cliffs of Kelingking Beach, Angel\'s Billabong, and Broken Beach.',
    image: 'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800&q=80',
  },
  {
    tag: 'Wellness',
    title: 'Ubud Spa & Yoga Retreat',
    desc: 'A half-day Balinese flower-bath ritual, followed by a private vinyasa session in a riverside studio.',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  },
]

const tripStyles = [
  { icon: <Heart size={20} strokeWidth={1.75} />, title: 'Honeymoon', desc: 'Private pool villas, candlelight dinners and couples spa rituals — Bali at its most romantic.' },
  { icon: <PlaneIcon size={20} strokeWidth={1.75} />, title: 'FIT & families', desc: 'Tailored journeys for couples, families and small groups — your itinerary, your pace.' },
  { icon: <Building2 size={20} strokeWidth={1.75} />, title: 'Groups & MICE', desc: 'Ubud retreats, beach offsites and large group movements — coordinated end to end.' },
]

const sampleItinerary = [
  { title: 'Arrival in Denpasar & Seminyak', desc: 'Welcome at Ngurah Rai Airport, transfer to your beachfront resort in Seminyak. Sunset cocktails at Potato Head and dinner at Ku De Ta.', tags: ['Airport pickup', 'Seminyak Beach', 'Welcome dinner'] },
  { title: 'South Bali Beaches', desc: 'Uluwatu Temple at sunset with the traditional Kecak fire dance, beach club afternoon, and a seafood dinner at Jimbaran Bay.', tags: ['Uluwatu', 'Kecak Dance', 'Jimbaran BBQ'] },
  { title: 'Move to Ubud — Cultural Heart', desc: 'Tegalalang rice terraces, Tegenungan waterfall, Ubud Monkey Forest, and check-in to a riverside private-pool villa.', tags: ['Rice terraces', 'Waterfall', 'Pool villa'] },
  { title: 'Mount Batur Sunrise', desc: '2:30 AM start for the sunrise trek up Mount Batur. Volcano breakfast at the summit, hot springs descent, and an afternoon spa session.', tags: ['Volcano trek', 'Hot springs', 'Spa ritual'] },
  { title: 'Nusa Penida Island', desc: 'Speedboat from Sanur, full-day exploring Kelingking, Angel\'s Billabong, Broken Beach, and Crystal Bay snorkelling.', tags: ['Boat ride', 'Snorkelling', 'Kelingking'] },
  { title: 'Departure', desc: 'Late checkout, last-minute shopping at Seminyak boutiques, transfer to the airport with a handpicked Bali coffee gift.', tags: ['Late checkout', 'Boutiques', 'Airport drop'] },
]

const galleryImages = [
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
  'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
]

const essentials = [
  { icon: <Calendar size={20} />, title: 'Best time', desc: 'Apr – Oct · dry season, sunny days with low humidity.' },
  { icon: <Plane size={20} />, title: 'Flying time', desc: '~5.5 hrs from India · easy connections via Singapore or KL.' },
  { icon: <DollarSign size={20} />, title: 'Currency', desc: 'IDR (Rupiah) · USD widely accepted; carry cash for villages.' },
  { icon: <FileCheck size={20} />, title: 'Visa', desc: '$35 USD VOA on arrival · 30-day stay, simple process.' },
  { icon: <Globe size={20} />, title: 'Language', desc: 'Balinese & Indonesian · English at every tourist property.' },
  { icon: <Sun size={20} />, title: 'Climate', desc: 'Tropical · 26–30°C year-round, light-cotton weather.' },
]

export default function BaliPage() {
  const dest = getDestination('bali')
  const pkgs = getPackagesByDestination('bali')

  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(s => (s + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const goToSlide = (i) => {
    setCurrentSlide(i)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 6000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const slide = heroSlides[currentSlide]

  return (
    <main className="dest-page">
      {/* HERO — multi-slide */}
      <section className="dest-hero">
        {heroSlides.map((s, i) => (
          <div
            key={s.image}
            className="dest-hero__slide"
            style={{
              backgroundImage: `url(${s.image})`,
              opacity: i === currentSlide ? 1 : 0,
              transform: i === currentSlide ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        ))}
        <div className="dest-hero__overlay" />
        <div className="dest-hero__fade" />

        <div className="container dest-hero__inner">
          <div key={currentSlide} className="dest-hero__content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <Link to="/destinations">Destinations</Link>
              <span>›</span>
              <span>Bali</span>
            </div>
            <span className="dest-hero__badge">
              <MapPin size={13} aria-hidden /> {slide.badge}
            </span>
            <h1 className="dest-hero__title">
              {slide.title}
              <span className="dest-hero__title-accent">{slide.accent}</span>
            </h1>
            <p className="dest-hero__lead">
              Emerald rice terraces, sea-cliff temples, and a soul that slows you down. We design Bali trips
              for couples, families, and friends who want to feel something — not just see it.
            </p>
            <div className="dest-hero__actions">
              <Link to="/contact" className="btn-primary">
                Get a custom quote <ArrowRight size={16} aria-hidden />
              </Link>
              <a href="#packages" className="btn-outline-white">View packages</a>
            </div>
          </div>
        </div>

        <div className="dest-hero__dots" role="tablist" aria-label="Hero slides">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentSlide}
              className={`dest-hero__dot${i === currentSlide ? ' is-active' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <section className="dest-trust" aria-label="Why book Bali with us">
        <div className="dest-trust__track">
          {[...trustSignals, ...trustSignals].map((signal, i) => (
            <div key={`${signal}-${i}`} className="dest-trust__item">
              <Star size={14} aria-hidden />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="dest-stats">
        <div className="container">
          <div className="dest-stats__grid">
            {stats.map(s => (
              <div key={s.label} className="dest-stat">
                <div className="dest-stat__icon">{s.icon}</div>
                <div className="dest-stat__value">{s.value}</div>
                <div className="dest-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BALI */}
      <section className="dest-section">
        <div className="container">
          <div className="dest-why">
            <div className="dest-why__text">
              <span className="tag">Why Bali</span>
              <h2 className="section-heading">An island that resets you, gently</h2>
              <p>
                Bali is rare — a place where ancient ritual is still woven into daily life. Mornings begin
                with offerings on doorsteps, afternoons drift into rice paddies, and evenings end at a
                sea-cliff temple watching the sun fall into the Indian Ocean.
              </p>
              <p>
                Our Bali desk works with private villa owners, certified trekking guides, and Balinese
                priests — so the moments you remember are real, not staged for visitors.
              </p>
              <div className="dest-why__chips">
                {dest.popularFor.map(tag => (
                  <span key={tag} className="dest-chip">{tag}</span>
                ))}
              </div>
              <Link to="/contact" className="btn-primary">
                Talk to our Bali desk <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="dest-why__media">
              <div className="dest-why__media-item dest-why__media-item--lg" style={{ backgroundImage: `url(${baliHero})` }} />
              <div className="dest-why__media-item" style={{ backgroundImage: `url(${galleryImages[3]})` }} />
              <div className="dest-why__media-item" style={{ backgroundImage: `url(${galleryImages[1]})` }} />
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE EXPERIENCES */}
      <section className="dest-section dest-section--surface">
        <div className="container">
          <header className="dest-section__head">
            <span className="tag">Signature experiences</span>
            <h2 className="section-heading">Six unforgettable Bali moments</h2>
            <p className="section-sub">
              The experiences that turn a Bali trip from a holiday into a memory you carry for years. Pick
              any combination — your itinerary, your pace.
            </p>
          </header>
          <div className="dest-experiences">
            {signatureExperiences.map((exp, i) => (
              <article key={exp.title} className="dest-exp-card">
                <div className="dest-exp-card__media" style={{ backgroundImage: `url(${exp.image})` }}>
                  <div className="dest-exp-card__num">{String(i + 1).padStart(2, '0')}</div>
                </div>
                <div className="dest-exp-card__body">
                  <span className="dest-exp-card__tag">{exp.tag}</span>
                  <h3 className="dest-exp-card__title">{exp.title}</h3>
                  <p className="dest-exp-card__desc">{exp.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRIP STYLES */}
      <section className="dest-section">
        <div className="container">
          <header className="dest-section__head">
            <span className="tag">Trip styles</span>
            <h2 className="section-heading">However you want to do Bali</h2>
            <p className="section-sub">
              Three ways to travel — every itinerary is built around your group, occasion and pace.
            </p>
          </header>
          <div className="dest-pillars">
            {tripStyles.map(p => (
              <div key={p.title} className="dest-pillar">
                <div className="dest-pillar__icon">{p.icon}</div>
                <h3 className="dest-pillar__title">{p.title}</h3>
                <p className="dest-pillar__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE ITINERARY */}
      <section className="dest-section dest-section--surface">
        <div className="container">
          <header className="dest-section__head">
            <span className="tag">Sample itinerary</span>
            <h2 className="section-heading">Six days in Bali — how it could flow</h2>
            <p className="section-sub">
              A reference itinerary our planners build on. Add days, swap regions (Seminyak → Ubud → Nusa
              Dua) — your trip, your rhythm.
            </p>
          </header>
          <div className="dest-itinerary">
            {sampleItinerary.map((day, i) => (
              <article key={day.title} className="dest-itinerary__day">
                <div className="dest-itinerary__marker">
                  <div className="dest-itinerary__num">{i + 1}</div>
                  <div className="dest-itinerary__day-label">Day</div>
                </div>
                <div className="dest-itinerary__content">
                  <h4>{day.title}</h4>
                  <p>{day.desc}</p>
                  <div className="dest-itinerary__tags">
                    {day.tags.map(t => (
                      <span key={t} className="dest-itinerary__tag">
                        <CheckCircle size={11} color="#10B981" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="dest-section">
        <div className="container">
          <header className="dest-section__head--row">
            <div>
              <span className="tag">Ready packages</span>
              <h2 className="section-heading">Curated Bali itineraries</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Hand-built packages travellers book most often. Every quote is customised — these are
                starting points, not boxes.
              </p>
            </div>
            <Link to="/packages" className="dest-section__link">
              View all packages <ArrowRight size={16} aria-hidden />
            </Link>
          </header>
          <div className="dest-pkg-grid">
            {pkgs.map(pkg => (
              <article key={pkg.id} className="dest-pkg-card">
                <div className="dest-pkg-card__media" style={{ backgroundImage: `url(${pkg.image})` }}>
                  {pkg.tag && (
                    <span className="dest-pkg-card__tag" style={{ background: pkg.tagColor }}>
                      {pkg.tag}
                    </span>
                  )}
                </div>
                <div className="dest-pkg-card__body">
                  <div className="dest-pkg-card__meta">
                    <Clock size={12} /> {pkg.duration}
                  </div>
                  <h3 className="dest-pkg-card__title">{pkg.title}</h3>
                  <div className="dest-pkg-card__list">
                    {pkg.highlights.slice(0, 3).map(h => (
                      <span key={h}>
                        <CheckCircle size={13} color="#10B981" /> {h}
                      </span>
                    ))}
                  </div>
                  <div className="dest-pkg-card__foot">
                    <div>
                      <div className="dest-pkg-card__price-label">From</div>
                      <div className="dest-pkg-card__price">{pkg.price}</div>
                    </div>
                    <Link to="/contact" className="btn-primary" style={{ padding: '10px 18px', fontSize: 13 }}>
                      Enquire <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="dest-section dest-section--surface">
        <div className="container">
          <header className="dest-section__head">
            <span className="tag">Gallery</span>
            <h2 className="section-heading">Bali through our lens</h2>
          </header>
          <div className="dest-gallery">
            <div className="dest-gallery__item dest-gallery__item--lg" style={{ backgroundImage: `url(${galleryImages[0]})` }} />
            <div className="dest-gallery__item" style={{ backgroundImage: `url(${galleryImages[1]})` }} />
            <div className="dest-gallery__item" style={{ backgroundImage: `url(${galleryImages[2]})` }} />
            <div className="dest-gallery__item" style={{ backgroundImage: `url(${galleryImages[3]})` }} />
            <div className="dest-gallery__item" style={{ backgroundImage: `url(${galleryImages[4]})` }} />
          </div>
        </div>
      </section>

      {/* TRAVEL ESSENTIALS */}
      <section className="dest-section">
        <div className="container">
          <header className="dest-section__head">
            <span className="tag">Travel essentials</span>
            <h2 className="section-heading">Everything you need before you fly</h2>
          </header>
          <div className="dest-pillars" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {essentials.map(e => (
              <div key={e.title} className="dest-pillar">
                <div className="dest-pillar__icon">{e.icon}</div>
                <h3 className="dest-pillar__title">{e.title}</h3>
                <p className="dest-pillar__desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIST */}
      <section className="dest-section dest-specialist">
        <div className="dest-specialist__bg" />
        <div className="dest-specialist__bg-img" style={{ backgroundImage: `url(${baliHero})` }} />
        <div className="container">
          <div className="dest-specialist__grid">
            <div>
              <span className="tag tag-light">Talk to our Bali desk</span>
              <h2 className="section-heading section-heading-light" style={{ marginBottom: 14 }}>
                A real specialist, not a chatbot
              </h2>
              <p className="section-sub section-sub-light" style={{ marginBottom: 0 }}>
                Our Bali desk works with on-ground partners across Seminyak, Ubud, and Nusa Dua. Share your
                brief — duration, vibe, group size — and you'll get a tailored proposal back within 2
                working hours.
              </p>
              <div className="dest-specialist__list">
                <div className="dest-specialist__list-item">
                  <TrendingUp size={18} />
                  <div>
                    <strong>Direct villa & resort rates</strong>
                    <span>120+ properties contracted, no middleman markup.</span>
                  </div>
                </div>
                <div className="dest-specialist__list-item">
                  <Headphones size={18} />
                  <div>
                    <strong>Dedicated specialist</strong>
                    <span>One point of contact from quote to airport drop.</span>
                  </div>
                </div>
                <div className="dest-specialist__list-item">
                  <Clock size={18} />
                  <div>
                    <strong>Rapid turnaround</strong>
                    <span>Quotes and revisions within 2 working hours.</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-primary">
                  Request a callback <ArrowRight size={16} />
                </Link>
                <a href="https://wa.me/919999999999" className="btn-outline-white">WhatsApp us</a>
              </div>
            </div>

            <aside className="dest-specialist__panel">
              <h3>At a glance</h3>
              <div className="dest-specialist__metric">
                <span>Years on the ground</span>
                <span>Since 2010</span>
              </div>
              <div className="dest-specialist__metric">
                <span>Villas & resorts</span>
                <span>120+</span>
              </div>
              <div className="dest-specialist__metric">
                <span>Travellers hosted</span>
                <span>8,500+</span>
              </div>
              <div className="dest-specialist__metric">
                <span>Avg. quote response</span>
                <span>Within 2 hrs</span>
              </div>
              <div className="dest-specialist__badge">
                <p>IATA · TAAI · Ministry of Tourism (India) recognised DMC</p>
                <small>Credentials you can rely on.</small>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* QUICK QUERY */}
      <section className="dest-section dest-section--surface">
        <div className="container">
          <div className="dest-query__wrap">
            <div>
              <span className="tag">Quick enquiry</span>
              <h2 className="section-heading">Tell us your Bali plan, we'll call you back</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Share your details and travel requirement. Our Bali specialist will reach out within
                2 working hours with a tailored proposal.
              </p>
            </div>
            {submitted ? (
              <div className="dest-query__success">
                <h3>Thanks! Query received.</h3>
                <p>Our team will contact you shortly with a custom Bali proposal.</p>
                <button type="button" className="btn-primary" onClick={() => setSubmitted(false)}>
                  Submit another
                </button>
              </div>
            ) : (
              <form className="dest-query__form" onSubmit={handleSubmit}>
                <div className="dest-query__grid">
                  <input type="text" placeholder="Full name *" required />
                  <input type="tel" placeholder="Phone / WhatsApp *" required />
                </div>
                <div className="dest-query__grid">
                  <input type="email" placeholder="Email ID *" required />
                  <select defaultValue="bali-honeymoon">
                    <option value="bali-honeymoon">Bali Honeymoon Dream (6D/5N)</option>
                    <option value="bali-adventure">Bali Adventure Trail (7D/6N)</option>
                    <option value="bali-custom">Custom itinerary</option>
                  </select>
                </div>
                <textarea rows={4} placeholder="Travel dates, group size & requirements (optional)" />
                <button type="submit" className="btn-primary dest-query__submit">
                  Submit query <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ALSO EXPLORE */}
      <section className="dest-section">
        <div className="container">
          <header className="dest-section__head">
            <span className="tag">Also explore</span>
            <h2 className="section-heading">Other destinations we run</h2>
          </header>
          <div className="dest-also">
            {['dubai', 'azerbaijan', 'singapore', 'malaysia'].map(id => {
              const d = getDestination(id)
              return (
                <Link key={id} to={`/destinations/${id}`} className="dest-also__card">
                  <span style={{ fontSize: 20 }}>{d.flag}</span>
                  {d.name}
                  <ChevronRight size={14} color="#9CA3AF" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="dest-cta">
        <div className="dest-cta__bg" style={{ backgroundImage: `url(${baliHero})` }} />
        <div className="dest-cta__overlay" />
        <div className="container">
          <div className="dest-cta__inner">
            <span className="tag tag-light" style={{ marginBottom: 12 }}>Ready when you are</span>
            <h2>
              Plan your <span style={{ color: '#C8102E' }}>Bali</span> escape
            </h2>
            <p>
              Tell us your brief — honeymoon, family, or group — and we'll respond with a clear, actionable
              proposal within 2 hours.
            </p>
            <div className="dest-cta__actions">
              <Link to="/contact" className="btn-primary" style={{ padding: '15px 32px' }}>
                Request a quote <ArrowRight size={16} aria-hidden />
              </Link>
              <Link to="/packages" className="btn-outline-white" style={{ padding: '14px 32px' }}>
                Browse packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
