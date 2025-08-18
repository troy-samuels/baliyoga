import { getSupabaseStudios, getSupabaseRetreats } from "@/lib/supabase-data-utils"
import { withCache, CACHE_CONFIG } from "@/lib/cache-utils"

async function generateSitemapIndex(): Promise<Response> {
  const baseUrl = "https://baliyoga.com"
  const currentDate = new Date().toISOString()
  
  // Get counts for estimation
  const [studios, retreats] = await Promise.all([
    getSupabaseStudios(),
    getSupabaseRetreats()
  ])

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/studios-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/retreats-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/locations-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/blog-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 hour
    },
  })
}

// Cached version
const cachedGenerateSitemapIndex = withCache(
  generateSitemapIndex,
  'sitemap-index',
  CACHE_CONFIG.LONG // 1 hour cache
)

export async function GET() {
  return cachedGenerateSitemapIndex()
}