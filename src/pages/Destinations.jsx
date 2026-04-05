import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, ArrowRight, Star } from 'lucide-react'
import { destinations } from '../data/destinations'

export default function Destinations() {
  const [hovered, setHovered] = useState(null)

  return (
    <main>
      {/* Hero */}
      <div
        className="page-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80)', paddingTop: '80px' }}
      >
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Destinations</span>
          </div>
          <h1>Our Destinations</h1>
          <p>Five extraordinary worlds — each one a masterpiece of culture, beauty, and adventure.</p>
        </div>
      </div>

      {/* Destinations grid */}
      <section style={{ padding: '100px 0', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <span className="tag">Where Would You Like to Go?</span>
            <h2 className="section-heading">Explore Our World</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              From the dazzling skylines of Dubai to the spiritual serenity of Bali — discover destinations that inspire, thrill, and move you.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {destinations.map((dest, i) => (
              <div
                key={dest.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '60px',
                  alignItems: 'center',
                  direction: i % 2 === 1 ? 'rtl' : 'ltr',
                }}
              >
                {/* Image */}
                <div
                  style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '420px', cursor: 'pointer', direction: 'ltr' }}
                  onMouseEnter={() => setHovered(dest.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `url(${dest.image}) center/cover`,
                    transform: hovered === dest.id ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.6s ease',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.5) 0%, transparent 60%)' }} />

                  {/* Flag overlay */}
                  <div style={{
                    position: 'absolute', top: '20px', left: '20px',
                    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                    padding: '8px 16px', borderRadius: '100px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '14px', fontWeight: '700', color: '#1A1A2E',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    <span>{dest.flag}</span>
                    {dest.country}
                  </div>

                  {/* Package count */}
                  <div style={{
                    position: 'absolute', bottom: '20px', right: '20px',
                    background: '#C8102E', color: 'white',
                    padding: '8px 16px', borderRadius: '100px',
                    fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {dest.packages} Packages Available
                  </div>
                </div>

                {/* Content */}
                <div style={{ direction: 'ltr' }}>
                  <span className="tag">{dest.bestTime && `Best Time: ${dest.bestTime}`}</span>
                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#0A0F1E', marginBottom: '8px', fontWeight: '900' }}>
                    {dest.name}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#C8102E', fontWeight: '700', marginBottom: '16px', fontFamily: "'Inter', sans-serif", fontStyle: 'italic' }}>
                    "{dest.tagline}"
                  </p>
                  <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.8', marginBottom: '28px' }}>
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div style={{ marginBottom: '28px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>
                      Top Highlights
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {dest.highlights.map(h => (
                        <span
                          key={h}
                          style={{
                            padding: '6px 14px', background: dest.bgColor,
                            border: `1px solid ${dest.color}22`,
                            borderRadius: '100px', fontSize: '13px',
                            color: '#374151', fontWeight: '500', fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick facts */}
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Currency', value: dest.currency },
                      { label: 'Language', value: dest.language.split(',')[0] },
                      { label: 'Visa', value: dest.visa.split('(')[0].trim() },
                    ].map(fact => (
                      <div key={fact.label}>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px', fontFamily: "'Inter', sans-serif" }}>{fact.label}</p>
                        <p style={{ fontSize: '14px', color: '#1A1A2E', fontWeight: '600', fontFamily: "'Inter', sans-serif" }}>{fact.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to={`/destinations/${dest.id}`} className="btn-primary">
                      Explore {dest.name} <ArrowRight size={16} />
                    </Link>
                    <Link to="/contact" className="btn-outline-white" style={{ color: '#1D3461', borderColor: '#1D3461' }}>
                      Get a Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: '#0A0F1E' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="tag tag-light">Custom Itineraries</span>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '0 auto 16px', maxWidth: '600px' }}>
            Can't Decide? Let Us Plan the Perfect Journey for You
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px', fontFamily: "'Inter', sans-serif" }}>
            Our travel experts will craft a bespoke itinerary based on your preferences, budget, and travel dates.
          </p>
          <Link to="/contact" className="btn-primary" style={{ padding: '16px 40px' }}>
            Start Planning <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}
