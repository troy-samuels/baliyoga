import type { MetadataRoute } from "next"
import { getAllStudios, getAllRetreats } from "@/lib/supabase-server"
import { withCache, CACHE_CONFIG } from "@/lib/cache-utils"
import { ROUTE_PATTERNS, generateSitemapEntry, getCanonicalUrl } from "@/lib/slug-utils"

// Cached sitemap generation function
async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://baliyoga.com"
  const currentDate = new Date()

  // Get dynamic content with caching
  const [studios, retreats] = await Promise.all([
    getAllStudios(),
    getAllRetreats()
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

    return generateSitemapEntry(
      getCanonicalUrl('studio', studio.slug, baseUrl),
      currentDate,
      'weekly',
      priority
    )
  })

  // Dynamic retreat pages with similar logic
  const retreatPages: MetadataRoute.Sitemap = retreats.map((retreat) => {
    const isPopularLocation = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar'].includes(retreat.location)
    const hasHighRating = retreat.rating >= 4.5
    
    let priority = 0.7
    if (isPopularLocation && hasHighRating) priority = 0.9
    else if (isPopularLocation || hasHighRating) priority = 0.8

    return generateSitemapEntry(
      getCanonicalUrl('retreat', retreat.slug, baseUrl),
      currentDate,
      'weekly',
      priority
    )
  })

  // Future: Add location and type-based routes here when needed

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

  // Generated sitemap successfully

  return [...staticPages, ...studioPages, ...retreatPages, ...claimPages]
}

// Export cached sitemap function
export default withCache(
  generateSitemap,
  'main-sitemap',
  CACHE_CONFIG.MEDIUM // 30 minutes cache
)
