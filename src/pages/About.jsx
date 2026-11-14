import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import EventsGallery from '../components/EventsGallery'
import PageHero from '../components/PageHero'
import './pages.css'

const milestones = [
  { year: '2013', event: 'Anjna Global founded in Gurugram, India — starting with Dubai as our first destination.' },
  { year: '2015', event: 'Expanded operations to Singapore and Malaysia, growing the partner network rapidly.' },
  { year: '2017', event: 'Added Bali (Indonesia) to our portfolio. Crossed 500+ active travel agent partners.' },
  { year: '2019', event: 'Launched dedicated MICE division for corporate clients.' },
  { year: '2021', event: 'Opened our Dubai office — Anjana Global Tourism LLC, Jabal Ali — for on-ground UAE operations.' },
  { year: '2022', event: 'Launched Azerbaijan as our fifth destination, bringing Baku and the mountains into our portfolio.' },
  { year: '2025', event: 'Crossed 2500+ travel partners across India and 700+ directly contracted hotels across all five destinations.' },
]

const team = [
  { name: 'Anjana Sharma', role: 'Founder & Managing Director', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', bio: 'Visionary leader who built Anjna Global from a single-destination DMC into a five-destination powerhouse trusted across India.' },
  { name: 'Rajesh Kumar', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80', bio: 'Ensures every booking runs with military precision. Rajesh and his team manage 200+ groups annually across all five destinations.' },
  { name: 'Priya Nair', role: 'Director — B2B Sales', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80', bio: 'The driving force behind our partner network. Priya has built relationships with 2500+ travel agencies across India and abroad.' },
  { name: 'Arjun Mehta', role: 'Head of MICE', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80', bio: 'Corporate events specialist with a flair for the dramatic. From intimate boardrooms to 500-person gala dinners — Arjun delivers.' },
]

const values = [
  { title: 'Integrity First', desc: 'Transparent pricing, honest communication, and zero hidden surprises — always.' },
  { title: 'Speed & Reliability', desc: 'We know time is money. 2-hour quote response, 24/7 ops support, no delays.' },
  { title: 'Excellence in Every Detail', desc: 'From the first airport transfer to the farewell dinner — we sweat every detail so your clients don\'t have to.' },
  { title: 'Local Expertise', desc: 'Our on-ground teams in every destination bring insider knowledge that no handbook can replicate.' },
  { title: 'Innovation', desc: 'Always evolving. New destinations, new products, new technology — we keep our partners ahead of the curve.' },
  { title: 'Passion for Travel', desc: 'We don\'t just sell trips. We craft stories. Every itinerary is built with genuine love for the destination.' },
]

const facts = [
  { label: 'Since 2013', sub: 'of Excellence' },
  { label: '5 Destinations', sub: 'across 4 countries' },
  { label: '2500+ Partners', sub: 'across India' },
  { label: '700+ Hotels', sub: 'directly contracted' },
]

export default function About() {
  return (
    <main>
      <PageHero
        eyebrow="About Anjna Global"
        title={<>Our <em>Story</em></>}
        sub="Over a decade of crafting extraordinary travel experiences across the Middle East & Asia."
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
      />

      {/* Intro */}
      <section className="sec">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Who We Are</span>
            <h2 className="d-m" data-split>A decade of <em>fabulously planned</em> journeys</h2>
            <p className="about__p1" data-fade>
              Founded in 2013, <strong>Anjna Global</strong> is a premier Destination Management Company (DMC) headquartered in Gurugram, India, with offices in Dubai and Ahmedabad. We specialise in creating bespoke travel experiences across five extraordinary destinations — Dubai, Azerbaijan, Singapore, Malaysia, and Bali.
            </p>
            <p className="about__p2" data-fade>
              Our tagline <em>&ldquo;Fabulously Planned... Remembered Always&rdquo;</em> isn&apos;t just marketing — it&apos;s a promise we make to every travel partner and every traveller who chooses to experience the world through us. We serve both the B2B trade community and discerning direct travellers who seek something beyond the ordinary.
            </p>

            <dl className="facts" data-stagger>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd className="mono">{f.sub}</dd>
                </div>
              ))}
            </dl>

            <Link to="/contact" className="btn" data-magnetic>
              Partner With Us <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="about__visual">
            <div className="media about__img" data-wipe data-parallax="9">
              <div className="px" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80)' }} />
            </div>
            <div className="about__badge" data-fade>
              <strong>2013</strong>
              <span className="mono">Trusted Since</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="sec sec--paper">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Our Values</span>
              <h2 className="d-m" data-split>What drives us <em>every day</em></h2>
            </div>
            <p className="lead" data-fade>
              These aren&apos;t words on a wall — they&apos;re the principles that guide every booking, every call, and every journey we plan.
            </p>
          </header>
          <div className="vgrid" data-stagger="0.08">
            {values.map((v, i) => (
              <article key={v.title} className="vcard">
                <span className="vcard__no mono">0{i + 1}</span>
                <h3 className="d-s">{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="sec">
        <div className="wrap">
          <header className="head">
            <span className="eyebrow">Our Journey</span>
            <h2 className="d-m" data-split>Our journey <em>so far</em></h2>
          </header>
          <ol className="tline">
            {milestones.map((m) => (
              <li key={m.year} className="tline__row" data-fade>
                <span className="tline__year">{m.year}</span>
                <p>{m.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="sec sec--paper">
        <div className="wrap">
          <header className="head head--split">
            <div>
              <span className="eyebrow">Our People</span>
              <h2 className="d-m" data-split>The team <em>behind the magic</em></h2>
            </div>
            <p className="lead" data-fade>
              A passionate team of travel professionals dedicated to delivering extraordinary experiences — every single time.
            </p>
          </header>
          <div className="team" data-stagger="0.1">
            {team.map((member) => (
              <article key={member.name} className="member">
                <div className="member__img media" data-parallax="6">
                  <div className="px"><img src={member.image} alt={member.name} loading="lazy" /></div>
                </div>
                <h3>{member.name}</h3>
                <p className="mono member__role">{member.role}</p>
                <p className="member__bio">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Events & Exhibitions gallery (hidden until photos are added) */}
      <EventsGallery />

      {/* CTA */}
      <section className="sec sec--ink on-ink cta-band" data-nav="dark">
        <div className="wrap cta-band__inner">
          <h2 className="d-l" data-split>Ready to experience the <em>Anjna difference?</em></h2>
          <p className="lead" data-fade>Partner with us or plan your next journey — we&apos;re ready when you are.</p>
          <div className="cta-band__actions">
            <Link to="/contact" className="btn" data-magnetic>Get in Touch <ArrowUpRight size={14} aria-hidden /></Link>
            <Link to="/destinations" className="btn btn--ghost" data-magnetic>Explore Destinations <ArrowUpRight size={14} aria-hidden /></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
