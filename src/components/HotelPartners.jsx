import { useState } from 'react'

function HotelTile({ hotel }) {
  const [errored, setErrored] = useState(false)
  const showLogo = hotel.logo && !errored

  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 'clamp(140px, 22vw, 180px)',
        height: '90px',
        background: 'white',
        border: '1px solid #EFEDE8',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 16px',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#7C3AED'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#EFEDE8'
        e.currentTarget.style.boxShadow = 'none'
      }}
      title={hotel.name}
    >
      {showLogo ? (
        <img
          src={hotel.logo}
          alt={hotel.name}
          loading="lazy"
          onError={() => setErrored(true)}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'grayscale(100%)',
            opacity: 0.85,
          }}
        />
      ) : (
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#0A0F1E',
            textAlign: 'center',
            lineHeight: 1.3,
            letterSpacing: '0.02em',
            fontFamily: 'var(--font-body)',
          }}
        >
          {hotel.name}
        </span>
      )}
    </div>
  )
}

export default function HotelPartners({
  hotels,
  eyebrow = 'Hospitality partners',
  heading = 'A few of our hotel partners',
  subtitle,
  background = '#F8F7F4',
}) {
  if (!hotels || hotels.length === 0) return null

  return (
    <section style={{ padding: 'clamp(48px, 8vw, 80px) 0', background }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span
            className="tag"
            style={{ display: 'inline-block', marginBottom: '12px' }}
          >
            {eyebrow}
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#0A0F1E',
              margin: 0,
              fontWeight: 700,
            }}
          >
            {heading}
          </h2>
          {subtitle && (
            <p
              style={{
                marginTop: '12px',
                fontSize: '15px',
                color: '#6B7280',
                maxWidth: '620px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
          }}
        >
          {hotels.map(h => (
            <HotelTile key={h.name} hotel={h} />
          ))}
        </div>
        <p
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#9CA3AF',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Logos and names belong to their respective owners. Shown for reference only.
        </p>
      </div>
    </section>
  )
}
