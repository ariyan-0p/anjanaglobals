import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowUpRight, Check } from 'lucide-react'
import { api } from '../lib/api'
import PageHero from '../components/PageHero'
import './pages.css'

const offices = [
  {
    city: 'Gurugram',
    country: 'India (Corporate Office)',
    address: 'Plot No. 1, Sector 10A, Gurugram, Haryana 122001',
    phone: '+91-124-2786999',
    email: 'info@anjnaglobal.com',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
    flag: '🇮🇳',
  },
  {
    city: 'Dubai',
    country: 'UAE (Operations)',
    address: 'Aspin Commercial Building, Trade Centre First, Plot 11, Dubai · Trade Licence 773256',
    phone: '+971-565954997',
    email: 'info@anjnaglobal.com',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM GST',
    flag: '🇦🇪',
  },
  {
    city: 'Ahmedabad',
    country: 'India (Gujarat Office)',
    address: 'B 1202, Gamesh Glory 11, Jagatpur Road, Ahmedabad, Gujarat 382470',
    phone: '+91 99588 01627',
    email: 'info@anjnaglobal.com',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
    flag: '🇮🇳',
  },
]

const enquiryTypes = [
  'FIT / Individual Package',
  'Group Tour Enquiry',
  'MICE / Corporate Event',
  'Honeymoon Package',
  'Visa Assistance',
  'Trade Partner Registration',
  'Other',
]

const quick = [
  { icon: <Phone size={16} />, label: 'Call Us', value: '+91-124-2786999', href: 'tel:+911242786999' },
  { icon: <MessageCircle size={16} />, label: 'WhatsApp', value: '+91 99588 01627', href: 'https://wa.me/919958801627' },
  { icon: <Mail size={16} />, label: 'Email Us', value: 'info@anjnaglobal.com', href: 'mailto:info@anjnaglobal.com' },
  { icon: <Clock size={16} />, label: 'Response Time', value: 'Within 2 Hours', href: null },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const firstName = (fd.get('firstName') || '').toString().trim()
    const lastName = (fd.get('lastName') || '').toString().trim()
    const enquiryType = (fd.get('enquiryType') || '').toString()
    const destination = (fd.get('destination') || '').toString()
    const travellers = (fd.get('travellers') || '').toString()
    const travelDates = (fd.get('travelDates') || '').toString().trim()
    const budget = (fd.get('budget') || '').toString()
    const message = (fd.get('message') || '').toString().trim()

    const messageParts = []
    if (enquiryType) messageParts.push(`Enquiry: ${enquiryType}`)
    if (travellers) messageParts.push(`Travellers: ${travellers}`)
    if (travelDates) messageParts.push(`Dates: ${travelDates}`)
    if (budget) messageParts.push(`Budget: ${budget}`)
    if (message) messageParts.push(message)

    try {
      await api.post('/leads', {
        name: `${firstName} ${lastName}`.trim(),
        email: (fd.get('email') || '').toString().trim(),
        phone: (fd.get('phone') || '').toString().trim(),
        destination,
        message: messageParts.join('\n'),
        source: 'contact',
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Could not send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <PageHero
        eyebrow="Contact Us"
        title={<>Let&apos;s Start <em>Planning</em></>}
        sub="Get in touch — our travel experts will respond within 2 hours."
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]}
      />

      {/* Quick contact */}
      <section className="quickbar" aria-label="Quick contact">
        <div className="wrap quickbar__grid" data-stagger="0.07">
          {quick.map((item) => (
            <div key={item.label} className="quickbar__item">
              <span className="quickbar__ic">{item.icon}</span>
              <div>
                <p className="mono">{item.label}</p>
                {item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="wrap split split--start contact__split">
          {/* Form */}
          <div>
            <span className="eyebrow">Send Us a Message</span>
            <h2 className="d-m" data-split>How can we <em>help you?</em></h2>
            <p className="lead" data-fade>
              Whether you need a quote, want to plan a trip, or are interested in becoming a trade partner — we&apos;re here for you.
            </p>

            {submitted ? (
              <div className="formok formok--lg">
                <Check size={34} aria-hidden />
                <h3 className="d-s">Message Received!</h3>
                <p>Thank you for reaching out. Our team will get back to you within 2 hours during business hours.</p>
                <button type="button" onClick={() => setSubmitted(false)} className="btn btn--plain">Send Another Message</button>
              </div>
            ) : (
              <form className="form contact__form" onSubmit={handleSubmit}>
                <div className="form__row">
                  <label className="field"><span>First Name *</span><input name="firstName" type="text" required placeholder="Your first name" /></label>
                  <label className="field"><span>Last Name *</span><input name="lastName" type="text" required placeholder="Your last name" /></label>
                </div>
                <div className="form__row">
                  <label className="field"><span>Email Address *</span><input name="email" type="email" required placeholder="you@example.com" /></label>
                  <label className="field"><span>Phone / WhatsApp *</span><input name="phone" type="tel" required placeholder="+91 98765 43210" /></label>
                </div>
                <label className="field">
                  <span>Type of Enquiry</span>
                  <select name="enquiryType">{enquiryTypes.map((t) => <option key={t}>{t}</option>)}</select>
                </label>
                <div className="form__row">
                  <label className="field">
                    <span>Destination</span>
                    <select name="destination">
                      <option value="">Select destination</option>
                      {['Dubai, UAE', 'Azerbaijan', 'Singapore', 'Malaysia', 'Bali, Indonesia', 'Multiple Destinations'].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span>Number of Travellers</span>
                    <select name="travellers">
                      <option>1 – 2 persons</option>
                      <option>3 – 5 persons</option>
                      <option>6 – 15 persons</option>
                      <option>16 – 50 persons</option>
                      <option>50+ persons</option>
                    </select>
                  </label>
                </div>
                <div className="form__row">
                  <label className="field"><span>Approximate Travel Dates</span><input name="travelDates" type="text" placeholder="e.g. Dec 2025, flexible" /></label>
                  <label className="field">
                    <span>Budget per Person</span>
                    <select name="budget">
                      <option>Under ₹50,000</option>
                      <option>₹50,000 – ₹1,00,000</option>
                      <option>₹1,00,000 – ₹2,00,000</option>
                      <option>₹2,00,000+</option>
                      <option>Flexible</option>
                    </select>
                  </label>
                </div>
                <label className="field">
                  <span>Message / Special Requirements</span>
                  <textarea name="message" rows={4} placeholder="Tell us about your travel plans, any special requirements, or questions you have..." />
                </label>

                {error ? <p className="form__error">{error}</p> : null}

                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Enquiry'} <ArrowUpRight size={14} aria-hidden />
                </button>
                <p className="form__note">🔒 Your information is safe with us. We never share your data with third parties.</p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="contact__side">
            {offices.map((office) => (
              <article key={office.city} className="office" data-fade>
                <header>
                  <span className="office__flag">{office.flag}</span>
                  <div>
                    <h3>{office.city}</h3>
                    <p className="mono">{office.country}</p>
                  </div>
                </header>
                <ul>
                  <li><MapPin size={14} aria-hidden /><span>{office.address}</span></li>
                  <li><Phone size={14} aria-hidden /><a href={`tel:${office.phone.replace(/\s/g, '')}`}>{office.phone}</a></li>
                  <li><Mail size={14} aria-hidden /><a href={`mailto:${office.email}`}>{office.email}</a></li>
                  <li><Clock size={14} aria-hidden /><span>{office.hours}</span></li>
                </ul>
              </article>
            ))}

            <a
              href="https://wa.me/919958801627?text=Hi%20Anjna%20Global%2C%20I%27d%20like%20to%20enquire%20about%20a%20trip."
              target="_blank"
              rel="noreferrer"
              className="wa-card"
              data-fade
            >
              <span className="wa-card__ic"><MessageCircle size={24} /></span>
              <div>
                <strong>Chat on WhatsApp</strong>
                <p>Fastest way to reach us — we&apos;re online now!</p>
              </div>
              <ArrowUpRight size={22} aria-hidden />
            </a>

            <div className="promise on-ink" data-fade>
              <p className="mono">Our Promise to You</p>
              {['⚡ 2-Hour response guarantee', '🔒 100% secure enquiry process', '💰 No hidden fees, ever', '⭐ Trusted DMC since 2013'].map((item) => (
                <p key={item} className="promise__row">{item}</p>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
