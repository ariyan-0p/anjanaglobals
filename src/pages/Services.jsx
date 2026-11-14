import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { services, whyUs } from '../data/services'
import { homepagePartners } from '../data/hotelPartners'
import HotelPartners from '../components/HotelPartners'
import PageHero from '../components/PageHero'
import './pages.css'

// Inline preview inside the Hotels service card
const hotelPartnersPreview = homepagePartners.slice(0, 6)

export default function Services() {
  return (
    <main>
      <PageHero
        eyebrow="What we do"
        title={<>Our <em>Services</em></>}
        sub="End-to-end travel solutions for trade partners and direct travellers alike."
        image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      {/* Intro */}
      <section className="sec sec--tight">
        <div className="wrap intro">
          <div>
            <span className="eyebrow">Complete Travel Solutions</span>
            <h2 className="d-m" data-split>Everything you need, <em>under one roof</em></h2>
          </div>
          <p className="lead" data-fade>
            From a simple airport transfer to a 500-person incentive program — Anjna Global has the expertise, the network, and the passion to make it happen.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="svcs">
        <div className="wrap">
          {services.map((svc, i) => (
            <article key={svc.id} className="svcrow">
              <div className="svcrow__side">
                <span className="svcrow__no">0{i + 1}</span>
                <p className="mono">{svc.subtitle}</p>
              </div>

              <div className="svcrow__main">
                <h2 className="d-m" data-split>{svc.title}</h2>
                <p className="svcrow__desc" data-fade>{svc.description}</p>

                <ul className="ticks" data-stagger="0.07">
                  {svc.features.map((f) => (
                    <li key={f}><Check size={16} aria-hidden /><span>{f}</span></li>
                  ))}
                </ul>

                <Link to={svc.href || '/contact'} className="btn" data-magnetic>
                  {svc.cta || 'Enquire about this service'} <ArrowUpRight size={14} aria-hidden />
                </Link>

                {svc.id === 'hotels' && (
                  <div className="svcrow__hotels">
                    <p className="mono">A few of our hotel partners</p>
                    {hotelPartnersPreview.length === 0 ? (
                      <p className="svcrow__soon">Partner logos coming soon.</p>
                    ) : (
                      <div className="svcrow__logos">
                        {hotelPartnersPreview.map((p) => (
                          <div key={p.name} title={p.name}>
                            {p.logo ? <img src={p.logo} alt={p.name} loading="lazy" /> : <span>{p.name}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="svcrow__more">… and 700+ more across all five destinations.</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Hotel partners — dedicated section */}
      <HotelPartners
        hotels={homepagePartners}
        eyebrow="Hospitality partners"
        heading="A few of our hotel partners"
        subtitle="A curated mix of brands we contract directly with across Dubai, Singapore, Azerbaijan, Malaysia and Bali."
      />

      {/* Why Choose Us */}
      <section className="sec sec--ink on-ink" data-nav="dark">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow eyebrow--light">Why Anjna Global</span>
              <h2 className="d-m" data-split>The Anjna <em>Advantage</em></h2>
            </div>
            <p className="lead" data-fade>What sets us apart from every other DMC in the market.</p>
          </header>
          <div className="adv" data-stagger="0.08">
            {whyUs.map((item, i) => (
              <article key={item.title} className="adv__item">
                <span className="mono adv__no">0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec cta-band cta-band--red on-ink" data-nav="dark">
        <div className="wrap cta-band__inner">
          <h2 className="d-l" data-split>Ready to work <em>together?</em></h2>
          <p className="lead" data-fade>Our team is ready to discuss how we can serve your travel business.</p>
          <div className="cta-band__actions">
            <Link to="/contact" className="btn btn--light" data-magnetic>Contact Us <ArrowUpRight size={14} aria-hidden /></Link>
            <Link to="/b2b" className="btn btn--ghost" data-magnetic>B2B Partners <ArrowUpRight size={14} aria-hidden /></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
