// Hotel partner logos. Files are picked up automatically from the
// assets folders below via Vite's import.meta.glob — drop a new image
// into the matching folder and it appears on the site after rebuild.
// Filename (without extension) becomes the displayed hotel name.

const dubaiModules = import.meta.glob('../assets/DXB Partners/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})

const azerbaijanModules = import.meta.glob('../assets/Azerbaijan Partners/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})

// Singapore logos are organised by star rating in separate folders.
const singapore3StarModules = import.meta.glob('../assets/3 Star/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})
const singapore4StarModules = import.meta.glob('../assets/4 Star/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})
const singapore5StarModules = import.meta.glob('../assets/5 Star/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})

function nameFromPath(path) {
  const file = path.split(/[\\/]/).pop() || ''
  return file.replace(/\.[^.]+$/, '').trim()
}

function toEntries(modules, extra = {}) {
  return Object.entries(modules)
    .map(([path, logo]) => ({
      name: nameFromPath(path),
      logo,
      ...extra,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const hotelPartners = {
  dubai: toEntries(dubaiModules),
  azerbaijan: toEntries(azerbaijanModules),
  singapore: [
    ...toEntries(singapore5StarModules, { stars: 5 }),
    ...toEntries(singapore4StarModules, { stars: 4 }),
    ...toEntries(singapore3StarModules, { stars: 3 }),
  ],
  malaysia: [],
  bali: [],
}

// Pick specific hotels from a destination list by exact name match.
// Silently skips names that don't (yet) have a matching file in assets.
function pickByName(list, names) {
  const byName = new Map(list.map((h) => [h.name, h]))
  return names.map((n) => byName.get(n)).filter(Boolean)
}

// Homepage strip — hand-curated. Edit the arrays below to control
// exactly which logos appear on the home and Services pages.
export const homepagePartners = [
  ...pickByName(hotelPartners.dubai, [
    'Admiral Plaza',
    'Canvas Hotel',
    'Citymax Hotel',
    'Crowne Plaza Yas Island',
    'Royal Ascot',
    "Jacob's Garden",
  ]),
  ...pickByName(hotelPartners.singapore, [
    'Grand Copthorne Waterfront Hotel Singapore',
    'Marina Bay Sands Singapore',
    'One Farrer Hotel',
  ]),
  ...pickByName(hotelPartners.azerbaijan, [
    'AtlasHotel',
    'Altus Hotel',
    'Austin Hotel',
    'Marriott Boulevard',
  ]),
]
