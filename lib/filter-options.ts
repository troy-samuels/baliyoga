/**
 * Data-Driven Filter Options
 * Real filter options based on standardized database content
 */

import type { Studio } from './types'

export interface FilterOption {
  id: string
  label: string
  count: number
  icon?: React.ReactNode
  quality?: 'high' | 'medium' | 'low'
  description?: string
}

export interface FilterCategory {
  id: string
  label: string
  icon: string
  options: FilterOption[]
  multiSelect?: boolean
}

// Location-based filters with geographic regions
export const LOCATION_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Locations', count: 450 },
  { id: 'south-bali', label: 'South Bali', count: 180, description: 'Seminyak, Canggu, Uluwatu, Denpasar' },
  { id: 'central-bali', label: 'Central Bali', count: 120, description: 'Ubud, Gianyar' },
  { id: 'east-bali', label: 'East Bali', count: 60, description: 'Karangasem, Amed, Candidasa' },
  { id: 'north-bali', label: 'North Bali', count: 45, description: 'Lovina, Singaraja' },
  { id: 'west-bali', label: 'West Bali', count: 30, description: 'Tabanan, Bedugul' },
  { id: 'islands', label: 'Islands', count: 15, description: 'Nusa Penida, Lembongan' }
]

// Quality-based filters using actual database metrics
export const QUALITY_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Studios', count: 450 },
  { id: 'excellent', label: 'Excellent (90-100%)', count: 173, quality: 'high', description: 'Complete profiles with verified info' },
  { id: 'good', label: 'Good (80-89%)', count: 127, quality: 'high', description: 'Well-documented studios' },
  { id: 'fair', label: 'Fair (70-79%)', count: 71, quality: 'medium', description: 'Decent information available' },
  { id: 'verified-contact', label: 'Verified Contact', count: 279, quality: 'high', description: 'Email verified' },
  { id: 'complete-profile', label: 'Complete Profile', count: 300, quality: 'high', description: 'All key fields filled' }
]

// Yoga style filters based on standardized data (top 20 most common)
export const YOGA_STYLE_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Styles', count: 450 },
  { id: 'hatha', label: 'Hatha', count: 84, description: 'Gentle, alignment-focused practice' },
  { id: 'yin', label: 'Yin', count: 83, description: 'Slow, meditative poses' },
  { id: 'vinyasa', label: 'Vinyasa', count: 78, description: 'Flow-based movement' },
  { id: 'meditation', label: 'Meditation', count: 78, description: 'Mindfulness and breathing' },
  { id: 'ashtanga', label: 'Ashtanga', count: 29, description: 'Traditional dynamic practice' },
  { id: 'restorative', label: 'Restorative', count: 25, description: 'Deeply relaxing poses' },
  { id: 'kundalini', label: 'Kundalini', count: 18, description: 'Spiritual awakening practice' },
  { id: 'power-yoga', label: 'Power Yoga', count: 15, description: 'Strength-building flow' },
  { id: 'hot-yoga', label: 'Hot Yoga', count: 12, description: 'Heated room practice' },
  { id: 'iyengar', label: 'Iyengar', count: 10, description: 'Precision and alignment' },
  { id: 'aerial-yoga', label: 'Aerial Yoga', count: 8, description: 'Suspended yoga practice' },
  { id: 'gentle-yoga', label: 'Gentle Yoga', count: 6, description: 'Beginner-friendly practice' }
]

// Amenity filters based on standardized data (top 25 most useful)
export const AMENITY_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Amenities', count: 450 },
  { id: 'showers', label: 'Showers', count: 44, description: 'Clean shower facilities' },
  { id: 'yoga-mats', label: 'Yoga Mats Provided', count: 36, description: 'Free mat rental' },
  { id: 'yoga-shop', label: 'Yoga Shop', count: 35, description: 'Equipment and clothing' },
  { id: 'changing-rooms', label: 'Changing Rooms', count: 33, description: 'Private changing areas' },
  { id: 'massage', label: 'Massage Services', count: 32, description: 'On-site massage therapy' },
  { id: 'spa-services', label: 'Spa Services', count: 29, description: 'Full spa treatments' },
  { id: 'yoga-props', label: 'Yoga Props', count: 27, description: 'Blocks, straps, bolsters' },
  { id: 'cafe', label: 'Cafe', count: 26, description: 'Healthy food and drinks' },
  { id: 'free-wifi', label: 'Free WiFi', count: 25, description: 'Complimentary internet' },
  { id: 'parking', label: 'Parking Available', count: 22, description: 'Free parking space' },
  { id: 'accommodation', label: 'Accommodation', count: 20, description: 'On-site lodging' },
  { id: 'garden', label: 'Garden Setting', count: 18, description: 'Natural outdoor space' },
  { id: 'swimming-pool', label: 'Swimming Pool', count: 15, description: 'Pool access included' },
  { id: 'restaurant', label: 'Restaurant', count: 14, description: 'Full dining service' },
  { id: 'organic-food', label: 'Organic Food', count: 12, description: 'Healthy, organic meals' },
  { id: 'sound-system', label: 'Sound System', count: 10, description: 'Quality audio equipment' },
  { id: 'air-conditioning', label: 'Air Conditioning', count: 8, description: 'Climate controlled' },
  { id: 'scenic-views', label: 'Scenic Views', count: 7, description: 'Beautiful surroundings' }
]

// Language filters based on standardized data
export const LANGUAGE_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Languages', count: 450 },
  { id: 'english', label: 'English', count: 92, description: 'English-speaking instructors' },
  { id: 'indonesian', label: 'Indonesian', count: 61, description: 'Local language instruction' },
  { id: 'german', label: 'German', count: 15, description: 'German-speaking classes' },
  { id: 'french', label: 'French', count: 8, description: 'French instruction available' },
  { id: 'dutch', label: 'Dutch', count: 6, description: 'Dutch-speaking instructors' },
  { id: 'spanish', label: 'Spanish', count: 5, description: 'Spanish classes offered' },
  { id: 'italian', label: 'Italian', count: 4, description: 'Italian instruction' },
  { id: 'japanese', label: 'Japanese', count: 3, description: 'Japanese-speaking teachers' }
]

// Special feature filters
export const FEATURE_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Features', count: 450 },
  { id: 'teacher-training', label: 'Teacher Training', count: 85, description: 'Certification programs' },
  { id: 'retreats', label: 'Retreats', count: 120, description: 'Multi-day programs' },
  { id: 'drop-in-classes', label: 'Drop-in Classes', count: 280, description: 'Single session welcome' },
  { id: 'beginner-friendly', label: 'Beginner Friendly', count: 200, description: 'Welcoming to newcomers' },
  { id: 'advanced-practice', label: 'Advanced Practice', count: 95, description: 'Challenging sessions' },
  { id: 'healing-therapy', label: 'Healing Therapy', count: 75, description: 'Therapeutic treatments' },
  { id: 'meditation-focused', label: 'Meditation Focus', count: 78, description: 'Strong meditation component' },
  { id: 'eco-friendly', label: 'Eco-Friendly', count: 45, description: 'Sustainable practices' },
  { id: 'beachfront', label: 'Beachfront Location', count: 35, description: 'Ocean-adjacent practice' }
]

// Price range filters (estimated based on location and amenities)
export const PRICE_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Prices', count: 450 },
  { id: 'budget', label: 'Budget ($5-15)', count: 150, description: 'Affordable community classes' },
  { id: 'mid-range', label: 'Mid-Range ($15-30)', count: 200, description: 'Standard studio rates' },
  { id: 'premium', label: 'Premium ($30-50)', count: 80, description: 'High-end studios' },
  { id: 'luxury', label: 'Luxury ($50+)', count: 20, description: 'Resort and luxury venues' }
]

/**
 * Get all available filter categories
 */
export function getFilterCategories(): FilterCategory[] {
  return [
    {
      id: 'location',
      label: 'Location',
      icon: 'MapPin',
      options: LOCATION_FILTERS,
      multiSelect: false
    },
    {
      id: 'quality',
      label: 'Quality & Verification',
      icon: 'Star',
      options: QUALITY_FILTERS,
      multiSelect: false
    },
    {
      id: 'yoga-styles',
      label: 'Yoga Styles',
      icon: 'Target',
      options: YOGA_STYLE_FILTERS,
      multiSelect: true
    },
    {
      id: 'amenities',
      label: 'Amenities',
      icon: 'Hotel',
      options: AMENITY_FILTERS,
      multiSelect: true
    },
    {
      id: 'languages',
      label: 'Languages',
      icon: 'Globe',
      options: LANGUAGE_FILTERS,
      multiSelect: true
    },
    {
      id: 'features',
      label: 'Special Features',
      icon: 'Sparkles',
      options: FEATURE_FILTERS,
      multiSelect: true
    },
    {
      id: 'price',
      label: 'Price Range',
      icon: 'DollarSign',
      options: PRICE_FILTERS,
      multiSelect: false
    }
  ]
}

/**
 * Get filter option counts for a specific set of studios
 * This will be used to show accurate counts based on current filters
 */
export function calculateFilterCounts(studios: Studio[]): {[categoryId: string]: {[optionId: string]: number}} {
  const counts: {[categoryId: string]: {[optionId: string]: number}} = {}

  // Initialize all categories
  const categories = getFilterCategories()
  categories.forEach(category => {
    counts[category.id] = {}
    category.options.forEach(option => {
      counts[category.id][option.id] = 0
    })
  })

  // Count based on actual studio data
  studios.forEach(studio => {
    // Location counts (based on city/location field)
    const location = (studio.location || studio.city || '').toLowerCase()
    if (location.includes('seminyak') || location.includes('canggu') || location.includes('uluwatu') || location.includes('denpasar') || location.includes('badung')) {
      counts.location['south-bali']++
    } else if (location.includes('ubud') || location.includes('gianyar')) {
      counts.location['central-bali']++
    } else if (location.includes('karangasem') || location.includes('amed') || location.includes('candidasa')) {
      counts.location['east-bali']++
    } else if (location.includes('lovina') || location.includes('singaraja') || location.includes('buleleng')) {
      counts.location['north-bali']++
    } else if (location.includes('tabanan') || location.includes('bedugul')) {
      counts.location['west-bali']++
    } else if (location.includes('nusa') || location.includes('lembongan')) {
      counts.location['islands']++
    }

    // Yoga styles (from standardized yoga_styles field)
    if (studio.yoga_styles && Array.isArray(studio.yoga_styles)) {
      studio.yoga_styles.forEach((style: string) => {
        const styleId = style.toLowerCase().replace(/\s+/g, '-')
        if (counts['yoga-styles'][styleId] !== undefined) {
          counts['yoga-styles'][styleId]++
        }
      })
    }

    // Amenities (from standardized amenities field)
    if (studio.amenities && Array.isArray(studio.amenities)) {
      studio.amenities.forEach((amenity: string) => {
        const amenityId = amenity.toLowerCase().replace(/\s+/g, '-')
        if (counts.amenities[amenityId] !== undefined) {
          counts.amenities[amenityId]++
        }
      })
    }

    // Languages (from standardized languages_spoken field)
    if (studio.languages_spoken && Array.isArray(studio.languages_spoken)) {
      studio.languages_spoken.forEach((language: string) => {
        const langId = language.toLowerCase()
        if (counts.languages[langId] !== undefined) {
          counts.languages[langId]++
        }
      })
    }

    // Quality (based on completion metrics)
    // This would need to be calculated based on profile completeness
    // For now, using static estimates

    // Features (based on profile analysis)
    const name = studio.name.toLowerCase()
    const description = (studio.description || studio.business_description || '').toLowerCase()

    if (name.includes('teacher') || name.includes('training') || name.includes('certification') || name.includes('yttc')) {
      counts.features['teacher-training']++
    }
    if (name.includes('retreat') || description.includes('retreat')) {
      counts.features['retreats']++
    }
    if (description.includes('beginner') || description.includes('all levels')) {
      counts.features['beginner-friendly']++
    }
    if (name.includes('healing') || description.includes('healing') || description.includes('therapy')) {
      counts.features['healing-therapy']++
    }
    if (name.includes('meditation') || description.includes('meditation')) {
      counts.features['meditation-focused']++
    }
    if (description.includes('eco') || description.includes('sustainable') || description.includes('organic')) {
      counts.features['eco-friendly']++
    }
    if (location.includes('beach') || description.includes('beach') || description.includes('ocean')) {
      counts.features['beachfront']++
    }
  })

  // Set 'all' counts to total studio count
  Object.keys(counts).forEach(categoryId => {
    counts[categoryId]['all'] = studios.length
  })

  return counts
}

/**
 * Get the most relevant filters for quick access
 */
export function getPopularFilters(): FilterOption[] {
  return [
    LOCATION_FILTERS[1], // South Bali
    LOCATION_FILTERS[2], // Central Bali
    QUALITY_FILTERS[1], // Excellent
    YOGA_STYLE_FILTERS[1], // Hatha
    YOGA_STYLE_FILTERS[2], // Yin
    YOGA_STYLE_FILTERS[3], // Vinyasa
    AMENITY_FILTERS[1], // Showers
    AMENITY_FILTERS[2], // Yoga Mats
    FEATURE_FILTERS[1], // Teacher Training
    FEATURE_FILTERS[2], // Retreats
  ]
}

export type { FilterOption, FilterCategory }