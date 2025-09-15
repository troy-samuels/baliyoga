// Define StudioProfile type
type StudioProfile = {
  id: number
  name: string
  city?: string
  address?: string
  email_address?: string
  phone_number?: string
  website?: string
  instagram_handle?: string
  facebook_url?: string
  whatsapp_number?: string
  business_description?: string
  enrichment_score?: number
  yoga_styles?: string[]
  amenities?: string[]
  drop_in_price_usd?: number
  beach_proximity?: boolean
  jungle_setting?: boolean
  mountain_view?: boolean
  rice_field_view?: boolean
  outdoor_space?: boolean
  private_classes?: boolean
  teacher_training?: boolean
  retreats?: boolean
  accommodation?: boolean
  beginner_friendly?: boolean
  advanced_classes?: boolean
  meditation_offered?: boolean
  sound_healing?: boolean
  spa?: boolean
  pool?: boolean
  computed?: any
}

// Location-based data intelligence for clean filtering
export const locationIntelligence = {
  // Beach proximity detection
  detectBeachProximity: (studio: StudioProfile) => {
    const beachKeywords = ['beach', 'coast', 'ocean', 'surf', 'seaside', 'waterfront']
    const beachAreas = ['Canggu', 'Seminyak', 'Kuta', 'Sanur', 'Uluwatu', 'Jimbaran', 'Nusa Dua']
    
    // Check explicit database field first
    if (studio.beach_proximity === true) {
      return { likely: true, confidence: 1.0, verified: true }
    }
    
    // Address analysis
    const addressMatch = beachKeywords.some(word => 
      studio.address?.toLowerCase().includes(word)
    )
    
    // City/location analysis
    const isBeachArea = beachAreas.some(area => 
      studio.city?.toLowerCase().includes(area.toLowerCase())
    )
    
    // Enhanced description analysis (from AI enhancement)
    const descriptionMatch = beachKeywords.some(word =>
      studio.business_description?.toLowerCase().includes(word)
    )
    
    const signals = [addressMatch, isBeachArea, descriptionMatch].filter(Boolean)
    const confidence = signals.length / 3
    
    return {
      likely: confidence >= 0.33, // At least one strong signal
      confidence,
      verified: false,
      sources: {
        address: addressMatch,
        location: isBeachArea,
        description: descriptionMatch
      }
    }
  },

  // Jungle setting detection
  detectJungleSetting: (studio: StudioProfile) => {
    const jungleKeywords = ['jungle', 'forest', 'nature', 'trees', 'tropical', 'wildlife', 'bamboo']
    const jungleAreas = ['Ubud', 'Gianyar', 'Bangli', 'Central Bali', 'East Bali']
    
    // Check explicit database field
    if (studio.jungle_setting === true) {
      return { likely: true, confidence: 1.0, verified: true }
    }
    
    // Geographic analysis - Ubud and central Bali are jungle areas
    const isJungleArea = jungleAreas.some(area =>
      studio.city?.toLowerCase().includes(area.toLowerCase())
    )
    
    // Description analysis
    const descriptionMatch = jungleKeywords.some(word =>
      studio.business_description?.toLowerCase().includes(word)
    )
    
    // Address analysis
    const addressMatch = jungleKeywords.some(word =>
      studio.address?.toLowerCase().includes(word)
    )
    
    const signals = [isJungleArea, descriptionMatch, addressMatch].filter(Boolean)
    const confidence = signals.length / 3
    
    return {
      likely: confidence >= 0.33,
      confidence,
      verified: false,
      sources: {
        location: isJungleArea,
        description: descriptionMatch,
        address: addressMatch
      }
    }
  },

  // Mountain views detection
  detectMountainViews: (studio: StudioProfile) => {
    const mountainKeywords = ['mountain', 'volcano', 'highland', 'elevation', 'valley', 'hill', 'peak']
    const mountainAreas = ['Ubud', 'Bangli', 'Karangasem', 'East Bali', 'Central Bali']
    
    // Check explicit database field
    if (studio.mountain_view === true) {
      return { likely: true, confidence: 1.0, verified: true }
    }
    
    const isHighlandArea = mountainAreas.some(area =>
      studio.city?.toLowerCase().includes(area.toLowerCase())
    )
    
    const descriptionMatch = mountainKeywords.some(word =>
      studio.business_description?.toLowerCase().includes(word)
    )
    
    const addressMatch = mountainKeywords.some(word =>
      studio.address?.toLowerCase().includes(word)
    )
    
    const signals = [isHighlandArea, descriptionMatch, addressMatch].filter(Boolean)
    const confidence = signals.length / 3
    
    return {
      likely: confidence >= 0.33,
      confidence,
      verified: false
    }
  },

  // Rice field views detection
  detectRiceFieldViews: (studio: StudioProfile) => {
    const riceKeywords = ['rice', 'paddy', 'field', 'terrace', 'farming', 'agriculture']
    const riceAreas = ['Ubud', 'Gianyar', 'Tabanan', 'Central Bali']
    
    // Check explicit database field
    if (studio.rice_field_view === true) {
      return { likely: true, confidence: 1.0, verified: true }
    }
    
    const isRiceArea = riceAreas.some(area =>
      studio.city?.toLowerCase().includes(area.toLowerCase())
    )
    
    const descriptionMatch = riceKeywords.some(word =>
      studio.business_description?.toLowerCase().includes(word)
    )
    
    const signals = [isRiceArea, descriptionMatch].filter(Boolean)
    const confidence = signals.length / 2
    
    return {
      likely: confidence >= 0.5,
      confidence,
      verified: false
    }
  }
}

// Price tier intelligence for clean filtering
export const priceIntelligence = {
  estimatePriceTier: (studio: StudioProfile) => {
    // If we have explicit pricing, use it
    if (studio.drop_in_price_usd) {
      return {
        tier: getPriceTierFromAmount(studio.drop_in_price_usd),
        confidence: 1.0,
        verified: true,
        amount: studio.drop_in_price_usd
      }
    }
    
    // Estimate based on multiple factors
    let score = 0
    const factors: string[] = []
    
    // Location premium scoring
    const locationPremiums = {
      'seminyak': 40,
      'canggu': 35, 
      'uluwatu': 30,
      'sanur': 25,
      'ubud': 20,
      'kuta': 15
    }
    
    const cityLower = studio.city?.toLowerCase() || ''
    for (const [location, premium] of Object.entries(locationPremiums)) {
      if (cityLower.includes(location)) {
        score += premium
        factors.push(`${location} location`)
        break
      }
    }
    
    // Amenities scoring
    const premiumAmenities = ['spa', 'pool', 'restaurant', 'accommodation']
    const amenityCount = premiumAmenities.filter(amenity =>
      studio.amenities?.some(a => a.toLowerCase().includes(amenity))
    ).length
    
    score += amenityCount * 10
    if (amenityCount > 0) factors.push(`${amenityCount} premium amenities`)
    
    // Quality/enrichment score correlation
    if (studio.enrichment_score && studio.enrichment_score > 85) {
      score += 20
      factors.push('high quality profile')
    }
    
    // Social media presence (professional studios often have higher prices)
    if (studio.instagram_handle && studio.facebook_url) {
      score += 10
      factors.push('strong social presence')
    }
    
    // Website indicates professional operation
    if (studio.website) {
      score += 15
      factors.push('professional website')
    }
    
    return {
      tier: scoreToPriceTier(score),
      confidence: Math.min(score / 100, 0.8), // Cap confidence at 80% for estimates
      verified: false,
      estimatedRange: scoreToPriceRange(score),
      factors
    }
  }
}

// Helper functions
function getPriceTierFromAmount(amount: number): 'budget' | 'mid' | 'premium' | 'luxury' {
  if (amount < 15) return 'budget'
  if (amount < 40) return 'mid' 
  if (amount < 80) return 'premium'
  return 'luxury'
}

function scoreToPriceTier(score: number): 'budget' | 'mid' | 'premium' | 'luxury' {
  if (score < 30) return 'budget'
  if (score < 60) return 'mid'
  if (score < 90) return 'premium'
  return 'luxury'
}

function scoreToPriceRange(score: number): string {
  if (score < 30) return '$10-20'
  if (score < 60) return '$20-40'
  if (score < 90) return '$40-80'
  return '$80+'
}

// Experience level detection
export const experienceIntelligence = {
  detectExperienceLevel: (studio: StudioProfile) => {
    const beginnerKeywords = ['beginner', 'starter', 'gentle', 'basics', 'introduction', 'first time']
    const advancedKeywords = ['advanced', 'intensive', 'masterclass', 'teacher training', 'certification']
    
    const description = studio.business_description?.toLowerCase() || ''
    const styles = studio.yoga_styles?.join(' ').toLowerCase() || ''
    const amenities = studio.amenities?.join(' ').toLowerCase() || ''
    
    const searchText = `${description} ${styles} ${amenities}`
    
    const beginnerFriendly = beginnerKeywords.some(word => searchText.includes(word)) || 
                            studio.beginner_friendly === true
    
    const advancedClasses = advancedKeywords.some(word => searchText.includes(word)) ||
                           studio.advanced_classes === true ||
                           studio.teacher_training === true
    
    return {
      beginner_friendly: beginnerFriendly,
      advanced_classes: advancedClasses,
      teacher_training: studio.teacher_training === true,
      all_levels: !beginnerFriendly && !advancedClasses // If no specific indicators, assume all levels
    }
  }
}

// Main intelligence processor
export const processStudioIntelligence = (studio: StudioProfile) => {
  return {
    ...studio,
    computed: {
      beach_proximity: locationIntelligence.detectBeachProximity(studio),
      jungle_setting: locationIntelligence.detectJungleSetting(studio), 
      mountain_view: locationIntelligence.detectMountainViews(studio),
      rice_field_view: locationIntelligence.detectRiceFieldViews(studio),
      price_tier: priceIntelligence.estimatePriceTier(studio),
      experience_level: experienceIntelligence.detectExperienceLevel(studio)
    }
  }
}

// Filter application with intelligence
export const applyIntelligentFilters = (studios: StudioProfile[], filters: any) => {
  return studios
    .map(processStudioIntelligence)
    .filter(studio => {
      // Contact availability filters
      if (filters.contact?.includes('instant_contact')) {
        if (!studio.email_address || (!studio.whatsapp_number && !studio.phone_number)) return false
      }
      if (filters.contact?.includes('email_available') && !studio.email_address) return false
      if (filters.contact?.includes('whatsapp_available') && !studio.whatsapp_number) return false
      if (filters.contact?.includes('phone_available') && !studio.phone_number) return false
      if (filters.contact?.includes('website_available') && !studio.website) return false
      
      // Geographic location filters (city/area based)
      if (filters.location?.includes('canggu')) {
        const inCanggu = studio.city?.toLowerCase().includes('canggu') || studio.address?.toLowerCase().includes('canggu')
        if (!inCanggu) return false
      }
      if (filters.location?.includes('seminyak')) {
        const inSeminyak = studio.city?.toLowerCase().includes('seminyak') || studio.address?.toLowerCase().includes('seminyak')
        if (!inSeminyak) return false
      }
      if (filters.location?.includes('ubud')) {
        const inUbud = studio.city?.toLowerCase().includes('ubud') || studio.address?.toLowerCase().includes('ubud')
        if (!inUbud) return false
      }
      if (filters.location?.includes('sanur')) {
        const inSanur = studio.city?.toLowerCase().includes('sanur') || studio.address?.toLowerCase().includes('sanur')
        if (!inSanur) return false
      }
      
      // Natural setting filters (environment based)
      if (filters.natural_setting?.includes('beach_proximity') && !studio.computed.beach_proximity.likely) return false
      if (filters.natural_setting?.includes('jungle_setting') && !studio.computed.jungle_setting.likely) return false
      if (filters.natural_setting?.includes('mountain_view') && !studio.computed.mountain_view.likely) return false
      if (filters.natural_setting?.includes('rice_field_view') && !studio.computed.rice_field_view.likely) return false
      
      // Price tier filters
      if (filters.price_range?.includes('budget') && studio.computed.price_tier.tier !== 'budget') return false
      if (filters.price_range?.includes('mid') && studio.computed.price_tier.tier !== 'mid') return false
      if (filters.price_range?.includes('premium') && studio.computed.price_tier.tier !== 'premium') return false
      if (filters.price_range?.includes('luxury') && studio.computed.price_tier.tier !== 'luxury') return false
      
      // Quality rating filters
      if (filters.quality?.includes('90plus') && (studio.enrichment_score || 0) < 90) return false
      if (filters.quality?.includes('75plus') && (studio.enrichment_score || 0) < 75) return false
      if (filters.quality?.includes('60plus') && (studio.enrichment_score || 0) < 60) return false
      
      // Experience level filters
      if (filters.experience?.includes('beginner_friendly') && !studio.computed.experience_level.beginner_friendly) return false
      if (filters.experience?.includes('advanced_classes') && !studio.computed.experience_level.advanced_classes) return false
      
      // Services filters
      if (filters.services?.includes('accommodation') && !studio.accommodation) return false
      if (filters.services?.includes('retreats') && !studio.retreats) return false
      if (filters.services?.includes('teacher_training') && !studio.teacher_training) return false
      if (filters.services?.includes('private_classes') && !studio.private_classes) return false
      
      // Special features filters
      if (filters.special?.includes('meditation_offered') && !studio.meditation_offered) return false
      if (filters.special?.includes('sound_healing') && !studio.sound_healing) return false
      if (filters.special?.includes('spa') && !studio.spa) return false
      if (filters.special?.includes('pool') && !studio.pool) return false
      
      // Yoga styles filter (existing database field)
      if (filters.yoga_styles?.length > 0) {
        const studioStyles = studio.yoga_styles?.map(s => s.toLowerCase()) || []
        const hasMatchingStyle = filters.yoga_styles.some((style: string) =>
          studioStyles.some(studioStyle => studioStyle.includes(style.toLowerCase()))
        )
        if (!hasMatchingStyle) return false
      }
      
      return true
    })
}