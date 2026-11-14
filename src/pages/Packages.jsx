import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, CheckCircle, ArrowUpRight } from 'lucide-react'
import { packages } from '../data/packages'
import PageHero from '../components/PageHero'
import './pages.css'

const categories = ['All', 'Honeymoon', 'Family', 'Adventure', 'Luxury', 'Group']
const destFilters = ['All', 'Dubai', 'Bali', 'Singapore', 'Malaysia', 'Azerbaijan']

export default function Packages() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDest, setActiveDest] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = packages.filter((p) => {
    const catMatch = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase()
    const destMatch = activeDest === 'All' || p.destinationName.includes(activeDest)
    return catMatch && destMatch
  })

  return (
    <main>
      <PageHero
        eyebrow="Handcrafted journeys"
        title={<>Tour <em>Packages</em></>}
        sub="Handcrafted journeys across Dubai, Bali, Singapore, Malaysia & Azerbaijan — for every budget and every dream."
        image="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Packages' }]}
      />

      {/* Filters */}
      <div className="filters">
        <div className="wrap filters__inner">
          <div className="filters__group" role="group" aria-label="Filter by destination">
            <span className="mono">Destination</span>
            {destFilters.map((d) => (
              <button key={d} type="button" className={`chip chip--red${activeDest === d ? ' is-active' : ''}`} onClick={() => setActiveDest(d)}>
                {d}
              </button>
            ))}
          </div>
          <div className="filters__group" role="group" aria-label="Filter by category">
            <span className="mono">Style</span>
            {categories.map((c) => (
              <button key={c} type="button" className={`chip${activeCategory === c ? ' is-active' : ''}`} onClick={() => setActiveCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <span className="filters__count mono">
            {filtered.length} package{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Packages grid */}
      <section className="sec sec--tight pk">
        <div className="wrap">
          {filtered.length === 0 ? (
            <div className="empty">
              <p className="d-s">No packages found</p>
              <button type="button" onClick={() => { setActiveCategory('All'); setActiveDest('All') }} className="btn btn--plain">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="pkgs__grid" key={`${activeCategory}-${activeDest}`} data-stagger="0.1">
              {filtered.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onExpand={() => setSelected(selected === pkg.id ? null : pkg.id)} expanded={selected === pkg.id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom package CTA */}
      <section className="sec sec--ink on-ink cta-band" data-nav="dark">
        <div className="wrap cta-band__inner">
          <span className="eyebrow eyebrow--light">Can&apos;t find what you&apos;re looking for?</span>
          <h2 className="d-l" data-split>We build custom <em>itineraries</em> too</h2>
          <p className="lead" data-fade>
            Tell us your dates, budget, and dream experience — we&apos;ll build the perfect trip around you.
          </p>
          <Link to="/contact" className="btn" data-magnetic>
            Request Custom Itinerary <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  )
}

function PackageCard({ pkg, onExpand, expanded }) {
  return (
    <article className="pcard">
      <div className="pcard__media media">
        <div className="px pcard__img" style={{ backgroundImage: `url(${pkg.image})` }} />
        {pkg.tag && (
          <span className="pcard__tag mono" style={{ background: pkg.tagColor || 'var(--red)' }}>{pkg.tag}</span>
        )}
        <span className="pcard__dur mono"><Clock size={11} aria-hidden /> {pkg.duration}</span>
      </div>

      <div className="pcard__body">
        <div className="pcard__meta mono">
          <span><MapPin size={12} aria-hidden /> {pkg.destinationName}</span>
          <span>{pkg.type}</span>
        </div>
        <h3>{pkg.title}</h3>

        <ul className="pcard__hl">
          {pkg.highlights.slice(0, expanded ? pkg.highlights.length : 3).map((h) => (
            <li key={h}><CheckCircle size={13} aria-hidden /><span>{h}</span></li>
          ))}
        </ul>
        {pkg.highlights.length > 3 && (
          <button type="button" className="pcard__more" onClick={onExpand}>
            {expanded ? '▲ Show less' : `+${pkg.highlights.length - 3} more highlights`}
          </button>
        )}

        <div className="pcard__inc">
          <p className="mono">Includes</p>
          <div>
            {pkg.inclusions.slice(0, 4).map((inc) => <span key={inc}>{inc}</span>)}
          </div>
        </div>

        <div className="pcard__foot">
          <div>
            <span className="mono">Starting from</span>
            <div className="pcard__price">{pkg.price}</div>
            <div className="pcard__note">{pkg.priceNote}</div>
          </div>
          <Link to="/contact" className="pcard__btn">
            Book Now <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
