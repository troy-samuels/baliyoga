import { createServerClient } from "./supabase"
import type { Studio, Retreat } from "./data-utils"
import { generateColorFallback } from "./image-fallback"
import { withCache, CACHE_CONFIG, createCacheKey } from "./cache-utils"
import { generateRetreatTypeSlug, generateLocationSlug } from "./retreat-types"
import { generateStudioTypeSlug, generateStudioLocationSlug } from "./studio-types"

// Categories that should be considered as studios - updated to match actual database data
const studioCategories = ["Yoga studio"]

// Categories that should be considered as retreats - updated to match actual database data
const retreatCategories = ["Yoga retreat center"]

// Helper function to process image URLs
const processImageUrl = (url: string | null | undefined): string => {
  if (!url) return generateColorFallback(300, 200, '#e6ceb3')
  
  // Route all external images through the proxy for better reliability
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`
  }
  
  return url
}

// Helper function to create SEO-optimized slugs
const createSEOSlug = (name: string, city: string, type: 'studio' | 'retreat'): string => {
  // Clean and normalize the name - be more selective about word removal
  const cleanName = name
    .toLowerCase()
    .replace(/\b(center|centre)\b/gi, '') // Remove center/centre but keep yoga/studio/retreat if part of unique name
    .replace(/\bbali\b/gi, '') // Remove standalone 'bali' 
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
  
  // Clean and normalize the city
  const cleanCity = city
    .toLowerCase()
    .replace(/\b(regency|city)\b/gi, '') // Remove administrative suffixes
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
  
  // Build SEO-friendly slug: name-yoga-studio-city-bali or name-yoga-retreat-city-bali
  const parts = [
    cleanName,
    'yoga',
    type,
    cleanCity !== 'bali' ? cleanCity : null, // Don't duplicate if city is already 'bali'
    'bali'
  ].filter(Boolean)
  
  return parts
    .join('-')
    .replace(/[\s_-]+/g, '-') // Normalize separators
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .replace(/-{2,}/g, '-') // Replace multiple dashes with single dash
    .substring(0, 100) // Limit length for SEO
}

// Function to convert raw data to Studio type
const mapToStudio = (item: any): Studio => {
  // Create SEO-optimized slug
  const slug = createSEOSlug(item.name, item.city || "Bali", "studio")

  // Extract styles from the yoga_styles field (enhanced data)
  let styles: string[] = []
  
  if (item.yoga_styles) {
    try {
      if (Array.isArray(item.yoga_styles)) {
        styles = item.yoga_styles
      } else if (typeof item.yoga_styles === 'string') {
        // Try parsing as JSON first, if that fails, split by comma
        try {
          styles = JSON.parse(item.yoga_styles)
        } catch {
          // If JSON parsing fails, treat as comma-separated string
          styles = item.yoga_styles.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
      }
    } catch (error) {
      console.warn('Error parsing yoga_styles:', error)
      styles = []
    }
  }

  // Parse images as array
  const imagesArray = Array.isArray(item.images)
    ? item.images
    : (typeof item.images === 'string' ? (() => {
        try {
          return JSON.parse(item.images)
        } catch (error) {
          console.warn('Error parsing images JSON:', error)
          return []
        }
      })() : []);

  // Parse amenities array
  let amenities: string[] = []
  if (item.amenities) {
    try {
      if (Array.isArray(item.amenities)) {
        amenities = item.amenities
      } else if (typeof item.amenities === 'string') {
        try {
          amenities = JSON.parse(item.amenities)
        } catch {
          amenities = item.amenities.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
      }
    } catch (error) {
      console.warn('Error parsing amenities:', error)
      amenities = []
    }
  }

  // Parse languages spoken array
  let languagesSpoken: string[] = []
  if (item.languages_spoken) {
    try {
      if (Array.isArray(item.languages_spoken)) {
        languagesSpoken = item.languages_spoken
      } else if (typeof item.languages_spoken === 'string') {
        try {
          languagesSpoken = JSON.parse(item.languages_spoken)
        } catch {
          languagesSpoken = item.languages_spoken.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
      }
    } catch (error) {
      console.warn('Error parsing languages_spoken:', error)
      languagesSpoken = []
    }
  }

  // Generate studio-specific URL components
  const locationSlug = generateStudioLocationSlug(item.city)
  const typeSlug = generateStudioTypeSlug({
    name: item.name,
    business_description: item.business_description,
    yoga_styles: styles,
    amenities: amenities
  })

  return {
    id: item.id,
    name: item.name,
    slug: slug,
    location: item.city || "Bali",
    rating: item.review_score || 0,
    reviewCount: item.review_count || 0,
    image: imagesArray.length > 0 ? processImageUrl(imagesArray[0]) : generateColorFallback(300, 200, '#e6ceb3'),
    images: imagesArray.map(processImageUrl),
    styles: styles,
    // AI-enhanced fields
    business_description: item.business_description || "",
    amenities: amenities,
    languages_spoken: languagesSpoken,
    drop_in_price_usd: item.drop_in_price_usd || null,
    price_range: item.price_range || "",
    // Only use real data - no fake descriptions or pricing
    tagline: undefined, // Will be handled in the component
    description: undefined, // Will be handled in the component
    longDescription: undefined, // Will be handled in the component
    price: undefined, // No fake pricing
    type: "studio",
    location_details: {
      address: item.address || "",
      area: item.city || "Bali",
    },
    phone_number: item.phone_number || "",
    website: item.website || "",
    opening_hours: item.opening_hours || [],
    category: item.category_name || "Yoga studio",
    // New URL structure fields
    locationSlug: locationSlug,
    typeSlug: typeSlug,
    urlPath: `/studios/${locationSlug}/${typeSlug}`,
  }
}

// Function to convert raw data to Retreat type
const mapToRetreat = (item: any): Retreat => {
  // Create SEO-optimized slug
  const slug = createSEOSlug(item.name, item.city || "Bali", "retreat")

  // Extract styles from the yoga_styles field (enhanced data)
  let styles: string[] = []
  
  if (item.yoga_styles) {
    try {
      if (Array.isArray(item.yoga_styles)) {
        styles = item.yoga_styles
      } else if (typeof item.yoga_styles === 'string') {
        // Try parsing as JSON first, if that fails, split by comma
        try {
          styles = JSON.parse(item.yoga_styles)
        } catch {
          // If JSON parsing fails, treat as comma-separated string
          styles = item.yoga_styles.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
      }
    } catch (error) {
      console.warn('Error parsing yoga_styles:', error)
      styles = []
    }
  }

  // Parse images as array
  const imagesArray = Array.isArray(item.images)
    ? item.images
    : (typeof item.images === 'string' ? (() => {
        try {
          return JSON.parse(item.images)
        } catch (error) {
          console.warn('Error parsing retreat images JSON:', error)
          return []
        }
      })() : []);

  // Parse amenities array
  let amenities: string[] = []
  if (item.amenities) {
    try {
      if (Array.isArray(item.amenities)) {
        amenities = item.amenities
      } else if (typeof item.amenities === 'string') {
        try {
          amenities = JSON.parse(item.amenities)
        } catch {
          amenities = item.amenities.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
      }
    } catch (error) {
      console.warn('Error parsing amenities:', error)
      amenities = []
    }
  }

  // Parse languages spoken array
  let languagesSpoken: string[] = []
  if (item.languages_spoken) {
    try {
      if (Array.isArray(item.languages_spoken)) {
        languagesSpoken = item.languages_spoken
      } else if (typeof item.languages_spoken === 'string') {
        try {
          languagesSpoken = JSON.parse(item.languages_spoken)
        } catch {
          languagesSpoken = item.languages_spoken.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
      }
    } catch (error) {
      console.warn('Error parsing languages_spoken:', error)
      languagesSpoken = []
    }
  }

  // Generate retreat-specific URL components
  const locationSlug = generateLocationSlug(item.city)
  const typeSlug = generateRetreatTypeSlug({
    name: item.name,
    business_description: item.business_description,
    yoga_styles: styles,
    amenities: amenities
  })

  return {
    id: item.id,
    name: item.name,
    slug: slug,
    location: item.city || "Bali",
    rating: item.review_score || 0,
    reviewCount: item.review_count || 0,
    image: imagesArray.length > 0 ? processImageUrl(imagesArray[0]) : generateColorFallback(300, 200, '#e6ceb3'),
    images: imagesArray.map(processImageUrl),
    // Required fields - use empty strings if no real data
    duration: "", // No duration data available
    price: "", // No pricing data available
    // AI-enhanced fields
    business_description: item.business_description || "",
    amenities: amenities,
    languages_spoken: languagesSpoken,
    drop_in_price_usd: item.drop_in_price_usd || null,
    price_range: item.price_range || "",
    // Optional fields
    tagline: undefined, // Will be handled in the component
    description: undefined, // Will be handled in the component
    longDescription: undefined, // Will be handled in the component
    styles: styles,
    includes: undefined, // No fake includes
    type: "retreat",
    location_details: {
      address: item.address || "",
      area: item.city || "Bali",
    },
    phone_number: item.phone_number || "",
    website: item.website || "",
    opening_hours: item.opening_hours || [],
    category: item.category_name || "Retreat center",
    // New URL structure fields
    locationSlug: locationSlug,
    typeSlug: typeSlug,
    urlPath: `/retreats/${locationSlug}/${typeSlug}`,
  }
}

// Function to get top studios by reviews and images (cached)
async function _getTopSupabaseStudios(limit = 3): Promise<Studio[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select("*")
    .in("category_name", studioCategories)
    .not("images", "is", null)
    .not("review_score", "is", null)
    .order("review_score", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(limit * 2)

  if (error) {
    console.error("Error fetching top studios from Supabase:", error)
    return []
  }

  const sortedData = data
    .filter((item) => {
      const imagesArray = Array.isArray(item.images)
        ? item.images
        : (typeof item.images === 'string' ? (() => {
            try {
              return JSON.parse(item.images)
            } catch (error) {
              console.warn('Error parsing images JSON in filter:', error)
              return []
            }
          })() : []);
      return imagesArray.length > 0;
    })
    .sort((a, b) => {
      const scoreDiff = (b.review_score || 0) - (a.review_score || 0)
      if (scoreDiff !== 0) return scoreDiff
      const imageCountDiff = ((Array.isArray(b.images) ? b.images.length : 0) || 0) - ((Array.isArray(a.images) ? a.images.length : 0) || 0)
      if (imageCountDiff !== 0) return imageCountDiff
      return (b.review_count || 0) - (a.review_count || 0)
    })
    .slice(0, limit)

  return sortedData.map(mapToStudio)
}

export const getTopSupabaseStudios = withCache(
  _getTopSupabaseStudios,
  'top-studios',
  CACHE_CONFIG.MEDIUM
)

// Function to get top retreats by reviews and images (cached)
async function _getTopSupabaseRetreats(limit = 3): Promise<Retreat[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select("*")
    .in("category_name", retreatCategories)
    .not("images", "is", null)
    .not("review_score", "is", null)
    .order("review_score", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(limit * 2)

  if (error) {
    console.error("Error fetching top retreats from Supabase:", error)
    return []
  }

  const sortedData = data
    .filter((item) => {
      const imagesArray = Array.isArray(item.images)
        ? item.images
        : (typeof item.images === 'string' ? (() => {
            try {
              return JSON.parse(item.images)
            } catch (error) {
              console.warn('Error parsing retreat images JSON in filter:', error)
              return []
            }
          })() : []);
      return imagesArray.length > 0;
    })
    .sort((a, b) => {
      const scoreDiff = (b.review_score || 0) - (a.review_score || 0)
      if (scoreDiff !== 0) return scoreDiff
      const imageCountDiff = ((Array.isArray(b.images) ? b.images.length : 0) || 0) - ((Array.isArray(a.images) ? a.images.length : 0) || 0)
      if (imageCountDiff !== 0) return imageCountDiff
      return (b.review_count || 0) - (a.review_count || 0)
    })
    .slice(0, limit)

  return sortedData.map(mapToRetreat)
}

export const getTopSupabaseRetreats = withCache(
  _getTopSupabaseRetreats,
  'top-retreats',
  CACHE_CONFIG.MEDIUM
)

// Function to fetch studios from Supabase (cached)
async function _getSupabaseStudios(): Promise<Studio[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select("*")
    .in("category_name", studioCategories)

  if (error) {
    console.error("Error fetching studios from Supabase:", error)
    return []
  }

  return data.map(mapToStudio)
}

export const getSupabaseStudios = withCache(
  _getSupabaseStudios,
  'all-studios',
  CACHE_CONFIG.LONG
)

// Function to fetch retreats from Supabase (cached)
async function _getSupabaseRetreats(): Promise<Retreat[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select("*")
    .in("category_name", retreatCategories)

  if (error) {
    console.error("Error fetching retreats from Supabase:", error)
    return []
  }

  return data.map(mapToRetreat)
}

export const getSupabaseRetreats = withCache(
  _getSupabaseRetreats,
  'all-retreats',
  CACHE_CONFIG.LONG
)

// Function to fetch a studio by slug (cached)
async function _getSupabaseStudioBySlug(slug: string): Promise<Studio | null> {
  const studios = await getSupabaseStudios()
  return studios.find((studio) => studio.slug === slug) || null
}

export const getSupabaseStudioBySlug = withCache(
  _getSupabaseStudioBySlug,
  'studio-by-slug',
  CACHE_CONFIG.LONG
)

// Function to fetch a retreat by slug (cached)
async function _getSupabaseRetreatBySlug(slug: string): Promise<Retreat | null> {
  const retreats = await getSupabaseRetreats()
  return retreats.find((retreat) => retreat.slug === slug) || null
}

export const getSupabaseRetreatBySlug = withCache(
  _getSupabaseRetreatBySlug,
  'retreat-by-slug',
  CACHE_CONFIG.LONG
)

// Function to get similar studios/retreats based on location (cached)
async function _getSimilarItems(type: "studio" | "retreat", currentItem: Studio | Retreat, limit = 3): Promise<(Studio | Retreat)[]> {
  const supabase = createServerClient()
  const categories = type === "studio" ? studioCategories : retreatCategories

  const { data, error } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select("*")
    .in("category_name", categories)
    .not("id", "eq", currentItem.id)
    .eq("city", currentItem.location)
    .not("images", "is", null)
    .not("review_score", "is", null)
    .order("review_score", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(limit * 2)

  if (error) {
    console.error(`Error fetching similar ${type}s from Supabase:`, error)
    return []
  }

  const sortedData = data
    .filter((item) => {
      const imagesArray = Array.isArray(item.images)
        ? item.images
        : (typeof item.images === 'string' ? (() => {
            try {
              return JSON.parse(item.images)
            } catch (error) {
              console.warn('Error parsing similar items images JSON:', error)
              return []
            }
          })() : []);
      return imagesArray.length > 0;
    })
    .sort((a, b) => {
      const scoreDiff = (b.review_score || 0) - (a.review_score || 0)
      if (scoreDiff !== 0) return scoreDiff
      const imageCountDiff = ((Array.isArray(b.images) ? b.images.length : 0) || 0) - ((Array.isArray(a.images) ? a.images.length : 0) || 0)
      if (imageCountDiff !== 0) return imageCountDiff
      return (b.review_count || 0) - (a.review_count || 0)
    })
    .slice(0, limit)

  return sortedData.map(item => type === "studio" ? mapToStudio(item) : mapToRetreat(item)) as (Studio | Retreat)[];
}

export function getSimilarItems(type: "studio" | "retreat", currentItem: Studio | Retreat, limit = 3): Promise<(Studio | Retreat)[]> {
  const cacheKey = createCacheKey('similar-items', { type, itemId: currentItem.id, location: currentItem.location, limit })
  return withCache(_getSimilarItems, cacheKey, CACHE_CONFIG.MEDIUM)(type, currentItem, limit)
}

// Function to get retreats by location slug (cached)
async function _getSupabaseRetreatsByLocation(locationSlug: string): Promise<Retreat[]> {
  const allRetreats = await getSupabaseRetreats()
  return allRetreats.filter(retreat => retreat.locationSlug === locationSlug)
}

export const getSupabaseRetreatsByLocation = withCache(
  _getSupabaseRetreatsByLocation,
  'retreats-by-location',
  CACHE_CONFIG.LONG
)

// Function to get retreats by location and type (cached)
async function _getSupabaseRetreatsByLocationAndType(locationSlug: string, typeSlug: string): Promise<Retreat[]> {
  const locationRetreats = await getSupabaseRetreatsByLocation(locationSlug)
  return locationRetreats.filter(retreat => retreat.typeSlug === typeSlug)
}

export const getSupabaseRetreatsByLocationAndType = withCache(
  _getSupabaseRetreatsByLocationAndType,
  'retreats-by-location-type',
  CACHE_CONFIG.LONG
)

// Function to get unique location and type combinations
async function _getRetreatLocationTypeCombinations(): Promise<Array<{location: string, type: string, count: number}>> {
  const allRetreats = await getSupabaseRetreats()
  const combinations = new Map<string, number>()
  
  allRetreats.forEach(retreat => {
    if (retreat.locationSlug && retreat.typeSlug) {
      const key = `${retreat.locationSlug}:${retreat.typeSlug}`
      combinations.set(key, (combinations.get(key) || 0) + 1)
    }
  })
  
  return Array.from(combinations.entries()).map(([key, count]) => {
    const [location, type] = key.split(':')
    return { location, type, count }
  })
}

export const getRetreatLocationTypeCombinations = withCache(
  _getRetreatLocationTypeCombinations,
  'retreat-combinations',
  CACHE_CONFIG.LONG
)

// Function to get studios by location slug (cached)
async function _getSupabaseStudiosByLocation(locationSlug: string): Promise<Studio[]> {
  const allStudios = await getSupabaseStudios()
  return allStudios.filter(studio => studio.locationSlug === locationSlug)
}

export const getSupabaseStudiosByLocation = withCache(
  _getSupabaseStudiosByLocation,
  'studios-by-location',
  CACHE_CONFIG.LONG
)

// Function to get studios by location and type (cached)
async function _getSupabaseStudiosByLocationAndType(locationSlug: string, typeSlug: string): Promise<Studio[]> {
  const locationStudios = await getSupabaseStudiosByLocation(locationSlug)
  return locationStudios.filter(studio => studio.typeSlug === typeSlug)
}

export const getSupabaseStudiosByLocationAndType = withCache(
  _getSupabaseStudiosByLocationAndType,
  'studios-by-location-type',
  CACHE_CONFIG.LONG
)

// Function to get unique studio location and type combinations
async function _getStudioLocationTypeCombinations(): Promise<Array<{location: string, type: string, count: number}>> {
  const allStudios = await getSupabaseStudios()
  const combinations = new Map<string, number>()
  
  allStudios.forEach(studio => {
    if (studio.locationSlug && studio.typeSlug) {
      const key = `${studio.locationSlug}:${studio.typeSlug}`
      combinations.set(key, (combinations.get(key) || 0) + 1)
    }
  })
  
  return Array.from(combinations.entries()).map(([key, count]) => {
    const [location, type] = key.split(':')
    return { location, type, count }
  })
}

export const getStudioLocationTypeCombinations = withCache(
  _getStudioLocationTypeCombinations,
  'studio-combinations',
  CACHE_CONFIG.LONG
)
