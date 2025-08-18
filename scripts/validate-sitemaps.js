#!/usr/bin/env node

/**
 * Sitemap Validation and Testing Script
 * Tests all sitemap endpoints and validates XML structure
 */

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://baliyoga.com' 
  : 'http://localhost:3000'

const sitemaps = [
  '/sitemap-index.xml',
  '/sitemap.xml',
  '/studios-sitemap.xml',
  '/retreats-sitemap.xml',
  '/locations-sitemap.xml',
  '/blog-sitemap.xml',
  '/robots.txt'
]

async function validateSitemap(url) {
  try {
    console.log(`🔍 Testing: ${url}`)
    
    const response = await fetch(`${baseUrl}${url}`)
    
    if (!response.ok) {
      console.log(`❌ Error: ${response.status} ${response.statusText}`)
      return false
    }
    
    const contentType = response.headers.get('content-type')
    const content = await response.text()
    
    if (url.endsWith('.xml')) {
      // Validate XML structure
      if (!contentType?.includes('application/xml') && !contentType?.includes('text/xml')) {
        console.log(`⚠️  Warning: Content-Type is ${contentType}, expected XML`)
      }
      
      // Basic XML validation
      if (!content.includes('<?xml version="1.0"')) {
        console.log(`❌ Invalid XML: Missing XML declaration`)
        return false
      }
      
      if (url.includes('sitemap') && !content.includes('<urlset') && !content.includes('<sitemapindex')) {
        console.log(`❌ Invalid sitemap: Missing urlset or sitemapindex`)
        return false
      }
      
      // Count URLs in sitemap
      const urlMatches = content.match(/<url>/g)
      const sitemapMatches = content.match(/<sitemap>/g)
      const urlCount = urlMatches ? urlMatches.length : 0
      const sitemapCount = sitemapMatches ? sitemapMatches.length : 0
      
      if (urlCount > 0) {
        console.log(`✅ Valid XML sitemap with ${urlCount} URLs`)
      } else if (sitemapCount > 0) {
        console.log(`✅ Valid XML sitemap index with ${sitemapCount} sitemaps`)
      } else {
        console.log(`⚠️  Warning: No URLs found in sitemap`)
      }
      
      // Check for required elements
      if (content.includes('<loc>') && content.includes('<lastmod>')) {
        console.log(`✅ Contains required elements (loc, lastmod)`)
      } else {
        console.log(`⚠️  Warning: Missing required elements`)
      }
      
    } else if (url.endsWith('robots.txt')) {
      // Validate robots.txt
      if (!content.includes('Sitemap:')) {
        console.log(`⚠️  Warning: robots.txt doesn't contain Sitemap directives`)
      } else {
        const sitemapLines = content.split('\n').filter(line => line.startsWith('Sitemap:'))
        console.log(`✅ Valid robots.txt with ${sitemapLines.length} sitemap references`)
      }
    }
    
    console.log(`📊 Response size: ${content.length} bytes`)
    console.log(`⏱️  Cache-Control: ${response.headers.get('cache-control') || 'Not set'}`)
    console.log('')
    
    return true
    
  } catch (error) {
    console.log(`❌ Error fetching ${url}:`, error.message)
    return false
  }
}

async function validateAllSitemaps() {
  console.log(`🚀 Validating sitemaps for: ${baseUrl}`)
  console.log(`📅 Timestamp: ${new Date().toISOString()}`)
  console.log('━'.repeat(50))
  console.log('')
  
  let successCount = 0
  const results = []
  
  for (const sitemap of sitemaps) {
    const isValid = await validateSitemap(sitemap)
    results.push({ url: sitemap, valid: isValid })
    if (isValid) successCount++
  }
  
  console.log('━'.repeat(50))
  console.log(`📊 SUMMARY`)
  console.log('━'.repeat(50))
  console.log(`✅ Successful: ${successCount}/${sitemaps.length}`)
  console.log(`❌ Failed: ${sitemaps.length - successCount}/${sitemaps.length}`)
  
  if (successCount === sitemaps.length) {
    console.log(`🎉 All sitemaps are valid!`)
  } else {
    console.log(`⚠️  Some sitemaps failed validation`)
    results.filter(r => !r.valid).forEach(r => {
      console.log(`   ❌ ${r.url}`)
    })
  }
  
  console.log('')
  console.log(`📋 Next Steps:`)
  console.log(`   1. Submit sitemap index to Google Search Console: ${baseUrl}/sitemap-index.xml`)
  console.log(`   2. Submit to Bing Webmaster Tools: ${baseUrl}/sitemap-index.xml`)
  console.log(`   3. Monitor sitemap processing in search console`)
  console.log(`   4. Check for crawl errors and indexing status`)
  
  return successCount === sitemaps.length
}

// Test sitemap URL validation
function validateSitemapUrls() {
  console.log(`🔍 Sitemap URL Structure Validation`)
  console.log('━'.repeat(50))
  
  const patterns = {
    'Main sitemap': '/sitemap.xml',
    'Studios': '/studios-sitemap.xml',
    'Retreats': '/retreats-sitemap.xml',
    'Locations': '/locations-sitemap.xml',
    'Blog': '/blog-sitemap.xml',
    'Index': '/sitemap-index.xml',
    'Robots': '/robots.txt'
  }
  
  for (const [name, pattern] of Object.entries(patterns)) {
    console.log(`✅ ${name}: ${baseUrl}${pattern}`)
  }
  
  console.log('')
}

// Performance testing
async function testSitemapPerformance() {
  console.log(`⚡ Performance Testing`)
  console.log('━'.repeat(50))
  
  for (const sitemap of sitemaps.filter(s => s.endsWith('.xml'))) {
    const start = Date.now()
    try {
      const response = await fetch(`${baseUrl}${sitemap}`)
      const content = await response.text()
      const duration = Date.now() - start
      
      console.log(`${sitemap}: ${duration}ms (${content.length} bytes)`)
    } catch (error) {
      console.log(`${sitemap}: Error - ${error.message}`)
    }
  }
  console.log('')
}

// Main execution
async function main() {
  validateSitemapUrls()
  await testSitemapPerformance()
  const allValid = await validateAllSitemaps()
  
  process.exit(allValid ? 0 : 1)
}

if (require.main === module) {
  main()
}

module.exports = { validateAllSitemaps, validateSitemap }