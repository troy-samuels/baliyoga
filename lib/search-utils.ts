export interface SearchFilters {
  query?: string
  location?: string
  type?: string
  rating?: number
  reviews?: number
  images?: boolean
  // Enhanced filters
  quality?: string
  contactInfo?: string[]
  socialMedia?: string[]
  yogaStyles?: string[]
  amenities?: string[]
  languages?: string[]
  features?: string[]
  price?: string
  // Retreat-specific filters
  duration?: string
  retreatType?: string
  accommodation?: string
}

// Enhanced location mapping for filtering
const LOCATION_GROUPS: { [key: string]: string[] } = {
  "south-bali": ["Badung Regency", "Denpasar City", "Denpasar", "Uluwatu", "Padang-Padang", "Canggu", "Seminyak", "Sanur", "Jimbaran", "Kuta"],
  "central-bali": ["Gianyar Regency", "Ubud", "Bangli Regency", "Gianyar", "Tegallalang"],
  "east-bali": ["Karangasem Regency", "Abang", "Klungkung Regency", "Karangasem", "Klungkung", "Amed", "Candidasa", "Tulamben"],
  "north-bali": ["Buleleng Regency", "Buleleng", "Singaraja", "Lovina", "Pemuteran"],
  "west-bali": ["Jembrana Regency", "Tabanan Regency", "Gunung", "Jembrana", "Tabanan", "Bedugul", "Balian"],
  "islands": ["Nusa Penida", "Nusa Lembongan", "Nusa Ceningan"],
}

// Quality level mapping
const QUALITY_MAPPINGS = {
  'excellent': (studio: any) => calculateQualityScore(studio) >= 90,
  'good': (studio: any) => calculateQualityScore(studio) >= 80 && calculateQualityScore(studio) < 90,
  'fair': (studio: any) => calculateQualityScore(studio) >= 70 && calculateQualityScore(studio) < 80,
  'verified-contact': (studio: any) => Boolean(studio.email_address && studio.phone_number),
  'complete-profile': (studio: any) => Boolean(studio.business_description && studio.email_address && studio.website)
}

// Calculate quality score based on profile completeness
function calculateQualityScore(studio: any): number {
  let score = 0
  const maxScore = 100

  // Core information (20 points)
  if (studio.name) score += 5
  if (studio.location || studio.city) score += 5
  if (studio.category_name) score += 5
  if (studio.address) score += 5

  // Contact information (30 points)
  if (studio.phone_number) score += 8
  if (studio.website) score += 8
  if (studio.email_address) score += 10
  if (studio.instagram_handle) score += 2
  if (studio.facebook_url) score += 2

  // Content (25 points)
  if (studio.business_description && studio.business_description.length > 100) score += 15
  if (studio.images && studio.images.length > 0) score += 10

  // Enhanced data (15 points)
  if (studio.yoga_styles && studio.yoga_styles.length > 0) score += 5
  if (studio.amenities && studio.amenities.length > 0) score += 5
  if (studio.languages_spoken && studio.languages_spoken.length > 0) score += 5

  // Reviews and ratings (10 points)
  if (studio.review_score && studio.review_score > 0) score += 5
  if (studio.review_count && studio.review_count > 0) score += 5

  return Math.min(score, maxScore)
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
      filtered = filtered.filter((studio) => {
        const studioLocation = studio.location || studio.city || ""
        return groupCities.some((city) =>
          studioLocation.toLowerCase().includes(city.toLowerCase()) ||
          studioLocation.toLowerCase() === city.toLowerCase()
        )
      })
    } else {
      // Direct location match
      filtered = filtered.filter((studio) => {
        const studioLocation = studio.location || studio.city || ""
        return studioLocation.toLowerCase().includes(filters.location!.toLowerCase())
      })
    }
  }

  // Filter by quality
  if (filters.quality && filters.quality !== "all") {
    const qualityFilter = QUALITY_MAPPINGS[filters.quality as keyof typeof QUALITY_MAPPINGS]
    if (qualityFilter) {
      filtered = filtered.filter(qualityFilter)
    }
  }

  // Filter by contact information availability
  if (filters.contactInfo && filters.contactInfo.length > 0) {
    filtered = filtered.filter((studio) => {
      return filters.contactInfo!.some(contactFilter => {
        switch (contactFilter) {
          case 'has-phone':
            return Boolean(studio.phone_number?.trim())
          case 'has-website':
            return Boolean(studio.website?.trim())
          case 'has-email':
            return Boolean(studio.email?.trim())
          case 'has-description':
            return Boolean(studio.business_description?.trim())
          case 'complete-contact':
            return Boolean(studio.phone_number?.trim() && studio.website?.trim() && studio.email?.trim())
          default:
            return false
        }
      })
    })
  }

  // Filter by social media availability
  if (filters.socialMedia && filters.socialMedia.length > 0) {
    filtered = filtered.filter((studio) => {
      return filters.socialMedia!.some(socialFilter => {
        switch (socialFilter) {
          case 'has-instagram':
            return Boolean(studio.instagram_url?.trim())
          case 'has-facebook':
            return Boolean(studio.facebook_url?.trim())
          case 'has-whatsapp':
            return Boolean(studio.whatsapp_number?.trim())
          case 'has-youtube':
            return Boolean(studio.youtube_url?.trim())
          case 'has-tiktok':
            return Boolean(studio.tiktok_url?.trim())
          case 'any-social-media':
            return Boolean(
              studio.instagram_url?.trim() ||
              studio.facebook_url?.trim() ||
              studio.whatsapp_number?.trim() ||
              studio.youtube_url?.trim() ||
              studio.tiktok_url?.trim()
            )
          default:
            return false
        }
      })
    })
  }

  // Filter by yoga styles
  if (filters.yogaStyles && filters.yogaStyles.length > 0) {
    filtered = filtered.filter((studio) => {
      if (!studio.yoga_styles || !Array.isArray(studio.yoga_styles)) return false

      return filters.yogaStyles!.some(filterStyle =>
        studio.yoga_styles.some((studioStyle: string) =>
          studioStyle.toLowerCase() === filterStyle.toLowerCase()
        )
      )
    })
  }

  // Filter by amenities
  if (filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter((studio) => {
      if (!studio.amenities || !Array.isArray(studio.amenities)) return false

      return filters.amenities!.some(filterAmenity =>
        studio.amenities.some((studioAmenity: string) =>
          studioAmenity.toLowerCase().includes(filterAmenity.toLowerCase()) ||
          filterAmenity.toLowerCase().includes(studioAmenity.toLowerCase())
        )
      )
    })
  }

  // Filter by languages
  if (filters.languages && filters.languages.length > 0) {
    filtered = filtered.filter((studio) => {
      if (!studio.languages_spoken || !Array.isArray(studio.languages_spoken)) return false

      return filters.languages!.some(filterLang =>
        studio.languages_spoken.some((studioLang: string) =>
          studioLang.toLowerCase() === filterLang.toLowerCase()
        )
      )
    })
  }

  // Filter by special features
  if (filters.features && filters.features.length > 0) {
    filtered = filtered.filter((studio) => {
      const name = studio.name.toLowerCase()
      const description = (studio.description || studio.business_description || '').toLowerCase()

      return filters.features!.some(feature => {
        switch (feature) {
          case 'teacher-training':
            return name.includes('teacher') || name.includes('training') || name.includes('certification') || name.includes('yttc')
          case 'retreats':
            return name.includes('retreat') || description.includes('retreat')
          case 'drop-in-classes':
            return description.includes('drop') || description.includes('walk-in') || !name.includes('retreat')
          case 'beginner-friendly':
            return description.includes('beginner') || description.includes('all levels') || description.includes('gentle')
          case 'advanced-practice':
            return description.includes('advanced') || description.includes('challenging') || name.includes('advanced')
          case 'healing-therapy':
            return name.includes('healing') || description.includes('healing') || description.includes('therapy')
          case 'meditation-focused':
            return name.includes('meditation') || description.includes('meditation') || studio.yoga_styles?.includes('Meditation')
          case 'eco-friendly':
            return description.includes('eco') || description.includes('sustainable') || description.includes('organic')
          case 'beachfront':
            return (studio.location || '').toLowerCase().includes('beach') || description.includes('beach') || description.includes('ocean')
          default:
            return false
        }
      })
    })
  }

  // Filter by price range (basic implementation based on location and amenities)
  if (filters.price && filters.price !== "all") {
    filtered = filtered.filter((studio) => {
      const location = (studio.location || '').toLowerCase()
      const hasLuxuryAmenities = studio.amenities?.some((amenity: string) =>
        ['spa', 'massage', 'pool', 'resort', 'luxury'].some(luxury =>
          amenity.toLowerCase().includes(luxury)
        )
      )
      const isRetreatvenue = studio.name.toLowerCase().includes('retreat') ||
                             studio.name.toLowerCase().includes('resort')

      switch (filters.price) {
        case 'budget':
          return !hasLuxuryAmenities && !isRetreatvenue &&
                 !location.includes('seminyak') && !location.includes('ubud')
        case 'mid-range':
          return !hasLuxuryAmenities || (!isRetreatvenue && !location.includes('seminyak'))
        case 'premium':
          return hasLuxuryAmenities || location.includes('seminyak') || location.includes('ubud')
        case 'luxury':
          return hasLuxuryAmenities && (isRetreatvenue || location.includes('seminyak'))
        default:
          return true
      }
    })
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

  // Filter by location (support group and city) - Fixed to work with Supabase data
  if (filters.location && filters.location !== "all") {
    const groupCities = LOCATION_GROUPS[filters.location]
    if (groupCities) {
      filtered = filtered.filter((retreat) => {
        const retreatLocation = retreat.location || retreat.city || ""
        return groupCities.some((city) =>
          retreatLocation.toLowerCase().includes(city.toLowerCase()) ||
          retreatLocation.toLowerCase() === city.toLowerCase()
        )
      })
    } else {
      // Direct location match
      filtered = filtered.filter((retreat) => {
        const retreatLocation = retreat.location || retreat.city || ""
        return retreatLocation.toLowerCase().includes(filters.location!.toLowerCase())
      })
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

  // Enhanced retreat-specific filters

  // Filter by duration
  if (filters.duration && filters.duration !== "all") {
    filtered = filtered.filter((retreat) => {
      const duration = retreat.duration?.toLowerCase() || ""
      switch (filters.duration) {
        case 'weekend':
          return duration.includes('weekend') || duration.includes('2') || duration.includes('3')
        case 'week':
          return duration.includes('week') || duration.includes('5') || duration.includes('7')
        case 'extended':
          return duration.includes('10') || duration.includes('14')
        case 'month':
          return duration.includes('21') || duration.includes('month')
        default:
          return true
      }
    })
  }

  // Filter by retreat type
  if (filters.retreatType && filters.retreatType !== "all") {
    filtered = filtered.filter((retreat) => {
      const name = retreat.name?.toLowerCase() || ""
      const description = retreat.business_description?.toLowerCase() || ""

      switch (filters.retreatType) {
        case 'wellness':
          return name.includes('wellness') || description.includes('wellness')
        case 'spiritual':
          return name.includes('spiritual') || description.includes('spiritual') || description.includes('meditation')
        case 'detox':
          return name.includes('detox') || description.includes('detox') || description.includes('cleanse')
        case 'adventure':
          return name.includes('adventure') || description.includes('adventure') || description.includes('hiking')
        case 'couples':
          return name.includes('couples') || description.includes('couples') || description.includes('romantic')
        case 'solo':
          return name.includes('solo') || description.includes('solo') || description.includes('single')
        default:
          return true
      }
    })
  }

  // Filter by accommodation type
  if (filters.accommodation && filters.accommodation !== "all") {
    filtered = filtered.filter((retreat) => {
      const accommodation = retreat.accommodation_type?.toLowerCase() || ""
      const description = retreat.business_description?.toLowerCase() || ""

      switch (filters.accommodation) {
        case 'shared':
          return accommodation.includes('shared') || description.includes('shared room')
        case 'private':
          return accommodation.includes('private') || description.includes('private room')
        case 'villa':
          return accommodation.includes('villa') || description.includes('villa')
        case 'glamping':
          return accommodation.includes('glamping') || description.includes('glamping') || description.includes('eco')
        default:
          return true
      }
    })
  }

  // Filter by price range
  if (filters.price && filters.price !== "all") {
    filtered = filtered.filter((retreat) => {
      const price = retreat.price ? parseFloat(retreat.price.replace(/[^\d]/g, '')) : 0

      switch (filters.price) {
        case 'budget':
          return price <= 500
        case 'mid':
          return price > 500 && price <= 1500
        case 'luxury':
          return price > 1500
        default:
          return true
      }
    })
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
