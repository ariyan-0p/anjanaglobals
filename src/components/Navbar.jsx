import { useState, useEffect, useRef, startTransition } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import logoColor from '../assets/Anjna Global Logo final.png'
import './Navbar.css'

const navLinks = [
  { label: 'Home', path: '/', end: true },
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
  { label: 'B2B', path: '/b2b', title: 'B2B Partners' },
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
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false)
      setMobileExpanded(null)
      setActiveDropdown(null)
    })
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
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 180)
  }

  /* Same full lockup (AG + wordmark + tagline) everywhere; hero renders it white via CSS */
  const lightNav = !transparent
  const logoHeight = transparent ? 48 : 40

  return (
    <>
      <nav
        className={`site-nav ${transparent ? 'site-nav--hero' : 'site-nav--light'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div className={`site-nav__bar site-nav__inner${transparent ? ' site-nav__inner--hero' : ''}`}>
          <Link to="/" className="site-nav__brand">
            <img
              src={logoColor}
              alt="Anjna Global"
              height={logoHeight}
              style={{ height: logoHeight, width: 'auto' }}
            />
          </Link>

          <div className="site-nav__links">
            {navLinks.map(link => (
              <div
                key={link.path}
                className="site-nav__dropdown-wrap"
                onMouseEnter={() => link.children && handleMouseEnter(link.label)}
                onMouseLeave={() => link.children && handleMouseLeave()}
              >
                <NavLink
                  to={link.path}
                  end={link.end === true}
                  title={link.title}
                  className={({ isActive }) =>
                    `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
                  }
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      size={14}
                      aria-hidden
                      style={{
                        opacity: 0.75,
                        transition: 'transform 0.2s ease',
                        transform: activeDropdown === link.label ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  )}
                </NavLink>

                {link.children && activeDropdown === link.label && (
                  <div
                    className={`site-nav__dropdown${lightNav ? ' site-nav__dropdown--light' : ''}`}
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="site-nav__dropdown-label">Destinations</div>
                    {link.children.map(child => (
                      <Link key={child.path} to={child.path} className="site-nav__dropdown-link">
                        {child.label}
                      </Link>
                    ))}
                    <div className="site-nav__dropdown-footer">
                      <Link to="/destinations" className="site-nav__dropdown-all">
                        View all →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="site-nav__tail">
            <div className="site-nav__actions">
              <a
                href="tel:+919876543210"
                className="site-nav__phone"
                aria-label="Call +91 98765 43210"
              >
                <Phone size={16} strokeWidth={1.75} aria-hidden />
                +91&nbsp;98765&nbsp;43210
              </a>
              <Link to="/contact" className="btn-primary site-nav__cta" style={{ padding: '10px 18px', fontSize: '14px' }}>
                Get a quote
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(o => !o)}
              className="site-nav__mobile-toggle"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(10,15,30,0.98)',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '100px',
            animation: 'fadeIn 0.25s ease',
            overflowY: 'auto',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navLinks.map(link => (
              <div key={link.path}>
                {link.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        color: 'white',
                        fontSize: '17px',
                        fontWeight: '500',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {link.label}
                      <ChevronDown
                        size={18}
                        style={{
                          transform: mobileExpanded === link.label ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>
                    {mobileExpanded === link.label && (
                      <div style={{ paddingLeft: '12px', paddingBottom: '8px' }}>
                        {link.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            style={{
                              display: 'block',
                              padding: '12px 0',
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '15px',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                            }}
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
                    end={link.end === true}
                    title={link.title}
                    style={{
                      display: 'block',
                      padding: '16px 0',
                      color: 'white',
                      fontSize: '17px',
                      fontWeight: '500',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="tel:+919876543210" className="site-nav__phone" style={{ justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Phone size={18} aria-hidden />
                +91 98765 43210
              </a>
              <Link to="/contact" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                Get a quote
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: '#25D366',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
