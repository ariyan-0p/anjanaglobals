const testimonialModules = import.meta.glob('../assets/testimonials/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const testimonialImages = Object.entries(testimonialModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src)

const demoByDestination = {
  dubai: testimonialImages.slice(0, 2),
  azerbaijan: testimonialImages.slice(2, 4),
  singapore: testimonialImages.slice(4, 6),
  malaysia: testimonialImages.slice(6, 8),
  bali: testimonialImages.slice(8, 10),
}

export const destinations = [
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    tagline: 'Where Dreams Touch the Sky',
    description:
      'Experience the perfect blend of ultra-modern architecture, luxury shopping, and vibrant nightlife set against the backdrop of a rich Emirati heritage. From the glittering Burj Khalifa to the golden dunes of the Arabian desert, Dubai redefines what extraordinary looks like.',
    shortDesc: 'Luxury, adventure & iconic skylines in the heart of the Middle East.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
      'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80',
    ],
    highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Palm Jumeirah', 'Gold & Spice Souk', 'Dhow Cruise'],
    bestTime: 'November – April',
    currency: 'AED (Dirham)',
    language: 'Arabic, English',
    packages: 6,
    color: '#C9A84C',
    bgColor: 'rgba(201,168,76,0.08)',
    visa: 'Visa on Arrival (most nationalities)',
    facts: { timezone: 'GMT+4', capital: 'Abu Dhabi', area: '4,114 km²', climate: 'Desert / Arid' },
    popularFor: ['Shopping', 'Adventure', 'Luxury', 'Family', 'MICE'],
    airlines: ['Emirates', 'flydubai', 'Air India', 'IndiGo'],
  },
  {
    id: 'azerbaijan',
    name: 'Azerbaijan',
    country: 'Azerbaijan',
    flag: '🇦🇿',
    tagline: 'Land of Fire & Heritage',
    description:
      "Discover the captivating land where ancient Silk Road heritage meets modern innovation. Baku's medieval Old City stands beneath futuristic Flame Towers, while ancient mud volcanoes, lush mountain forests, and the warm Caspian coast offer a diversity few destinations can match.",
    shortDesc: 'Ancient Silk Road heritage meets futuristic flair on the Caspian.',
    image: 'https://images.unsplash.com/photo-1570214476695-8f09e2e1cc87?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1570214476695-8f09e2e1cc87?w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1574175819253-0cdec79e6253?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    ],
    highlights: ['Baku Old City (Icherisheher)', 'Flame Towers', 'Gobustan Mud Volcanoes', 'Sheki Khan Palace', 'Lahij Village', 'Gabala Mountain Resort'],
    bestTime: 'April – June, Sept – Nov',
    currency: 'AZN (Manat)',
    language: 'Azerbaijani, Russian',
    packages: 4,
    color: '#0092BC',
    bgColor: 'rgba(0,146,188,0.08)',
    visa: 'E-Visa (ASAN Visa)',
    facts: { timezone: 'GMT+4', capital: 'Baku', area: '86,600 km²', climate: 'Semi-arid / Continental' },
    popularFor: ['Culture', 'Heritage', 'Adventure', 'Honeymoon', 'Groups'],
    airlines: ['Azerbaijan Airlines', 'Turkish Airlines', 'FlyDubai'],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    tagline: 'The Garden City of Asia',
    description:
      'A futuristic city-state where cultures, cuisines, and cutting-edge design collide in perfect harmony. From the iconic Marina Bay Sands to the lush Gardens by the Bay, Singapore blends nature and technology to create experiences that feel truly otherworldly.',
    shortDesc: 'Futuristic skylines, world-class food & Asia\'s most efficient city.',
    image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    ],
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Universal Studios', 'Hawker Centres', 'Orchard Road'],
    bestTime: 'February – April',
    currency: 'SGD (Singapore Dollar)',
    language: 'English, Mandarin, Malay, Tamil',
    packages: 5,
    color: '#EF4444',
    bgColor: 'rgba(239,68,68,0.08)',
    visa: 'Visa-free for most nationalities',
    facts: { timezone: 'GMT+8', capital: 'Singapore', area: '728 km²', climate: 'Tropical / Humid' },
    popularFor: ['Family', 'Shopping', 'MICE', 'Honeymoon', 'Food'],
    airlines: ['Singapore Airlines', 'Scoot', 'Air India', 'IndiGo'],
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    tagline: 'Truly Asia — Infinitely Diverse',
    description:
      'A vibrant tapestry of rainforests, stunning beaches, and cosmopolitan cities. Malaysia offers extraordinary cultural diversity, extraordinary food, and extraordinary natural beauty — from the Petronas Twin Towers to the primordial jungles of Borneo and idyllic shores of Langkawi.',
    shortDesc: 'Rainforests, beaches, twin towers & Southeast Asia\'s most diverse cuisine.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1549526610-01cff2e06a77?w=800&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    ],
    highlights: ['Petronas Twin Towers', 'Langkawi Island', 'Cameron Highlands', 'Penang Street Art', 'Borneo Rainforest', 'Genting Highlands'],
    bestTime: 'March – October',
    currency: 'MYR (Ringgit)',
    language: 'Malay, English, Mandarin',
    packages: 5,
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.08)',
    visa: 'Visa-free for most nationalities',
    facts: { timezone: 'GMT+8', capital: 'Kuala Lumpur', area: '329,847 km²', climate: 'Tropical' },
    popularFor: ['Family', 'Nature', 'Shopping', 'Honeymoon', 'Groups'],
    airlines: ['Malaysia Airlines', 'AirAsia', 'Batik Air', 'IndiGo'],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    tagline: 'Island of the Gods',
    description:
      "Bali's emerald rice terraces, ancient temples, and deeply spiritual culture create an enchanting escape unlike anywhere on Earth. Whether you seek spiritual renewal in Ubud, surf on Kuta's shores, or watch a flaming sunset at Tanah Lot — Bali is pure magic.",
    shortDesc: 'Ancient temples, emerald rice fields & soul-restoring island magic.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    highlights: ['Tegalalang Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur Sunrise Trek', 'Tirta Empul', 'Nusa Penida'],
    bestTime: 'April – October',
    currency: 'IDR (Indonesian Rupiah)',
    language: 'Balinese, Indonesian, English',
    packages: 5,
    color: '#10B981',
    bgColor: 'rgba(16,185,129,0.08)',
    visa: 'Visa on Arrival / E-Visa',
    facts: { timezone: 'GMT+8', capital: 'Denpasar', area: '5,780 km²', climate: 'Tropical' },
    popularFor: ['Honeymoon', 'Wellness', 'Adventure', 'Family', 'Culture'],
    airlines: ['Garuda Indonesia', 'AirAsia', 'IndiGo', 'Air India'],
  },
]

destinations.forEach((dest) => {
  const demos = demoByDestination[dest.id] || []
  dest.testimonialImages = demos
  dest.galleryImages = [...dest.galleryImages, ...demos]
})

export const getDestination = (id) => destinations.find(d => d.id === id)
