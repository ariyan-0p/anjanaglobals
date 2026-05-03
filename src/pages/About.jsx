import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Award, Users, Globe, Heart } from 'lucide-react'

const milestones = [
  { year: '2013', event: 'Anjna Global founded in Gurugram, India — starting with Dubai as our first destination.' },
  { year: '2015', event: 'Expanded operations to Singapore and Malaysia, growing the partner network rapidly.' },
  { year: '2017', event: 'Added Bali (Indonesia) to our portfolio. Crossed 500+ active travel agent partners.' },
  { year: '2019', event: 'IATA Accreditation received. Launched dedicated MICE division for corporate clients.' },
  { year: '2021', event: 'Launched Azerbaijan as a destination. Opened Dubai office at Aspin Commercial Building.' },
  { year: '2025', event: 'Crossed 2500+ travel partners across India and 700+ directly contracted hotels across all five destinations.' },
]

const team = [
  { name: 'Anjana Sharma', role: 'Founder & Managing Director', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', bio: 'Visionary leader who built Anjna Global from a single-destination DMC into a five-destination powerhouse trusted across India.' },
  { name: 'Rajesh Kumar', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', bio: 'Ensures every booking runs with military precision. Rajesh and his team manage 200+ groups annually across all five destinations.' },
  { name: 'Priya Nair', role: 'Director — B2B Sales', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', bio: 'The driving force behind our partner network. Priya has built relationships with 2500+ travel agencies across India and abroad.' },
  { name: 'Arjun Mehta', role: 'Head of MICE', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Corporate events specialist with a flair for the dramatic. From intimate boardrooms to 500-person gala dinners — Arjun delivers.' },
]

const values = [
  { icon: '🤝', title: 'Integrity First', desc: 'Transparent pricing, honest communication, and zero hidden surprises — always.' },
  { icon: '⚡', title: 'Speed & Reliability', desc: 'We know time is money. 2-hour quote response, 24/7 ops support, no delays.' },
  { icon: '🌟', title: 'Excellence in Every Detail', desc: 'From the first airport transfer to the farewell dinner — we sweat every detail so your clients don\'t have to.' },
  { icon: '🌍', title: 'Local Expertise', desc: 'Our on-ground teams in every destination bring insider knowledge that no handbook can replicate.' },
  { icon: '💡', title: 'Innovation', desc: 'Always evolving. New destinations, new products, new technology — we keep our partners ahead of the curve.' },
  { icon: '❤️', title: 'Passion for Travel', desc: 'We don\'t just sell trips. We craft stories. Every itinerary is built with genuine love for the destination.' },
]

export default function About() {
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
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)' }}
      >
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>About Us</span>
          </div>
          <h1>Our Story</h1>
          <p>Over a decade of crafting extraordinary travel experiences across the Middle East & Asia.</p>
        </div>
      </div>

      {/* Intro */}
      <section style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '28px' : '80px', alignItems: 'center' }}>
            <div>
              <span className="tag">Who We Are</span>
              <h2 className="section-heading">
                A Decade of Fabulously Planned Journeys
              </h2>
              <p style={{ fontSize: '17px', color: '#374151', lineHeight: '1.8', marginBottom: '20px' }}>
                Founded in 2013, <strong>Anjna Global</strong> is a premier Destination Management Company (DMC) headquartered in Gurugram, India, with offices in Dubai and Ahmedabad. We specialise in creating bespoke travel experiences across five extraordinary destinations — Dubai, Azerbaijan, Singapore, Malaysia, and Bali.
              </p>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '32px' }}>
                Our tagline <em>"Fabulously Planned... Remembered Always"</em> isn't just marketing — it's a promise we make to every travel partner and every traveller who chooses to experience the world through us. We serve both the B2B trade community and discerning direct travellers who seek something beyond the ordinary.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginBottom: '30px' }}>
                {[
                  { icon: <Award size={20} />, label: 'Since 2013', sub: 'of Excellence' },
                  { icon: <Globe size={20} />, label: '5 Destinations', sub: 'across 4 countries' },
                  { icon: <Users size={20} />, label: '2500+ Partners', sub: 'across India' },
                  { icon: <Heart size={20} />, label: '700+ Hotels', sub: 'directly contracted' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#F8F7F4', borderRadius: '10px' }}>
                    <div style={{ color: '#C8102E', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '18px', color: '#1A1A2E', fontFamily: 'var(--font-body)' }}>{item.label}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn-primary">
                Partner With Us <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                height: isMobile ? '340px' : '500px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '20px',
                boxShadow: '0 30px 70px rgba(0,0,0,0.2)',
              }} />
              {/* Floating card */}
              <div style={{
                position: isMobile ? 'relative' : 'absolute',
                bottom: isMobile ? 'auto' : '-24px',
                left: isMobile ? 'auto' : '-24px',
                marginTop: isMobile ? '14px' : 0,
                background: '#C8102E',
                padding: isMobile ? '18px 20px' : '24px 28px',
                borderRadius: '16px',
                color: 'white',
                boxShadow: '0 20px 50px rgba(200,16,46,0.35)',
              }}>
                <p style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'var(--font-body)', lineHeight: 1 }}>2013</p>
                <p style={{ fontSize: '14px', opacity: 0.85, marginTop: '4px' }}>Trusted Since</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: '#F8F7F4' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '56px' }}>
            <span className="tag">Our Values</span>
            <h2 className="section-heading">What Drives Us Every Day</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              These aren't words on a wall — they're the principles that guide every booking, every call, and every journey we plan.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  background: 'white', borderRadius: '16px', padding: '36px 28px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{v.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', marginBottom: '10px', fontFamily: 'var(--font-body)' }}>{v.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.7' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '56px' }}>
            <span className="tag">Our Journey</span>
            <h2 className="section-heading">Our Journey So Far</h2>
          </div>
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            {/* Line */}
            {!isMobile && <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#E5E7EB', transform: 'translateX(-50%)' }} />}
            {milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex', gap: isMobile ? '12px' : '40px', marginBottom: isMobile ? '28px' : '48px',
                flexDirection: isMobile ? 'row' : (i % 2 === 0 ? 'row' : 'row-reverse'),
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, textAlign: isMobile ? 'left' : (i % 2 === 0 ? 'right' : 'left'), paddingTop: '4px' }}>
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7' }}>{m.event}</p>
                </div>
                <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C8102E, #1D3461)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '800', fontSize: '11px',
                    fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px rgba(200,16,46,0.35)',
                  }}>
                    {m.year.slice(2)}
                  </div>
                </div>
                <div style={{ flex: 1, paddingTop: '4px', display: isMobile ? 'none' : 'block' }}>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#C8102E', fontFamily: 'var(--font-body)', opacity: i % 2 === 1 ? 1 : 0 }}>
                    {i % 2 === 1 ? m.year : ''}
                  </span>
                  {i % 2 === 0 && <span style={{ fontSize: '28px', fontWeight: '900', color: '#C8102E', fontFamily: 'var(--font-body)' }}>{m.year}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: '#F8F7F4' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '56px' }}>
            <span className="tag">Our People</span>
            <h2 className="section-heading">The Team Behind the Magic</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              A passionate team of travel professionals dedicated to delivering extraordinary experiences — every single time.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            {team.map((member, i) => (
              <div
                key={i}
                style={{
                  background: 'white', borderRadius: '20px', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)' }}
              >
                <div style={{ height: '260px', overflow: 'hidden' }}>
                  <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>{member.name}</h3>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#C8102E', letterSpacing: '0.5px', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>{member.role}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.65' }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #C8102E 0%, #8B0A1F 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '16px' }}>
            Ready to Experience the Anjna Difference?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', marginBottom: '32px', fontFamily: 'var(--font-body)' }}>
            Partner with us or plan your next journey — we're ready when you are.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-outline-white">Get in Touch <ArrowRight size={16} /></Link>
            <Link to="/destinations" style={{ padding: '14px 32px', background: 'white', color: '#C8102E', borderRadius: '4px', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
