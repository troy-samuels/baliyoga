import { getAllStudios } from '@/lib/supabase-server'
import { withCache } from '@/lib/cache-utils'
import { getCanonicalUrl } from '@/lib/slug-utils'

async function generateStudiosSitemap() {
  const baseUrl = 'https://baliyoga.com'
  const currentDate = new Date().toISOString()

  const studios = await getAllStudios()

  // Create XML content for studios sitemap
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${studios.map(studio => {
  const priority = (() => {
    const isPopularLocation = ['Ubud', 'Canggu', 'Seminyak', 'Denpasar'].includes(studio.location)
    const hasHighRating = studio.rating >= 4.5
    const hasReviews = studio.reviewCount && studio.reviewCount > 0

    if (isPopularLocation && hasHighRating && hasReviews) return '0.9'
    if ((isPopularLocation && hasHighRating) || (hasHighRating && hasReviews)) return '0.8'
    if (isPopularLocation || hasHighRating) return '0.7'
    return '0.6'
  })()

  return `  <url>
    <loc>${getCanonicalUrl('studio', studio.slug, baseUrl)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    ${studio.image ? `<image:image>
      <image:loc>${studio.image}</image:loc>
      <image:title>${studio.name} - Yoga Studio in ${studio.location}, Bali</image:title>
      <image:caption>Authentic yoga experience at ${studio.name}</image:caption>
    </image:image>` : ''}
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
  generateStudiosSitemap,
  'studios-sitemap',
  { revalidate: 1800, tags: ['studios-sitemap'] } // 30 minutes cache
)