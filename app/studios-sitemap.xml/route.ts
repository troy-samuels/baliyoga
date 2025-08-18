import { getSupabaseStudios, getStudioLocationTypeCombinations } from "@/lib/supabase-data-utils"
import { withCache, CACHE_CONFIG } from "@/lib/cache-utils"
import { getAllStudioLocationSlugs, getAllStudioTypeSlugs, STUDIO_TYPE_MAPPING } from "@/lib/studio-types"

async function generateStudiosSitemap(): Promise<Response> {
  const baseUrl = "https://baliyoga.com"
  const studios = await getSupabaseStudios()
  const combinations = await getStudioLocationTypeCombinations()
  const currentDate = new Date().toISOString()
  
  // Individual studio URLs (old structure - keeping for backward compatibility)
  const studioUrls = studios.map((studio) => {
    const isPopularLocation = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar'].includes(studio.location)
    const hasHighRating = studio.rating >= 4.5
    
    let priority = "0.7"
    if (isPopularLocation && hasHighRating) priority = "0.9"
    else if (isPopularLocation || hasHighRating) priority = "0.8"

    const imageUrls = studio.images && studio.images.length > 0 
      ? studio.images.slice(0, 5).map(img => `
      <image:image>
        <image:loc>${img.startsWith('http') ? img : `${baseUrl}${img}`}</image:loc>
        <image:caption>${studio.name} - Yoga Studio in ${studio.location}, Bali</image:caption>
        <image:title>${studio.name}</image:title>
      </image:image>`).join('')
      : ''

    return `  <url>
    <loc>${baseUrl}/studios/${studio.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${imageUrls}
  </url>`
  }).join('\n')

  // New structured URLs - /studios/[location]/[type]
  const structuredUrls = combinations.map(({ location, type, count }) => {
    const studioType = Object.values(STUDIO_TYPE_MAPPING).find(t => t.slug === type)
    if (!studioType) return ''
    
    // Higher priority for popular locations and types with more studios
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = "0.6"
    if (isPopularLocation && count > 5) priority = "0.8"
    else if (isPopularLocation || count > 3) priority = "0.7"

    return `  <url>
    <loc>${baseUrl}/studios/${location}/${type}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).filter(Boolean).join('\n')

  // Location-only URLs - /studios/[location]
  const locationUrls = getAllStudioLocationSlugs().map(location => {
    const locationStudios = studios.filter(s => s.locationSlug === location)
    if (locationStudios.length === 0) return ''
    
    const isPopularLocation = ['ubud', 'canggu', 'seminyak', 'denpasar'].includes(location)
    let priority = "0.6"
    if (isPopularLocation && locationStudios.length > 10) priority = "0.8"
    else if (isPopularLocation || locationStudios.length > 5) priority = "0.7"

    return `  <url>
    <loc>${baseUrl}/studios/${location}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).filter(Boolean).join('\n')
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${studioUrls}
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
const cachedGenerateStudiosSitemap = withCache(
  generateStudiosSitemap,
  'studios-sitemap',
  CACHE_CONFIG.MEDIUM
)

export async function GET() {
  return cachedGenerateStudiosSitemap()
}