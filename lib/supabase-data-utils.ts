import { createServerClient } from "./supabase"
import type { Studio, Retreat } from "./data-utils"

// Categories that should be considered as studios
const studioCategories = ["Yoga studio", "Pilates studio", "Fitness center", "Gym", "Meditation center"]

// Categories that should be considered as retreats
const retreatCategories = [
  "Yoga retreat center",
  "Retreat center",
  "Wellness center",
  "Wellness hotel",
  "Resort hotel",
  "Ashram",
  "Health spa",
  "Spa",
]

// Helper function to process image URLs
const processImageUrl = (url: string | null | undefined): string => {
  if (!url) return `/placeholder.svg?height=200&width=300&text=No+Image`
  
  if (url.includes('googleusercontent.com') || url.includes('googleapis.com')) {
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

  // Extract styles based on category - no defaults
  const styles: string[] = []
  const categoryName = (item.category_name || "").toLowerCase()
  const description = (item.description || "").toLowerCase()
  const name = (item.name || "").toLowerCase()

  // Check for yoga styles in category, name, and description
  if (categoryName.includes("hatha") || description.includes("hatha") || name.includes("hatha")) {
    styles.push("Hatha")
  }
  if (categoryName.includes("vinyasa") || description.includes("vinyasa") || name.includes("vinyasa")) {
    styles.push("Vinyasa")
  }
  if (categoryName.includes("yin") || description.includes("yin") || name.includes("yin")) {
    styles.push("Yin")
  }
  if (categoryName.includes("meditation") || description.includes("meditation") || name.includes("meditation")) {
    styles.push("Meditation")
  }
  if (categoryName.includes("ashtanga") || description.includes("ashtanga") || name.includes("ashtanga")) {
    styles.push("Ashtanga")
  }
  if (categoryName.includes("bikram") || description.includes("bikram") || name.includes("bikram")) {
    styles.push("Bikram")
  }
  if (categoryName.includes("hot yoga") || description.includes("hot yoga") || name.includes("hot yoga")) {
    styles.push("Hot Yoga")
  }
  if (categoryName.includes("restorative") || description.includes("restorative") || name.includes("restorative")) {
    styles.push("Restorative")
  }
  if (categoryName.includes("kundalini") || description.includes("kundalini") || name.includes("kundalini")) {
    styles.push("Kundalini")
  }
  if (categoryName.includes("pilates") || description.includes("pilates") || name.includes("pilates")) {
    styles.push("Pilates")
  }

  return {
    id: item.id,
    name: item.name,
    slug: slug,
    location: item.city || "Bali",
    rating: item.review_score || 4.5,
    reviewCount: item.review_count || 0,
    image: item.images && item.images.length > 0
      ? processImageUrl(item.images[0])
      : `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.name)}`,
    styles: styles,
    tagline: `Discover yoga at ${item.name}`,
    description: `Located in ${item.city || "Bali"}, ${item.name} offers various yoga classes.`,
    longDescription: `${item.name} is a welcoming yoga studio in ${item.city || "Bali"} offering a variety of classes for all levels. Join us to deepen your practice in a supportive environment.`,
    price: {
      dropIn: "$15",
      weekly: "$75",
      monthly: "$220",
    },
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

  // Extract styles based on category - no defaults
  const styles: string[] = []
  const categoryName = (item.category_name || "").toLowerCase()
  const description = (item.description || "").toLowerCase()
  const name = (item.name || "").toLowerCase()

  // Check for yoga styles in category, name, and description
  if (categoryName.includes("hatha") || description.includes("hatha") || name.includes("hatha")) {
    styles.push("Hatha")
  }
  if (categoryName.includes("vinyasa") || description.includes("vinyasa") || name.includes("vinyasa")) {
    styles.push("Vinyasa")
  }
  if (categoryName.includes("yin") || description.includes("yin") || name.includes("yin")) {
    styles.push("Yin")
  }
  if (categoryName.includes("meditation") || description.includes("meditation") || name.includes("meditation")) {
    styles.push("Meditation")
  }
  if (categoryName.includes("ashtanga") || description.includes("ashtanga") || name.includes("ashtanga")) {
    styles.push("Ashtanga")
  }
  if (categoryName.includes("wellness") || description.includes("wellness") || name.includes("wellness")) {
    styles.push("Wellness")
  }
  if (categoryName.includes("detox") || description.includes("detox") || name.includes("detox")) {
    styles.push("Detox")
  }
  if (categoryName.includes("spiritual") || description.includes("spiritual") || name.includes("spiritual")) {
    styles.push("Spiritual")
  }
  if (categoryName.includes("healing") || description.includes("healing") || name.includes("healing")) {
    styles.push("Healing")
  }

  return {
    id: item.id,
    name: item.name,
    slug: slug,
    location: item.city || "Bali",
    rating: item.review_score || 4.5,
    reviewCount: item.review_count || 0,
    image: item.images && item.images.length > 0
      ? processImageUrl(item.images[0])
      : `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.name)}`,
    duration: "7-14 days",
    price: "$1,200",
    tagline: `Experience tranquility at ${item.name}`,
    description: `Located in ${item.city || "Bali"}, ${item.name} offers a peaceful retreat experience.`,
    longDescription: `${item.name} is a beautiful retreat center located in ${item.city || "Bali"}. Offering a range of wellness activities and yoga classes, this is the perfect place to relax and rejuvenate.`,
    styles: styles,
    includes: ["Accommodation", "Daily yoga classes", "Healthy meals"],
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
    .from("Bali Yoga Studios and Retreats")
    .select("*")
    .in("category_name", studioCategories)
    .not("images", "is", null)
    .not("review_score", "is", null)
    .order("review_score", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(limit * 2) // Get more to filter by image count

  if (error) {
    console.error("Error fetching top studios from Supabase:", error)
    return []
  }

  // Sort by image count and review quality, then take top results
  const sortedData = data
    .filter((item) => item.images && item.images.length > 0)
    .sort((a, b) => {
      // Primary sort: review score
      const scoreDiff = (b.review_score || 0) - (a.review_score || 0)
      if (scoreDiff !== 0) return scoreDiff

      // Secondary sort: number of images
      const imageCountDiff = (b.images?.length || 0) - (a.images?.length || 0)
      if (imageCountDiff !== 0) return imageCountDiff

      // Tertiary sort: review count
      return (b.review_count || 0) - (a.review_count || 0)
    })
    .slice(0, limit)

  return sortedData.map(mapToStudio)
}

// Function to get top retreats by reviews and images
export async function getTopSupabaseRetreats(limit = 3): Promise<Retreat[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("Bali Yoga Studios and Retreats")
    .select("*")
    .in("category_name", retreatCategories)
    .not("images", "is", null)
    .not("review_score", "is", null)
    .order("review_score", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(limit * 2) // Get more to filter by image count

  if (error) {
    console.error("Error fetching top retreats from Supabase:", error)
    return []
  }

  // Sort by image count and review quality, then take top results
  const sortedData = data
    .filter((item) => item.images && item.images.length > 0)
    .sort((a, b) => {
      // Primary sort: review score
      const scoreDiff = (b.review_score || 0) - (a.review_score || 0)
      if (scoreDiff !== 0) return scoreDiff

      // Secondary sort: number of images
      const imageCountDiff = (b.images?.length || 0) - (a.images?.length || 0)
      if (imageCountDiff !== 0) return imageCountDiff

      // Tertiary sort: review count
      return (b.review_count || 0) - (a.review_count || 0)
    })
    .slice(0, limit)

  return sortedData.map(mapToRetreat)
}

// Function to fetch studios from Supabase
export async function getSupabaseStudios(): Promise<Studio[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("Bali Yoga Studios and Retreats")
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
    .from("Bali Yoga Studios and Retreats")
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
