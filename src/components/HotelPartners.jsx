import { useState } from 'react'
import './HotelPartners.css'

function HotelTile({ hotel }) {
  const [errored, setErrored] = useState(false)
  const showLogo = hotel.logo && !errored

  return (
    <div className="hp__tile" title={hotel.name}>
      {showLogo ? (
        <img src={hotel.logo} alt={hotel.name} loading="lazy" onError={() => setErrored(true)} />
      ) : (
        <span>{hotel.name}</span>
      )}
    </div>
  )
}

export default function HotelPartners({
  hotels,
  eyebrow = 'Hospitality partners',
  heading = 'A few of our hotel partners',
  subtitle,
  background = 'paper',
}) {
  if (!hotels || hotels.length === 0) return null

  // Two rows drifting in opposite directions; split so each row has its own set.
  const mid = Math.ceil(hotels.length / 2)
  const rows = hotels.length > 6 ? [hotels.slice(0, mid), hotels.slice(mid)] : [hotels]
  const tone = background === 'white' || background === '#fff' || background === '#ffffff' ? 'white' : 'paper'

  return (
    <section className={`hp hp--${tone}`}>
      <div className="wrap">
        <div className="hp__head" data-fade>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="d-m">{heading}</h2>
          {subtitle ? <p className="lead">{subtitle}</p> : null}
        </div>
      </div>

      <div className="hp__rows">
        {rows.map((row, r) => (
          <div key={r} className={`marquee hp__row${r % 2 ? ' marquee--rev' : ''}`}>
            <div className="marquee__track">{row.map((h) => <HotelTile key={h.name} hotel={h} />)}</div>
            <div className="marquee__track" aria-hidden>{row.map((h) => <HotelTile key={`b-${h.name}`} hotel={h} />)}</div>
          </div>
        ))}
      </div>

      <div className="wrap">
        <p className="hp__note">Logos and names belong to their respective owners. Shown for reference only.</p>
      </div>
    </section>
  )
}
