import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, MapPin, Clock, Calendar, DollarSign, Globe, CheckCircle, Star, ChevronRight } from 'lucide-react'
import { getDestination } from '../data/destinations'
import { getPackagesByDestination } from '../data/packages'

export default function DestinationDetail() {
  const { slug } = useParams()
  const dest = getDestination(slug)
  const pkgs = getPackagesByDestination(slug)
  const [activeTab, setActiveTab] = useState('overview')
  const [activeImg, setActiveImg] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!dest) {
    return (
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '2rem' }}>Destination not found</h2>
        <Link to="/destinations" className="btn-primary">Back to Destinations</Link>
      </main>
    )
  }

  const tabs = ['overview', 'highlights', 'packages', 'travel info']

  return (
    <main>
      {/* Hero */}
      <div style={{
        position: 'relative', height: isMobile ? '62vh' : '70vh', minHeight: isMobile ? '420px' : '500px',
        background: `url(${dest.heroImage}) center/cover no-repeat`,
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,15,30,0.3) 0%, rgba(10,15,30,0.8) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: isMobile ? '36px' : '60px', paddingTop: '80px' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/destinations">Destinations</Link>
            <span>›</span>
            <span>{dest.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: '8px' }}>{dest.flag}</div>
              <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', marginBottom: '8px' }}>
                {dest.name}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: isMobile ? '15px' : '18px', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                {dest.tagline}
              </p>
            </div>
            <div style={{ marginLeft: isMobile ? 0 : 'auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary" style={{ padding: '14px 28px' }}>
                Get a Quote <ArrowRight size={16} />
              </Link>
              <Link to="/packages" className="btn-outline-white" style={{ padding: '13px 28px' }}>
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick facts bar */}
      <div style={{ background: '#0A0F1E', padding: '18px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gap: '12px 18px', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {[
              { icon: <Calendar size={16} />, label: 'Best Time to Visit', value: dest.bestTime },
              { icon: <DollarSign size={16} />, label: 'Currency', value: dest.currency },
              { icon: <Globe size={16} />, label: 'Language', value: dest.language },
              { icon: <MapPin size={16} />, label: 'Visa', value: dest.visa },
              { icon: <Clock size={16} />, label: 'Timezone', value: dest.facts?.timezone || 'GMT+4' },
            ].map((fact, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#C8102E' }}>{fact.icon}</div>
                <div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>{fact.label}</p>
                  <p style={{ fontSize: '14px', color: 'white', fontWeight: '600', fontFamily: 'var(--font-body)' }}>{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: isMobile ? 'static' : 'sticky', top: '70px', zIndex: 100 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: isMobile ? '14px 16px' : '18px 24px',
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #C8102E' : '3px solid transparent',
                  color: activeTab === tab ? '#C8102E' : '#6B7280',
                  fontWeight: activeTab === tab ? '700' : '500',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <section style={{ padding: 'clamp(52px, 8vw, 80px) 0', background: 'white', minHeight: '500px' }}>
        <div className="container">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? '24px' : '60px', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontSize: '2rem', color: '#0A0F1E', marginBottom: '20px' }}>About {dest.name}</h2>
                <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.85', marginBottom: '32px' }}>
                  {dest.description}
                </p>

                {/* Gallery */}
                {dest.galleryImages && (
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: '#0A0F1E', marginBottom: '16px', fontFamily: 'var(--font-body)', fontWeight: '700' }}>
                      Photo Gallery
                    </h3>
                    <div style={{ position: 'relative', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', height: isMobile ? '240px' : '300px' }}>
                      <img src={dest.galleryImages[activeImg]} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '10px' }}>
                      {dest.galleryImages.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveImg(i)}
                          style={{
                            height: '80px', borderRadius: '8px', overflow: 'hidden',
                            cursor: 'pointer', border: activeImg === i ? '3px solid #C8102E' : '3px solid transparent',
                            transition: 'border-color 0.2s',
                          }}
                        >
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Popular for */}
                <div style={{ background: '#F8F7F4', borderRadius: '16px', padding: '28px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                    Popular For
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {dest.popularFor.map(tag => (
                      <span key={tag} style={{ padding: '6px 14px', background: 'white', border: `2px solid ${dest.color}33`, borderRadius: '100px', fontSize: '13px', color: '#374151', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Airlines */}
                <div style={{ background: '#F8F7F4', borderRadius: '16px', padding: '28px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                    Airlines Available
                  </h4>
                  {dest.airlines.map(a => (
                    <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <CheckCircle size={14} color="#10B981" />
                      <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'var(--font-body)' }}>{a}</span>
                    </div>
                  ))}
                </div>

                {/* CTA card */}
                <div style={{ background: 'linear-gradient(135deg, #C8102E, #8B0A1F)', borderRadius: '16px', padding: '28px', color: 'white' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>Plan Your {dest.name} Trip</h4>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6', marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
                    Get a customised itinerary and competitive quote within 2 hours.
                  </p>
                  <Link to="/contact" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: 'white', color: '#C8102E', padding: '12px 20px',
                    borderRadius: '6px', fontWeight: '700', fontSize: '13px',
                    letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                  }}>
                    Get Free Quote <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div>
              <h2 style={{ fontSize: '2rem', color: '#0A0F1E', marginBottom: '40px' }}>Must-See in {dest.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {dest.highlights.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '32px 28px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '16px',
                      background: 'white',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(200,16,46,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ width: '44px', height: '44px', background: dest.bgColor, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '22px' }}>
                      🏛️
                    </div>
                    <h3 style={{ fontSize: '18px', color: '#1A1A2E', fontFamily: 'var(--font-body)', fontWeight: '700' }}>{h}</h3>
                    <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>Top attraction in {dest.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PACKAGES */}
          {activeTab === 'packages' && (
            <div>
              <h2 style={{ fontSize: '2rem', color: '#0A0F1E', marginBottom: '12px' }}>{dest.name} Packages</h2>
              <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
                {pkgs.length} curated packages available for {dest.name}
              </p>
              {pkgs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>Packages coming soon!</p>
                  <Link to="/contact" className="btn-primary">Contact for Custom Quote</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
                  {pkgs.map(pkg => (
                    <div key={pkg.id} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'all 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none' }}
                    >
                      <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                        <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {pkg.tag && <div style={{ position: 'absolute', top: '14px', left: '14px', background: pkg.tagColor, color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-body)' }}>{pkg.tag}</div>}
                      </div>
                      <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Clock size={12} color="#9CA3AF" />
                          <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>{pkg.duration}</span>
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1A1A2E', marginBottom: '12px' }}>{pkg.title}</h3>
                        <div style={{ marginBottom: '16px' }}>
                          {pkg.highlights.slice(0, 3).map(h => (
                            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <CheckCircle size={12} color="#10B981" />
                              <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'var(--font-body)' }}>{h}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                          <div>
                            <p style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>Starting from</p>
                            <p style={{ fontSize: '20px', fontWeight: '800', color: '#C8102E', fontFamily: 'var(--font-body)' }}>{pkg.price}</p>
                          </div>
                          <Link to="/contact" className="btn-primary" style={{ padding: '9px 18px', fontSize: '12px' }}>
                            Enquire <ChevronRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRAVEL INFO */}
          {activeTab === 'travel info' && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
              {[
                {
                  title: 'Visa Information',
                  icon: '📄',
                  content: [
                    `Visa Type: ${dest.visa}`,
                    'Documents typically required:',
                    '• Valid passport (6 months validity)',
                    '• Return flight tickets',
                    '• Hotel booking confirmation',
                    '• Bank statement (last 3 months)',
                    '• Travel insurance',
                  ],
                },
                {
                  title: 'Best Time to Visit',
                  icon: '☀️',
                  content: [
                    `Peak Season: ${dest.bestTime}`,
                    `Timezone: ${dest.facts?.timezone || 'GMT+4'}`,
                    `Climate: ${dest.facts?.climate || 'Varies by season'}`,
                    '',
                    'Tip: Book at least 6-8 weeks in advance for peak season travel to secure the best rates.',
                  ],
                },
                {
                  title: 'Currency & Costs',
                  icon: '💰',
                  content: [
                    `Local Currency: ${dest.currency}`,
                    'Credit cards widely accepted',
                    'ATMs available throughout',
                    '',
                    'Budget Range:',
                    '• Budget: ₹40,000–60,000/person',
                    '• Mid-range: ₹70,000–1,20,000/person',
                    '• Luxury: ₹1,50,000+ per person',
                  ],
                },
                {
                  title: 'Getting There',
                  icon: '✈️',
                  content: [
                    'Airlines available:',
                    ...dest.airlines.map(a => `• ${a}`),
                    '',
                    `Capital / Main Airport: ${dest.facts?.capital || dest.country}`,
                    'Direct flights available from major Indian cities.',
                  ],
                },
              ].map((section, i) => (
                <div key={i} style={{ background: '#F8F7F4', borderRadius: '16px', padding: isMobile ? '22px' : '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '28px' }}>{section.icon}</span>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'var(--font-body)' }}>{section.title}</h3>
                  </div>
                  {section.content.map((line, j) => (
                    <p key={j} style={{ fontSize: '14px', color: line === '' ? 'transparent' : '#4B5563', lineHeight: '1.8', fontFamily: 'var(--font-body)', fontWeight: line.startsWith('•') ? '400' : line.includes(':') ? '600' : '400' }}>
                      {line || '·'}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other destinations */}
      <section style={{ padding: '80px 0', background: '#F8F7F4' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', color: '#0A0F1E', marginBottom: '32px', fontFamily: 'var(--font-body)', fontWeight: '700' }}>
            Also Explore
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {['dubai', 'azerbaijan', 'singapore', 'malaysia', 'bali']
              .filter(id => id !== slug)
              .map(id => {
                const d = getDestination(id)
                return (
                  <Link key={id} to={`/destinations/${id}`} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 20px', background: 'white',
                    borderRadius: '12px', border: '1px solid #E5E7EB',
                    transition: 'all 0.2s', color: '#1A1A2E', fontFamily: 'var(--font-body)',
                    fontWeight: '600', fontSize: '14px',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.background = '#FFF5F6' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white' }}
                  >
                    <span style={{ fontSize: '20px' }}>{d.flag}</span>
                    {d.name}
                    <ChevronRight size={14} color="#9CA3AF" />
                  </Link>
                )
              })}
          </div>
        </div>
      </section>
    </main>
  )
}
