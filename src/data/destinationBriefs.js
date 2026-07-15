// Per-destination brief data powering the new /destinations/:slug page.
//
// Schema:
//   atGlance: { bestMonths, visa, currency, timezone, language, flightTime, language? }
//   story: array of { heading, paragraph } chapters
//   pricingTiers: 3 cards (Budget / Standard / Premium)
//   tripTypes: object keyed by segment id; each holds { products: [productKey], itineraryKey }
//   experiences: array of products (name, duration, includes, price, badge?)
//   itineraries: array of full itineraries (name, nights, hotel, price, days[])
//   trustPoints: array of trust quick-wins
//   ctaLabel, quoteIntent
//
// Pricing notes: Dubai is the only destination with confirmed real B2B rates
// from the client brief. Others use TBD-marked placeholders — replace as
// content lands. Page handles missing/empty data gracefully.

import bakuLocal from '../assets/baku.jpg'
import kualalumpurLocal from '../assets/Kualalumpur.jpg'

const TBD = 'On request'

// Helper: build a stats strip from the brief + linked counts
function buildStats({ hotelCount, experienceCount, response = '2 hrs', since = '2013' }) {
  return [
    { label: 'Partner hotels', value: hotelCount > 0 ? `${hotelCount}+` : 'Direct contracts', tone: 'navy' },
    { label: 'Curated experiences', value: experienceCount > 0 ? `${experienceCount}` : 'Bookable', tone: 'gold' },
    { label: 'Avg. quote response', value: response, tone: 'navy' },
    { label: 'Specialist desk since', value: since, tone: 'gold' },
  ]
}

const dubai = {
  id: 'dubai',
  accentColor: '#C9A84C',
  accentInk: '#1a1500',
  atGlance: {
    bestMonths: 'Sept – Apr',
    visa: 'E-visa',
    currency: 'AED',
    timezone: 'GMT +4',
    language: 'Arabic, English',
    flightTime: '3.5h ex DEL',
  },
  story: [
    {
      heading: 'Why agents pick Dubai with us',
      paragraph:
        'We hold direct contracts across 30+ hotels, run our own fleet for transfers, and pre-purchase bulk allotments for every iconic attraction. That means faster confirmation, transparent rates, and no markup surprises when you build a client quote.',
    },
    {
      heading: "Dubai's commercial advantage",
      paragraph:
        'Year-round demand from Indian travellers, easy visa, short flights, and constantly evolving products keep Dubai at the top of every B2B agent\'s portfolio. Whether your client wants a 4-night family escape or a 6-night honeymoon, the rate card flexes.',
    },
  ],
  signatureMoments: [
    {
      title: 'Skyline at dusk',
      meta: 'Burj Khalifa + Fountain show',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
    },
    {
      title: 'Dune adventure',
      meta: 'Sunset safari with BBQ',
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&q=80',
    },
    {
      title: 'Old Dubai',
      meta: 'Spice Souk · Creek · abra',
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=900&q=80',
    },
    {
      title: 'Sea + skyline',
      meta: 'Dhow cruise + Marina',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80',
    },
  ],
  pricingTiers: [
    {
      name: 'Budget',
      subtitle: '3★ hotels · centrally located',
      price: '₹18,000',
      perPaxNote: 'per person · 4N/5D · twin sharing',
      includes: ['Airport transfers', 'Daily breakfast', 'Half-day Dubai city tour', 'Desert Safari with BBQ'],
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80',
    },
    {
      name: 'Standard',
      subtitle: '4★ hotels · prime areas',
      price: '₹28,000',
      perPaxNote: 'per person · 4N/5D · twin sharing',
      includes: ['All Budget features', 'Burj Khalifa 124th floor', 'Dhow Cruise Marina dinner', 'Private transfers'],
      isPopular: true,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    },
    {
      name: 'Premium',
      subtitle: '5★ hotels · views or beach',
      price: '₹45,000',
      perPaxNote: 'per person · 5N/6D · twin sharing',
      includes: ['All Standard features', '5★ hotel category (Atlantis / similar)', 'Private chauffeur transfers', 'Atlantis Aquaventure or theme park'],
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    },
  ],
  tripTypes: {
    fit: {
      label: 'FIT',
      blurb: 'Couples or small groups on a tailored independent trip.',
      productKeys: ['desert-safari', 'city-tour', 'dhow-cruise'],
      itineraryKey: 'express',
    },
    family: {
      label: 'Family',
      blurb: 'Theme parks, age-appropriate experiences, family-room hotels.',
      productKeys: ['city-tour', 'desert-safari', 'aquaventure'],
      itineraryKey: 'premium',
    },
    honeymoon: {
      label: 'Honeymoon',
      blurb: 'Beach hotels, private transfers, romantic dining setups.',
      productKeys: ['dhow-cruise', 'desert-safari', 'burj-khalifa'],
      itineraryKey: 'honeymoon',
    },
    mice: {
      label: 'MICE',
      blurb: 'Conference space, group transfers, themed gala dinners.',
      productKeys: ['city-tour', 'dhow-cruise', 'desert-safari'],
      itineraryKey: 'express',
    },
    group: {
      label: 'Group',
      blurb: 'Coach transfers, group-friendly rates, fixed itinerary.',
      productKeys: ['city-tour', 'desert-safari', 'dhow-cruise'],
      itineraryKey: 'express',
    },
  },
  experiences: [
    {
      key: 'desert-safari',
      name: 'Evening Desert Safari',
      duration: '4 hrs',
      includes: 'BBQ dinner · dune bashing · camel ride',
      price: 'AED 110 PP',
      badge: 'Most quoted',
      image: 'https://images.unsplash.com/photo-1549944850-84e00be4203b?w=800&q=80',
    },
    {
      key: 'city-tour',
      name: 'Dubai City Tour',
      duration: '4 hrs',
      includes: 'Half day · Burj Al Arab · Creek · Souk',
      price: 'AED 50 PP',
      image: 'https://images.unsplash.com/photo-1582882198551-c0d7f863c5dd?w=800&q=80',
    },
    {
      key: 'dhow-cruise',
      name: 'Marina Dhow Cruise',
      duration: '2 hrs',
      includes: 'Dinner · Entertainment · Marina views',
      price: 'AED 90 PP',
      image: 'https://images.unsplash.com/photo-1576397189312-199928d647b6?w=800&q=80',
    },
    {
      key: 'burj-khalifa',
      name: 'Burj Khalifa 124th Floor',
      duration: '1.5 hrs',
      includes: 'Non-prime hours · skip-the-line entry',
      price: 'AED 200 PP',
      image: 'https://images.unsplash.com/photo-1544092683-c0c9ebb368e5?w=800&q=80',
    },
    {
      key: 'aquaventure',
      name: 'Atlantis Aquaventure',
      duration: 'Full day',
      includes: 'Waterpark + Lost Chambers access',
      price: 'AED 450 PP',
      image: 'https://images.unsplash.com/photo-1600450575743-43793ba079d3?w=800&q=80',
    },
    {
      key: 'museum-of-future',
      name: 'Museum of the Future Tour',
      duration: '2 hrs',
      includes: 'Iconic architecture · immersive exhibits',
      price: 'AED 160 PP',
      image: 'https://images.unsplash.com/photo-1667592441284-b590021411e3?w=800&q=80',
    },
    {
      key: 'abu-dhabi-city-tour',
      name: 'Full Day Abu Dhabi City Tour',
      duration: 'Full day',
      includes: 'Sheikh Zayed Mosque · Corniche · Emirates Palace',
      price: 'AED 120 PP',
      image: 'https://images.unsplash.com/photo-1590273089302-ebbc53986b6e?w=800&q=80',
    },
    {
      key: 'global-village-miracle-garden',
      name: 'Global Village & Miracle Garden Combo',
      duration: 'Full day',
      includes: 'World pavilions · flower displays',
      price: 'AED 180 PP',
      image: 'https://images.unsplash.com/photo-1588314941393-af1c493f345c?w=800&q=80',
    },
  ],
  itineraries: [
    {
      key: 'express',
      name: 'Dubai Express',
      nights: '4N / 5D',
      hotelCategory: '3★ / 4★ flex',
      price: '₹28,000/pax',
      summary: 'Tight 4-night itinerary covering every iconic Dubai stop with one free day.',
      days: [
        { day: 1, title: 'Arrival + Marina', items: ['Airport pickup', 'Hotel check-in', 'Marina walk + Dhow Cruise dinner'] },
        { day: 2, title: 'Half-day city tour', items: ['Burj Al Arab photo stop', 'Dubai Creek + abra ride', 'Gold & Spice Souk', 'Free evening'] },
        { day: 3, title: 'Desert Safari', items: ['Free morning at hotel', 'Dune bashing pickup at 3 PM', 'BBQ dinner + entertainment under the stars'] },
        { day: 4, title: 'Burj Khalifa + free time', items: ['Burj Khalifa 124th floor (off-peak)', 'Dubai Mall fountain show', 'Optional Atlantis day pass'] },
        { day: 5, title: 'Departure', items: ['Breakfast', 'Airport transfer'] },
      ],
    },
    {
      key: 'premium',
      name: 'Dubai Premium',
      nights: '5N / 6D',
      hotelCategory: '4★ / 5★',
      price: '₹42,000/pax',
      summary: 'Extra night, 5★ stay, private transfers, theme-park day.',
      days: [
        { day: 1, title: 'Arrival + welcome dinner', items: ['Private airport pickup', '5★ check-in (Atlantis or similar)', 'Welcome dinner at hotel'] },
        { day: 2, title: 'Theme park day', items: ['Full-day Atlantis Aquaventure', 'Lost Chambers Aquarium', 'Evening at leisure'] },
        { day: 3, title: 'City tour + Burj Khalifa', items: ['Half-day city tour', 'Burj Khalifa prime-hour entry', 'Dubai Mall'] },
        { day: 4, title: 'Desert Safari', items: ['Free morning', 'Premium Desert Safari (Bedouin camp)', 'Belly dance + Tanoura show'] },
        { day: 5, title: 'Free day + Dhow', items: ['Free shopping day', 'Dhow Marina dinner cruise'] },
        { day: 6, title: 'Departure', items: ['Late checkout', 'Airport drop'] },
      ],
    },
    {
      key: 'honeymoon',
      name: 'Dubai Honeymoon',
      nights: '5N / 6D',
      hotelCategory: '5★ beach',
      price: '₹55,000/couple',
      summary: 'Beach hotel, private chauffeur, romantic dining setups.',
      days: [
        { day: 1, title: 'Arrival + private check-in', items: ['Private chauffeur from airport', '5★ beach resort check-in (Jumeirah / Atlantis)', 'In-room welcome amenities'] },
        { day: 2, title: 'Beach day + sunset cruise', items: ['Beach day at hotel', 'Couples spa (on request)', 'Private sunset Dhow with table for two'] },
        { day: 3, title: 'Private city tour', items: ['Private city tour with chauffeur', 'Burj Khalifa SKY (148th floor)', "Dinner at At.mosphere or Pier 7"] },
        { day: 4, title: 'Desert Safari + dune dinner', items: ['Premium dune drive', 'Private Bedouin tent dinner setup', 'Stargazing'] },
        { day: 5, title: 'Free day', items: ['Optional Atlantis day pass', 'Free shopping at Dubai Mall', 'Farewell dinner'] },
        { day: 6, title: 'Departure', items: ['Late checkout', 'Private airport drop'] },
      ],
    },
  ],
  trustPoints: [
    { title: 'Direct hotel contracts', desc: 'No middleman. Faster confirmation, no margin leakage.' },
    { title: 'Own transport fleet', desc: "Sedans, SUVs, vans, coaches — we don't outsource ground transport." },
    { title: 'Attraction tickets in bulk', desc: 'Pre-booked tickets — faster confirmation, better rates.' },
    { title: 'On-ground English-speaking guides', desc: 'Indian-passport-friendly. Familiar with first-time travellers.' },
  ],
  quoteIntent: 'Dubai',
}

// Helpers for placeholder destinations
function placeholderTiers(currency = 'INR') {
  return [
    { name: 'Budget', subtitle: '3★ hotels', price: TBD, perPaxNote: 'per person · request quote', includes: ['Airport transfers', 'Daily breakfast', 'Half-day city tour'] },
    { name: 'Standard', subtitle: '4★ hotels', price: TBD, perPaxNote: 'per person · request quote', includes: ['All Budget features', 'Two signature experiences', 'Private transfers'], isPopular: true },
    { name: 'Premium', subtitle: '5★ hotels', price: TBD, perPaxNote: 'per person · request quote', includes: ['All Standard features', '5★ stay category', 'Private chauffeur transfers'] },
  ]
}

function placeholderTripTypes(experienceKeys, itineraryKey) {
  return {
    fit: { label: 'FIT', blurb: 'Independent couples or small groups.', productKeys: experienceKeys.slice(0, 3), itineraryKey },
    family: { label: 'Family', blurb: 'Age-appropriate, kid-friendly experiences.', productKeys: experienceKeys.slice(0, 3), itineraryKey },
    honeymoon: { label: 'Honeymoon', blurb: 'Romantic stays + private experiences.', productKeys: experienceKeys.slice(0, 3), itineraryKey },
    mice: { label: 'MICE', blurb: 'Group transfers + venue support.', productKeys: experienceKeys.slice(0, 3), itineraryKey },
    group: { label: 'Group', blurb: 'Coach transfers + fixed itinerary.', productKeys: experienceKeys.slice(0, 3), itineraryKey },
  }
}

const azerbaijan = {
  id: 'azerbaijan',
  accentColor: '#0092BC',
  accentInk: '#001620',
  signatureMoments: [
    { title: 'Flame Towers', meta: 'Sunset over Baku skyline', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80' },
    { title: 'Old City walls', meta: 'UNESCO Icherisheher', image: bakuLocal },
    { title: 'Mountain weekend', meta: 'Shahdag + Gabala resort', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80' },
    { title: 'Mud volcanoes', meta: 'Gobustan landscape', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80' },
  ],
  atGlance: {
    bestMonths: 'Apr – Jun · Sept – Nov',
    visa: 'E-Visa (ASAN)',
    currency: 'AZN',
    timezone: 'GMT +4',
    language: 'Azerbaijani, Russian',
    flightTime: '5h ex DEL',
  },
  story: [
    {
      heading: 'Silk Road heritage, modern infrastructure',
      paragraph:
        "Baku's medieval Old City sits beneath the futuristic Flame Towers — a contrast few destinations offer. Mountain resorts in Shahdag and Gabala, mud volcanoes outside the capital, and a sleepy Caspian coast give Azerbaijan unusual range for a single-country itinerary.",
    },
    {
      heading: 'Why agents are quoting it more',
      paragraph:
        'Short flight from India, easy e-visa, hotel inventory across price points, and a destination that still feels off the beaten path. Strong honeymoon and group bookings throughout shoulder months.',
    },
  ],
  pricingTiers: placeholderTiers(),
  experiences: [
    { key: 'old-city', name: 'Baku Old City (Icherisheher)', duration: '3 hrs', includes: 'UNESCO-listed medieval core · Maiden Tower', price: TBD },
    { key: 'flame-towers', name: 'Flame Towers + Highland Park', duration: '2 hrs', includes: 'Sunset photo stop · panoramic Baku views', price: TBD },
    { key: 'gobustan', name: 'Gobustan + mud volcanoes', duration: 'Half day', includes: 'Ancient petroglyphs · short 4WD to volcanoes', price: TBD },
    { key: 'sheki', name: 'Sheki Khan Palace day trip', duration: 'Full day', includes: '3hr drive · 18th-century palace · halva tasting', price: TBD },
    { key: 'gabala', name: 'Gabala Mountain Resort', duration: 'Full / overnight', includes: 'Tufandag cable car · forest trails', price: TBD },
  ],
  itineraries: [
    {
      key: 'classic',
      name: 'Azerbaijan Classic',
      nights: '4N / 5D',
      hotelCategory: '4★ flex',
      price: TBD,
      summary: 'Baku core + Gobustan day trip + Absheron peninsula.',
      days: [
        { day: 1, title: 'Arrival + Old City', items: ['Airport pickup', 'Hotel check-in', 'Evening walk through Icherisheher'] },
        { day: 2, title: 'Gobustan + Absheron', items: ['Gobustan petroglyphs', 'Mud volcanoes 4WD', 'Yanar Dag burning hillside'] },
        { day: 3, title: 'Baku panorama', items: ['Flame Towers + Highland Park', 'Heydar Aliyev Center (Zaha Hadid)', 'Boulevard + Caspian promenade'] },
        { day: 4, title: 'Sheki day trip', items: ['Long day · Sheki Khan Palace', 'Caravanserai lunch', 'Return to Baku'] },
        { day: 5, title: 'Departure', items: ['Breakfast', 'Airport transfer'] },
      ],
    },
  ],
  tripTypes: placeholderTripTypes(['old-city', 'flame-towers', 'gobustan', 'sheki', 'gabala'], 'classic'),
  trustPoints: [
    { title: 'Local Azeri ground team', desc: 'Native-language operators handle every transfer and pickup.' },
    { title: 'Hotel inventory across Baku + mountains', desc: 'Direct contracts with 45+ properties from Baku city centre to Shahdag.' },
    { title: 'Visa handling included', desc: 'We process the e-visa for you — you only share passport scans.' },
  ],
  quoteIntent: 'Azerbaijan',
}

const singapore = {
  id: 'singapore',
  accentColor: '#EF4444',
  accentInk: '#3a0808',
  signatureMoments: [
    { title: 'Marina Bay glow', meta: 'Sands + light show', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80' },
    { title: 'Gardens by the Bay', meta: 'Supertree Grove', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=900&q=80' },
    { title: 'Sentosa island', meta: 'Universal Studios + beach', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80' },
    { title: 'Hawker food', meta: 'Chinatown + Lau Pa Sat', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80' },
  ],
  atGlance: {
    bestMonths: 'Feb – Apr',
    visa: 'eVisa (most nationalities)',
    currency: 'SGD',
    timezone: 'GMT +8',
    language: 'English, Mandarin, Malay',
    flightTime: '5.5h ex DEL',
  },
  story: [
    {
      heading: "Asia's most efficient city",
      paragraph:
        'Marina Bay Sands, Gardens by the Bay, Universal Studios on Sentosa — Singapore packs more headline attractions into 728 km² than most countries. For B2B agents, it\'s an easy sell: safe, English-speaking, family-friendly, MICE-ready.',
    },
    {
      heading: 'Inventory depth advantage',
      paragraph:
        '16 hotel partners spanning 3★ to 5★ across Marina Bay, Orchard, Little India, and Lavender. Direct contracts mean you can build any budget without losing margin to consolidators.',
    },
  ],
  pricingTiers: placeholderTiers(),
  experiences: [
    { key: 'gardens', name: 'Gardens by the Bay (Domes + Skyway)', duration: '3 hrs', includes: 'Flower Dome + Cloud Forest + OCBC Skyway', price: TBD },
    { key: 'sentosa', name: 'Sentosa Island combo', duration: 'Full day', includes: 'Universal Studios OR SEA Aquarium + cable car', price: TBD },
    { key: 'city-tour-sg', name: 'Singapore city tour', duration: '4 hrs', includes: 'Merlion · Chinatown · Little India · Civic District', price: TBD },
    { key: 'night-safari', name: 'Night Safari + Tram', duration: '3 hrs', includes: "World's first nocturnal zoo · tram + walking trails", price: TBD },
    { key: 'sg-river', name: 'Singapore River cruise', duration: '40 min', includes: 'Bumboat along Marina Bay · Merlion + Esplanade', price: TBD },
  ],
  itineraries: [
    {
      key: 'classic-sg',
      name: 'Singapore Classic',
      nights: '3N / 4D',
      hotelCategory: '4★',
      price: TBD,
      summary: 'City + Sentosa day + Gardens by the Bay.',
      days: [
        { day: 1, title: 'Arrival + Marina Bay', items: ['Airport pickup', 'Hotel check-in', 'Marina Bay Sands light show'] },
        { day: 2, title: 'Sentosa day', items: ['Universal Studios full day', 'Sentosa cable car return', 'Evening at leisure'] },
        { day: 3, title: 'City + Gardens', items: ['City tour half day', 'Free lunch', 'Gardens by the Bay + Supertree Grove'] },
        { day: 4, title: 'Departure', items: ['Breakfast', 'Airport drop'] },
      ],
    },
  ],
  tripTypes: placeholderTripTypes(['gardens', 'sentosa', 'city-tour-sg', 'night-safari', 'sg-river'], 'classic-sg'),
  trustPoints: [
    { title: '16 hotel partners contracted directly', desc: 'Marina Bay, Orchard, Little India, Lavender — all star tiers.' },
    { title: 'Theme-park tickets ready', desc: 'Pre-booked Universal Studios + SEA Aquarium tickets.' },
    { title: 'Multi-destination twins', desc: 'Easy combo with Malaysia or Bali for week-plus itineraries.' },
  ],
  quoteIntent: 'Singapore',
}

const malaysia = {
  id: 'malaysia',
  accentColor: '#FBBF24',
  accentInk: '#3a2a00',
  signatureMoments: [
    { title: 'Petronas at night', meta: 'Twin Towers Skybridge', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=900&q=80' },
    { title: 'Langkawi beach', meta: 'White sand + sky cab', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=900&q=80' },
    { title: 'Batu Caves', meta: '272 colourful steps', image: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=900&q=80' },
    { title: 'Cameron Highlands', meta: 'Tea estates + cool air', image: kualalumpurLocal },
  ],
  atGlance: {
    bestMonths: 'Jun – Sept · Dec – Feb',
    visa: 'Visa-free (90 days)',
    currency: 'MYR',
    timezone: 'GMT +8',
    language: 'Malay, English',
    flightTime: '5.5h ex DEL',
  },
  story: [
    {
      heading: '"Truly Asia" with serious diversity',
      paragraph:
        'Kuala Lumpur skylines, Langkawi beaches, Penang street food, Cameron Highlands tea plantations — Malaysia offers urban, beach and hill experiences within a single 7-night itinerary. Strong twin-destination potential with Singapore or Bali.',
    },
    {
      heading: 'Easy economics for agents',
      paragraph:
        'Visa-free for Indian passports keeps friction low. Petronas Towers anchor the iconic stops. KL hotel inventory is deep across all categories.',
    },
  ],
  pricingTiers: placeholderTiers(),
  experiences: [
    { key: 'petronas', name: 'Petronas Towers Skybridge', duration: '1.5 hrs', includes: 'Skybridge level 41 + observation deck level 86', price: TBD },
    { key: 'batu-caves', name: 'Batu Caves + city tour', duration: 'Half day', includes: 'Hindu temple complex · KL highlights', price: TBD },
    { key: 'langkawi', name: 'Langkawi Island hopping', duration: 'Half day', includes: 'Eagle feeding · pregnant maiden lake · wet rice fields', price: TBD },
    { key: 'cameron', name: 'Cameron Highlands tea trail', duration: 'Full / overnight', includes: 'BOH tea estate + strawberry farm + cool weather', price: TBD },
    { key: 'genting', name: 'Genting Highlands day trip', duration: 'Full day', includes: 'Awana Skyway cable car · theme park + casino', price: TBD },
  ],
  itineraries: [
    {
      key: 'kl-langkawi',
      name: 'KL + Langkawi Classic',
      nights: '5N / 6D',
      hotelCategory: '4★',
      price: TBD,
      summary: 'Two nights KL + three nights Langkawi beach.',
      days: [
        { day: 1, title: 'Arrival KL', items: ['Airport pickup', 'Hotel check-in', 'Petronas Towers night photo stop'] },
        { day: 2, title: 'KL city tour', items: ['Batu Caves morning', 'KL Tower viewing deck', 'Bukit Bintang evening'] },
        { day: 3, title: 'Fly to Langkawi', items: ['Morning flight KUL-LGK', 'Hotel check-in', 'Beach evening'] },
        { day: 4, title: 'Island hopping', items: ['Half-day island hopping', 'Free afternoon at hotel'] },
        { day: 5, title: 'Free Langkawi day', items: ['Optional Sky Cab cable car', 'Free shopping (duty-free)'] },
        { day: 6, title: 'Departure', items: ['Breakfast', 'Airport transfer'] },
      ],
    },
  ],
  tripTypes: placeholderTripTypes(['petronas', 'batu-caves', 'langkawi', 'cameron', 'genting'], 'kl-langkawi'),
  trustPoints: [
    { title: 'Visa-free advantage', desc: 'Indian passports get 90 days visa-free — zero pre-trip friction.' },
    { title: 'KL + Langkawi internal flights bundled', desc: 'We include the domestic leg in the package, fixed rate.' },
    { title: 'Easy twin-destination combos', desc: 'Singapore-Malaysia and Bali-Malaysia combo packages on tap.' },
  ],
  quoteIntent: 'Malaysia',
}

const bali = {
  id: 'bali',
  accentColor: '#14B8A6',
  accentInk: '#002e29',
  signatureMoments: [
    { title: 'Uluwatu cliff', meta: 'Sunset + Kecak fire dance', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80' },
    { title: 'Rice terraces', meta: 'Tegallalang at dawn', image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=900&q=80' },
    { title: 'Ubud temples', meta: 'Tirta Empul + jungle walks', image: 'https://images.unsplash.com/photo-1542897644-e04428948020?w=900&q=80' },
    { title: 'Beach villa', meta: 'Seminyak / Nusa Dua', image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=900&q=80' },
  ],
  atGlance: {
    bestMonths: 'May – Sept',
    visa: 'Visa on Arrival',
    currency: 'IDR',
    timezone: 'GMT +8',
    language: 'Indonesian, English',
    flightTime: '7.5h ex DEL (via SIN/KUL)',
  },
  story: [
    {
      heading: 'The honeymoon workhorse',
      paragraph:
        'Bali still does the heavy lifting for honeymoon and family bookings. Villas in Ubud, beach resorts in Nusa Dua and Seminyak, temples in Uluwatu — the experience layer is mature and the inventory is deep.',
    },
    {
      heading: 'What the new Bali looks like',
      paragraph:
        'Wellness retreats, surf camps, cooking classes, and design-driven boutique resorts have widened Bali well beyond the temple-and-beach loop. Multi-area splits (Ubud + Seminyak, or Ubud + Nusa Dua) are the new default.',
    },
  ],
  pricingTiers: placeholderTiers(),
  experiences: [
    { key: 'uluwatu', name: 'Uluwatu Temple + Kecak dance', duration: '4 hrs', includes: 'Cliff-top temple + sunset Kecak fire dance', price: TBD },
    { key: 'ubud-tour', name: 'Ubud cultural tour', duration: 'Full day', includes: 'Tegallalang rice terraces · monkey forest · art villages', price: TBD },
    { key: 'mt-batur', name: 'Mt Batur sunrise trek', duration: 'Half day · early start', includes: '2hr ascent · sunrise above clouds · breakfast', price: TBD },
    { key: 'nusa-penida', name: 'Nusa Penida day trip', duration: 'Full day', includes: 'Speed boat · Kelingking + Angel Billabong + Crystal Bay', price: TBD },
    { key: 'cooking', name: 'Balinese cooking class', duration: '3 hrs', includes: 'Market visit + 5-course meal preparation', price: TBD },
  ],
  itineraries: [
    {
      key: 'bali-honeymoon',
      name: 'Bali Honeymoon',
      nights: '5N / 6D',
      hotelCategory: '4★ / 5★ villas',
      price: TBD,
      summary: 'Two areas: Ubud villa + Seminyak beach resort.',
      days: [
        { day: 1, title: 'Arrival + Ubud', items: ['Airport pickup', 'Private villa check-in (Ubud)', 'Welcome floral bath setup'] },
        { day: 2, title: 'Ubud culture', items: ['Tegallalang rice terraces', 'Monkey forest', 'Couples spa (on request)'] },
        { day: 3, title: 'Transfer to Seminyak', items: ['Late checkout', 'Drive to Seminyak (1.5 hrs)', 'Beach resort check-in'] },
        { day: 4, title: 'Uluwatu sunset', items: ['Free beach morning', 'Uluwatu + Kecak fire dance', 'Romantic dinner at Jimbaran Bay'] },
        { day: 5, title: 'Free day', items: ['Optional Nusa Penida day trip', 'Or full beach + spa day'] },
        { day: 6, title: 'Departure', items: ['Breakfast', 'Airport drop'] },
      ],
    },
  ],
  tripTypes: placeholderTripTypes(['uluwatu', 'ubud-tour', 'mt-batur', 'nusa-penida', 'cooking'], 'bali-honeymoon'),
  trustPoints: [
    { title: 'Two-area itineraries as default', desc: 'Ubud + Seminyak / Ubud + Nusa Dua splits priced cleanly.' },
    { title: 'Villa + resort hybrid', desc: 'Mix private villas (Ubud) with beach resorts (Seminyak/Nusa Dua) in one quote.' },
    { title: 'Honeymoon setups included', desc: 'Floral baths, candle-lit dinners, in-villa breakfasts — at no extra hand-holding from you.' },
  ],
  quoteIntent: 'Bali',
}

export const destinationBriefs = {
  dubai,
  azerbaijan,
  singapore,
  malaysia,
  bali,
}

// ── What we do for travel agents ────────────────────────────────
// Four ground-handling service boxes per destination. icon keys map
// to lucide icons in DestinationPage.jsx (transfers/hotels/attractions/visa).
const whatWeDoByDest = {
  dubai: [
    { icon: 'transfers', title: 'Transfers', text: 'Airport, intercity, private & group. Own fleet — fixed rates, no surge.' },
    { icon: 'hotels', title: 'Hotels', text: '3★ to 5★ across Downtown, Marina & JBR. Direct contracts, no markup surprises.' },
    { icon: 'attractions', title: 'Attractions', text: 'Burj Khalifa, Desert Safari, Dhow Cruise, theme parks — all pre-ticketed.' },
    { icon: 'visa', title: 'Visa', text: 'UAE visa for Indian passports. 30 & 60-day. Fast, tracked processing.' },
  ],
  azerbaijan: [
    { icon: 'transfers', title: 'Transfers', text: 'Airport & intercity to Baku, Gabala, Shahdag. Local Azeri fleet, fixed rates.' },
    { icon: 'hotels', title: 'Hotels', text: '3★ to 5★ across Baku city centre and mountain resorts. Direct-contracted.' },
    { icon: 'attractions', title: 'Attractions', text: 'Gobustan, Flame Towers, Sheki, mud volcanoes — guided and ticketed.' },
    { icon: 'visa', title: 'Visa', text: 'ASAN e-visa processed for you. You just share passport scans.' },
  ],
  singapore: [
    { icon: 'transfers', title: 'Transfers', text: 'Airport, city & Sentosa — private or shared coach. Fixed rates.' },
    { icon: 'hotels', title: 'Hotels', text: '16 partners 3★–5★ across Marina Bay, Orchard & Little India. Direct.' },
    { icon: 'attractions', title: 'Attractions', text: 'Universal Studios, Gardens by the Bay, SEA Aquarium, Night Safari — pre-booked tickets.' },
    { icon: 'visa', title: 'Visa', text: 'Singapore e-visa handled end to end for your clients.' },
  ],
  malaysia: [
    { icon: 'transfers', title: 'Transfers', text: 'KL, Langkawi & Genting transfers. Domestic flight legs bundled in.' },
    { icon: 'hotels', title: 'Hotels', text: '3★ to 5★ across KL, Langkawi & Penang. All direct contracts.' },
    { icon: 'attractions', title: 'Attractions', text: 'Petronas Skybridge, Batu Caves, Genting Skyway, island hopping — ticketed.' },
    { icon: 'visa', title: 'Visa', text: 'Visa-free for Indian passports (90 days) — zero pre-trip friction.' },
  ],
  bali: [
    { icon: 'transfers', title: 'Transfers', text: 'Airport & inter-area Ubud ↔ Seminyak ↔ Nusa Dua. Private cars.' },
    { icon: 'hotels', title: 'Hotels', text: 'Villas & 4★–5★ beach resorts across Ubud, Seminyak & Nusa Dua. Direct.' },
    { icon: 'attractions', title: 'Attractions', text: 'Uluwatu, Nusa Penida, rice terraces, Mt Batur trek — guided and ticketed.' },
    { icon: 'visa', title: 'Visa', text: 'Visa on Arrival / e-VoA guidance for your clients.' },
  ],
}

Object.values(destinationBriefs).forEach((d) => {
  d.whatWeDo = whatWeDoByDest[d.id] || []
})

// ── Real per-destination photos ────────────────────────────────
// Drop images into src/assets/destinations/<id>/ (jpg/png/webp).
// They are auto-loaded here (alphabetical order) and drive the
// Signature Moments tiles, experience cards and pricing-tier headers.
// Until photos are added, those image slots stay empty (sections that
// need images hide themselves rather than show placeholder stock).
const destPhotoModules = import.meta.glob(
  '../assets/destinations/*/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
)

function destPhotos(id) {
  return Object.entries(destPhotoModules)
    .filter(([path]) => path.includes(`/destinations/${id}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src)
}

// Wire real photos into each destination, replacing stock placeholders.
Object.values(destinationBriefs).forEach((d) => {
  const photos = destPhotos(d.id)
  if (photos.length > 0) {
    // Signature moments keep their curated captions, get real images in order.
    d.signatureMoments = (d.signatureMoments || []).map((m, i) => ({
      ...m,
      image: photos[i % photos.length],
    }))
    // Experience cards keep their curated per-tour image (which actually
    // matches the tour); only fall back to a local photo when none is set.
    d.experiences = (d.experiences || []).map((e, i) => ({
      ...e,
      image: e.image || photos[i % photos.length],
    }))
    d.pricingTiers = (d.pricingTiers || []).map((t, i) => ({
      ...t,
      image: photos[i % photos.length],
    }))
  } else {
    // No real photos yet → hide moments, drop unreliable stock from cards.
    d.signatureMoments = []
    d.experiences = (d.experiences || []).map((e) => ({ ...e, image: undefined }))
    d.pricingTiers = (d.pricingTiers || []).map((t) => ({ ...t, image: undefined }))
  }
})

export function getDestinationBrief(id) {
  return destinationBriefs[id] || null
}
