// Hotel partner data per destination. The HotelPartners component renders each
// entry as a clean typographic name tile — using actual hotel logos would
// require trademark permission from each chain, so we display names instead.

export const hotelPartners = {
  dubai: [
    { name: 'Atlantis The Palm' },
    { name: 'Crowne Plaza Yas Island' },
    { name: 'Movenpick Bur Dubai' },
    { name: 'Millennium Downtown' },
    { name: 'Park Inn by Radisson Yas Island' },
    { name: 'Citymax Hotel' },
    { name: 'Admiral Plaza' },
    { name: 'Royal Ascot' },
    { name: 'Landmark Hotel' },
    { name: 'Canvas Hotel' },
    { name: 'Majestic City Retreat' },
  ],
  singapore: [
    { name: 'Marina Bay Sands' },
    { name: 'Pan Pacific Singapore' },
    { name: 'Grand Copthorne Waterfront' },
    { name: 'Novotel Singapore on Kitchener' },
    { name: 'Mercure Singapore Tyrwhitt' },
    { name: 'Holiday Inn Little India' },
    { name: 'Ibis Novena' },
    { name: 'YOTEL Orchard Road' },
    { name: 'Hotel Boss' },
    { name: 'V Hotel Lavender' },
    { name: 'V Hotel Bencoolen' },
    { name: 'Village Hotel Albert Court' },
    { name: 'One Farrer Hotel' },
    { name: 'Ibis Style Albert' },
    { name: 'Value Hotel Thomson' },
    { name: 'Hotel Bencoolen' },
    { name: 'The Quay Hotel' },
  ],
  azerbaijan: [
    { name: 'JW Marriott Absheron Baku' },
    { name: 'Pik Palace Shahdag' },
    { name: 'Sapphire City Hotel' },
    { name: 'Diamond Hotel Baku' },
    { name: 'Atlas Hotel Baku' },
    { name: 'Altus Hotel' },
    { name: 'Mildom Hotel' },
    { name: 'Austin Hotel' },
    { name: 'Shahdag Hotel & Spa' },
    { name: 'Gabala Garden' },
    { name: 'Sahil Hotel Baku' },
  ],
}

// Curated mix for the homepage strip — pulls a few names from each destination
// so the section reads as breadth rather than depth.
export const homepagePartners = [
  ...hotelPartners.dubai.slice(0, 4),
  ...hotelPartners.singapore.slice(0, 4),
  ...hotelPartners.azerbaijan.slice(0, 2),
]
