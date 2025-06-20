import { createServerClient } from "./supabase"
import type { Studio, Retreat } from "./data-utils"
import { generateColorFallback } from "./image-fallback"

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

// Function to convert raw data to Studio type
const mapToStudio = (item: any): Studio => {
  // Create a slug from the name
  const slug = item.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  // Extract styles based on category - only if we have real data
  const styles: string[] = []
  const categoryName = (item.category_name || "").toLowerCase()
  
  // Only add styles if they're explicitly mentioned in the category
  if (categoryName.includes("hatha")) styles.push("Hatha")
  if (categoryName.includes("vinyasa")) styles.push("Vinyasa")
  if (categoryName.includes("yin")) styles.push("Yin")
  if (categoryName.includes("meditation")) styles.push("Meditation")
  if (categoryName.includes("ashtanga")) styles.push("Ashtanga")
  if (categoryName.includes("bikram")) styles.push("Bikram")
  if (categoryName.includes("hot yoga")) styles.push("Hot Yoga")
  if (categoryName.includes("restorative")) styles.push("Restorative")
  if (categoryName.includes("kundalini")) styles.push("Kundalini")
  if (categoryName.includes("pilates")) styles.push("Pilates")

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
  }
}

// Function to convert raw data to Retreat type
const mapToRetreat = (item: any): Retreat => {
  // Create a slug from the name
  const slug = item.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  // Extract styles based on category - only if we have real data
  const styles: string[] = []
  const categoryName = (item.category_name || "").toLowerCase()
  
  // Only add styles if they're explicitly mentioned in the category
  if (categoryName.includes("hatha")) styles.push("Hatha")
  if (categoryName.includes("vinyasa")) styles.push("Vinyasa")
  if (categoryName.includes("yin")) styles.push("Yin")
  if (categoryName.includes("meditation")) styles.push("Meditation")
  if (categoryName.includes("ashtanga")) styles.push("Ashtanga")
  if (categoryName.includes("wellness")) styles.push("Wellness")
  if (categoryName.includes("detox")) styles.push("Detox")
  if (categoryName.includes("spiritual")) styles.push("Spiritual")
  if (categoryName.includes("healing")) styles.push("Healing")

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
  }
}

// Function to get top studios by reviews and images
export async function getTopSupabaseStudios(limit = 3): Promise<Studio[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v2_bali_yoga_studios_and_retreats')
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

// Function to get top retreats by reviews and images
export async function getTopSupabaseRetreats(limit = 3): Promise<Retreat[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v2_bali_yoga_studios_and_retreats')
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

// Function to fetch studios from Supabase
export async function getSupabaseStudios(): Promise<Studio[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v2_bali_yoga_studios_and_retreats')
    .select("*")
    .in("category_name", studioCategories)

  if (error) {
    console.error("Error fetching studios from Supabase:", error)
    return []
  }

  return data.map(mapToStudio)
}

// Function to fetch retreats from Supabase
export async function getSupabaseRetreats(): Promise<Retreat[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('v2_bali_yoga_studios_and_retreats')
    .select("*")
    .in("category_name", retreatCategories)

  if (error) {
    console.error("Error fetching retreats from Supabase:", error)
    return []
  }

  return data.map(mapToRetreat)
}

// Function to fetch a studio by slug
export async function getSupabaseStudioBySlug(slug: string): Promise<Studio | null> {
  const studios = await getSupabaseStudios()
  return studios.find((studio) => studio.slug === slug) || null
}

// Function to fetch a retreat by slug
export async function getSupabaseRetreatBySlug(slug: string): Promise<Retreat | null> {
  const retreats = await getSupabaseRetreats()
  return retreats.find((retreat) => retreat.slug === slug) || null
}

// Function to get similar studios/retreats based on location
export async function getSimilarItems(type: "studio" | "retreat", currentItem: Studio | Retreat, limit = 3): Promise<(Studio | Retreat)[]> {
  const supabase = createServerClient()
  const categories = type === "studio" ? studioCategories : retreatCategories

  const { data, error } = await supabase
    .from('v2_bali_yoga_studios_and_retreats')
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
