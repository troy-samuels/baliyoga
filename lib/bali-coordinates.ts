/**
 * Static coordinates for major Bali locations
 * This eliminates the need for Geocoding API calls while providing accurate locations
 */

export interface BaliLocation {
  lat: number
  lng: number
  name: string
  aliases: string[]
  zoom: number
}

export const BALI_LOCATIONS: Record<string, BaliLocation> = {
  // Major cities and regions
  ubud: {
    lat: -8.5069,
    lng: 115.2625,
    name: 'Ubud',
    aliases: ['ubud center', 'central ubud', 'ubud bali'],
    zoom: 15
  },

  canggu: {
    lat: -8.6481,
    lng: 115.1253,
    name: 'Canggu',
    aliases: ['canggu beach', 'canggu bali', 'cangu'],
    zoom: 15
  },

  seminyak: {
    lat: -8.6914,
    lng: 115.1689,
    name: 'Seminyak',
    aliases: ['seminyak beach', 'seminyak bali'],
    zoom: 15
  },

  sanur: {
    lat: -8.6872,
    lng: 115.2608,
    name: 'Sanur',
    aliases: ['sanur beach', 'sanur bali'],
    zoom: 15
  },

  kuta: {
    lat: -8.7205,
    lng: 115.1693,
    name: 'Kuta',
    aliases: ['kuta beach', 'kuta bali'],
    zoom: 15
  },

  denpasar: {
    lat: -8.6500,
    lng: 115.2167,
    name: 'Denpasar',
    aliases: ['denpasar city', 'denpasar bali'],
    zoom: 13
  },

  jimbaran: {
    lat: -8.7894,
    lng: 115.1647,
    name: 'Jimbaran',
    aliases: ['jimbaran beach', 'jimbaran bay'],
    zoom: 15
  },

  uluwatu: {
    lat: -8.8298,
    lng: 115.0845,
    name: 'Uluwatu',
    aliases: ['uluwatu temple', 'uluwatu bali'],
    zoom: 15
  },

  // Ubud area locations
  'ubud monkey forest': {
    lat: -8.5174,
    lng: 115.2624,
    name: 'Ubud Monkey Forest',
    aliases: ['monkey forest sanctuary', 'sacred monkey forest'],
    zoom: 16
  },

  'ubud center': {
    lat: -8.5069,
    lng: 115.2625,
    name: 'Ubud Center',
    aliases: ['ubud town center', 'central ubud'],
    zoom: 16
  },

  'ubud rice terraces': {
    lat: -8.4953,
    lng: 115.2731,
    name: 'Tegallalang Rice Terraces',
    aliases: ['tegallalang', 'rice terraces ubud'],
    zoom: 15
  },

  // Canggu area locations
  'canggu beach': {
    lat: -8.6481,
    lng: 115.1253,
    name: 'Canggu Beach',
    aliases: ['pantai canggu', 'canggu surf beach'],
    zoom: 16
  },

  'echo beach': {
    lat: -8.6213,
    lng: 115.1217,
    name: 'Echo Beach',
    aliases: ['echo beach canggu', 'pantai echo'],
    zoom: 16
  },

  'berawa beach': {
    lat: -8.6393,
    lng: 115.1324,
    name: 'Berawa Beach',
    aliases: ['berawa', 'pantai berawa'],
    zoom: 16
  },

  // Northern Bali
  lovina: {
    lat: -8.1580,
    lng: 115.0253,
    name: 'Lovina',
    aliases: ['lovina beach', 'lovina bali'],
    zoom: 14
  },

  // Eastern Bali
  amed: {
    lat: -8.3419,
    lng: 115.6625,
    name: 'Amed',
    aliases: ['amed beach', 'amed bali'],
    zoom: 14
  },

  // Central Bali
  'mount batur': {
    lat: -8.2422,
    lng: 115.3750,
    name: 'Mount Batur',
    aliases: ['gunung batur', 'batur volcano'],
    zoom: 12
  },

  // West Bali
  'negara': {
    lat: -8.3553,
    lng: 114.6186,
    name: 'Negara',
    aliases: ['negara bali', 'west bali'],
    zoom: 13
  },

  // Default fallback for Bali
  bali: {
    lat: -8.4095,
    lng: 115.1889,
    name: 'Bali',
    aliases: ['bali indonesia', 'island of bali', 'province of bali'],
    zoom: 10
  }
}

/**
 * Find coordinates for a location based on address or name
 */
export function findBaliCoordinates(address: string, name?: string, city?: string): BaliLocation | null {
  const searchText = `${address} ${name} ${city}`.toLowerCase().trim()

  // Direct location match
  for (const [key, location] of Object.entries(BALI_LOCATIONS)) {
    if (searchText.includes(key) ||
        location.aliases.some(alias => searchText.includes(alias.toLowerCase()))) {
      return location
    }
  }

  // City-based matching
  const cityMatches: Record<string, string> = {
    'ubud': 'ubud',
    'canggu': 'canggu',
    'cangu': 'canggu',
    'seminyak': 'seminyak',
    'sanur': 'sanur',
    'kuta': 'kuta',
    'jimbaran': 'jimbaran',
    'uluwatu': 'uluwatu',
    'denpasar': 'denpasar',
    'lovina': 'lovina',
    'amed': 'amed',
    'negara': 'negara'
  }

  for (const [searchKey, locationKey] of Object.entries(cityMatches)) {
    if (searchText.includes(searchKey)) {
      return BALI_LOCATIONS[locationKey]
    }
  }

  // Default to general Bali location
  return BALI_LOCATIONS.bali
}

/**
 * Get all available Bali locations for reference
 */
export function getAllBaliLocations(): BaliLocation[] {
  return Object.values(BALI_LOCATIONS)
}

/**
 * Get major city locations only
 */
export function getMajorBaliCities(): BaliLocation[] {
  const majorCities = ['ubud', 'canggu', 'seminyak', 'sanur', 'kuta', 'denpasar', 'jimbaran', 'uluwatu']
  return majorCities.map(city => BALI_LOCATIONS[city]).filter(Boolean)
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Find the closest location to given coordinates
 */
export function findClosestLocation(lat: number, lng: number): BaliLocation {
  let closest = BALI_LOCATIONS.bali
  let minDistance = Infinity

  for (const location of Object.values(BALI_LOCATIONS)) {
    const distance = calculateDistance(lat, lng, location.lat, location.lng)
    if (distance < minDistance) {
      minDistance = distance
      closest = location
    }
  }

  return closest
}