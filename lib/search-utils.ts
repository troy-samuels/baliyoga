export interface SearchFilters {
  query?: string
  location?: string
  category?: string
}

export function filterStudios(studios: any[], filters: SearchFilters) {
  let filtered = [...studios]

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

  // Filter by location
  if (filters.location && filters.location !== "all") {
    filtered = filtered.filter((studio) => studio.location.toLowerCase().includes(filters.location!.toLowerCase()))
  }

  return filtered
}

export function filterRetreats(retreats: any[], filters: SearchFilters) {
  let filtered = [...retreats]

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

  // Filter by location
  if (filters.location && filters.location !== "all") {
    filtered = filtered.filter((retreat) => retreat.location.toLowerCase().includes(filters.location!.toLowerCase()))
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
