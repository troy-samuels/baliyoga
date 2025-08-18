/**
 * Studio Type Classification and URL Structure
 * 
 * This file defines studio types based on yoga styles and characteristics
 * to create SEO-friendly URLs like /studios/ubud/hot-yoga-studio
 */

export const STUDIO_TYPE_MAPPING = {
  // Primary studio types based on yoga styles and focus
  'traditional': {
    keywords: ['traditional', 'classical', 'authentic', 'hatha', 'spiritual', 'meditative'],
    styles: ['Hatha', 'Yin', 'Restorative', 'Meditation'],
    slug: 'traditional-yoga-studio',
    displayName: 'Traditional Yoga Studio',
    description: 'Classic yoga practices with focus on alignment and mindfulness'
  },
  'vinyasa': {
    keywords: ['vinyasa', 'flow', 'dynamic', 'movement', 'breath'],
    styles: ['Vinyasa', 'Flow', 'Power'],
    slug: 'vinyasa-flow-studio',
    displayName: 'Vinyasa Flow Studio',
    description: 'Dynamic flowing yoga practices connecting breath and movement'
  },
  'hot': {
    keywords: ['hot', 'heated', 'bikram', 'warm', 'temperature'],
    styles: ['Hot', 'Bikram', 'Power'],
    slug: 'hot-yoga-studio',
    displayName: 'Hot Yoga Studio',
    description: 'Heated yoga practices in climate-controlled environments'
  },
  'power': {
    keywords: ['power', 'strength', 'athletic', 'fitness', 'strong', 'intense'],
    styles: ['Power', 'Ashtanga', 'Vinyasa'],
    slug: 'power-yoga-studio',
    displayName: 'Power Yoga Studio',
    description: 'Intense, strength-building yoga practices for fitness'
  },
  'ashtanga': {
    keywords: ['ashtanga', 'mysore', 'traditional', 'series', 'disciplined'],
    styles: ['Ashtanga', 'Mysore'],
    slug: 'ashtanga-yoga-studio',
    displayName: 'Ashtanga Yoga Studio',
    description: 'Traditional Ashtanga yoga practice with set sequences'
  },
  'wellness': {
    keywords: ['wellness', 'healing', 'therapy', 'therapeutic', 'gentle', 'restorative', 'mindfulness'],
    styles: ['Restorative', 'Yin', 'Gentle', 'Therapy'],
    slug: 'wellness-yoga-studio',
    displayName: 'Wellness Yoga Studio',
    description: 'Gentle, therapeutic yoga practices for healing and wellness'
  },
  'boutique': {
    keywords: ['boutique', 'premium', 'luxury', 'exclusive', 'private', 'small'],
    styles: ['Vinyasa', 'Hatha', 'Yin'],
    slug: 'boutique-yoga-studio',
    displayName: 'Boutique Yoga Studio',
    description: 'Intimate, premium yoga experiences with personalized attention'
  },
  'community': {
    keywords: ['community', 'donation', 'accessible', 'inclusive', 'neighborhood', 'local'],
    styles: ['Hatha', 'Vinyasa', 'Gentle'],
    slug: 'community-yoga-studio',
    displayName: 'Community Yoga Studio',
    description: 'Accessible, community-focused yoga studios for everyone'
  }
} as const

export type StudioTypeKey = keyof typeof STUDIO_TYPE_MAPPING
export type StudioType = typeof STUDIO_TYPE_MAPPING[StudioTypeKey]

/**
 * Location slug mapping for SEO-friendly URLs (reusing from retreat-types)
 */
export const STUDIO_LOCATION_SLUG_MAPPING = {
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

export const POPULAR_STUDIO_LOCATIONS = [
  'ubud', 'canggu', 'seminyak', 'denpasar', 'sanur', 'uluwatu', 'jimbaran', 'lovina', 'amed'
] as const

/**
 * Generate studio type slug based on business characteristics
 */
export function generateStudioTypeSlug(studio: {
  name: string
  business_description?: string
  yoga_styles?: string[]
  amenities?: string[]
}): string {
  const name = studio.name.toLowerCase()
  const description = (studio.business_description || '').toLowerCase()
  const styles = studio.yoga_styles || []
  const amenities = studio.amenities || []
  
  const allText = `${name} ${description} ${styles.join(' ')} ${amenities.join(' ')}`.toLowerCase()
  
  // Check for hot yoga first (most specific)
  if (STUDIO_TYPE_MAPPING['hot'].keywords.some(keyword => 
    allText.includes(keyword)) || 
    styles.some(style => ['Hot', 'Bikram'].includes(style))) {
    return 'hot-yoga-studio'
  }
  
  // Check for Ashtanga (specific practice)
  if (STUDIO_TYPE_MAPPING['ashtanga'].keywords.some(keyword => 
    allText.includes(keyword)) || 
    styles.some(style => ['Ashtanga', 'Mysore'].includes(style))) {
    return 'ashtanga-yoga-studio'
  }
  
  // Check for power/fitness focus
  if (STUDIO_TYPE_MAPPING['power'].keywords.some(keyword => 
    allText.includes(keyword)) || 
    styles.some(style => ['Power'].includes(style))) {
    return 'power-yoga-studio'
  }
  
  // Check for boutique/premium indicators
  if (STUDIO_TYPE_MAPPING['boutique'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'boutique-yoga-studio'
  }
  
  // Check for wellness/therapeutic focus
  if (STUDIO_TYPE_MAPPING['wellness'].keywords.some(keyword => 
    allText.includes(keyword)) || 
    styles.some(style => ['Restorative', 'Therapy', 'Gentle'].includes(style))) {
    return 'wellness-yoga-studio'
  }
  
  // Check for community focus
  if (STUDIO_TYPE_MAPPING['community'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'community-yoga-studio'
  }
  
  // Check for vinyasa/flow focus
  if (styles.some(style => ['Vinyasa', 'Flow'].includes(style)) ||
    STUDIO_TYPE_MAPPING['vinyasa'].keywords.some(keyword => 
    allText.includes(keyword))) {
    return 'vinyasa-flow-studio'
  }
  
  // Default to traditional
  return 'traditional-yoga-studio'
}

/**
 * Generate location slug from city name (reusing logic from retreat-types)
 */
export function generateStudioLocationSlug(city: string | null | undefined): string {
  if (!city) return 'bali'
  
  // Check exact mapping first
  if (city in STUDIO_LOCATION_SLUG_MAPPING) {
    return STUDIO_LOCATION_SLUG_MAPPING[city as keyof typeof STUDIO_LOCATION_SLUG_MAPPING]
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
 * Get studio type info by slug
 */
export function getStudioTypeBySlug(slug: string): StudioType | null {
  const entry = Object.entries(STUDIO_TYPE_MAPPING).find(([key, type]) => type.slug === slug)
  return entry ? entry[1] : null
}

/**
 * Get all studio type slugs
 */
export function getAllStudioTypeSlugs(): string[] {
  return Object.values(STUDIO_TYPE_MAPPING).map(type => type.slug)
}

/**
 * Get all studio location slugs
 */
export function getAllStudioLocationSlugs(): string[] {
  return Object.values(STUDIO_LOCATION_SLUG_MAPPING)
}

/**
 * Generate full studio URL path
 */
export function generateStudioUrlPath(studio: {
  name: string
  city?: string | null
  business_description?: string
  yoga_styles?: string[]
  amenities?: string[]
}): string {
  const locationSlug = generateStudioLocationSlug(studio.city)
  const typeSlug = generateStudioTypeSlug(studio)
  
  return `/studios/${locationSlug}/${typeSlug}`
}