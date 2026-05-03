import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './LeadPopup.css'

const FIRST_DELAY_MS = 30000
const SESSION_DISMISS_KEY = 'anjna:leadPopupDismissed'

export default function LeadPopup() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return

    const timer = window.setTimeout(() => {
      setSubmitted(false)
      setOpen(true)
    }, FIRST_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [])

  const closePopup = () => {
    setOpen(false)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_DISMISS_KEY, '1')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_DISMISS_KEY, '1')
    }
    window.setTimeout(() => setOpen(false), 1300)
  }

  if (!open) return null

  return (
    <div className="lead-popup" role="dialog" aria-modal="true" aria-label="Quick travel query">
      <button type="button" className="lead-popup__backdrop" onClick={closePopup} aria-label="Close popup" />

      <div className="lead-popup__card">
        <button type="button" className="lead-popup__close" onClick={closePopup} aria-label="Close">
          <X size={16} />
        </button>

        {submitted ? (
          <div className="lead-popup__success">
            <h3>Thanks! Query received.</h3>
            <p>Our team will reach out shortly.</p>
          </div>
        ) : (
          <>
            <p className="lead-popup__tag">Quick enquiry</p>
            <h3>Plan your next trip with us</h3>
            <p className="lead-popup__sub">Share your details and our team will contact you.</p>

            <form onSubmit={handleSubmit} className="lead-popup__form">
              <input type="text" placeholder="Full name *" required />
              <input type="tel" placeholder="Phone / WhatsApp *" required />
              <input type="email" placeholder="Email ID *" required />
              <select defaultValue="">
                <option value="" disabled>
                  Destination (optional)
                </option>
                <option>Dubai</option>
                <option>Azerbaijan</option>
                <option>Singapore</option>
                <option>Malaysia</option>
                <option>Bali</option>
                <option>Not sure yet</option>
              </select>
              <textarea rows={3} placeholder="Travel dates / requirements (optional)" />
              <button type="submit" className="btn-primary lead-popup__submit">
                Submit query
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
