import { getAllStudios, getAllRetreats } from '@/lib/supabase-server'
import { withCache } from '@/lib/cache-utils'

async function generateLocationsSitemap() {
  const baseUrl = 'https://baliyoga.com'
  const currentDate = new Date().toISOString()

  const [studios, retreats] = await Promise.all([
    getAllStudios(),
    getAllRetreats()
  ])

  // Get unique locations with counts
  const locationCounts = new Map<string, { studios: number; retreats: number }>()

  studios.forEach(studio => {
    const location = studio.location
    const current = locationCounts.get(location) || { studios: 0, retreats: 0 }
    locationCounts.set(location, { ...current, studios: current.studios + 1 })
  })

  retreats.forEach(retreat => {
    const location = retreat.location
    const current = locationCounts.get(location) || { studios: 0, retreats: 0 }
    locationCounts.set(location, { ...current, retreats: current.retreats + 1 })
  })

  // Popular tourist areas in Bali
  const popularLocations = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar', 'Sanur', 'Kuta', 'Uluwatu']

  // Create XML content for locations sitemap
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(locationCounts.entries()).map(([location, counts]) => {
  const locationSlug = location.toLowerCase().replace(/\s+/g, '-')
  const isPopular = popularLocations.includes(location)
  const totalCount = counts.studios + counts.retreats

  const priority = (() => {
    if (isPopular && totalCount >= 10) return '0.9'
    if (isPopular || totalCount >= 5) return '0.8'
    if (totalCount >= 3) return '0.7'
    return '0.6'
  })()

  // Generate URLs for location-based pages
  const urls = []

  // Main location pages
  if (counts.studios > 0) {
    urls.push(`  <url>
    <loc>${baseUrl}/studios/${locationSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`)
  }

  if (counts.retreats > 0) {
    urls.push(`  <url>
    <loc>${baseUrl}/retreats/${locationSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`)
  }

  // Location overview page
  urls.push(`  <url>
    <loc>${baseUrl}/locations/${locationSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${Math.max(0.6, priority - 0.1)}</priority>
  </url>`)

  return urls.join('\n')
}).join('\n')}
</urlset>`

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=7200, s-maxage=14400', // 2 hours browser, 4 hours CDN
    },
  })
}

// Export cached sitemap with proper headers
export const GET = withCache(
  generateLocationsSitemap,
  'locations-sitemap',
  { ttl: 3600 } // 1 hour cache
)