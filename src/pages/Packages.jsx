import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, CheckCircle, ArrowRight, ChevronRight, Filter } from 'lucide-react'
import { packages } from '../data/packages'

const categories = ['All', 'Honeymoon', 'Family', 'Adventure', 'Luxury', 'Group']
const destFilters = ['All', 'Dubai', 'Bali', 'Singapore', 'Malaysia', 'Azerbaijan']

export default function Packages() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDest, setActiveDest] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = packages.filter(p => {
    const catMatch = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase()
    const destMatch = activeDest === 'All' || p.destinationName.includes(activeDest)
    return catMatch && destMatch
  })

  return (
    <main>
      {/* Hero */}
      <div
        className="page-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80)', paddingTop: '80px' }}
      >
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Packages</span>
          </div>
          <h1>Tour Packages</h1>
          <p>Handcrafted journeys across Dubai, Bali, Singapore, Malaysia & Azerbaijan — for every budget and every dream.</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '20px 0', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '13px', fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>
              <Filter size={15} />
              <span style={{ fontWeight: '700' }}>Filter by:</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {destFilters.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDest(d)}
                  style={{
                    padding: '7px 16px', borderRadius: '100px',
                    background: activeDest === d ? '#C8102E' : '#F3F4F6',
                    color: activeDest === d ? 'white' : '#374151',
                    border: 'none', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <div style={{ width: '1px', height: '20px', background: '#E5E7EB' }} />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  style={{
                    padding: '7px 16px', borderRadius: '100px',
                    background: activeCategory === c ? '#1D3461' : 'transparent',
                    color: activeCategory === c ? 'white' : '#6B7280',
                    border: activeCategory === c ? 'none' : '1px solid #E5E7EB',
                    fontSize: '12px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#9CA3AF', fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>
              {filtered.length} package{filtered.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <section style={{ padding: '60px 0 100px', background: '#F8F7F4', minHeight: '600px' }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9CA3AF' }}>
              <p style={{ fontSize: '24px', marginBottom: '16px' }}>No packages found</p>
              <button onClick={() => { setActiveCategory('All'); setActiveDest('All') }} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
              {filtered.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} onExpand={() => setSelected(selected === pkg.id ? null : pkg.id)} expanded={selected === pkg.id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom package CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #0A0F1E, #1D3461)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="tag tag-light">Can't find what you're looking for?</span>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '0 auto 16px', maxWidth: '600px' }}>
            We Build Custom Itineraries Too
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '32px', fontFamily: "'Inter', sans-serif", maxWidth: '500px', margin: '0 auto 32px' }}>
            Tell us your dates, budget, and dream experience — we'll build the perfect trip around you.
          </p>
          <Link to="/contact" className="btn-primary" style={{ padding: '16px 40px' }}>
            Request Custom Itinerary <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}

function PackageCard({ pkg, onExpand, expanded }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        borderRadius: '18px', overflow: 'hidden',
        background: 'white',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.14)' : '0 4px 16px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `url(${pkg.image}) center/cover`,
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.6s ease',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />
        {pkg.tag && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: pkg.tagColor || '#C8102E',
            color: 'white', padding: '5px 14px', borderRadius: '100px',
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif",
          }}>
            {pkg.tag}
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: '16px', right: '16px',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          color: 'white', padding: '5px 12px', borderRadius: '100px',
          fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px',
          fontFamily: "'Inter', sans-serif",
        }}>
          <Clock size={11} /> {pkg.duration}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <MapPin size={13} color="#9CA3AF" />
          <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>{pkg.destinationName}</span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#B8963E', fontWeight: '700', background: '#FDF8F0', padding: '3px 10px', borderRadius: '100px', fontFamily: "'Inter', sans-serif" }}>
            {pkg.type}
          </span>
        </div>

        <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#1A1A2E', marginBottom: '14px' }}>{pkg.title}</h3>

        {/* Highlights (collapsible) */}
        <div style={{ marginBottom: '16px' }}>
          {pkg.highlights.slice(0, expanded ? pkg.highlights.length : 3).map(h => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle size={13} color="#10B981" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#4B5563', fontFamily: "'Inter', sans-serif" }}>{h}</span>
            </div>
          ))}
          {pkg.highlights.length > 3 && (
            <button
              onClick={onExpand}
              style={{ background: 'none', border: 'none', color: '#C8102E', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px 0', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {expanded ? '▲ Show less' : `+${pkg.highlights.length - 3} more highlights`}
            </button>
          )}
        </div>

        {/* Inclusions */}
        <div style={{ padding: '12px', background: '#F8F7F4', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>Includes</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {pkg.inclusions.slice(0, 4).map(inc => (
              <span key={inc} style={{ fontSize: '12px', color: '#4B5563', background: 'white', border: '1px solid #E5E7EB', padding: '3px 10px', borderRadius: '100px', fontFamily: "'Inter', sans-serif" }}>
                {inc}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>Starting from</p>
            <p style={{ fontSize: '24px', fontWeight: '900', color: '#C8102E', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>{pkg.price}</p>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', fontFamily: "'Inter', sans-serif" }}>{pkg.priceNote}</p>
          </div>
          <Link to="/contact" className="btn-primary" style={{ padding: '11px 22px', fontSize: '12px' }}>
            Book Now <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
