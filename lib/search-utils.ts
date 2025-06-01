export interface SearchFilters {
  query?: string
  location?: string
  type?: string
  rating?: number
  reviews?: number
  images?: boolean
}

// Add location group mapping for filtering
const LOCATION_GROUPS: { [key: string]: string[] } = {
  "South Bali": ["Badung Regency", "Denpasar City", "Denpasar", "Uluwatu", "Padang-Padang", "Canggu"],
  "Central Bali": ["Gianyar Regency", "Ubud", "Bangli Regency"],
  "East Bali": ["Karangasem Regency", "Abang", "Klungkung Regency"],
  "North Bali": ["Buleleng Regency"],
  "West Bali": ["Jembrana Regency", "Tabanan Regency", "Gunung"],
  "Islands": ["Nusa Penida"],
}

export function filterStudios(studios: any[], filters: SearchFilters) {
  let filtered = [...studios]

  // Filter by type
  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((studio) => studio.type === filters.type)
  }

  // Filter by search query
  if (filters.query) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(
      (studio) =>
        studio.name.toLowerCase().includes(query) ||
        studio.description?.toLowerCase().includes(query) ||
        studio.location.toLowerCase().includes(query) ||
        studio.styles?.some((style: string) => style.toLowerCase().includes(query)),
    )
  }

  // Filter by location (support group and city)
  if (filters.location && filters.location !== "all") {
    const groupCities = LOCATION_GROUPS[filters.location]
    if (groupCities) {
      filtered = filtered.filter((studio) =>
        groupCities.some((city) =>
          studio.location && studio.location.toLowerCase().includes(city.toLowerCase())
        )
      )
    } else {
      filtered = filtered.filter((studio) =>
        studio.location && studio.location.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }
  }

  // Filter by rating
  if (filters.rating && filters.rating > 0) {
    filtered = filtered.filter((studio) => (studio.rating || 0) >= filters.rating!)
  }

  // Filter by minimum review count
  if (filters.reviews && filters.reviews > 0) {
    filtered = filtered.filter((studio) => (studio.reviewCount || 0) >= filters.reviews!)
  }

  // Filter by has images
  if (filters.images) {
    filtered = filtered.filter((studio) => 
      studio.images && studio.images.length > 0 && 
      !studio.image.includes('placeholder.svg')
    )
  }

  return filtered
}

export function filterRetreats(retreats: any[], filters: SearchFilters) {
  let filtered = [...retreats]

  // Filter by type
  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((retreat) => retreat.type === filters.type)
  }

  // Filter by search query
  if (filters.query) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(
      (retreat) =>
        retreat.name.toLowerCase().includes(query) ||
        retreat.description?.toLowerCase().includes(query) ||
        retreat.location.toLowerCase().includes(query) ||
        retreat.duration?.toLowerCase().includes(query),
    )
  }

  // Filter by location (support group and city)
  if (filters.location && filters.location !== "all") {
    const groupCities = LOCATION_GROUPS[filters.location]
    if (groupCities) {
      filtered = filtered.filter((retreat) =>
        groupCities.some((city) =>
          retreat.location && retreat.location.toLowerCase().includes(city.toLowerCase())
        )
      )
    } else {
      filtered = filtered.filter((retreat) =>
        retreat.location && retreat.location.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }
  }

  // Filter by rating
  if (filters.rating && filters.rating > 0) {
    filtered = filtered.filter((retreat) => (retreat.rating || 0) >= filters.rating!)
  }

  // Filter by minimum review count
  if (filters.reviews && filters.reviews > 0) {
    filtered = filtered.filter((retreat) => (retreat.reviewCount || 0) >= filters.reviews!)
  }

  // Filter by has images
  if (filters.images) {
    filtered = filtered.filter((retreat) => 
      retreat.images && retreat.images.length > 0 && 
      !retreat.image.includes('placeholder.svg')
    )
  }

  return filtered
}

export function getLocationDisplayName(location: string): string {
  const locationMap: { [key: string]: string } = {
    ubud: "Ubud",
    canggu: "Canggu",
    seminyak: "Seminyak",
    uluwatu: "Uluwatu",
    all: "All Locations",
  }
  return locationMap[location] || location
}
