import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import logoColor from '../assets/Anjna Global Logo final.png'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Destinations',
    path: '/destinations',
    children: [
      { label: '🇦🇪 Dubai', path: '/destinations/dubai' },
      { label: '🇦🇿 Azerbaijan', path: '/destinations/azerbaijan' },
      { label: '🇸🇬 Singapore', path: '/destinations/singapore' },
      { label: '🇲🇾 Malaysia', path: '/destinations/malaysia' },
      { label: '🇮🇩 Bali', path: '/destinations/bali' },
    ],
  },
  { label: 'Services', path: '/services' },
  { label: 'Packages', path: '/packages' },
  { label: 'B2B Partners', path: '/b2b' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const location = useLocation()
  const dropdownTimeout = useRef(null)

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMobileExpanded(null)
    setActiveDropdown(null)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleMouseEnter = (label) => {
    clearTimeout(dropdownTimeout.current)
    setActiveDropdown(label)
  }
  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const navBg = transparent
    ? 'transparent'
    : 'rgba(10, 15, 30, 0.96)'

  const logoFilter = transparent ? 'brightness(0) invert(1)' : 'none'

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: navBg,
        backdropFilter: transparent ? 'none' : 'blur(16px)',
        borderBottom: transparent ? 'none' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.4s ease',
        padding: transparent ? '18px 0' : '0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: transparent ? 'auto' : '70px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logoColor}
              alt="Anjna Global"
              style={{
                height: transparent ? '54px' : '40px',
                width: 'auto',
                transition: 'all 0.4s ease',
                filter: logoFilter,
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map(link => (
              <div
                key={link.path}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.children && handleMouseEnter(link.label)}
                onMouseLeave={() => link.children && handleMouseLeave()}
              >
                <NavLink
                  to={link.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 14px',
                    color: isActive ? '#C8102E' : 'rgba(255,255,255,0.88)',
                    fontSize: '13.5px',
                    fontWeight: '500',
                    letterSpacing: '0.3px',
                    transition: 'color 0.25s',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    borderRadius: '6px',
                  })}
                  onMouseEnter={e => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.color = '#ffffff'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {link.label}
                  {link.children && <ChevronDown size={13} style={{ opacity: 0.6, transition: 'transform 0.2s', transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0)' }} />}
                </NavLink>

                {/* Dropdown */}
                {link.children && activeDropdown === link.label && (
                  <div
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(10, 15, 30, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '10px',
                      padding: '8px 0',
                      minWidth: '210px',
                      boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                      animation: 'slideDown 0.2s ease',
                      zIndex: 10,
                    }}
                  >
                    <div style={{ padding: '8px 16px 6px', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                      Our Destinations
                    </div>
                    {link.children.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        style={{
                          display: 'block',
                          padding: '10px 16px',
                          color: 'rgba(255,255,255,0.75)',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s',
                          borderRadius: '0',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#ffffff'
                          e.currentTarget.style.background = 'rgba(200,16,46,0.15)'
                          e.currentTarget.style.paddingLeft = '22px'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.paddingLeft = '16px'
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                    <div style={{ margin: '8px 16px 4px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <Link
                        to="/destinations"
                        style={{ fontSize: '12px', color: '#C8102E', fontWeight: '600', letterSpacing: '0.5px' }}
                      >
                        View All Destinations →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)', margin: '0 8px' }} />

            <a
              href="tel:+919876543210"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              <Phone size={14} />
              +91 98765 43210
            </a>

            <Link to="/contact" className="btn-primary" style={{ padding: '10px 22px', fontSize: '12px', marginLeft: '4px' }}>
              Get a Quote
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="mobile-menu-btn"
            style={{ color: 'white', padding: '8px', display: 'none' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(10,15,30,0.98)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '80px',
          animation: 'fadeIn 0.25s ease',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navLinks.map(link => (
              <div key={link.path}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '16px 0', color: 'white', fontSize: '18px', fontFamily: "'Playfair Display', serif",
                        borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'none',
                      }}
                    >
                      {link.label}
                      <ChevronDown size={18} style={{ transform: mobileExpanded === link.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {mobileExpanded === link.label && (
                      <div style={{ paddingLeft: '16px', paddingBottom: '8px' }}>
                        {link.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            style={{ display: 'block', padding: '12px 0', color: 'rgba(255,255,255,0.65)', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    style={{ display: 'block', padding: '16px 0', color: 'white', fontSize: '18px', fontFamily: "'Playfair Display', serif", borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/contact" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                Get a Quote
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', background: '#25D366', color: 'white', borderRadius: '4px',
                fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
              }}>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
