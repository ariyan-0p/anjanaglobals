import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Clock, ShieldCheck, FileText, Plane, Phone, ChevronDown } from 'lucide-react'

const visaTypes = [
  {
    name: 'Visit Visa',
    duration: '30 / 60 Days · Non-renewable',
    stay: 'For stays longer than 14 days',
    price: 'On request',
    bestFor: 'Family visits, business visits, longer holidays',
    color: '#7C3AED',
  },
  {
    name: 'Tourist Visa',
    duration: '30 Days · Non-renewable',
    stay: 'Up to 30 days in UAE',
    price: 'On request',
    bestFor: 'Short holidays — sponsored by hotel / tour operator',
    color: '#C8102E',
    badge: 'Most popular',
  },
  {
    name: 'Multiple Entry Visa',
    duration: '30 / 60 Days · Multiple Entry',
    stay: 'Re-enter the UAE within validity',
    price: 'On request',
    bestFor: 'Cruise passengers and frequent business visitors',
    color: '#059669',
  },
  {
    name: 'Transit Visa',
    duration: '96 Hours',
    stay: 'For minimum 8-hour layovers',
    price: 'On request',
    bestFor: 'Passengers with valid onward tickets',
    color: '#1D3461',
  },
]

const benefits = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Our Own Visa Quota',
    desc: 'We hold a UAE visa quota in-house — no third-party intermediaries, no slipped timelines.',
  },
  {
    icon: <Clock size={22} />,
    title: 'Fast Turnaround',
    desc: 'Quick processing with express options available — exact timelines confirmed before you pay.',
  },
  {
    icon: <CheckCircle size={22} />,
    title: 'Pre-Screened Documents',
    desc: 'Our team reviews every document before submission so applications go in clean the first time.',
  },
  {
    icon: <Phone size={22} />,
    title: 'Live Status Updates',
    desc: 'You know exactly where the application stands — from filing to issuance.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Share your travel plan',
    desc: 'Tell us your travel dates, emirate(s) you plan to visit, and visa type. Takes 2 minutes.',
  },
  {
    n: '02',
    title: 'Upload documents',
    desc: 'Send a clear passport scan, photo, and supporting documents. Our team reviews them before filing.',
  },
  {
    n: '03',
    title: 'We file & track',
    desc: 'Application goes in through our quota. We track every status change and keep you posted.',
  },
  {
    n: '04',
    title: 'Visa delivered',
    desc: 'Your e-visa is delivered by email — print or save on your phone, and you are ready to fly.',
  },
]

const documents = [
  'Clear passport copies of the applicant',
  'Return Flight tickets',
  'Passport size photograph',
  'Confirmed Hotel Booking',
]

const faqs = [
  {
    q: 'How long does the UAE visa take to process?',
    a: 'Processing time depends on the visa type and current load with UAE authorities. We confirm the exact timeline for your case before you pay, and express options are available when you need a faster turnaround.',
  },
  {
    q: 'Do I get my passport stamped?',
    a: 'No — UAE tourist visas are issued electronically. You receive a PDF e-visa that is checked at the airport on arrival.',
  },
  {
    q: 'Can you process visas for groups?',
    a: 'Yes — we handle group visa filings for tour groups, corporate incentives, MICE, and family clusters. Share the headcount and we will come back with a quote.',
  },
  {
    q: 'What if my visa is rejected?',
    a: 'Visa fees paid to UAE authorities are non-refundable in case of rejection. Our team pre-screens every document so applications go in clean — if a case looks risky we will flag it before charging.',
  },
  {
    q: 'Do children need a separate visa?',
    a: 'Yes — every traveller, including infants, needs an individual visa. Talk to us about family bundle pricing.',
  },
  {
    q: 'I have an 8-hour layover in Dubai. Do I need a visa?',
    a: 'You may be eligible for a 96-hour Transit Visa, provided you hold a valid onward ticket. Share your itinerary and we will confirm eligibility.',
  },
]

export default function UAEVisaPage() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <main>
      {/* Hero */}
      <div
        className="page-hero"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,15,30,0.55), rgba(10,15,30,0.65)), url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80)',
        }}
      >
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/services">Services</Link>
            <span>›</span>
            <span>UAE Visa</span>
          </div>
          <h1>UAE Visa — Done Right, On Time</h1>
          <p>
            We hold our own UAE visa quota. That means faster processing, transparent updates, and a higher
            first-pass approval rate — for individual travellers, families, and groups.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
            <Link to="/contact" className="btn-primary">
              Apply now <ArrowRight size={16} />
            </Link>
            <a href="#visa-types" className="btn-outline-white">
              See visa options
            </a>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 0', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="tag">Why apply through us</span>
            <h2 className="section-heading">A visa team that actually owns the timeline</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Most agents submit and wait. We file through our own quota and stay on it until issuance.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {benefits.map(b => (
              <div
                key={b.title}
                style={{
                  background: '#F8F7F4',
                  border: '1px solid #EFEDE8',
                  borderRadius: '14px',
                  padding: '28px 24px',
                }}
              >
                <div style={{ color: '#7C3AED', marginBottom: '14px' }}>{b.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0A0F1E', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Types */}
      <section id="visa-types" style={{ padding: 'clamp(48px, 8vw, 80px) 0', background: '#F8F7F4' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="tag">Visa types</span>
            <h2 className="section-heading">Pick the right visa for your trip</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Share your travel dates and we will come back with the right visa type and an exact quote.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {visaTypes.map(v => (
              <div
                key={v.name}
                style={{
                  position: 'relative',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  border: '1px solid #EFEDE8',
                  borderTop: `4px solid ${v.color}`,
                }}
              >
                {v.badge && (
                  <span style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: v.color, color: 'white', fontSize: '11px',
                    padding: '4px 10px', borderRadius: '999px', fontWeight: 700, letterSpacing: '0.05em',
                  }}>{v.badge}</span>
                )}
                <h3 style={{ fontSize: '18px', color: '#0A0F1E', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '6px' }}>
                  {v.name}
                </h3>
                <p style={{ fontSize: '13px', color: v.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
                  {v.duration}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#4B5563', fontSize: '14px' }}>
                  <Clock size={15} /> <span>{v.stay}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#4B5563', fontSize: '14px' }}>
                  <Plane size={15} /> <span>{v.bestFor}</span>
                </div>
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#0A0F1E' }}>{v.price}</span>
                  <Link to="/contact" style={{ color: v.color, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Apply <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 0', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="tag">How it works</span>
            <h2 className="section-heading">Four steps, zero friction</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {steps.map(s => (
              <div key={s.n} style={{ padding: '8px 4px' }}>
                <div style={{ fontSize: '40px', fontWeight: 800, color: '#7C3AED', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>{s.n}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0A0F1E', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 0', background: '#F8F7F4' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'start' }}>
          <div>
            <span className="tag">Documents</span>
            <h2 className="section-heading">What you will need</h2>
            <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: 1.8 }}>
              We pre-screen every document so applications go in clean the first time. If anything is missing
              or unclear, we will flag it before submission — not after.
            </p>
            <div style={{ marginTop: '24px', padding: '18px 20px', background: 'white', borderRadius: '12px', border: '1px solid #EFEDE8' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <FileText size={18} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '14px', color: '#4B5563', margin: 0, lineHeight: 1.7 }}>
                  Some categories (e.g. business visa, certain nationalities) need additional papers. We will
                  share the exact checklist for your case after the first conversation.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0A0F1E', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Requirements</h3>
            {documents.map(d => (
              <div key={d} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #EFEDE8' }}>
                <CheckCircle size={18} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '15px', color: '#374151' }}>{d}</span>
              </div>
            ))}
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '20px', fontStyle: 'italic', lineHeight: 1.6 }}>
              Please contact your nearest embassy for accurate, up-to-date information.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <span className="tag">Frequently asked</span>
            <h2 className="section-heading">Quick answers</h2>
          </div>
          {faqs.map((f, i) => {
            const open = openFaq === i
            return (
              <button
                key={f.q}
                type="button"
                onClick={() => setOpenFaq(open ? -1 : i)}
                style={{
                  width: '100%', textAlign: 'left', background: 'white',
                  border: '1px solid #EFEDE8', borderRadius: '12px',
                  padding: '18px 22px', marginBottom: '12px', cursor: 'pointer',
                  display: 'block',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0F1E', fontFamily: 'var(--font-body)' }}>{f.q}</span>
                  <ChevronDown size={18} style={{ flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'none', color: '#7C3AED' }} />
                </div>
                {open && (
                  <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: 1.7, marginTop: '12px', marginBottom: 0 }}>{f.a}</p>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: '#7C3AED' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '16px' }}>
            Ready to apply?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', marginBottom: '32px', fontFamily: 'var(--font-body)' }}>
            Share your trip details and we will come back with the right visa and exact pricing within hours.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ padding: '14px 32px', background: 'white', color: '#7C3AED', borderRadius: '4px', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Start application <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn-outline-white">All services</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
