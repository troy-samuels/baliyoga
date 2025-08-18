import { withCache, CACHE_CONFIG } from "@/lib/cache-utils"

async function generateBlogSitemap(): Promise<Response> {
  const baseUrl = "https://baliyoga.com"
  const currentDate = new Date().toISOString()
  
  // Static blog pages - could be enhanced with dynamic blog posts from database
  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/blog/submit`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    }
  ]

  // TODO: Add dynamic blog posts from database when blog system is implemented
  // const blogPosts = await getBlogPosts()
  // const dynamicBlogPages = blogPosts.map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastmod: post.updatedAt,
  //   changefreq: 'monthly',
  //   priority: '0.6'
  // }))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
const cachedGenerateBlogSitemap = withCache(
  generateBlogSitemap,
  'blog-sitemap',
  CACHE_CONFIG.LONG
)

export async function GET() {
  return cachedGenerateBlogSitemap()
}