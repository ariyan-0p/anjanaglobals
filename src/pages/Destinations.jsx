import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { destinations } from '../data/destinations'
import PageHero from '../components/PageHero'
import './pages.css'

export default function Destinations() {
  return (
    <main>
      <PageHero
        eyebrow="Five destinations"
        title={<>Our <em>Destinations</em></>}
        sub="Five extraordinary worlds — each one a masterpiece of culture, beauty, and adventure."
        image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Destinations' }]}
      />

      <section className="sec">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Where Would You Like to Go?</span>
              <h2 className="d-m" data-split>Explore <em>Our World</em></h2>
            </div>
            <p className="lead" data-fade>
              From the dazzling skylines of Dubai to the spiritual serenity of Bali — discover destinations that inspire,
              thrill, and move you.
            </p>
          </header>

          <div className="dlist">
            {destinations.map((dest, i) => (
              <article key={dest.id} className={`drow${i % 2 ? ' drow--flip' : ''}`}>
                <Link to={`/destinations/${dest.id}`} className="drow__media media" data-wipe data-parallax="8" data-cursor="Explore" aria-label={`Explore ${dest.name}`}>
                  <div className="px" style={{ backgroundImage: `url(${dest.image})` }} />
                  <span className="drow__country mono">{dest.flag} {dest.country}</span>
                  <span className="drow__count mono">{dest.packages} Packages Available</span>
                </Link>

                <div className="drow__body">
                  <span className="drow__no">0{i + 1}</span>
                  {dest.bestTime ? <p className="eyebrow">{`Best Time: ${dest.bestTime}`}</p> : null}
                  <h2 className="d-l" data-split>{dest.name}</h2>
                  <p className="drow__tag">&ldquo;{dest.tagline}&rdquo;</p>
                  <p className="drow__desc">{dest.description}</p>

                  <p className="mono drow__label">Top Highlights</p>
                  <div className="drow__chips">
                    {dest.highlights.map((h) => <span key={h}>{h}</span>)}
                  </div>

                  <dl className="drow__facts">
                    {[
                      { label: 'Currency', value: dest.currency },
                      { label: 'Language', value: dest.language.split(',')[0] },
                      { label: 'Visa', value: dest.visa.split('(')[0].trim() },
                    ].map((fact) => (
                      <div key={fact.label}>
                        <dt className="mono">{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="drow__actions">
                    <Link to={`/destinations/${dest.id}`} className="btn" data-magnetic>
                      Explore {dest.name} <ArrowUpRight size={14} aria-hidden />
                    </Link>
                    <Link to="/contact" className="btn btn--ghost-dark" data-magnetic>
                      Get a Quote <ArrowUpRight size={14} aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--ink on-ink cta-band" data-nav="dark">
        <div className="wrap cta-band__inner">
          <span className="eyebrow eyebrow--light">Custom Itineraries</span>
          <h2 className="d-l" data-split>Can&apos;t decide? Let us plan the <em>perfect journey</em> for you</h2>
          <p className="lead" data-fade>
            Our travel experts will craft a bespoke itinerary based on your preferences, budget, and travel dates.
          </p>
          <Link to="/contact" className="btn" data-magnetic>
            Start Planning <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  )
}
