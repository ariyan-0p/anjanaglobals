import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronRight, MapPin, Calendar, DollarSign, Globe, Clock, Plane,
  Sparkles, CheckCircle, Star, Award, Users, TrendingUp, Headphones,
  Plane as PlaneIcon, Heart, Building2, Sun, FileCheck,
} from 'lucide-react'
import { getDestination } from '../data/destinations'
import { getPackagesByDestination } from '../data/packages'
import dubaiHero from '../assets/Dubai.jpg'
import './DestinationPage.css'

const heroSlides = [
  {
    image: dubaiHero,
    badge: 'Middle East · UAE',
    title: 'Dubai —',
    accent: 'where dreams touch the sky',
  },
  {
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920&q=80',
    badge: 'Iconic Skyline',
    title: 'A city built',
    accent: 'on the impossible',
  },
  {
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1920&q=80',
    badge: 'Desert & Dunes',
    title: 'Golden silence,',
    accent: 'just beyond the city',
  },
]

const trustSignals = [
  'Direct hotel contracts',
  'On-ground team since 2007',
  'Visa support · 3–5 days',
  'Premium transfers',
  '24/7 destination support',
  '180+ properties contracted',
]

const stats = [
  { icon: <Award size={20} strokeWidth={1.75} />, value: '17+', label: 'Years on the ground' },
  { icon: <Building2 size={20} strokeWidth={1.75} />, value: '180+', label: 'Hotels contracted' },
  { icon: <Users size={20} strokeWidth={1.75} />, value: '12,000+', label: 'Travellers hosted' },
  { icon: <Headphones size={20} strokeWidth={1.75} />, value: '2 hrs', label: 'Avg. quote response' },
]

const signatureExperiences = [
  {
    tag: 'Iconic',
    title: 'Burj Khalifa — At the Top',
    desc: 'Ascend the world\'s tallest building and watch the city melt into the desert horizon from level 124.',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?w=800&q=80',
  },
  {
    tag: 'Adventure',
    title: 'Red Dune Desert Safari',
    desc: 'Dune-bash the Lahbab desert, ride a camel into the sunset, and dine under a billion stars at a Bedouin camp.',
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80',
  },
  {
    tag: 'Heritage',
    title: 'Old Dubai & Dhow Cruise',
    desc: 'Wander the spice and gold souks of Deira, then glide along Dubai Creek aboard a traditional wooden dhow.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
  },
  {
    tag: 'Luxury',
    title: 'Atlantis & Palm Jumeirah',
    desc: 'A private monorail ride to the iconic palm-shaped island, ending with high tea at Atlantis The Palm.',
    image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80',
  },
  {
    tag: 'Family',
    title: 'IMG Worlds & Global Village',
    desc: 'The world\'s largest indoor theme park paired with an evening at the cultural mosaic of Global Village.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  },
  {
    tag: 'Skyline',
    title: 'Helicopter City Tour',
    desc: 'A 22-minute aerial ballet over the Burj, the Palm, the World Islands and Marina — premium altitude only.',
    image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&q=80',
  },
]

const tripStyles = [
  { icon: <PlaneIcon size={20} strokeWidth={1.75} />, title: 'FIT & bespoke', desc: 'Private trips for couples, families and small groups — your pace, your call.' },
  { icon: <Heart size={20} strokeWidth={1.75} />, title: 'Honeymoon', desc: 'Beachfront resorts, private dinners, helicopter rides — moments that stay with you.' },
  { icon: <Building2 size={20} strokeWidth={1.75} />, title: 'Groups & MICE', desc: 'Conferences, incentives, and group movements — coordinated end to end.' },
]

const sampleItinerary = [
  { title: 'Arrival & Marina Sunset', desc: 'Meet & greet at DXB, premium transfer to your hotel. Evening at Dubai Marina with a stroll along The Walk and dinner at Bluewaters.', tags: ['Airport pickup', 'Marina walk', 'Welcome dinner'] },
  { title: 'Modern Dubai City Tour', desc: 'Burj Khalifa (Level 124), Dubai Mall fountains, Museum of the Future, then a curated drive past the Frame and Palm Jumeirah.', tags: ['Burj Khalifa', 'Museum of the Future', 'Dubai Mall'] },
  { title: 'Desert Safari Experience', desc: 'Pickup in a 4×4, dune-bashing in the red sands, sandboarding, camel ride, henna, falconry, and a BBQ buffet under the stars.', tags: ['Dune bashing', 'Bedouin camp', 'Live show'] },
  { title: 'Old Dubai & Dhow Cruise', desc: 'Souk Madinat, gold & spice souks of Deira, abra ride across the creek, evening dhow cruise with dinner on the water.', tags: ['Souks', 'Abra ride', 'Dhow dinner'] },
  { title: 'Abu Dhabi Day Trip', desc: 'Sheikh Zayed Grand Mosque, Heritage Village, Emirates Palace photo stop, and the Louvre Abu Dhabi for an art-led close.', tags: ['Grand Mosque', 'Louvre AD', 'Day return'] },
  { title: 'Departure', desc: 'Optional last-mile shopping at Mall of the Emirates or Dubai Hills Mall, premium transfer to the airport.', tags: ['Late checkout', 'Shopping', 'Airport drop'] },
]

const galleryImages = [
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
  'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80',
  'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80',
  'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800&q=80',
]

const essentials = [
  { icon: <Calendar size={20} />, title: 'Best time', desc: 'Nov – Apr · cool 22–28°C days, crystal-clear evenings.' },
  { icon: <Plane size={20} />, title: 'Flying time', desc: '~3.5 hrs from India · direct flights from BLR, BOM, DEL, HYD, MAA.' },
  { icon: <DollarSign size={20} />, title: 'Currency', desc: 'AED (Dirham) · cards accepted everywhere; tip 10%.' },
  { icon: <FileCheck size={20} />, title: 'Visa', desc: 'On Arrival / E-Visa · we arrange tourist visas in 3–5 days.' },
  { icon: <Globe size={20} />, title: 'Language', desc: 'Arabic & English · English universally spoken.' },
  { icon: <Sun size={20} />, title: 'Climate', desc: 'Desert / arid · sunny year-round, hot in summer.' },
]

export default function DubaiPage() {
  const dest = getDestination('dubai')
  const pkgs = getPackagesByDestination('dubai')

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
              <span>Dubai</span>
            </div>
            <span className="dest-hero__badge">
              <MapPin size={13} aria-hidden /> {slide.badge}
            </span>
            <h1 className="dest-hero__title">
              {slide.title}
              <span className="dest-hero__title-accent">{slide.accent}</span>
            </h1>
            <p className="dest-hero__lead">
              Glittering skylines, golden dunes, and a luxury hospitality scene unmatched anywhere — designed
              with the precision of an Anjana Globals itinerary.
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
      <section className="dest-trust" aria-label="Why book Dubai with us">
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

      {/* WHY DUBAI */}
      <section className="dest-section">
        <div className="container">
          <div className="dest-why">
            <div className="dest-why__text">
              <span className="tag">Why Dubai</span>
              <h2 className="section-heading">A city that rewrote what hospitality means</h2>
              <p>
                Few destinations balance the futuristic and the timeless quite like Dubai. In one day you can
                breakfast at a 5-star pool overlooking the Burj Khalifa, lunch at a centuries-old spice souk,
                and dine under desert stars 40 km from the city.
              </p>
              <p>
                Our Dubai desk has been running ground operations since 2007 — direct hotel contracts, vetted
                desert camps, and a fleet of premium transfers ensure you experience it the right way.
              </p>
              <div className="dest-why__chips">
                {dest.popularFor.map(tag => (
                  <span key={tag} className="dest-chip">{tag}</span>
                ))}
              </div>
              <Link to="/contact" className="btn-primary">
                Talk to our Dubai desk <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="dest-why__media">
              <div className="dest-why__media-item dest-why__media-item--lg" style={{ backgroundImage: `url(${dubaiHero})` }} />
              <div className="dest-why__media-item" style={{ backgroundImage: `url(${galleryImages[2]})` }} />
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
            <h2 className="section-heading">Six unforgettable Dubai moments</h2>
            <p className="section-sub">
              The experiences our clients remember years later. Every itinerary includes your pick of these —
              fully customisable to your pace.
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
            <h2 className="section-heading">However you want to do Dubai</h2>
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
            <h2 className="section-heading">Six days in Dubai — how it could flow</h2>
            <p className="section-sub">
              A reference itinerary our planners build on. Add days, swap experiences, switch to a 5★ beach
              property — your trip, your pace.
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
              <h2 className="section-heading">Curated Dubai itineraries</h2>
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
            <h2 className="section-heading">Dubai through our lens</h2>
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

      {/* SPECIALIST (B2B-style dark) */}
      <section className="dest-section dest-specialist">
        <div className="dest-specialist__bg" />
        <div className="dest-specialist__bg-img" style={{ backgroundImage: `url(${dubaiHero})` }} />
        <div className="container">
          <div className="dest-specialist__grid">
            <div>
              <span className="tag tag-light">Talk to our Dubai desk</span>
              <h2 className="section-heading section-heading-light" style={{ marginBottom: 14 }}>
                A real specialist, not a chatbot
              </h2>
              <p className="section-sub section-sub-light" style={{ marginBottom: 0 }}>
                Our Dubai desk sits across India and the UAE. Share what you have in mind — duration, group
                size, occasion — and you'll get a tailored proposal back within 2 working hours.
              </p>
              <div className="dest-specialist__list">
                <div className="dest-specialist__list-item">
                  <TrendingUp size={18} />
                  <div>
                    <strong>Direct hotel & supplier rates</strong>
                    <span>180+ properties contracted, no middleman markup.</span>
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
                <span>Since 2007</span>
              </div>
              <div className="dest-specialist__metric">
                <span>Hotels contracted</span>
                <span>180+</span>
              </div>
              <div className="dest-specialist__metric">
                <span>Travellers hosted</span>
                <span>12,000+</span>
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
              <h2 className="section-heading">Tell us your Dubai plan, we'll call you back</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Share your details and travel requirement. Our Dubai specialist will reach out within
                2 working hours with a tailored proposal.
              </p>
            </div>
            {submitted ? (
              <div className="dest-query__success">
                <h3>Thanks! Query received.</h3>
                <p>Our team will contact you shortly with a custom Dubai proposal.</p>
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
                  <select defaultValue="dubai-classic">
                    <option value="dubai-classic">Dubai Classic (5D/4N)</option>
                    <option value="dubai-luxury">Dubai Luxury Escape (7D/6N)</option>
                    <option value="dubai-custom">Custom itinerary</option>
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
            {['bali', 'azerbaijan', 'singapore', 'malaysia'].map(id => {
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
        <div className="dest-cta__bg" style={{ backgroundImage: `url(${dubaiHero})` }} />
        <div className="dest-cta__overlay" />
        <div className="container">
          <div className="dest-cta__inner">
            <span className="tag tag-light" style={{ marginBottom: 12 }}>Ready when you are</span>
            <h2>
              Plan your <span style={{ color: '#C8102E' }}>Dubai</span> escape
            </h2>
            <p>
              Tell us your brief — FIT, honeymoon, or group — and we'll respond with a clear, actionable
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
