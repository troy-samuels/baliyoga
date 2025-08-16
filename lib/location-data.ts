/**
 * Bali Location Data for Landing Pages
 * 
 * This file contains detailed information about each location in Bali
 * for creating location-specific landing pages
 */

export interface LocationInfo {
  slug: string
  name: string
  displayName: string
  description: string
  highlights: string[]
  atmosphere: string
  bestFor: string[]
  image: string
  coordinates?: { lat: number; lng: number }
  popularAreas?: string[]
  transportation: string
  priceRange: 'budget' | 'mid-range' | 'luxury' | 'mixed'
  crowdLevel: 'quiet' | 'moderate' | 'busy' | 'very-busy'
}

export const BALI_LOCATIONS: Record<string, LocationInfo> = {
  'ubud': {
    slug: 'ubud',
    name: 'Ubud',
    displayName: 'Ubud',
    description: 'The spiritual heart of Bali, Ubud is renowned worldwide as a yoga and wellness destination. Surrounded by lush rice terraces, ancient temples, and healing retreats, it offers the perfect environment for deepening your yoga practice and finding inner peace.',
    highlights: [
      'World-famous yoga retreat center',
      'Sacred temples and rice terraces',
      'Holistic healing and wellness',
      'Organic cafes and healthy cuisine',
      'Traditional Balinese culture'
    ],
    atmosphere: 'Spiritual, peaceful, and deeply connected to nature and traditional Balinese culture.',
    bestFor: [
      'Yoga retreats and teacher training',
      'Meditation and spiritual practice',
      'Wellness and healing',
      'Cultural immersion',
      'Digital nomads seeking tranquility'
    ],
    image: '/images/locations/ubud-rice-terraces.jpg',
    coordinates: { lat: -8.5069, lng: 115.2625 },
    popularAreas: ['Central Ubud', 'Monkey Forest Road', 'Jalan Raya', 'Campuhan Ridge'],
    transportation: 'Motorbike rental, bicycle, private transport, walking',
    priceRange: 'mid-range',
    crowdLevel: 'busy'
  },
  
  'canggu': {
    slug: 'canggu',
    name: 'Canggu',
    displayName: 'Canggu',
    description: 'A vibrant beach town that perfectly blends surf culture with yoga lifestyle. Canggu offers world-class waves, trendy beach clubs, and a thriving yoga scene with studios just steps from black sand beaches.',
    highlights: [
      'Surf and yoga combination',
      'Beachfront yoga studios',
      'Trendy cafes and co-working spaces',
      'Vibrant nightlife and beach clubs',
      'International community'
    ],
    atmosphere: 'Laid-back surf vibes mixed with modern wellness culture and international flair.',
    bestFor: [
      'Surf and yoga retreats',
      'Beachside yoga practice',
      'Digital nomad community',
      'Fitness and active lifestyle',
      'Young travelers and creatives'
    ],
    image: '/images/locations/canggu-beach-yoga.jpg',
    coordinates: { lat: -8.6481, lng: 115.1253 },
    popularAreas: ['Echo Beach', 'Batu Bolong', 'Berawa', 'Pererenan'],
    transportation: 'Motorbike rental, bicycle, ride-sharing apps',
    priceRange: 'mid-range',
    crowdLevel: 'very-busy'
  },

  'seminyak': {
    slug: 'seminyak',
    name: 'Seminyak',
    displayName: 'Seminyak',
    description: 'Bali\'s most sophisticated beach destination, offering luxury yoga experiences alongside high-end beach clubs, designer boutiques, and world-class restaurants. Perfect for those seeking premium wellness experiences.',
    highlights: [
      'Luxury yoga studios and spas',
      'Premium beach clubs',
      'High-end shopping and dining',
      'Beautiful sunset beaches',
      'Sophisticated wellness scene'
    ],
    atmosphere: 'Upscale, sophisticated, and cosmopolitan with a focus on luxury wellness.',
    bestFor: [
      'Luxury yoga and spa experiences',
      'Premium wellness retreats',
      'Romantic getaways',
      'Fashion and lifestyle enthusiasts',
      'Upscale dining and nightlife'
    ],
    image: '/images/locations/seminyak-luxury-yoga.jpg',
    coordinates: { lat: -8.6906, lng: 115.1656 },
    popularAreas: ['Petitenget', 'Double Six Beach', 'Kayu Aya', 'Jalan Laksmana'],
    transportation: 'Private transport, taxi, motorbike rental',
    priceRange: 'luxury',
    crowdLevel: 'busy'
  },

  'denpasar': {
    slug: 'denpasar',
    name: 'Denpasar',
    displayName: 'Denpasar',
    description: 'The bustling capital city of Bali, offering authentic local yoga experiences away from tourist crowds. Experience traditional Balinese culture while practicing yoga in community-focused studios.',
    highlights: [
      'Authentic Balinese yoga culture',
      'Local community studios',
      'Traditional markets and temples',
      'Affordable yoga classes',
      'Cultural immersion'
    ],
    atmosphere: 'Authentic, local, and culturally rich with a focus on traditional Balinese lifestyle.',
    bestFor: [
      'Budget-conscious travelers',
      'Cultural immersion',
      'Traditional yoga practices',
      'Local community experience',
      'Airport proximity'
    ],
    image: '/images/locations/denpasar-temple-yoga.jpg',
    coordinates: { lat: -8.6705, lng: 115.2126 },
    popularAreas: ['Central Denpasar', 'Sanglah', 'Renon', 'Sesetan'],
    transportation: 'Public transport, motorbike rental, taxi',
    priceRange: 'budget',
    crowdLevel: 'moderate'
  },

  'sanur': {
    slug: 'sanur',
    name: 'Sanur',
    displayName: 'Sanur',
    description: 'A peaceful seaside town perfect for gentle yoga practices and wellness. Known for its calm beaches, family-friendly atmosphere, and traditional Balinese fishing village charm.',
    highlights: [
      'Calm beaches for sunrise yoga',
      'Family-friendly yoga studios',
      'Traditional fishing village culture',
      'Peaceful and relaxed atmosphere',
      'Easy access to cultural sites'
    ],
    atmosphere: 'Peaceful, family-oriented, and traditionally Balinese with gentle wellness focus.',
    bestFor: [
      'Gentle and restorative yoga',
      'Family yoga experiences',
      'Mature travelers',
      'Sunrise beach meditation',
      'Cultural exploration'
    ],
    image: '/images/locations/sanur-sunrise-yoga.jpg',
    coordinates: { lat: -8.6881, lng: 115.2608 },
    popularAreas: ['Central Sanur', 'Sindhu Beach', 'Mertasari Beach'],
    transportation: 'Bicycle, motorbike rental, traditional bemo',
    priceRange: 'mid-range',
    crowdLevel: 'quiet'
  },

  'uluwatu': {
    slug: 'uluwatu',
    name: 'Uluwatu',
    displayName: 'Uluwatu',
    description: 'Perched on dramatic clifftops overlooking the Indian Ocean, Uluwatu offers spectacular yoga experiences with breathtaking views. Famous for world-class surfing and stunning clifftop temples.',
    highlights: [
      'Clifftop yoga with ocean views',
      'World-class surf breaks',
      'Spectacular sunset sessions',
      'Sacred clifftop temples',
      'Luxury resort yoga programs'
    ],
    atmosphere: 'Dramatic, scenic, and adventurous with a focus on natural beauty and surfing culture.',
    bestFor: [
      'Advanced yoga practitioners',
      'Surf and yoga combinations',
      'Spectacular view seekers',
      'Adventure enthusiasts',
      'Luxury retreat experiences'
    ],
    image: '/images/locations/uluwatu-cliff-yoga.jpg',
    coordinates: { lat: -8.8299, lng: 115.0784 },
    popularAreas: ['Bingin', 'Padang Padang', 'Suluban', 'Pecatu'],
    transportation: 'Motorbike rental, private transport, taxi',
    priceRange: 'luxury',
    crowdLevel: 'moderate'
  },

  'amed': {
    slug: 'amed',
    name: 'Amed',
    displayName: 'Amed',
    description: 'A tranquil fishing village on Bali\'s east coast, offering pristine black sand beaches and incredible diving. Perfect for yoga practitioners seeking solitude and natural beauty away from crowds.',
    highlights: [
      'Pristine black sand beaches',
      'World-class diving and snorkeling',
      'Authentic fishing village life',
      'Mount Agung sunrise views',
      'Peaceful and uncrowded'
    ],
    atmosphere: 'Remote, peaceful, and authentically Balinese with focus on natural beauty and solitude.',
    bestFor: [
      'Retreat from crowds',
      'Diving and underwater meditation',
      'Nature-focused yoga',
      'Authentic cultural experience',
      'Advanced practitioners seeking solitude'
    ],
    image: '/images/locations/amed-beach-yoga.jpg',
    coordinates: { lat: -8.3472, lng: 115.6669 },
    popularAreas: ['Jemeluk', 'Bunutan', 'Lipah Beach'],
    transportation: 'Motorbike rental, private transport',
    priceRange: 'budget',
    crowdLevel: 'quiet'
  },

  'lovina': {
    slug: 'lovina',
    name: 'Lovina',
    displayName: 'Lovina',
    description: 'A peaceful black sand beach destination in northern Bali, famous for dolphin watching and calm waters. Offers a more relaxed alternative to southern Bali with authentic local culture.',
    highlights: [
      'Dolphin watching at sunrise',
      'Calm black sand beaches',
      'Traditional northern Bali culture',
      'Hot springs and waterfalls nearby',
      'Peaceful and uncrowded'
    ],
    atmosphere: 'Calm, authentic, and traditionally Balinese with focus on nature and local culture.',
    bestFor: [
      'Peaceful yoga practice',
      'Nature and wildlife lovers',
      'Families with children',
      'Budget-conscious travelers',
      'Cultural immersion'
    ],
    image: '/images/locations/lovina-dolphin-yoga.jpg',
    coordinates: { lat: -8.1580, lng: 115.0264 },
    popularAreas: ['Kalibukbuk', 'Anturan', 'Tukad Mungga'],
    transportation: 'Motorbike rental, bicycle, traditional transport',
    priceRange: 'budget',
    crowdLevel: 'quiet'
  }
}

export const POPULAR_LOCATIONS = [
  'ubud', 'canggu', 'seminyak', 'sanur', 'uluwatu', 'denpasar', 'amed', 'lovina'
] as const

export type PopularLocation = typeof POPULAR_LOCATIONS[number]

/**
 * Get location info by slug
 */
export function getLocationInfo(slug: string): LocationInfo | null {
  return BALI_LOCATIONS[slug] || null
}

/**
 * Get all locations
 */
export function getAllLocations(): LocationInfo[] {
  return Object.values(BALI_LOCATIONS)
}

/**
 * Get popular locations only
 */
export function getPopularLocations(): LocationInfo[] {
  return POPULAR_LOCATIONS.map(slug => BALI_LOCATIONS[slug]).filter(Boolean)
}