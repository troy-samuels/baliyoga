import { getAllRetreats } from '@/lib/supabase-server'
import { withCache } from '@/lib/cache-utils'
import { getCanonicalUrl } from '@/lib/slug-utils'

async function generateRetreatsSitemap() {
  const baseUrl = 'https://baliyoga.com'
  const currentDate = new Date().toISOString()

  const retreats = await getAllRetreats()

  // Create XML content for retreats sitemap
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${retreats.map(retreat => {
  const priority = (() => {
    const isPopularLocation = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar'].includes(retreat.location)
    const hasHighRating = retreat.rating >= 4.5
    const hasReviews = retreat.reviewCount && retreat.reviewCount > 0
    const isUpcoming = retreat.start_date && new Date(retreat.start_date) > new Date()

    if (isPopularLocation && hasHighRating && isUpcoming) return '0.9'
    if ((isPopularLocation && hasHighRating) || (hasHighRating && isUpcoming)) return '0.8'
    if (isPopularLocation || hasHighRating || isUpcoming) return '0.7'
    return '0.6'
  })()

  return `  <url>
    <loc>${getCanonicalUrl('retreat', retreat.slug, baseUrl)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    ${retreat.image ? `<image:image>
      <image:loc>${retreat.image}</image:loc>
      <image:title>${retreat.name} - Yoga Retreat in ${retreat.location}, Bali</image:title>
      <image:caption>Transformative yoga retreat experience at ${retreat.name}</image:caption>
    </image:image>` : ''}
    ${retreat.start_date ? `<news:news>
      <news:publication>
        <news:name>Bali Yoga</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${retreat.start_date}</news:publication_date>
      <news:title>${retreat.name} - Yoga Retreat in ${retreat.location}</news:title>
    </news:news>` : ''}
  </url>`
}).join('\n')}
</urlset>`

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200', // 1 hour browser, 2 hours CDN
    },
  })
}

// Export cached sitemap with proper headers
export const GET = withCache(
  generateRetreatsSitemap,
  'retreats-sitemap',
  { ttl: 1800 } // 30 minutes cache
)