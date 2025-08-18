import { getSupabaseStudios, getSupabaseRetreats } from "@/lib/supabase-data-utils"
import { withCache, CACHE_CONFIG } from "@/lib/cache-utils"

async function generateLocationsSitemap(): Promise<Response> {
  const baseUrl = "https://baliyoga.com"
  const currentDate = new Date().toISOString()
  
  // Get all studios and retreats to extract unique locations
  const [studios, retreats] = await Promise.all([
    getSupabaseStudios(),
    getSupabaseRetreats()
  ])

  // Extract unique locations
  const allLocations = new Set([
    ...studios.map(s => s.location),
    ...retreats.map(r => r.location)
  ])

  // Popular Bali locations for yoga and wellness
  const popularLocations = [
    'Ubud', 'Canggu', 'Seminyak', 'Denpasar', 'Sanur', 'Uluwatu', 
    'Jimbaran', 'Nusa Penida', 'Amed', 'Lovina'
  ]

  // Create location-based URLs (these would be landing pages for each location)
  const locationUrls = Array.from(allLocations).map(location => {
    const isPopular = popularLocations.includes(location)
    const studioCount = studios.filter(s => s.location === location).length
    const retreatCount = retreats.filter(r => r.location === location).length
    const totalCount = studioCount + retreatCount
    
    let priority = "0.6"
    if (isPopular && totalCount > 10) priority = "0.8"
    else if (isPopular || totalCount > 5) priority = "0.7"

    const locationSlug = location.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      studios: {
        url: `${baseUrl}/studios?location=${encodeURIComponent(location)}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: priority
      },
      retreats: {
        url: `${baseUrl}/retreats?location=${encodeURIComponent(location)}`,
        lastmod: currentDate,
        changefreq: 'weekly', 
        priority: priority
      },
      // Future location landing pages
      location: {
        url: `${baseUrl}/locations/${locationSlug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: priority
      }
    }
  })

  const allUrls = locationUrls.flatMap(loc => [loc.studios, loc.retreats, loc.location])

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 hour
    },
  })
}

// Cached version
const cachedGenerateLocationsSitemap = withCache(
  generateLocationsSitemap,
  'locations-sitemap',
  CACHE_CONFIG.LONG
)

export async function GET() {
  return cachedGenerateLocationsSitemap()
}