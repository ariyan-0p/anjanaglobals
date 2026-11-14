import { useEffect, useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import './WhatsAppFloat.css'

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false)
  const [tooltip, setTooltip] = useState(true)
  const [away, setAway] = useState(false)

  // On phones the button tucks away while reading down the page, so it never sits on top
  // of a package's Enquire button; it comes back as soon as you scroll up.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - last
      if (window.innerWidth <= 768) {
        if (dy > 6 && y > 200) setAway(true)
        else if (dy < -6 || y < 200) setAway(false)
      } else setAway(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`wa${away && !show ? ' is-away' : ''}`}>
      {tooltip && !show && (
        <div className="wa__tip">
          <button type="button" onClick={() => setTooltip(false)} aria-label="Dismiss"><X size={12} /></button>
          <span>💬 Chat with us on WhatsApp!</span>
        </div>
      )}

      {show && (
        <div className="wa__panel">
          <div className="wa__head">
            <div>
              <p>Anjna Global</p>
              <span>Typically replies in minutes</span>
            </div>
            <button type="button" onClick={() => setShow(false)} aria-label="Close chat"><X size={18} /></button>
          </div>
          <div className="wa__body">
            <div className="wa__bubble">
              Hello! 👋 Welcome to <strong>Anjna Global</strong>.<br />How can we help you plan your perfect trip?
            </div>
          </div>
          <div className="wa__foot">
            <a
              href="https://wa.me/919958801627?text=Hi%20Anjna%20Global%2C%20I%20would%20like%20to%20enquire%20about%20a%20travel%20package."
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Start chat
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`wa__fab${show ? ' is-open' : ''}`}
        onClick={() => { setShow((o) => !o); setTooltip(false) }}
        aria-label="WhatsApp Chat"
      >
        {show ? <X size={24} color="white" /> : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </div>
  )
}
