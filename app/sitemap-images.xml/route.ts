import { getAllStudios, getAllRetreats } from '@/lib/supabase-server'
import { withCache } from '@/lib/cache-utils'

async function generateImagesSitemap() {
  const baseUrl = 'https://baliyoga.com'
  const currentDate = new Date().toISOString()

  const [studios, retreats] = await Promise.all([
    getAllStudios(),
    getAllRetreats()
  ])

  // Collect all images with metadata
  const images: Array<{
    url: string
    title: string
    caption: string
    location: string
    type: 'studio' | 'retreat'
    itemSlug: string
  }> = []

  // Studio images
  studios.forEach(studio => {
    if (studio.image) {
      images.push({
        url: studio.image,
        title: `${studio.name} - Yoga Studio in ${studio.location}, Bali`,
        caption: `Experience authentic yoga at ${studio.name}, a beautiful yoga studio located in ${studio.location}, Bali. ${studio.business_description ? studio.business_description.substring(0, 100) + '...' : ''}`,
        location: studio.location,
        type: 'studio',
        itemSlug: studio.slug
      })
    }

    // Additional images if available
    if (studio.images && Array.isArray(studio.images)) {
      studio.images.forEach((imageUrl: string, index: number) => {
        images.push({
          url: imageUrl,
          title: `${studio.name} - Interior View ${index + 1}`,
          caption: `Beautiful interior and atmosphere at ${studio.name} yoga studio in ${studio.location}, Bali`,
          location: studio.location,
          type: 'studio',
          itemSlug: studio.slug
        })
      })
    }
  })

  // Retreat images
  retreats.forEach(retreat => {
    if (retreat.image) {
      images.push({
        url: retreat.image,
        title: `${retreat.name} - Yoga Retreat in ${retreat.location}, Bali`,
        caption: `Join a transformative yoga retreat at ${retreat.name} in the beautiful setting of ${retreat.location}, Bali. ${retreat.business_description ? retreat.business_description.substring(0, 100) + '...' : ''}`,
        location: retreat.location,
        type: 'retreat',
        itemSlug: retreat.slug
      })
    }

    // Additional retreat images
    if (retreat.images && Array.isArray(retreat.images)) {
      retreat.images.forEach((imageUrl: string, index: number) => {
        images.push({
          url: imageUrl,
          title: `${retreat.name} - Retreat Setting ${index + 1}`,
          caption: `Serene environment and facilities at ${retreat.name} yoga retreat in ${retreat.location}, Bali`,
          location: retreat.location,
          type: 'retreat',
          itemSlug: retreat.slug
        })
      })
    }
  })

  // Create XML content for images sitemap
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(img => `  <url>
    <loc>${baseUrl}/${img.type === 'studio' ? 'studios' : 'retreats'}/${img.itemSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
      <image:geo_location>${img.location}, Bali, Indonesia</image:geo_location>
    </image:image>
  </url>`).join('\n')}
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
  generateImagesSitemap,
  'images-sitemap',
  { revalidate: 3600, tags: ['images-sitemap'] } // 1 hour cache
)