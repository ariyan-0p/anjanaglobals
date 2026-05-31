import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import './DestinationB2BBrief.css'

/**
 * Generic B2B-targeted block for a destination page.
 * Sections (in order, each is optional):
 *   1. Hero: title + subtitle
 *   2. Services: array of { icon, title, desc }
 *   3. Trust points: array of { title, desc }
 *   4. Top products: array of { name, duration, includes, price }
 *   5. Sample itineraries: array of { name, nights, price }
 */
export default function DestinationB2BBrief({
  hero,
  services = [],
  trustHeading = 'Why our rates are better',
  trustPoints = [],
  productsHeading = 'Top selling products',
  products = [],
  itinerariesHeading = 'Sample itineraries — ready to quote',
  itineraries = [],
  ctaHref = '/contact',
  ctaLabel = 'Get B2B rates',
}) {
  return (
    <div className="d-brief">
      <div className="container d-brief__inner">
        {/* 1. Hero card */}
        {hero ? (
          <section className="d-brief__hero" aria-label={hero.title}>
            <h2>{hero.title}</h2>
            {hero.subtitle ? <p>{hero.subtitle}</p> : null}
            <Link to={ctaHref} className="d-brief__hero-cta">
              {ctaLabel} <ArrowRight size={15} aria-hidden />
            </Link>
          </section>
        ) : null}

        {/* 2. Services (what we do) */}
        {services.length > 0 ? (
          <section className="d-brief__section">
            <header className="d-brief__head">
              <p className="d-brief__eyebrow">What we do for travel agents</p>
            </header>
            <div className="d-brief__service-grid">
              {services.map((s) => (
                <article key={s.title} className="d-brief__service">
                  {s.icon ? <span className="d-brief__service-icon" aria-hidden>{s.icon}</span> : null}
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* 3. Trust / pricing differentiators */}
        {trustPoints.length > 0 ? (
          <section className="d-brief__section d-brief__section--trust">
            <header className="d-brief__head">
              <p className="d-brief__eyebrow d-brief__eyebrow--gold">
                <ShieldCheck size={13} aria-hidden /> {trustHeading}
              </p>
              <p className="d-brief__sub">
                This is where we own the product — no middlemen, no markup surprises.
              </p>
            </header>
            <div className="d-brief__trust-grid">
              {trustPoints.map((t) => (
                <article key={t.title} className="d-brief__trust">
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* 4. Top-selling products */}
        {products.length > 0 ? (
          <section className="d-brief__section">
            <header className="d-brief__head">
              <p className="d-brief__eyebrow">{productsHeading}</p>
              <p className="d-brief__sub">What agents actually book — starting B2B rates.</p>
            </header>
            <div className="d-brief__product-grid">
              {products.map((p) => (
                <article key={p.name} className="d-brief__product">
                  <h3>{p.name}</h3>
                  {p.duration || p.includes ? (
                    <p className="d-brief__product-meta">
                      {[p.duration, p.includes].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  {p.price ? (
                    <p className="d-brief__product-price">
                      <span>From</span> {p.price}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* 5. Sample itineraries */}
        {itineraries.length > 0 ? (
          <section className="d-brief__section">
            <header className="d-brief__head">
              <p className="d-brief__eyebrow">{itinerariesHeading}</p>
              <p className="d-brief__sub">Copy-paste straight into your client quote.</p>
            </header>
            <div className="d-brief__itinerary-grid">
              {itineraries.map((i) => (
                <article key={i.name} className="d-brief__itinerary">
                  <h3>{i.name}</h3>
                  {i.nights ? <p className="d-brief__itinerary-meta">{i.nights}</p> : null}
                  {i.price ? <p className="d-brief__itinerary-price">From {i.price}</p> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
