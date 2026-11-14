import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Clock, Plane, Plus } from 'lucide-react'
import PageHero from '../components/PageHero'
import './pages.css'

const visaTypes = [
  {
    name: 'Visit Visa',
    duration: '30 / 60 Days · Non-renewable',
    stay: 'For stays longer than 14 days',
    price: 'On request',
    bestFor: 'Family visits, business visits, longer holidays',
  },
  {
    name: 'Tourist Visa',
    duration: '30 Days · Non-renewable',
    stay: 'Up to 30 days in UAE',
    price: 'On request',
    bestFor: 'Short holidays — sponsored by hotel / tour operator',
    badge: 'Most popular',
  },
  {
    name: 'Multiple Entry Visa',
    duration: '30 / 60 Days · Multiple Entry',
    stay: 'Re-enter the UAE within validity',
    price: 'On request',
    bestFor: 'Cruise passengers and frequent business visitors',
  },
  {
    name: 'Transit Visa',
    duration: '96 Hours',
    stay: 'For minimum 8-hour layovers',
    price: 'On request',
    bestFor: 'Passengers with valid onward tickets',
  },
]

const benefits = [
  { title: 'Our Own Visa Quota', desc: 'We hold a UAE visa quota in-house — no third-party intermediaries, no slipped timelines.' },
  { title: 'Fast Turnaround', desc: 'Quick processing with express options available — exact timelines confirmed before you pay.' },
  { title: 'Pre-Screened Documents', desc: 'Our team reviews every document before submission so applications go in clean the first time.' },
  { title: 'Live Status Updates', desc: 'You know exactly where the application stands — from filing to issuance.' },
]

const steps = [
  { n: '01', title: 'Share your travel plan', desc: 'Tell us your travel dates, emirate(s) you plan to visit, and visa type. Takes 2 minutes.' },
  { n: '02', title: 'Upload documents', desc: 'Send a clear passport scan, photo, and supporting documents. Our team reviews them before filing.' },
  { n: '03', title: 'We file & track', desc: 'Application goes in through our quota. We track every status change and keep you posted.' },
  { n: '04', title: 'Visa delivered', desc: 'Your e-visa is delivered by email — print or save on your phone, and you are ready to fly.' },
]

const documents = [
  'Clear passport copies of the applicant',
  'Return Flight tickets',
  'Passport size photograph',
  'Confirmed Hotel Booking',
]

const faqs = [
  { q: 'How long does the UAE visa take to process?', a: 'Processing time depends on the visa type and current load with UAE authorities. We confirm the exact timeline for your case before you pay, and express options are available when you need a faster turnaround.' },
  { q: 'Do I get my passport stamped?', a: 'No — UAE tourist visas are issued electronically. You receive a PDF e-visa that is checked at the airport on arrival.' },
  { q: 'Can you process visas for groups?', a: 'Yes — we handle group visa filings for tour groups, corporate incentives, MICE, and family clusters. Share the headcount and we will come back with a quote.' },
  { q: 'What if my visa is rejected?', a: 'Visa fees paid to UAE authorities are non-refundable in case of rejection. Our team pre-screens every document so applications go in clean — if a case looks risky we will flag it before charging.' },
  { q: 'Do children need a separate visa?', a: 'Yes — every traveller, including infants, needs an individual visa. Talk to us about family bundle pricing.' },
  { q: 'I have an 8-hour layover in Dubai. Do I need a visa?', a: 'You may be eligible for a 96-hour Transit Visa, provided you hold a valid onward ticket. Share your itinerary and we will confirm eligibility.' },
]

export default function UAEVisaPage() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <main>
      <PageHero
        tall
        eyebrow="UAE Visa Assistance"
        title={<>UAE Visa — Done Right, <em>On Time</em></>}
        sub="We hold our own UAE visa quota. That means faster processing, transparent updates, and a higher first-pass approval rate — for individual travellers, families, and groups."
        image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: 'UAE Visa' }]}
      >
        <Link to="/contact" className="btn" data-magnetic>Apply now <ArrowUpRight size={14} aria-hidden /></Link>
        <a href="#visa-types" className="btn btn--ghost" data-magnetic>See visa options <ArrowUpRight size={14} aria-hidden /></a>
      </PageHero>

      {/* Benefits */}
      <section className="sec">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Why apply through us</span>
              <h2 className="d-m" data-split>A visa team that <em>owns the timeline</em></h2>
            </div>
            <p className="lead" data-fade>Most agents submit and wait. We file through our own quota and stay on it until issuance.</p>
          </header>
          <div className="vgrid vgrid--4" data-stagger="0.08">
            {benefits.map((b, i) => (
              <article key={b.title} className="vcard">
                <span className="vcard__no mono">0{i + 1}</span>
                <h3 className="d-s">{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Types */}
      <section id="visa-types" className="sec sec--paper">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Visa types</span>
              <h2 className="d-m" data-split>Pick the right visa <em>for your trip</em></h2>
            </div>
            <p className="lead" data-fade>Share your travel dates and we will come back with the right visa type and an exact quote.</p>
          </header>
          <div className="visas" data-stagger="0.1">
            {visaTypes.map((v) => (
              <article key={v.name} className="visa">
                {v.badge && <span className="visa__badge mono">{v.badge}</span>}
                <h3 className="d-s">{v.name}</h3>
                <p className="mono visa__dur">{v.duration}</p>
                <p className="visa__row"><Clock size={15} aria-hidden /> <span>{v.stay}</span></p>
                <p className="visa__row"><Plane size={15} aria-hidden /> <span>{v.bestFor}</span></p>
                <div className="visa__foot">
                  <strong>{v.price}</strong>
                  <Link to="/contact" className="link-u">Apply <ArrowUpRight size={14} aria-hidden /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sec">
        <div className="wrap">
          <header className="head">
            <span className="eyebrow">How it works</span>
            <h2 className="d-m" data-split>Four steps, <em>zero friction</em></h2>
          </header>
          <div className="steps" data-stagger="0.1">
            {steps.map((s) => (
              <div key={s.n} className="step">
                <span className="step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="sec sec--paper">
        <div className="wrap split split--start">
          <div>
            <span className="eyebrow">Documents</span>
            <h2 className="d-m" data-split>What you <em>will need</em></h2>
            <p className="lead" data-fade>
              We pre-screen every document so applications go in clean the first time. If anything is missing
              or unclear, we will flag it before submission — not after.
            </p>
            <p className="note" data-fade>
              Some categories (e.g. business visa, certain nationalities) need additional papers. We will
              share the exact checklist for your case after the first conversation.
            </p>
          </div>
          <div data-fade>
            <h3 className="mono doclabel">Requirements</h3>
            <ul className="ticks ticks--lg">
              {documents.map((d) => (<li key={d}><Check size={16} aria-hidden /><span>{d}</span></li>))}
            </ul>
            <p className="form__note">Please contact your nearest embassy for accurate, up-to-date information.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="wrap faqwrap">
          <header className="head">
            <span className="eyebrow">Frequently asked</span>
            <h2 className="d-m" data-split>Quick <em>answers</em></h2>
          </header>
          <div className="faq">
            {faqs.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={f.q} className={`faq__item${open ? ' is-open' : ''}`}>
                  <button type="button" className="faq__q" onClick={() => setOpenFaq(open ? -1 : i)} aria-expanded={open}>
                    <span>{f.q}</span>
                    <Plus size={20} aria-hidden />
                  </button>
                  <div className="faq__a"><div><p>{f.a}</p></div></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec cta-band cta-band--red on-ink" data-nav="dark">
        <div className="wrap cta-band__inner">
          <h2 className="d-l" data-split>Ready to <em>apply?</em></h2>
          <p className="lead" data-fade>Share your trip details and we will come back with the right visa and exact pricing within hours.</p>
          <div className="cta-band__actions">
            <Link to="/contact" className="btn btn--light" data-magnetic>Start application <ArrowUpRight size={14} aria-hidden /></Link>
            <Link to="/services" className="btn btn--ghost" data-magnetic>All services <ArrowUpRight size={14} aria-hidden /></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
