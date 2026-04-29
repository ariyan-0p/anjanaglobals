import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronRight, MapPin, Calendar, DollarSign, Globe, Clock, Plane,
  CheckCircle, XCircle, Star, Award, Users, TrendingUp, Headphones,
  Plane as PlaneIcon, Heart, Building2, Sun, FileCheck, Car, Camera, Utensils,
  ShieldCheck, Languages, Ticket, Sparkles,
} from 'lucide-react'
import { getDestination } from '../data/destinations'
import { getPackagesByDestination } from '../data/packages'
import dubaiHero from '../assets/Dubai.jpg'
import './DestinationPage.css'

const heroSlides = [
  {
    image: dubaiHero,
    badge: 'Dubai City Tours · UAE',
    title: 'Dubai City Tours —',
    accent: 'every icon, one curated day',
  },
  {
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920&q=80',
    badge: 'Modern & Old Dubai',
    title: 'From the Burj',
    accent: 'to the gold souks of Deira',
  },
  {
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1920&q=80',
    badge: 'Desert & Dunes',
    title: 'Dune-bash, dine,',
    accent: 'sleep under desert stars',
  },
]

const trustSignals = [
  'Hotel pickup & drop',
  'Licensed English-speaking guide',
  '20–25 min photo stops',
  'Skip-the-queue tickets',
  'AC vehicles · group-size matched',
  '24/7 on-tour support',
]

const stats = [
  { icon: <Award size={20} strokeWidth={1.75} />, value: '17+', label: 'Years running tours' },
  { icon: <Camera size={20} strokeWidth={1.75} />, value: '14+', label: 'Iconic stops covered' },
  { icon: <Users size={20} strokeWidth={1.75} />, value: '12,000+', label: 'Guests toured' },
  { icon: <Headphones size={20} strokeWidth={1.75} />, value: '2 hrs', label: 'Avg. quote response' },
]

const attractions = [
  {
    tag: 'World #1',
    title: 'Burj Khalifa',
    desc: 'The world\'s tallest tower. Photo stop at the base, with optional At The Top tickets to Levels 124/125.',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?w=800&q=80',
  },
  {
    tag: 'Shopping',
    title: 'Dubai Mall & Fountain',
    desc: 'The world\'s largest mall, the Dubai Aquarium tunnel, and the choreographed Dubai Fountain show.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
  },
  {
    tag: 'Iconic',
    title: 'Burj Al Arab',
    desc: 'Photo stop at the seven-star sail — Dubai\'s most photographed silhouette, on Jumeirah Beach.',
    image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80',
  },
  {
    tag: 'Heritage',
    title: 'Jumeirah Mosque',
    desc: 'A masterpiece of modern Islamic architecture in pure white stone — exterior visit and walk-around.',
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80',
  },
  {
    tag: 'Engineering',
    title: 'Palm Jumeirah & Atlantis',
    desc: 'A drive across the man-made palm-shaped island, ending at the iconic Atlantis The Palm resort.',
    image: 'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800&q=80',
  },
  {
    tag: 'Old Dubai',
    title: 'Dubai Creek & Dhow Cruise',
    desc: 'Abra ride across the historic creek and an evening dhow cruise with dinner on traditional wooden boats.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  },
  {
    tag: 'Culture',
    title: 'Dubai Museum & Al Fahidi',
    desc: 'Inside the 18th-century Al Fahidi Fort — the story of Dubai before the oil, in the old quarter.',
    image: 'https://images.unsplash.com/photo-1583425423320-cb8a3c4b4e8b?w=800&q=80',
  },
  {
    tag: 'Souks',
    title: 'Gold & Spice Souks',
    desc: 'The bustling lanes of Deira — gold by the kilo, spices by the scoop, and sharp bargaining.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
  },
  {
    tag: 'Adventure',
    title: 'Red Dune Desert Safari',
    desc: '4×4 dune-bashing in Lahbab desert, sandboarding, camel ride, henna, falconry, BBQ under the stars.',
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80',
  },
]

const sampleItinerary = [
  {
    title: 'Pickup & Modern Dubai',
    desc: 'Pickup from your hotel or location in Dubai. Drive past Sheikh Zayed Road skyline, photo stops at Burj Khalifa and Dubai Mall fountains.',
    tags: ['Hotel pickup', 'Burj Khalifa', 'Dubai Mall'],
  },
  {
    title: 'Jumeirah & The Palm',
    desc: 'Jumeirah Mosque exterior, photo stop at Burj Al Arab on Jumeirah Beach, drive across Palm Jumeirah ending at Atlantis.',
    tags: ['Jumeirah Mosque', 'Burj Al Arab', 'Atlantis'],
  },
  {
    title: 'Old Dubai & The Creek',
    desc: 'Dubai Museum at Al Fahidi Fort, abra ride across Dubai Creek, walk through the gold and spice souks of Deira.',
    tags: ['Dubai Museum', 'Abra ride', 'Souks'],
  },
  {
    title: 'Optional · Desert Safari',
    desc: 'Afternoon pickup in a 4×4, dune-bashing on red sands of Lahbab, sandboarding, camel ride, henna, BBQ buffet at Bedouin camp.',
    tags: ['Dune bashing', 'Camel ride', 'BBQ dinner'],
  },
  {
    title: 'Optional · Dhow Cruise',
    desc: 'Evening cruise along Dubai Creek or Marina aboard a traditional wooden dhow — dinner, live tanoura show, city lights.',
    tags: ['Dhow cruise', 'Dinner', 'Tanoura show'],
  },
  {
    title: 'Drop Off',
    desc: 'Drop back to your hotel or onward location. Add-on extensions: Abu Dhabi, Al Ain, Ferrari World, Miracle Garden.',
    tags: ['Hotel drop', 'Add-ons available'],
  },
]

const vehicleOptions = [
  {
    capacity: '1–4 persons',
    name: 'Toyota Land Cruiser',
    desc: 'Premium SUV with chilled water and leather interiors — ideal for couples and small families.',
    perks: ['Premium SUV', 'Chilled water', 'Leather interior'],
  },
  {
    capacity: '4–6 persons',
    name: '7-Seat AC SUV',
    desc: 'Spacious 7-seater with luggage room — perfect for families travelling with kids and elders.',
    perks: ['7-seat AC', 'Luggage space', 'Family-friendly'],
  },
  {
    capacity: '5–6 persons',
    name: 'Family Sedan / MPV',
    desc: 'Comfortable family car with privacy, kid-seats on request, and English-speaking chauffeur.',
    perks: ['Privacy glass', 'Kid seats', 'Pro chauffeur'],
  },
  {
    capacity: '10–12 persons',
    name: 'Hi-Roof Van',
    desc: 'Stand-up cabin van for extended families and friend groups — luggage racks, large windows, AC.',
    perks: ['Hi-roof cabin', 'Large windows', 'Group-friendly'],
  },
  {
    capacity: '13–25 persons',
    name: 'Mini-Coach',
    desc: 'Tinted-glass mini-coach with onboard PA — used for school groups, extended families, MICE.',
    perks: ['Tinted glass', 'Onboard PA', 'MICE-ready'],
  },
  {
    capacity: '26–50 persons',
    name: 'Luxury Coach',
    desc: 'Full-size luxury coach with reclining seats and onboard washroom — for large group movements.',
    perks: ['Reclining seats', 'Washroom', 'Pro driver'],
  },
]

const inclusions = [
  'Pickup & drop from your hotel or location in Dubai',
  '20–25 minute photo stops at every major attraction',
  'AC vehicle matched to your group size',
  'Licensed English-speaking driver / guide',
  'Bottled water on board',
  'All taxes and parking fees',
]

const exclusions = [
  'Burj Khalifa entry tickets (At The Top — addable)',
  'Meals not specified in the itinerary',
  'Personal expenses & tipping',
  'Anything not listed under inclusions',
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
  { icon: <Languages size={20} />, title: 'Language', desc: 'Arabic & English · English universally spoken.' },
  { icon: <Sun size={20} />, title: 'Climate', desc: 'Desert / arid · sunny year-round, hot in summer.' },
]

const tripStyles = [
  { icon: <PlaneIcon size={20} strokeWidth={1.75} />, title: 'Half-day city tour', desc: '4–5 hour iconic-stops circuit — Burj, Mall, Jumeirah, Palm.' },
  { icon: <Heart size={20} strokeWidth={1.75} />, title: 'Full-day combo', desc: 'City tour + Desert Safari OR Dhow Cruise — the classic Dubai day.' },
  { icon: <Building2 size={20} strokeWidth={1.75} />, title: 'Multi-day with add-ons', desc: 'Dubai + Abu Dhabi + Al Ain + Ferrari World, fully itinerised.' },
]

const relatedTours = [
  { id: 'abu-dhabi', name: 'Abu Dhabi City Tour', emoji: '🕌' },
  { id: 'al-ain', name: 'Al Ain Excursion', emoji: '🌴' },
  { id: 'ferrari-world', name: 'Ferrari World Combo', emoji: '🏎️' },
  { id: 'desert-safari', name: 'Desert Safari', emoji: '🐪' },
  { id: 'dhow-cruise', name: 'Dhow Cruise Dinner', emoji: '⛵' },
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

  useEffect(() => {
    const els = document.querySelectorAll('.dest-reveal')
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) } }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
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
      {/* HERO */}
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
              <span>Dubai City Tours</span>
            </div>
            <span className="dest-hero__badge">
              <Sparkles size={13} aria-hidden /> {slide.badge}
            </span>
            <h1 className="dest-hero__title">
              {slide.title}
              <span className="dest-hero__title-accent">{slide.accent}</span>
            </h1>
            <p className="dest-hero__lead">
              From the foot of the Burj Khalifa to the gold souks of Deira — our Dubai City Tours
              cover every iconic stop in one beautifully paced day, with hotel pickup, premium AC vehicles,
              and licensed local guides.
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
      <section className="dest-trust" aria-label="What's included on every tour">
        <div className="dest-trust__track">
          {[...trustSignals, ...trustSignals].map((signal, i) => (
            <div key={`${signal}-${i}`} className="dest-trust__item">
              <Star size={14} aria-hidden />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
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

      {/* ABOUT THE CITY TOUR */}
      <section className="dest-section">
        <div className="container">
          <div className="dest-why dest-reveal">
            <div className="dest-why__text">
              <span className="tag">About the tour</span>
              <h2 className="section-heading">One day. Every Dubai icon. Beautifully paced.</h2>
              <p>
                Dubai is a city designed to be photographed — the tallest tower in the world, the
                seven-star sail of Burj Al Arab, an island shaped like a palm, and a creek lined with
                wooden dhows older than the city itself. Our Dubai City Tour is a single, seamless day
                that connects every one of these landmarks.
              </p>
              <p>
                You'll be picked up directly from your hotel or location in Dubai, driven in an AC
                vehicle matched to your group size, and accompanied by a licensed English-speaking
                driver-guide who builds in 20–25 minute photo stops at each major attraction. The tour
                pairs perfectly with a desert safari in the afternoon or a dhow cruise in the evening.
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

      {/* ATTRACTIONS COVERED */}
      <section className="dest-section dest-section--surface">
        <div className="container">
          <header className="dest-section__head dest-reveal">
            <span className="tag">Attractions covered</span>
            <h2 className="section-heading">Every iconic stop, in one day</h2>
            <p className="section-sub">
              The full circuit of must-see Dubai landmarks — modern, heritage, and adventure. Mix and
              match to build your perfect city day.
            </p>
          </header>
          <div className="dest-experiences">
            {attractions.map((exp, i) => (
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

      {/* TOUR FORMATS */}
      <section className="dest-section">
        <div className="container">
          <header className="dest-section__head dest-reveal">
            <span className="tag">Tour formats</span>
            <h2 className="section-heading">Three ways to do the Dubai tour</h2>
            <p className="section-sub">
              Pick the format that fits your timeline — every option is private and customisable.
            </p>
          </header>
          <div className="dest-pillars dest-reveal">
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

      {/* HOW THE DAY FLOWS */}
      <section className="dest-section dest-section--surface">
        <div className="container">
          <header className="dest-section__head dest-reveal">
            <span className="tag">How the day flows</span>
            <h2 className="section-heading">A reference flow for your Dubai City Tour</h2>
            <p className="section-sub">
              Every stop is a 20–25 minute photo break unless otherwise noted. Day 4 and 5 are popular
              add-ons most guests pair with the main tour.
            </p>
          </header>
          <div className="dest-itinerary">
            {sampleItinerary.map((day, i) => (
              <article key={day.title} className="dest-itinerary__day">
                <div className="dest-itinerary__marker">
                  <div className="dest-itinerary__num">{i + 1}</div>
                  <div className="dest-itinerary__day-label">Stop</div>
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

      {/* VEHICLE OPTIONS */}
      <section className="dest-section">
        <div className="container">
          <header className="dest-section__head dest-reveal">
            <span className="tag">Vehicle options</span>
            <h2 className="section-heading">Matched to your group size</h2>
            <p className="section-sub">
              Every tour is private. Your vehicle is allocated based on group size — from a premium
              Land Cruiser for couples, to a luxury coach for incentive groups.
            </p>
          </header>
          <div className="dest-vehicles dest-reveal">
            {vehicleOptions.map(v => (
              <article key={v.name} className="dest-vehicle-card">
                <div className="dest-vehicle-card__head">
                  <div className="dest-vehicle-card__icon"><Car size={22} strokeWidth={1.75} /></div>
                  <span className="dest-vehicle-card__capacity">{v.capacity}</span>
                </div>
                <h3 className="dest-vehicle-card__name">{v.name}</h3>
                <p className="dest-vehicle-card__desc">{v.desc}</p>
                <ul className="dest-vehicle-card__perks">
                  {v.perks.map(p => (
                    <li key={p}>
                      <CheckCircle size={13} color="#10B981" /> {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUSIONS / EXCLUSIONS */}
      <section className="dest-section dest-section--surface">
        <div className="container">
          <header className="dest-section__head dest-reveal">
            <span className="tag">What's included</span>
            <h2 className="section-heading">Transparent pricing — no surprises</h2>
            <p className="section-sub">
              Every Dubai City Tour quote spells out exactly what's covered and what's optional. Below
              is the standard inclusion list.
            </p>
          </header>
          <div className="dest-incex dest-reveal">
            <div className="dest-incex__col dest-incex__col--in">
              <div className="dest-incex__head">
                <ShieldCheck size={18} />
                <h3>Included on every tour</h3>
              </div>
              <ul className="dest-incex__list">
                {inclusions.map(item => (
                  <li key={item}>
                    <CheckCircle size={14} color="#10B981" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="dest-incex__col dest-incex__col--ex">
              <div className="dest-incex__head">
                <Ticket size={18} />
                <h3>Optional add-ons / not included</h3>
              </div>
              <ul className="dest-incex__list">
                {exclusions.map(item => (
                  <li key={item}>
                    <XCircle size={14} color="#9CA3AF" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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
                Hand-built combinations of city tour, desert safari, and dhow cruise — every quote is
                customised to your dates and group.
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
          <header className="dest-section__head dest-reveal">
            <span className="tag">Gallery</span>
            <h2 className="section-heading">Dubai through our lens</h2>
          </header>
          <div className="dest-gallery dest-reveal">
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
          <header className="dest-section__head dest-reveal">
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
        <div className="dest-specialist__bg-img" style={{ backgroundImage: `url(${dubaiHero})` }} />
        <div className="container">
          <div className="dest-specialist__grid">
            <div>
              <span className="tag tag-light">Talk to our Dubai desk</span>
              <h2 className="section-heading section-heading-light" style={{ marginBottom: 14 }}>
                A real specialist, not a chatbot
              </h2>
              <p className="section-sub section-sub-light" style={{ marginBottom: 0 }}>
                Our Dubai desk sits across India and the UAE. Share your dates, group size, and which
                landmarks you want covered — you'll get a tailored proposal back within 2 working hours.
              </p>
              <div className="dest-specialist__list">
                <div className="dest-specialist__list-item">
                  <TrendingUp size={18} />
                  <div>
                    <strong>Direct vehicle & guide rates</strong>
                    <span>Owned fleet and contracted guides — no middleman markup.</span>
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
                <span>Iconic stops covered</span>
                <span>14+</span>
              </div>
              <div className="dest-specialist__metric">
                <span>Guests toured</span>
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
                  <select defaultValue="city-tour">
                    <option value="city-tour">Dubai City Tour (Half/Full day)</option>
                    <option value="city-safari">City Tour + Desert Safari</option>
                    <option value="city-dhow">City Tour + Dhow Cruise</option>
                    <option value="multi-day">Multi-day Dubai package</option>
                    <option value="custom">Custom itinerary</option>
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

      {/* RELATED TOURS */}
      <section className="dest-section">
        <div className="container">
          <header className="dest-section__head dest-reveal">
            <span className="tag">Pair with</span>
            <h2 className="section-heading">Related UAE tours</h2>
            <p className="section-sub">
              Most guests pair the Dubai City Tour with one of these — tell us your dates and we'll
              build the combined itinerary.
            </p>
          </header>
          <div className="dest-also dest-reveal">
            {relatedTours.map(t => (
              <Link key={t.id} to="/contact" className="dest-also__card">
                <span style={{ fontSize: 20 }}>{t.emoji}</span>
                {t.name}
                <ChevronRight size={14} color="#9CA3AF" />
              </Link>
            ))}
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
              Plan your <span style={{ color: '#C8102E' }}>Dubai</span> day
            </h2>
            <p>
              Tell us your brief — half-day, full-day, or multi-city — and we'll respond with a clear,
              actionable proposal within 2 hours.
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
