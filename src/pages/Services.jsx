import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { services, whyUs } from '../data/services'

const serviceIcons = {
  fit: '✈️',
  groups: '👥',
  mice: '💼',
  honeymoon: '💍',
  visa: '📄',
  transfers: '🚗',
}

export default function Services() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <main>
      {/* Hero */}
      <div
        className="page-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80)', paddingTop: '80px' }}
      >
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Services</span>
          </div>
          <h1>Our Services</h1>
          <p>End-to-end travel solutions for trade partners and direct travellers alike.</p>
        </div>
      </div>

      {/* Intro */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 0', background: 'white' }}>
        <div className="container text-center">
          <span className="tag">Complete Travel Solutions</span>
          <h2 className="section-heading">Everything You Need, Under One Roof</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            From a simple airport transfer to a 500-person incentive program — Anjna Global has the expertise, the network, and the passion to make it happen.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section style={{ padding: '16px 0 clamp(56px, 9vw, 100px)', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {services.map((svc, i) => (
              <div
                key={svc.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '20px' : '80px',
                  alignItems: 'center',
                  padding: isMobile ? '42px 0' : '80px 0',
                  borderBottom: i < services.length - 1 ? '1px solid #F3F4F6' : 'none',
                  direction: !isMobile && i % 2 === 1 ? 'rtl' : 'ltr',
                }}
              >
                {/* Icon block */}
                <div
                  style={{
                    direction: 'ltr',
                    background: 'linear-gradient(135deg, #F8F7F4, #F0EFEC)',
                    borderRadius: '24px',
                    padding: isMobile ? '34px 20px' : '60px 40px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '-20px', right: '-20px',
                    width: isMobile ? '92px' : '120px', height: isMobile ? '92px' : '120px',
                    background: svc.color + '15',
                    borderRadius: '50%',
                  }} />
                  <div style={{
                    fontSize: isMobile ? '58px' : '80px', marginBottom: '24px',
                    filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))',
                    animation: 'float 4s ease-in-out infinite',
                    display: 'inline-block',
                  }}>
                    {serviceIcons[svc.id]}
                  </div>
                  <h3 style={{ fontSize: isMobile ? '24px' : '28px', color: '#0A0F1E', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: svc.color, fontWeight: '700', fontFamily: 'var(--font-body)' }}>
                    {svc.subtitle}
                  </p>
                </div>

                {/* Content */}
                <div style={{ direction: 'ltr' }}>
                  <span className="tag">{svc.subtitle}</span>
                  <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#0A0F1E', marginBottom: '16px' }}>
                    {svc.title}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.8', marginBottom: '28px' }}>
                    {svc.description}
                  </p>
                  <div style={{ marginBottom: '32px' }}>
                    {svc.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <CheckCircle size={18} color={svc.color} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '15px', color: '#374151', fontWeight: '500', fontFamily: 'var(--font-body)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/contact" className="btn-primary">
                    Enquire About This Service <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: '#0A0F1E' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <span className="tag tag-light">Why Anjna Global</span>
            <h2 className="section-heading section-heading-light">The Anjna Advantage</h2>
            <p className="section-sub section-sub-light" style={{ margin: '0 auto' }}>
              What sets us apart from every other DMC in the market.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {whyUs.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '36px 28px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(200,16,46,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '18px', color: 'white', fontFamily: 'var(--font-body)', fontWeight: '700', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: '#C8102E' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '16px' }}>
            Ready to Work Together?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', marginBottom: '32px', fontFamily: 'var(--font-body)' }}>
            Our team is ready to discuss how we can serve your travel business.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-outline-white">Contact Us <ArrowRight size={16} /></Link>
            <Link to="/b2b" style={{ padding: '14px 32px', background: 'white', color: '#C8102E', borderRadius: '4px', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              B2B Partners
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
