import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './LeadPopup.css'

const REOPEN_INTERVAL_MS = 30000

export default function LeadPopup() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const openPopup = () => {
      setSubmitted(false)
      setOpen(true)
    }

    const firstTimer = window.setTimeout(openPopup, REOPEN_INTERVAL_MS)
    const interval = window.setInterval(openPopup, REOPEN_INTERVAL_MS)

    return () => {
      window.clearTimeout(firstTimer)
      window.clearInterval(interval)
    }
  }, [])

  const closePopup = () => {
    setOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
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
