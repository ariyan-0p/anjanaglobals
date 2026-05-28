import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Camera } from 'lucide-react'
import { destinations } from '../data/destinations'
import { useAllGalleries } from '../hooks/useGalleries'
import './Testimonials.css'

export default function Testimonials() {
  const { data: galleries, loading } = useAllGalleries()

  function imagesFor(dest) {
    const apiItems = galleries?.[dest.id]
    if (apiItems && apiItems.length > 0) {
      return apiItems.map((item) => ({
        src: item.url,
        alt: item.alt || item.caption || `${dest.name} travel moment`,
        caption: item.caption || '',
      }))
    }
    // Fallback to hardcoded images while API is empty
    return (dest.galleryImages || []).map((src, idx) => ({
      src,
      alt: `${dest.name} travel moment ${idx + 1}`,
      caption: '',
    }))
  }

  return (
    <main className="testimonials-page">
      <section className="testimonials-page__hero">
        <div className="container testimonials-page__hero-inner">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Testimonials</span>
          </div>
          <span className="tag tag-light">Client moments</span>
          <h1>Stories and snapshots from all destinations</h1>
          <p>
            Explore travel moments from our five core destinations. Click any location tab to jump
            directly to that destination page.
          </p>
        </div>
      </section>

      <section className="testimonials-page__tabs-wrap">
        <div className="container">
          <div className="testimonials-page__tabs" aria-label="Destination tabs">
            {destinations.map((dest) => (
              <Link key={dest.id} to={`/destinations/${dest.id}`} className="testimonials-page__tab">
                <span>{dest.flag}</span>
                {dest.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-page__content">
        <div className="container">
          {destinations.map((dest) => {
            const images = imagesFor(dest)
            return (
              <article key={dest.id} id={dest.id} className="testi-destination">
                <header className="testi-destination__head">
                  <div>
                    <p className="testi-destination__meta">
                      <MapPin size={14} />
                      {dest.flag} {dest.name}, {dest.country}
                    </p>
                    <h2>{dest.tagline}</h2>
                    <p>{dest.shortDesc}</p>
                  </div>
                  <Link to={`/destinations/${dest.id}`} className="testi-destination__link">
                    View {dest.name} page <ArrowRight size={15} />
                  </Link>
                </header>

                <div className="testi-gallery">
                  {images.map((img, idx) => (
                    <figure
                      key={`${dest.id}-${idx}-${img.src}`}
                      className={`testi-gallery__item${idx === 0 ? ' is-featured' : ''}`}
                    >
                      <img src={img.src} alt={img.alt} loading="lazy" />
                      {img.caption ? <figcaption>{img.caption}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              </article>
            )
          })}

          {loading ? null : (
            <div className="testimonials-page__footnote">
              <Camera size={15} />
              <p>
                Need destination-wise itineraries and more client moments? Visit any location page
                above for detailed highlights and packages.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
