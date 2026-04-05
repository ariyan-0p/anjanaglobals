import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react'

const offices = [
  {
    city: 'New Delhi',
    country: 'India (Head Office)',
    address: '123 Travel House, Nehru Place, New Delhi – 110019',
    phone: '+91 98765 43210',
    email: 'info@anjnaglobal.com',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
    flag: '🇮🇳',
  },
  {
    city: 'Dubai',
    country: 'UAE (Operations)',
    address: 'Office 412, Al Barsha Business Centre, Dubai',
    phone: '+971 55 123 4567',
    email: 'dubai@anjnaglobal.com',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM GST',
    flag: '🇦🇪',
  },
]

const enquiryTypes = [
  'FIT / Individual Package',
  'Group Tour Enquiry',
  'MICE / Corporate Event',
  'Honeymoon Package',
  'Visa Assistance',
  'Trade Partner Registration',
  'Other',
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: '1.5px solid #E5E7EB', borderRadius: '8px',
    fontSize: '14px', fontFamily: "'Inter', sans-serif",
    outline: 'none', background: 'white',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    color: '#1A1A2E',
  }

  const labelStyle = {
    fontSize: '12px', fontWeight: '700', color: '#374151',
    letterSpacing: '0.5px', display: 'block', marginBottom: '6px',
    fontFamily: "'Inter', sans-serif",
  }

  const focusStyle = (e) => {
    e.target.style.borderColor = '#C8102E'
    e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.08)'
  }
  const blurStyle = (e) => {
    e.target.style.borderColor = '#E5E7EB'
    e.target.style.boxShadow = 'none'
  }

  return (
    <main>
      {/* Hero */}
      <div
        className="page-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80)', paddingTop: '80px' }}
      >
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Contact Us</span>
          </div>
          <h1>Let's Start Planning</h1>
          <p>Get in touch — our travel experts will respond within 2 hours.</p>
        </div>
      </div>

      {/* Quick contact bar */}
      <div style={{ background: '#C8102E', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <Phone size={16} />, label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: <MessageCircle size={16} />, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
              { icon: <Mail size={16} />, label: 'Email Us', value: 'info@anjnaglobal.com', href: 'mailto:info@anjnaglobal.com' },
              { icon: <Clock size={16} />, label: 'Response Time', value: 'Within 2 Hours', href: null },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)' }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: '15px', color: 'white', fontWeight: '700', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>{item.value}</a>
                  ) : (
                    <p style={{ fontSize: '15px', color: 'white', fontWeight: '700', fontFamily: "'Inter', sans-serif" }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main section */}
      <section style={{ padding: '100px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '80px', alignItems: 'start' }}>

            {/* Form */}
            <div>
              <span className="tag">Send Us a Message</span>
              <h2 className="section-heading">How Can We Help You?</h2>
              <p className="section-sub" style={{ marginBottom: '40px' }}>
                Whether you need a quote, want to plan a trip, or are interested in becoming a trade partner — we're here for you.
              </p>

              {submitted ? (
                <div style={{
                  padding: '48px', background: '#F0FFF4', border: '2px solid #10B981',
                  borderRadius: '16px', textAlign: 'center',
                }}>
                  <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '22px', color: '#065F46', marginBottom: '12px' }}>Message Received!</h3>
                  <p style={{ color: '#047857', fontSize: '15px', lineHeight: '1.7', fontFamily: "'Inter', sans-serif" }}>
                    Thank you for reaching out. Our team will get back to you within 2 hours during business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary"
                    style={{ marginTop: '24px' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>First Name *</label>
                      <input type="text" required placeholder="Your first name" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name *</label>
                      <input type="text" required placeholder="Your last name" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input type="email" required placeholder="you@example.com" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone / WhatsApp *</label>
                      <input type="tel" required placeholder="+91 98765 43210" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Type of Enquiry</label>
                    <select style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
                      {enquiryTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Destination</label>
                      <select style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
                        <option value="">Select destination</option>
                        {['Dubai, UAE', 'Azerbaijan', 'Singapore', 'Malaysia', 'Bali, Indonesia', 'Multiple Destinations'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Number of Travellers</label>
                      <select style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
                        <option>1 – 2 persons</option>
                        <option>3 – 5 persons</option>
                        <option>6 – 15 persons</option>
                        <option>16 – 50 persons</option>
                        <option>50+ persons</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Approximate Travel Dates</label>
                      <input type="text" placeholder="e.g. Dec 2025, flexible" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Budget per Person</label>
                      <select style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}>
                        <option>Under ₹50,000</option>
                        <option>₹50,000 – ₹1,00,000</option>
                        <option>₹1,00,000 – ₹2,00,000</option>
                        <option>₹2,00,000+</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Message / Special Requirements</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your travel plans, any special requirements, or questions you have..."
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '16px', fontSize: '14px' }}>
                    Send Enquiry <ArrowRight size={16} />
                  </button>

                  <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
                    🔒 Your information is safe with us. We never share your data with third parties.
                  </p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Offices */}
              {offices.map((office, i) => (
                <div key={i} style={{ background: '#F8F7F4', borderRadius: '16px', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '28px' }}>{office.flag}</span>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1A1A2E', fontFamily: "'Inter', sans-serif" }}>{office.city}</h3>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: "'Inter', sans-serif" }}>{office.country}</p>
                    </div>
                  </div>
                  {[
                    { icon: <MapPin size={14} />, value: office.address, href: null },
                    { icon: <Phone size={14} />, value: office.phone, href: `tel:${office.phone.replace(/\s/g, '')}` },
                    { icon: <Mail size={14} />, value: office.email, href: `mailto:${office.email}` },
                    { icon: <Clock size={14} />, value: office.hours, href: null },
                  ].map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: j < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                      <span style={{ color: '#C8102E', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                      {item.href ? (
                        <a href={item.href} style={{ fontSize: '14px', color: '#374151', fontFamily: "'Inter', sans-serif", transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#C8102E'}
                          onMouseLeave={e => e.currentTarget.style.color = '#374151'}
                        >{item.value}</a>
                      ) : (
                        <span style={{ fontSize: '14px', color: '#374151', fontFamily: "'Inter', sans-serif", lineHeight: '1.5' }}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919876543210?text=Hi%20Anjna%20Global%2C%20I%27d%20like%20to%20enquire%20about%20a%20trip."
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: '#25D366', borderRadius: '16px', padding: '24px 28px',
                  color: 'white', textDecoration: 'none',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,211,102,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Chat on WhatsApp</p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontFamily: "'Inter', sans-serif" }}>Fastest way to reach us — we're online now!</p>
                </div>
                <ArrowRight size={20} style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </a>

              {/* Assurances */}
              <div style={{ background: '#0A0F1E', borderRadius: '16px', padding: '28px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
                  Our Promise to You
                </p>
                {[
                  '⚡ 2-Hour response guarantee',
                  '🔒 100% secure enquiry process',
                  '💰 No hidden fees, ever',
                  '✅ IATA Accredited & Ministry recognised',
                ].map((item, i) => (
                  <p key={i} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', fontFamily: "'Inter', sans-serif" }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
