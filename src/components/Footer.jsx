import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

const SocialIcons = {
  Instagram: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Facebook: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Linkedin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Youtube: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  ),
}
import logoColor from '../assets/Anjna Global Logo final.png'

const destinations = [
  { label: 'Dubai, UAE', path: '/destinations/dubai' },
  { label: 'Azerbaijan', path: '/destinations/azerbaijan' },
  { label: 'Singapore', path: '/destinations/singapore' },
  { label: 'Malaysia', path: '/destinations/malaysia' },
  { label: 'Bali, Indonesia', path: '/destinations/bali' },
]

const quickLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Our Services', path: '/services' },
  { label: 'Tour Packages', path: '/packages' },
  { label: 'B2B Partners', path: '/b2b' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Get a Quote', path: '/contact' },
]

const services = [
  'FIT Packages',
  'Group Tours',
  'MICE & Events',
  'Honeymoon Specials',
  'Visa Assistance',
  'Airport Transfers',
]

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <footer style={{ background: '#060D1F', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)' }}>
      {/* Top CTA strip */}
      <div style={{
        background: 'linear-gradient(135deg, #0F1C3A 0%, #1D3461 50%, #152a4a 100%)',
        padding: '22px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '18px', fontFamily: 'var(--font-body)', color: 'white', fontWeight: '600', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              Ready to plan your next trip?
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
              Our team replies within one business day.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              padding: '11px 22px', background: '#C8102E', color: 'white',
              borderRadius: '8px', fontSize: '14px', fontWeight: '600',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              Contact <ArrowRight size={14} />
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '11px 22px', background: 'rgba(255,255,255,0.1)',
                color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: isMobile ? '42px 0 30px' : '56px 32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: isMobile ? '28px 20px' : '40px 32px' }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <img
              src={logoColor}
              alt="Anjna Global"
              style={{ height: '44px', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '20px' }}
            />
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'rgba(255,255,255,0.55)', marginBottom: '24px', maxWidth: '280px' }}>
              Your trusted DMC partner for Dubai, Azerbaijan, Singapore, Malaysia & Bali. Crafting extraordinary travel experiences since 2003.
            </p>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
              Follow Us
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: <SocialIcons.Instagram />, href: '#', label: 'Instagram' },
                { icon: <SocialIcons.Facebook />, href: '#', label: 'Facebook' },
                { icon: <SocialIcons.Linkedin />, href: '#', label: 'LinkedIn' },
                { icon: <SocialIcons.Youtube />, href: '#', label: 'YouTube' },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.6)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#C8102E'
                    e.currentTarget.style.borderColor = '#C8102E'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
              Destinations
            </h4>
            <ul style={{ listStyle: 'none' }}>
              {destinations.map(d => (
                <li key={d.path} style={{ marginBottom: '10px' }}>
                  <Link
                    to={d.path}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C8102E'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    <ArrowRight size={12} style={{ opacity: 0.4 }} />
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none' }}>
              {quickLinks.map(l => (
                <li key={l.label} style={{ marginBottom: '10px' }}>
                  <Link
                    to={l.path}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C8102E'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    <ArrowRight size={12} style={{ opacity: 0.4 }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
              Our Services
            </h4>
            <ul style={{ listStyle: 'none' }}>
              {services.map(s => (
                <li key={s} style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.55)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={12} style={{ opacity: 0.4 }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  icon: <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px' }} />,
                  text: '123 Travel House, Nehru Place, New Delhi – 110019, India',
                },
                {
                  icon: <Phone size={15} style={{ flexShrink: 0 }} />,
                  text: '+91 98765 43210',
                  href: 'tel:+919876543210',
                },
                {
                  icon: <Mail size={15} style={{ flexShrink: 0 }} />,
                  text: 'info@anjnaglobal.com',
                  href: 'mailto:info@anjnaglobal.com',
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>
                  <span style={{ color: '#C8102E' }}>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                    >{item.text}</a>
                  ) : (
                    <span style={{ lineHeight: '1.6' }}>{item.text}</span>
                  )}
                </div>
              ))}

              {/* IATA / Accreditations */}
              <div style={{ marginTop: '8px', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>
                  Accredited By
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                  IATA Accredited · TAAI Member<br />Ministry of Tourism (India) Recognised
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'space-between', flexWrap: 'wrap', gap: '12px', textAlign: isMobile ? 'center' : 'left' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Anjna Global. All rights reserved. |{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.25)' }}>Fabulously Planned... Remembered Always</span>
          </p>
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(item => (
              <Link
                key={item}
                to="/contact"
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
