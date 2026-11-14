import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import PageHero from '../components/PageHero'
import './pages.css'

const partnerBenefits = [
  {
    title: 'Competitive Net Rates',
    desc: 'Direct contracts with leading hotels, airlines, and attractions mean you get the best margins in the market — every time.',
  },
  {
    title: '2-Hour Quote Response',
    desc: 'We know speed is everything in travel sales. Our operations team guarantees quotes within 2 business hours.',
  },
  {
    title: 'Dedicated BDM Support',
    desc: 'Every partner gets a dedicated Business Development Manager who knows your business and is available when you need them.',
  },
  {
    title: 'Reliable Operations',
    desc: 'Over a decade of on-ground experience. Our local teams in every destination ensure zero hiccups — from arrival to departure.',
  },
  {
    title: 'Pre-Allocated Inventory',
    desc: 'As a registered partner, get access to pre-allocated hotel rooms and attraction tickets during peak season.',
  },
  {
    title: '24/7 Emergency Support',
    desc: 'Round-the-clock emergency helpline for all live operations. Your travellers are never stranded, never without help.',
  },
]

const partnerTypes = [
  { title: 'Travel Agents', desc: 'Retail and online travel agents building FIT and package portfolios' },
  { title: 'Tour Operators', desc: 'Wholesale operators looking for reliable DMC services across our destinations' },
  { title: 'Corporate Travel', desc: 'Corporate travel managers and MICE buyers planning incentive trips and events' },
  { title: 'Inbound Operators', desc: 'International operators seeking a trusted India-based DMC partner' },
]

const destinations = ['🇦🇪 Dubai', '🇦🇿 Azerbaijan', '🇸🇬 Singapore', '🇲🇾 Malaysia', '🇮🇩 Bali']

const stats = [
  { value: '2500+', label: 'Travel Partners', count: true },
  { value: '700+', label: 'Hotel Partners', count: true },
  { value: '5', label: 'Destinations', count: true },
  { value: '2hr', label: 'Quote Response', count: true },
  { value: '98%', label: 'Satisfaction', count: true },
  { value: 'Since 2013', label: 'Trusted DMC' },
]

const perks = [
  'Access to exclusive net rates',
  'Dedicated account manager',
  'Priority booking during peak season',
  'Marketing support and co-op materials',
  'Familiarisation trips for top partners',
  'Monthly destination newsletters & updates',
]

export default function B2B() {
  return (
    <main>
      <PageHero
        tall
        eyebrow="For Travel Professionals"
        title={<>Your Trusted <em>DMC Partner</em></>}
        sub="Join 2500+ travel agencies and operators across India who rely on Anjna Global for competitive rates, seamless operations, and on-ground excellence across 5 destinations."
        image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'B2B Partners' }]}
      >
        <a href="#register" className="btn" data-magnetic>Become a Partner <ArrowUpRight size={14} aria-hidden /></a>
        <Link to="/contact" className="btn btn--ghost" data-magnetic>Get Trade Rates <ArrowUpRight size={14} aria-hidden /></Link>
      </PageHero>

      {/* Stats band */}
      <section className="statband" aria-label="Partner network at a glance">
        <div className="wrap statband__grid" data-stagger="0.06">
          {stats.map((s) => (
            <div key={s.label}>
              <strong {...(s.count ? { 'data-count': true } : {})}>{s.value}</strong>
              <span className="mono">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="sec">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Partner Benefits</span>
              <h2 className="d-m" data-split>Why top agencies choose <em>Anjna Global</em></h2>
            </div>
            <p className="lead" data-fade>
              We don&apos;t just handle bookings — we become an extension of your business, committed to your success.
            </p>
          </header>
          <div className="vgrid" data-stagger="0.08">
            {partnerBenefits.map((b, i) => (
              <article key={b.title} className="vcard">
                <span className="vcard__no mono">0{i + 1}</span>
                <h3 className="d-s">{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="sec sec--paper">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Who We Work With</span>
            <h2 className="d-m" data-split>Built for <em>travel professionals</em></h2>
            <p className="lead" data-fade>
              Whether you&apos;re a retail agent, wholesale operator, corporate travel manager, or inbound tour operator — we have a partnership model tailored for you.
            </p>
            <div className="ptypes" data-stagger="0.08">
              {partnerTypes.map((t) => (
                <div key={t.title}>
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="covers" data-fade>
            <h3 className="mono">Destinations We Cover</h3>
            {destinations.map((d) => (
              <div key={d} className="covers__row">
                <span>{d}</span>
                <span className="mono">Full DMC Services</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="sec">
        <div className="wrap split split--start">
          <div>
            <span className="eyebrow">Join Our Network</span>
            <h2 className="d-m" data-split>Register as a <em>trade partner</em></h2>
            <p className="lead" data-fade>
              Fill in your details and our B2B team will reach out within 24 hours to set up your trade account with access to our net rates and partner portal.
            </p>
            <ul className="ticks ticks--lg" data-stagger="0.07">
              {perks.map((item) => (
                <li key={item}><Check size={16} aria-hidden /><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="formcard" data-fade>
            <h3 className="d-s">Partner Registration</h3>
            <PartnerForm />
          </div>
        </div>
      </section>
    </main>
  )
}

function PartnerForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const firstName = (fd.get('firstName') || '').toString().trim()
    const lastName = (fd.get('lastName') || '').toString().trim()
    const company = (fd.get('company') || '').toString().trim()
    const referral = (fd.get('referral') || '').toString().trim()
    const messageParts = []
    if (company) messageParts.push(`Company: ${company}`)
    if (referral) messageParts.push(`Heard about us: ${referral}`)
    try {
      await api.post('/leads', {
        name: `${firstName} ${lastName}`.trim(),
        email: (fd.get('email') || '').toString().trim(),
        phone: (fd.get('phone') || '').toString().trim(),
        destination: (fd.get('destination') || '').toString(),
        message: messageParts.join('\n'),
        source: 'b2b',
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Could not send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="formok">
        <Check size={30} aria-hidden />
        <h3 className="d-s">Registration received</h3>
        <p>Our B2B team will contact you within 24 hours.</p>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__row">
        <label className="field"><span>First Name *</span><input name="firstName" type="text" placeholder="Rahul" required /></label>
        <label className="field"><span>Last Name *</span><input name="lastName" type="text" placeholder="Sharma" required /></label>
      </div>
      <label className="field"><span>Company / Agency Name *</span><input name="company" type="text" placeholder="Sunshine Travels Pvt Ltd" required /></label>
      <label className="field"><span>Business Email *</span><input name="email" type="email" placeholder="sales@sunshinetravels.com" required /></label>
      <label className="field"><span>Phone / WhatsApp *</span><input name="phone" type="tel" placeholder="+91 98765 43210" required /></label>
      <label className="field">
        <span>Destinations of Interest</span>
        <select name="destination">
          <option value="">Select destination(s)</option>
          <option>Dubai, UAE</option>
          <option>Azerbaijan</option>
          <option>Singapore</option>
          <option>Malaysia</option>
          <option>Bali, Indonesia</option>
          <option>All Destinations</option>
        </select>
      </label>
      <label className="field"><span>How did you hear about us?</span><textarea name="referral" rows={3} placeholder="Google, referral, trade fair, etc." /></label>
      {error ? <p className="form__error">{error}</p> : null}
      <button type="submit" disabled={submitting} className="btn">
        {submitting ? 'Submitting…' : 'Submit Registration'} <ArrowUpRight size={14} aria-hidden />
      </button>
      <p className="form__note">Our B2B team will contact you within 24 hours.</p>
    </form>
  )
}
