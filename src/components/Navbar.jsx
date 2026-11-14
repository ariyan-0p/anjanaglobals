import { useState, useEffect, useRef, startTransition } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Phone, ArrowUpRight } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { scrollToTop } from '../motion/lenis'
import { lockScroll, unlockScroll } from '../motion/scrollLock'
import logoColor from '../assets/Anjna Global Logo final.png'
import './Navbar.css'

const navLinks = [
  { label: 'Home', path: '/', end: true },
  { label: 'About', path: '/about' },
  {
    label: 'Destinations',
    path: '/destinations',
    children: [
      { label: 'Dubai', flag: '🇦🇪', path: '/destinations/dubai' },
      { label: 'Azerbaijan', flag: '🇦🇿', path: '/destinations/azerbaijan' },
      { label: 'Singapore', flag: '🇸🇬', path: '/destinations/singapore' },
      { label: 'Malaysia', flag: '🇲🇾', path: '/destinations/malaysia' },
      { label: 'Bali', flag: '🇮🇩', path: '/destinations/bali' },
    ],
  },
  { label: 'Services', path: '/services' },
  { label: 'Packages', path: '/packages' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Blog', path: '/blog' },
  { label: 'B2B', path: '/b2b', title: 'B2B Partners' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [dd, setDd] = useState(false)
  const location = useLocation()
  const menu = useRef(null)
  const ddTimer = useRef(null)
  const lastY = useRef(0)
  const didMount = useRef(false)

  /* Theme under the header + hide-on-scroll-down */
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      const y = window.scrollY
      setAtTop(y < 40)
      const dy = y - lastY.current
      if (y < 160) setHidden(false)
      else if (dy > 4) setHidden(true)
      else if (dy < -4) setHidden(false)
      lastY.current = y
      const stack = document.elementsFromPoint(window.innerWidth / 2, 36)
      const host = stack.find((el) => !el.closest('.nav') && el.closest('[data-nav]'))
      setDark(host ? host.closest('[data-nav]').dataset.nav === 'dark' : false)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Lazy pages mount after this effect — re-check as content arrives.
    const timers = [60, 300, 800, 1600, 3200].map((ms) => setTimeout(check, ms))
    check()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [location.pathname])

  useEffect(() => { startTransition(() => { setOpen(false); setDd(false) }) }, [location.pathname, location.search])

  /* Full-screen menu choreography */
  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return }
    const el = menu.current
    if (!el) return
    if (prefersReducedMotion()) { el.style.visibility = open ? 'visible' : 'hidden'; return }
    if (open) {
      lockScroll()
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
      gsap.fromTo('.menu__link span', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: 'expo.out', delay: 0.35 })
      gsap.fromTo('.menu__aside > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.6 })
    } else {
      unlockScroll()
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.8,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(el, { visibility: 'hidden' }),
      })
    }
  }, [open])

  // Any tap inside the menu closes it. A tap on the page you're already on changes no route,
  // so without this the menu (and its scroll lock) would stay open; scroll to the top instead.
  const closeMenu = (to) => {
    setOpen(false)
    if (to && to === location.pathname) scrollToTop(false)
  }

  const enter = () => { clearTimeout(ddTimer.current); setDd(true) }
  const leave = () => { ddTimer.current = setTimeout(() => setDd(false), 160) }

  const cls = ['nav']
  if (dark && !open) cls.push('nav--dark')
  if (open) cls.push('nav--open')
  if (hidden === true && !open) cls.push('nav--hidden')
  if (!atTop) cls.push('nav--solid')

  return (
    <>
      <header className={cls.join(' ')}>
        <div className="nav__bar">
          <Link to="/" className="nav__brand" aria-label="Anjna Global — home">
            <img src={logoColor} alt="Anjna Global" height="40" />
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.path} className="nav__item" onMouseEnter={enter} onMouseLeave={leave}>
                  <NavLink to={link.path} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
                    {link.label}
                    <ChevronDown size={13} aria-hidden className={dd ? 'is-flip' : ''} />
                  </NavLink>
                  <div className={`nav__dd${dd ? ' is-open' : ''}`} onMouseEnter={enter} onMouseLeave={leave}>
                    <p className="mono">Destinations</p>
                    {link.children.map((c) => (
                      <Link key={c.path} to={c.path} className="nav__dd-link">
                        <span>{c.flag}</span>{c.label}<ArrowUpRight size={15} aria-hidden />
                      </Link>
                    ))}
                    <Link to="/destinations" className="nav__dd-all">View all destinations →</Link>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end === true}
                  title={link.title}
                  className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="nav__tail">
            <a href="tel:+911242786999" className="nav__phone" aria-label="Call +91-124-2786999">
              <Phone size={14} strokeWidth={1.8} aria-hidden /> +91-124-2786999
            </a>
            <Link to="/contact" className="btn btn--sm nav__cta">Get a quote <ArrowUpRight size={14} aria-hidden /></Link>
            <button
              type="button"
              className={`nav__burger${open ? ' is-open' : ''}`}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className="menu" ref={menu} aria-hidden={!open} data-lenis-prevent style={{ visibility: 'hidden' }}>
        <div className="menu__inner">
          <nav className="menu__nav" aria-label="Mobile">
            {navLinks.map((l, i) => (
              <Link key={l.path} to={l.path} className="menu__link" title={l.title} tabIndex={open ? 0 : -1} onClick={() => closeMenu(l.path)}>
                <i>{String(i + 1).padStart(2, '0')}</i>
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>
          <aside className="menu__aside">
            <p className="mono">Destinations</p>
            <ul>
              {navLinks[2].children.map((c) => (
                <li key={c.path}><Link to={c.path} tabIndex={open ? 0 : -1} onClick={() => closeMenu(c.path)}>{c.flag} {c.label}</Link></li>
              ))}
            </ul>
            <p className="mono">Talk to us</p>
            <a href="tel:+911242786999" tabIndex={open ? 0 : -1} onClick={() => closeMenu()}>+91-124-2786999</a>
            <a href="mailto:info@anjnaglobal.com" tabIndex={open ? 0 : -1} onClick={() => closeMenu()}>info@anjnaglobal.com</a>
            <a href="https://wa.me/919958801627" target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} onClick={() => closeMenu()}>WhatsApp ↗</a>
            <Link to="/contact" className="btn btn--light" tabIndex={open ? 0 : -1} onClick={() => closeMenu("/contact")}>Get a quote <ArrowUpRight size={14} aria-hidden /></Link>
          </aside>
        </div>
      </div>
    </>
  )
}
