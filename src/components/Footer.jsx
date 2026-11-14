import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'
import logoWhite from '../assets/white logo.png'
import './Footer.css'

const SocialIcons = {
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Youtube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  ),
}

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
  { label: 'Tours & Transfers', path: '/services' },
  { label: 'Hotel Partners', path: '/services' },
  { label: 'UAE Visa Assistance', path: '/uae-visa' },
  { label: 'FIT, Groups & MICE', path: '/services' },
]

const socials = [
  { icon: <SocialIcons.Instagram />, href: 'https://www.instagram.com/anjna.global/', label: 'Instagram' },
  { icon: <SocialIcons.Facebook />, href: 'https://www.facebook.com/AnjnaGlobal/', label: 'Facebook' },
  { icon: <SocialIcons.Linkedin />, href: 'https://www.linkedin.com/company/anjna-global/', label: 'LinkedIn' },
  { icon: <SocialIcons.Youtube />, href: 'https://www.youtube.com/channel/UCk4HXXsWgzDDYChAQBqpXfw', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="foot" data-nav="dark">
      <div className="foot__cta wrap">
        <div>
          <p className="eyebrow eyebrow--light">Ready to plan your next trip?</p>
          <h2 className="d-l" data-split>Let&apos;s build <em>something</em> memorable.</h2>
          <p className="foot__cta-sub">Our team replies within one business day.</p>
        </div>
        <div className="foot__cta-actions">
          <Link to="/contact" className="btn" data-magnetic>Contact <ArrowUpRight size={14} aria-hidden /></Link>
          <a href="https://wa.me/919958801627" target="_blank" rel="noreferrer" className="btn btn--ghost" data-magnetic>
            WhatsApp <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>
      </div>

      <div className="foot__grid wrap">
        <div className="foot__brand">
          <img src={logoWhite} alt="Anjna Global" />
          <p>
            Your trusted DMC partner for Dubai, Azerbaijan, Singapore, Malaysia &amp; Bali. Crafting extraordinary travel
            experiences since 2013.
          </p>
          <p className="mono foot__label">Follow us</p>
          <div className="foot__social">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">{s.icon}</a>
            ))}
          </div>
        </div>

        <FootList title="Destinations" items={destinations} />
        <FootList title="Quick Links" items={quickLinks} />
        <FootList title="Our Services" items={services} />

        <div className="foot__contact">
          <h4 className="mono">Contact Us</h4>
          <p><MapPin size={15} aria-hidden /> Plot No. 1, Sector 10A, Gurugram, Haryana 122001, India</p>
          <p><Phone size={15} aria-hidden /> <a href="tel:+911242786999">+91-124-2786999</a></p>
          <p><Phone size={15} aria-hidden /> <a href="tel:+919958801627">+91 99588 01627</a></p>
          <p><Mail size={15} aria-hidden /> <a href="mailto:info@anjnaglobal.com">info@anjnaglobal.com</a></p>

          <div className="foot__office">
            <h4 className="mono">Dubai Office</h4>
            <p><MapPin size={15} aria-hidden /> Anjana Global Tourism LLC — Sabha Building, Jabal Ali, Plot No. 1414-0, Dubai, UAE</p>
            <p><Phone size={15} aria-hidden /> <a href="tel:+971565954997">+971-565954997</a></p>
            <p><Mail size={15} aria-hidden /> <a href="mailto:info@anjnaglobal.com">info@anjnaglobal.com</a></p>
            <p className="foot__licence">Trade Licence No. 773256</p>
          </div>
        </div>
      </div>

      <div className="foot__mark" aria-hidden>Anjna Global</div>

      <div className="foot__bar wrap">
        <p>
          © {new Date().getFullYear()} Anjna Global. All rights reserved. |{' '}
          <em>Fabulously Planned... Remembered Always</em>
        </p>
        <div className="foot__legal">
          {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
            <Link key={item} to="/contact">{item}</Link>
          ))}
          <a href="https://ariyan-0p.github.io/Ariyan-portlio/" target="_blank" rel="noreferrer">
            Powered by <strong>Ariyan Samal</strong>
          </a>
        </div>
      </div>
    </footer>
  )
}

function FootList({ title, items }) {
  return (
    <div className="foot__col">
      <h4 className="mono">{title}</h4>
      <ul>
        {items.map((d) => (
          <li key={d.label}><Link to={d.path}>{d.label}</Link></li>
        ))}
      </ul>
    </div>
  )
}
