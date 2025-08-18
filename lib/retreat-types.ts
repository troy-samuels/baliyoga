/**
 * Retreat Type Classification and URL Structure
 * 
 * This file defines retreat types based on yoga styles and characteristics
 * to create SEO-friendly URLs like /retreats/ubud/wellness-retreat
 */

export const RETREAT_TYPE_MAPPING = {
  // Primary retreat types based on focus
  'wellness': {
    keywords: ['wellness', 'detox', 'healing', 'holistic', 'mindfulness', 'meditation'],
    styles: ['Yin', 'Restorative', 'Meditation'],
    slug: 'wellness-retreat',
    displayName: 'Wellness Retreat',
    description: 'Holistic wellness and healing focused retreats'
  },
  'yoga': {
    keywords: ['yoga', 'asana', 'practice', 'flow', 'traditional'],
    styles: ['Hatha', 'Vinyasa', 'Ashtanga', 'Iyengar'],
    slug: 'yoga-retreat',
    displayName: 'Yoga Retreat', 
    description: 'Traditional yoga practice and instruction retreats'
  },
  'spiritual': {
    keywords: ['spiritual', 'awakening', 'consciousness', 'enlightenment', 'sacred', 'divine'],
    styles: ['Kundalini', 'Meditation', 'Spiritual'],
    slug: 'spiritual-retreat',
    displayName: 'Spiritual Retreat',
    description: 'Spiritual awakening and consciousness retreats'
  },
  'adventure': {
    keywords: ['adventure', 'hiking', 'surfing', 'nature', 'outdoor', 'active'],
    styles: ['Vinyasa', 'Power', 'Dynamic'],
    slug: 'adventure-retreat',
    displayName: 'Adventure Retreat',
    description: 'Active adventure and outdoor yoga retreats'
  },
  'luxury': {
    keywords: ['luxury', 'premium', 'exclusive', 'spa', 'high-end', 'boutique'],
    styles: ['Restorative', 'Yin', 'Gentle'],
    slug: 'luxury-retreat',
    displayName: 'Luxury Retreat',
    description: 'Premium luxury wellness retreats'
  },
  'teacher-training': {
    keywords: ['teacher', 'training', 'certification', 'instructor', 'course', 'education'],
    styles: ['Hatha', 'Vinyasa', 'Ashtanga'],
    slug: 'teacher-training',
    displayName: 'Teacher Training',
    description: 'Yoga teacher training and certification programs'
  }
} as const

export type RetreatTypeKey = keyof typeof RETREAT_TYPE_MAPPING
export type RetreatType = typeof RETREAT_TYPE_MAPPING[RetreatTypeKey]

/**
 * Location slug mapping for SEO-friendly URLs
 */
export const LOCATION_SLUG_MAPPING = {
  'Gianyar Regency': 'ubud',
  'Badung Regency': 'canggu', 
  'Denpasar City': 'denpasar',
  'Tabanan Regency': 'tabanan',
  'Buleleng Regency': 'lovina',
  'Karangasem Regency': 'amed',
  'Bangli Regency': 'bangli',
  'Klungkung Regency': 'klungkung',
  // Fallback for other locations
  'Bali': 'bali'
} as const

export const POPULAR_LOCATIONS = [
  'ubud', 'canggu', 'seminyak', 'denpasar', 'sanur', 'uluwatu', 'jimbaran', 'lovina', 'amed'
] as const

/**
 * Generate retreat type slug based on business characteristics
 */
export function generateRetreatTypeSlug(retreat: {
  name: string
  business_description?: string
  yoga_styles?: string[]
  amenities?: string[]
}): string {
  const name = retreat.name.toLowerCase()
  const description = (retreat.business_description || '').toLowerCase()
  const styles = retreat.yoga_styles || []
  const amenities = retreat.amenities || []
  
  const allText = `${name} ${description} ${styles.join(' ')} ${amenities.join(' ')}`.toLowerCase()
  
  // Check for teacher training first (most specific)
  if (RETREAT_TYPE_MAPPING['teacher-training'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'teacher-training'
  }
  
  // Check for luxury indicators
  if (RETREAT_TYPE_MAPPING['luxury'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'luxury-retreat'
  }
  
  // Check for spiritual focus
  if (RETREAT_TYPE_MAPPING['spiritual'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'spiritual-retreat'
  }
  
  // Check for adventure/active
  if (RETREAT_TYPE_MAPPING['adventure'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'adventure-retreat'
  }
  
  // Check for wellness focus
  if (RETREAT_TYPE_MAPPING['wellness'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'wellness-retreat'
  }
  
  // Default to yoga retreat
  return 'yoga-retreat'
}

/**
 * Generate location slug from city name
 */
export function generateLocationSlug(city: string | null | undefined): string {
  if (!city) return 'bali'
  
  // Check exact mapping first
  if (city in LOCATION_SLUG_MAPPING) {
    return LOCATION_SLUG_MAPPING[city as keyof typeof LOCATION_SLUG_MAPPING]
  }
  
  // Generate slug from city name
  return city
    .toLowerCase()
    .replace(/\s+(regency|city|district)$/i, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

/**
 * Get retreat type info by slug
 */
export function getRetreatTypeBySlug(slug: string): RetreatType | null {
  const entry = Object.entries(RETREAT_TYPE_MAPPING).find(([key, type]) => type.slug === slug)
  return entry ? entry[1] : null
}

/**
 * Get all retreat type slugs
 */
export function getAllRetreatTypeSlugs(): string[] {
  return Object.values(RETREAT_TYPE_MAPPING).map(type => type.slug)
}

/**
 * Get all location slugs
 */
export function getAllLocationSlugs(): string[] {
  return Object.values(LOCATION_SLUG_MAPPING)
}

/**
 * Generate full retreat URL path
 */
export function generateRetreatUrlPath(retreat: {
  name: string
  city?: string | null
  business_description?: string
  yoga_styles?: string[]
  amenities?: string[]
}): string {
  const locationSlug = generateLocationSlug(retreat.city)
  const typeSlug = generateRetreatTypeSlug(retreat)
  
  return `/retreats/${locationSlug}/${typeSlug}`
}