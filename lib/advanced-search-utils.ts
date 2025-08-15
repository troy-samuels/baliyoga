export interface AdvancedSearchFilters {
  query?: string
  location?: string
  yoga_styles?: string[]
  price_range?: string
  amenities?: string[]
  beach_proximity?: string
  beginner_friendly?: boolean
  advanced_classes?: boolean
  teacher_training?: boolean
  meditation_offered?: boolean
  sound_healing?: boolean
  outdoor_space?: boolean
  // Retreat-specific filters
  retreat_duration?: string
  accommodation_included?: boolean
  meals_included?: boolean
  retreat_type?: string
}

// Location group mapping for filtering
const LOCATION_GROUPS: { [key: string]: string[] } = {
  "South Bali": ["Badung Regency", "Denpasar City", "Denpasar", "Uluwatu", "Padang-Padang", "Canggu", "Seminyak", "Sanur"],
  "Central Bali": ["Gianyar Regency", "Ubud", "Bangli Regency", "Gianyar"],
  "East Bali": ["Karangasem Regency", "Abang", "Klungkung Regency", "Karangasem", "Klungkung"],
  "North Bali": ["Buleleng Regency", "Buleleng", "Singaraja", "Lovina"],
  "West Bali": ["Jembrana Regency", "Tabanan Regency", "Gunung", "Jembrana", "Tabanan", "Bedugul"],
  "Islands": ["Nusa Penida", "Nusa Lembongan", "Nusa Ceningan"],
}

export function filterWithAdvancedOptions(items: any[], filters: AdvancedSearchFilters) {
  let filtered = [...items]

  // Basic text search
  if (filters.query) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.city?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
    )
  }

  // Location filtering (supports both groups and individual cities)
  if (filters.location && filters.location !== "all") {
    const groupCities = LOCATION_GROUPS[filters.location]
    if (groupCities) {
      filtered = filtered.filter((item) => {
        const itemLocation = item.location || item.city || ""
        return groupCities.some((city) =>
          itemLocation.toLowerCase().includes(city.toLowerCase()) ||
          itemLocation.toLowerCase() === city.toLowerCase()
        )
      })
    } else {
      // Direct location match
      filtered = filtered.filter((item) => {
        const itemLocation = item.location || item.city || ""
        return itemLocation.toLowerCase().includes(filters.location!.toLowerCase())
      })
    }
  }

  // Yoga styles filtering
  if (filters.yoga_styles && filters.yoga_styles.length > 0) {
    filtered = filtered.filter((item) => {
      const itemStyles = item.yoga_styles || []
      return filters.yoga_styles!.some(style => 
        itemStyles.some((itemStyle: string) => 
          itemStyle.toLowerCase().includes(style.toLowerCase())
        )
      )
    })
  }

  // Price range filtering
  if (filters.price_range) {
    filtered = filtered.filter((item) => item.price_range === filters.price_range)
  }

  // Amenities filtering
  if (filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter((item) => {
      const itemAmenities = item.amenities || []
      return filters.amenities!.every(amenity => itemAmenities.includes(amenity))
    })
  }

  // Beach proximity filtering
  if (filters.beach_proximity) {
    filtered = filtered.filter((item) => item.beach_proximity === filters.beach_proximity)
  }

  // Boolean feature filters
  const booleanFilters = [
    'beginner_friendly',
    'advanced_classes', 
    'teacher_training',
    'meditation_offered',
    'sound_healing',
    'outdoor_space',
    'accommodation_included',
    'meals_included'
  ]

  booleanFilters.forEach(filterKey => {
    if (filters[filterKey as keyof AdvancedSearchFilters] === true) {
      filtered = filtered.filter((item) => item[filterKey] === true)
    }
  })

  // Retreat duration filtering
  if (filters.retreat_duration && filters.retreat_duration !== '') {
    filtered = filtered.filter((item) => {
      const duration = item.retreat_duration_days || 0
      switch (filters.retreat_duration) {
        case '1-3':
          return duration >= 1 && duration <= 3
        case '4-7':
          return duration >= 4 && duration <= 7
        case '8-14':
          return duration >= 8 && duration <= 14
        case '15+':
          return duration >= 15
        default:
          return true
      }
    })
  }

  // Retreat type filtering
  if (filters.retreat_type) {
    filtered = filtered.filter((item) => item.retreat_type === filters.retreat_type)
  }

  return filtered
}

export function getLocationDisplayName(location: string): string {
  // Handle location groups
  const locationGroupMap: { [key: string]: string } = {
    "South Bali": "South Bali",
    "Central Bali": "Central Bali", 
    "East Bali": "East Bali",
    "North Bali": "North Bali",
    "West Bali": "West Bali",
    "Islands": "Islands",
    all: "All Locations",
  }
  
  // Handle individual locations
  const individualLocationMap: { [key: string]: string } = {
    ubud: "Ubud",
    canggu: "Canggu",
    seminyak: "Seminyak",
    uluwatu: "Uluwatu",
  }
  
  // First check location groups, then individual locations, then return as-is
  return locationGroupMap[location] || individualLocationMap[location.toLowerCase()] || location
}

// Helper function to build Supabase query with advanced filters
export function buildSupabaseQuery(supabase: any, tableName: string, filters: AdvancedSearchFilters) {
  let query = supabase.from(tableName).select('*')

  // Location filtering
  if (filters.location && filters.location !== "all") {
    const groupCities = LOCATION_GROUPS[filters.location]
    if (groupCities) {
      // Use OR condition for location group cities
      const locationConditions = groupCities.map(city => `city.ilike.%${city}%`).join(',')
      query = query.or(locationConditions)
    } else {
      query = query.ilike('city', `%${filters.location}%`)
    }
  }

  // Yoga styles filtering
  if (filters.yoga_styles && filters.yoga_styles.length > 0) {
    // Use contains operator for array fields
    query = query.overlaps('yoga_styles', filters.yoga_styles)
  }

  // Price range filtering
  if (filters.price_range) {
    query = query.eq('price_range', filters.price_range)
  }

  // Amenities filtering
  if (filters.amenities && filters.amenities.length > 0) {
    query = query.contains('amenities', filters.amenities)
  }

  // Beach proximity filtering
  if (filters.beach_proximity) {
    query = query.eq('beach_proximity', filters.beach_proximity)
  }

  // Boolean filters
  const booleanFilters = [
    'beginner_friendly',
    'advanced_classes', 
    'teacher_training',
    'meditation_offered',
    'sound_healing',
    'outdoor_space',
    'accommodation_included',
    'meals_included'
  ]

  booleanFilters.forEach(filterKey => {
    if (filters[filterKey as keyof AdvancedSearchFilters] === true) {
      query = query.eq(filterKey, true)
    }
  })

  // Retreat duration filtering
  if (filters.retreat_duration && filters.retreat_duration !== '') {
    switch (filters.retreat_duration) {
      case '1-3':
        query = query.gte('retreat_duration_days', 1).lte('retreat_duration_days', 3)
        break
      case '4-7':
        query = query.gte('retreat_duration_days', 4).lte('retreat_duration_days', 7)
        break
      case '8-14':
        query = query.gte('retreat_duration_days', 8).lte('retreat_duration_days', 14)
        break
      case '15+':
        query = query.gte('retreat_duration_days', 15)
        break
    }
  }

  // Retreat type filtering
  if (filters.retreat_type) {
    query = query.eq('retreat_type', filters.retreat_type)
  }

  return query
}

// Convert URL search params to AdvancedSearchFilters
export function parseAdvancedFiltersFromSearchParams(searchParams: URLSearchParams): AdvancedSearchFilters {
  return {
    query: searchParams.get('q') || undefined,
    location: searchParams.get('location') || undefined,
    yoga_styles: searchParams.get('yoga_styles')?.split(',').filter(Boolean) || [],
    price_range: searchParams.get('price_range') || undefined,
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    beach_proximity: searchParams.get('beach_proximity') || undefined,
    beginner_friendly: searchParams.get('beginner_friendly') === 'true',
    advanced_classes: searchParams.get('advanced_classes') === 'true',
    teacher_training: searchParams.get('teacher_training') === 'true',
    meditation_offered: searchParams.get('meditation_offered') === 'true',
    sound_healing: searchParams.get('sound_healing') === 'true',
    outdoor_space: searchParams.get('outdoor_space') === 'true',
    retreat_duration: searchParams.get('retreat_duration') || undefined,
    accommodation_included: searchParams.get('accommodation_included') === 'true',
    meals_included: searchParams.get('meals_included') === 'true',
    retreat_type: searchParams.get('retreat_type') || undefined,
  }
} 