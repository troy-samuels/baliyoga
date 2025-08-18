import { getSupabaseRetreats, getRetreatLocationTypeCombinations } from "@/lib/supabase-data-utils"
import { withCache, CACHE_CONFIG } from "@/lib/cache-utils"
import { getAllLocationSlugs, getAllRetreatTypeSlugs, RETREAT_TYPE_MAPPING } from "@/lib/retreat-types"

async function generateRetreatsSitemap(): Promise<Response> {
  const baseUrl = "https://baliyoga.com"
  const retreats = await getSupabaseRetreats()
  const combinations = await getRetreatLocationTypeCombinations()
  const currentDate = new Date().toISOString()
  
  // Individual retreat URLs (old structure - keeping for backward compatibility)
  const retreatUrls = retreats.map((retreat) => {
    const isPopularLocation = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar'].includes(retreat.location)
    const hasHighRating = retreat.rating >= 4.5
    
    let priority = "0.7"
    if (isPopularLocation && hasHighRating) priority = "0.9"
    else if (isPopularLocation || hasHighRating) priority = "0.8"

    const imageUrls = retreat.images && retreat.images.length > 0 
      ? retreat.images.slice(0, 5).map(img => `
      <image:image>
        <image:loc>${img.startsWith('http') ? img : `${baseUrl}${img}`}</image:loc>
        <image:caption>${retreat.name} - Yoga Retreat in ${retreat.location}, Bali</image:caption>
        <image:title>${retreat.name}</image:title>
      </image:image>`).join('')
      : ''

    return `  <url>
    <loc>${baseUrl}/retreats/${retreat.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${imageUrls}
  </url>`
  }).join('\n')

  // New structured URLs - /retreats/[location]/[type]
  const structuredUrls = combinations.map(({ location, type, count }) => {
    const retreatType = Object.values(RETREAT_TYPE_MAPPING).find(t => t.slug === type)
    if (!retreatType) return ''
    
    // Higher priority for popular locations and types with more retreats
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = "0.6"
    if (isPopularLocation && count > 5) priority = "0.8"
    else if (isPopularLocation || count > 3) priority = "0.7"

    return `  <url>
    <loc>${baseUrl}/retreats/${location}/${type}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).filter(Boolean).join('\n')

  // Location-only URLs - /retreats/[location]
  const locationUrls = getAllLocationSlugs().map(location => {
    const locationRetreats = retreats.filter(r => r.locationSlug === location)
    if (locationRetreats.length === 0) return ''
    
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = "0.6"
    if (isPopularLocation && locationRetreats.length > 10) priority = "0.8"
    else if (isPopularLocation || locationRetreats.length > 5) priority = "0.7"

    return `  <url>
    <loc>${baseUrl}/retreats/${location}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).filter(Boolean).join('\n')
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${retreatUrls}
${structuredUrls}
${locationUrls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30 minutes
    },
  })
}

// Cached version
const cachedGenerateRetreatsSitemap = withCache(
  generateRetreatsSitemap,
  'retreats-sitemap',
  CACHE_CONFIG.MEDIUM
)

export async function GET() {
  return cachedGenerateRetreatsSitemap()
}