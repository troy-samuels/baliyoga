import type { MetadataRoute } from "next"
import { getSupabaseStudios, getSupabaseRetreats, getRetreatLocationTypeCombinations, getStudioLocationTypeCombinations } from "@/lib/supabase-data-utils"
import { withCache, CACHE_CONFIG } from "@/lib/cache-utils"
import { getAllLocationSlugs, getAllRetreatTypeSlugs, RETREAT_TYPE_MAPPING } from "@/lib/retreat-types"
import { getAllStudioLocationSlugs, getAllStudioTypeSlugs, STUDIO_TYPE_MAPPING } from "@/lib/studio-types"

// Cached sitemap generation function
async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://baliyoga.com"
  const currentDate = new Date()

  // Get dynamic content with caching
  const [studios, retreats, retreatCombinations, studioCombinations] = await Promise.all([
    getSupabaseStudios(),
    getSupabaseRetreats(),
    getRetreatLocationTypeCombinations(),
    getStudioLocationTypeCombinations()
  ])

  // Static pages with proper priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/studios`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/retreats`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/submit`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/become-a-partner`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic studio pages with location-based priorities
  const studioPages: MetadataRoute.Sitemap = studios.map((studio) => {
    // Higher priority for popular locations
    const isPopularLocation = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar'].includes(studio.location)
    const hasHighRating = studio.rating >= 4.5
    
    let priority = 0.7
    if (isPopularLocation && hasHighRating) priority = 0.9
    else if (isPopularLocation || hasHighRating) priority = 0.8

    return {
      url: `${baseUrl}/studios/${studio.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority,
    }
  })

  // Dynamic retreat pages with similar logic
  const retreatPages: MetadataRoute.Sitemap = retreats.map((retreat) => {
    const isPopularLocation = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar'].includes(retreat.location)
    const hasHighRating = retreat.rating >= 4.5
    
    let priority = 0.7
    if (isPopularLocation && hasHighRating) priority = 0.9
    else if (isPopularLocation || hasHighRating) priority = 0.8

    return {
      url: `${baseUrl}/retreats/${retreat.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority,
    }
  })

  // New structured retreat URL pages - /retreats/[location]/[type] 
  const structuredRetreatPages: MetadataRoute.Sitemap = retreatCombinations.map(({ location, type, count }) => {
    const retreatType = Object.values(RETREAT_TYPE_MAPPING).find(t => t.slug === type)
    if (!retreatType) return null
    
    // Higher priority for popular locations and types with more retreats
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = 0.6
    if (isPopularLocation && count > 5) priority = 0.8
    else if (isPopularLocation || count > 3) priority = 0.7

    return {
      url: `${baseUrl}/retreats/${location}/${type}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority,
    }
  }).filter(Boolean) as MetadataRoute.Sitemap

  // Location-only retreat pages - /retreats/[location]
  const locationRetreatPages: MetadataRoute.Sitemap = getAllLocationSlugs().map(location => {
    const locationRetreats = retreats.filter(r => r.locationSlug === location)
    if (locationRetreats.length === 0) return null
    
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = 0.6
    if (isPopularLocation && locationRetreats.length > 10) priority = 0.8
    else if (isPopularLocation || locationRetreats.length > 5) priority = 0.7

    return {
      url: `${baseUrl}/retreats/${location}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority,
    }
  }).filter(Boolean) as MetadataRoute.Sitemap

  // New structured studio URL pages - /studios/[location]/[type]
  const structuredStudioPages: MetadataRoute.Sitemap = studioCombinations.map(({ location, type, count }) => {
    const studioType = Object.values(STUDIO_TYPE_MAPPING).find(t => t.slug === type)
    if (!studioType) return null
    
    // Higher priority for popular locations and types with more studios
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = 0.6
    if (isPopularLocation && count > 10) priority = 0.8
    else if (isPopularLocation || count > 5) priority = 0.7

    return {
      url: `${baseUrl}/studios/${location}/${type}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority,
    }
  }).filter(Boolean) as MetadataRoute.Sitemap

  // Location-only studio pages - /studios/[location]
  const locationStudioPages: MetadataRoute.Sitemap = getAllStudioLocationSlugs().map(location => {
    const locationStudios = studios.filter(s => s.locationSlug === location)
    if (locationStudios.length === 0) return null
    
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = 0.6
    if (isPopularLocation && locationStudios.length > 15) priority = 0.8
    else if (isPopularLocation || locationStudios.length > 8) priority = 0.7

    return {
      url: `${baseUrl}/studios/${location}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority,
    }
  }).filter(Boolean) as MetadataRoute.Sitemap

  // Claim pages for each listing
  const claimPages: MetadataRoute.Sitemap = [
    ...studios.map((studio) => ({
      url: `${baseUrl}/claim/${studio.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...retreats.map((retreat) => ({
      url: `${baseUrl}/claim/${retreat.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }))
  ]

  console.log(`Generated sitemap with ${staticPages.length} static pages, ${studioPages.length} studios, ${retreatPages.length} retreats, ${structuredStudioPages.length} structured studio pages, ${locationStudioPages.length} studio location pages, ${structuredRetreatPages.length} structured retreat pages, ${locationRetreatPages.length} retreat location pages, ${claimPages.length} claim pages`)

  return [...staticPages, ...studioPages, ...retreatPages, ...structuredStudioPages, ...locationStudioPages, ...structuredRetreatPages, ...locationRetreatPages, ...claimPages]
}

// Export cached sitemap function
export default withCache(
  generateSitemap,
  'main-sitemap',
  CACHE_CONFIG.MEDIUM // 30 minutes cache
)
