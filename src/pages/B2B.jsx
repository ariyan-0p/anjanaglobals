import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Clock, Award, Headphones, Shield } from 'lucide-react'

const partnerBenefits = [
  {
    icon: <TrendingUp size={24} />,
    title: 'Competitive Net Rates',
    desc: 'Direct contracts with leading hotels, airlines, and attractions mean you get the best margins in the market — every time.',
    color: '#C8102E',
  },
  {
    icon: <Clock size={24} />,
    title: '2-Hour Quote Response',
    desc: 'We know speed is everything in travel sales. Our operations team guarantees quotes within 2 business hours.',
    color: '#1D3461',
  },
  {
    icon: <Users size={24} />,
    title: 'Dedicated BDM Support',
    desc: 'Every partner gets a dedicated Business Development Manager who knows your business and is available when you need them.',
    color: '#B8963E',
  },
  {
    icon: <Shield size={24} />,
    title: 'Reliable Operations',
    desc: '20+ years of on-ground experience. Our local teams in every destination ensure zero hiccups — from arrival to departure.',
    color: '#7C3AED',
  },
  {
    icon: <Award size={24} />,
    title: 'Pre-Allocated Inventory',
    desc: 'As a registered partner, get access to pre-allocated hotel rooms and attraction tickets during peak season.',
    color: '#059669',
  },
  {
    icon: <Headphones size={24} />,
    title: '24/7 Emergency Support',
    desc: 'Round-the-clock emergency helpline for all live operations. Your travellers are never stranded, never without help.',
    color: '#DB2777',
  },
]

const partnerTypes = [
  { icon: '✈️', title: 'Travel Agents', desc: 'Retail and online travel agents building FIT and package portfolios' },
  { icon: '🏢', title: 'Tour Operators', desc: 'Wholesale operators looking for reliable DMC services across our destinations' },
  { icon: '💼', title: 'Corporate Travel', desc: 'Corporate travel managers and MICE buyers planning incentive trips and events' },
  { icon: '🌍', title: 'Inbound Operators', desc: 'International operators seeking a trusted India-based DMC partner' },
]

const destinations = ['🇦🇪 Dubai', '🇦🇿 Azerbaijan', '🇸🇬 Singapore', '🇲🇾 Malaysia', '🇮🇩 Bali']

export default function B2B() {
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
      <div style={{
        minHeight: isMobile ? '440px' : '500px',
        background: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80) center/cover no-repeat',
        position: 'relative', display: 'flex', alignItems: 'flex-end', paddingBottom: isMobile ? '44px' : '60px', paddingTop: '80px',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,15,30,0.9) 0%, rgba(29,52,97,0.85) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, color: 'white' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>B2B Partners</span>
          </div>
          <div style={{ maxWidth: '600px' }}>
            <span className="tag tag-light" style={{ marginBottom: '16px' }}>For Travel Professionals</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '900', marginBottom: '16px' }}>
              Your Trusted DMC Partner
            </h1>
              <p style={{ fontSize: isMobile ? '16px' : '18px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.7', marginBottom: '32px', fontFamily: 'var(--font-body)' }}>
              Join 500+ travel agencies and operators who rely on Anjna Global for competitive rates, seamless operations, and on-ground excellence across 5 destinations.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#register" className="btn-primary" style={{ padding: '15px 34px' }}>
                Become a Partner <ArrowRight size={16} />
              </a>
              <Link to="/contact" className="btn-outline-white" style={{ padding: '14px 34px' }}>
                Get Trade Rates
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: '#C8102E', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            {[
              { value: '500+', label: 'Active Partners' },
              { value: '20+', label: 'Years of Trust' },
              { value: '2hr', label: 'Quote Response' },
              { value: '98%', label: 'Partner Satisfaction' },
              { value: '5', label: 'Destinations' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', color: 'white' }}>
                <p style={{ fontSize: '28px', fontWeight: '900', fontFamily: 'var(--font-body)', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', fontFamily: 'var(--font-body)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <span className="tag">Partner Benefits</span>
            <h2 className="section-heading">Why Top Agencies Choose Anjna Global</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              We don't just handle bookings — we become an extension of your business, committed to your success.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {partnerBenefits.map((b, i) => (
              <div
                key={i}
                style={{
                  padding: '36px 28px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  background: 'white',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = b.color
                  e.currentTarget.style.boxShadow = `0 12px 30px ${b.color}20`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E5E7EB'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <div style={{ color: b.color, marginBottom: '16px', width: '48px', height: '48px', background: b.color + '15', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1A1A2E', marginBottom: '10px', fontFamily: 'var(--font-body)' }}>{b.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.7' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: '#F8F7F4' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '28px' : '80px', alignItems: 'center' }}>
            <div>
              <span className="tag">Who We Work With</span>
              <h2 className="section-heading">Built for Travel Professionals</h2>
              <p className="section-sub" style={{ marginBottom: '32px' }}>
                Whether you're a retail agent, wholesale operator, corporate travel manager, or inbound tour operator — we have a partnership model tailored for you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                {partnerTypes.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '28px', flexShrink: 0 }}>{t.icon}</div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>{t.title}</h4>
                      <p style={{ fontSize: '13px', color: '#6B7280' }}>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* Destinations coverage */}
              <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '24px' : '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
                  Destinations We Cover
                </h3>
                {destinations.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none' }}>
                    <CheckCircle size={16} color="#10B981" />
                    <span style={{ fontSize: '15px', color: '#1A1A2E', fontFamily: 'var(--font-body)', fontWeight: '600' }}>{d}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6B7280', fontFamily: 'var(--font-body)' }}>Full DMC Services</span>
                  </div>
                ))}
              </div>

              {/* Accreditation */}
              <div style={{ background: 'linear-gradient(135deg, #0A0F1E, #1D3461)', borderRadius: '20px', padding: isMobile ? '24px' : '32px', color: 'white' }}>
                <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                  Accreditations
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['🏆 IATA Accredited Agency', '🤝 TAAI Member', '🇮🇳 Ministry of Tourism Recognised', '⭐ 20+ Years in Industry'].map((a, i) => (
                    <p key={i} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>{a}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" style={{ padding: 'clamp(56px, 9vw, 100px) 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '28px' : '80px', alignItems: 'start' }}>
            <div>
              <span className="tag">Join Our Network</span>
              <h2 className="section-heading">Register as a Trade Partner</h2>
              <p className="section-sub" style={{ marginBottom: '32px' }}>
                Fill in your details and our B2B team will reach out within 24 hours to set up your trade account with access to our net rates and partner portal.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Access to exclusive net rates',
                  'Dedicated account manager',
                  'Priority booking during peak season',
                  'Marketing support and co-op materials',
                  'Familiarisation trips for top partners',
                  'Monthly destination newsletters & updates',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={16} color="#C8102E" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#374151', fontFamily: 'var(--font-body)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#F8F7F4', borderRadius: '20px', padding: isMobile ? '26px 20px' : '48px 40px' }}>
              <h3 style={{ fontSize: '22px', color: '#0A0F1E', marginBottom: '28px', fontFamily: 'var(--font-body)' }}>
                Partner Registration
              </h3>
              <PartnerForm isMobile={isMobile} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function PartnerForm({ isMobile }) {
  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: '1.5px solid #E5E7EB', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'var(--font-body)',
    outline: 'none', background: 'white',
    transition: 'border-color 0.2s',
  }

  const focusStyle = (e) => { e.target.style.borderColor = '#C8102E' }
  const blurStyle = (e) => { e.target.style.borderColor = '#E5E7EB' }

  return (
    <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
            First Name *
          </label>
          <input type="text" placeholder="Rahul" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} required />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
            Last Name *
          </label>
          <input type="text" placeholder="Sharma" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} required />
        </div>
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
          Company / Agency Name *
        </label>
        <input type="text" placeholder="Sunshine Travels Pvt Ltd" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} required />
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
          Business Email *
        </label>
        <input type="email" placeholder="sales@sunshinetravels.com" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} required />
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
          Phone / WhatsApp *
        </label>
        <input type="tel" placeholder="+91 98765 43210" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} required />
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
          Destinations of Interest
        </label>
        <select style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
          <option value="">Select destination(s)</option>
          <option>Dubai, UAE</option>
          <option>Azerbaijan</option>
          <option>Singapore</option>
          <option>Malaysia</option>
          <option>Bali, Indonesia</option>
          <option>All Destinations</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
          How did you hear about us?
        </label>
        <textarea rows={3} placeholder="Google, referral, trade fair, etc." style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusStyle} onBlur={blurStyle} />
      </div>
      <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '16px', marginTop: '4px' }}>
        Submit Registration <ArrowRight size={16} />
      </button>
      <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
        Our B2B team will contact you within 24 hours.
      </p>
    </form>
  )
}
