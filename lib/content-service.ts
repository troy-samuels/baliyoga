import fs from 'fs'
import path from 'path'
import { RetreatGuide, BlogPost } from './types'

/**
 * Content Management Service for Retreat Guides and Blog Posts
 * Enhanced system for SEO-optimized content creation and management
 */

interface ContentMetadata {
  title: string
  slug: string
  excerpt: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  categories: string[]
  tags: string[]
  author: string
  publishDate: string
  readTime: string
  status: 'draft' | 'published' | 'archived'
  featured?: boolean
  priority?: number
}

interface RetreatGuideData extends ContentMetadata {
  content: string
  featuredImage: string
  locationFocus: string[]
  retreatTypes: string[]
  targetAudience: string[]
  seoKeywords: string[]
  affiliateLinks?: AffiliateLink[]
  bookingOptions?: string[]
  priceRange?: string
  seasonalInfo?: {
    bestMonths: string[]
    peakSeason: string[]
    lowSeason: string[]
  }
}

interface AffiliateLink {
  partner: string
  url: string
  description: string
  commission?: number
}

export class ContentService {
  private readonly contentDir: string
  private readonly blogDataPath: string
  private readonly guidesDataPath: string

  constructor() {
    this.contentDir = path.join(process.cwd(), 'data')
    this.blogDataPath = path.join(this.contentDir, 'blog-posts.json')
    this.guidesDataPath = path.join(this.contentDir, 'retreat-guides.json')

    // Ensure data directory exists
    if (!fs.existsSync(this.contentDir)) {
      fs.mkdirSync(this.contentDir, { recursive: true })
    }
  }

  /**
   * Load all blog posts
   */
  getBlogPosts(): BlogPost[] {
    try {
      if (fs.existsSync(this.blogDataPath)) {
        const data = fs.readFileSync(this.blogDataPath, 'utf8')
        return JSON.parse(data).filter((post: BlogPost) => post.status === 'published')
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
    }
    return []
  }

  /**
   * Load all retreat guides
   */
  getRetreatGuides(): RetreatGuide[] {
    try {
      if (fs.existsSync(this.guidesDataPath)) {
        const data = fs.readFileSync(this.guidesDataPath, 'utf8')
        return JSON.parse(data).filter((guide: RetreatGuide) => guide.status === 'published')
      }
    } catch (error) {
      console.error('Error loading retreat guides:', error)
    }
    return []
  }

  /**
   * Get a specific blog post by slug
   */
  getBlogPost(slug: string): BlogPost | null {
    const posts = this.getBlogPosts()
    return posts.find(post => post.slug === slug) || null
  }

  /**
   * Get a specific retreat guide by slug
   */
  getRetreatGuide(slug: string): RetreatGuide | null {
    const guides = this.getRetreatGuides()
    return guides.find(guide => guide.slug === slug) || null
  }

  /**
   * Get blog posts by category
   */
  getBlogPostsByCategory(category: string): BlogPost[] {
    const posts = this.getBlogPosts()
    return posts.filter(post => post.categories?.includes(category))
  }

  /**
   * Get retreat guides by location
   */
  getRetreatGuidesByLocation(location: string): RetreatGuide[] {
    const guides = this.getRetreatGuides()
    return guides.filter(guide => guide.location_focus?.includes(location))
  }

  /**
   * Get featured content
   */
  getFeaturedBlogPosts(): BlogPost[] {
    const posts = this.getBlogPosts()
    return posts.filter(post => post.featured).slice(0, 3)
  }

  /**
   * Get featured retreat guides
   */
  getFeaturedRetreatGuides(): RetreatGuide[] {
    const guides = this.getRetreatGuides()
    return guides.filter(guide => guide.featured).slice(0, 3)
  }

  /**
   * Get related content based on tags and categories
   */
  getRelatedContent(tags: string[], categories: string[], currentSlug: string, limit: number = 3): (BlogPost | RetreatGuide)[] {
    const allContent: (BlogPost | RetreatGuide)[] = [
      ...this.getBlogPosts(),
      ...this.getRetreatGuides()
    ]

    // Filter out current item and calculate relevance score
    const related = allContent
      .filter(item => item.slug !== currentSlug)
      .map(item => {
        let score = 0

        // Score based on matching tags
        const itemTags = item.tags || []
        const matchingTags = tags.filter(tag => itemTags.includes(tag))
        score += matchingTags.length * 2

        // Score based on matching categories
        const itemCategories = item.categories || []
        const matchingCategories = categories.filter(cat => itemCategories.includes(cat))
        score += matchingCategories.length * 3

        return { item, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item }) => item)

    return related
  }

  /**
   * Generate SEO metadata for content
   */
  generateSEOMetadata(content: BlogPost | RetreatGuide) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baliyoga.com'
    const isGuide = 'location_focus' in content

    return {
      title: content.metaTitle || content.title,
      description: content.metaDescription || content.excerpt,
      keywords: content.keywords?.join(', ') || '',
      openGraph: {
        title: content.title,
        description: content.excerpt,
        type: 'article',
        publishedTime: content.publishDate,
        modifiedTime: content.updatedAt,
        authors: [content.author],
        tags: content.tags,
        images: [{
          url: content.featuredImage || '/images/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: content.title
        }],
        siteName: 'Bali Yoga'
      },
      twitter: {
        card: 'summary_large_image',
        title: content.title,
        description: content.excerpt,
        images: [content.featuredImage || '/images/default-twitter-image.jpg']
      },
      alternates: {
        canonical: `${baseUrl}/${isGuide ? 'guides' : 'blog'}/${content.slug}`
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      }
    }
  }

  /**
   * Generate structured data for content
   */
  generateStructuredData(content: BlogPost | RetreatGuide) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baliyoga.com'
    const isGuide = 'location_focus' in content

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.title,
      description: content.excerpt,
      image: content.featuredImage || '/images/default-article-image.jpg',
      datePublished: content.publishDate,
      dateModified: content.updatedAt || content.publishDate,
      author: {
        '@type': 'Person',
        name: content.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'Bali Yoga',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/${isGuide ? 'guides' : 'blog'}/${content.slug}`
      },
      keywords: content.tags?.join(', ') || '',
      articleSection: content.categories?.[0] || 'General',
      wordCount: this.calculateWordCount(content.content)
    }

    // Add location-specific schema for retreat guides
    if (isGuide && 'location_focus' in content) {
      structuredData['@type'] = 'TravelGuide'
      structuredData['about'] = {
        '@type': 'Place',
        name: content.location_focus?.[0] || 'Bali',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'Indonesia',
          addressRegion: 'Bali'
        }
      }
    }

    return structuredData
  }

  /**
   * Calculate word count for content
   */
  private calculateWordCount(content: string): number {
    // Remove HTML tags and count words
    const text = content.replace(/<[^>]*>/g, ' ')
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    return words.length
  }

  /**
   * Generate reading time estimation
   */
  generateReadingTime(content: string): string {
    const wordsPerMinute = 200 // Average reading speed
    const wordCount = this.calculateWordCount(content)
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  /**
   * Create new retreat guide template
   */
  createRetreatGuideTemplate(location: string, type: string = 'general'): RetreatGuideData {
    const slug = `${type}-yoga-retreats-${location.toLowerCase().replace(/\s+/g, '-')}`

    return {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Yoga Retreats in ${location}: Complete Guide`,
      slug,
      excerpt: `Discover the best ${type} yoga retreats in ${location}. Complete guide with prices, reviews, and booking options for transformative wellness experiences.`,
      metaTitle: `Best ${type} Yoga Retreats in ${location} 2025 | Bali Yoga`,
      metaDescription: `Find authentic ${type} yoga retreats in ${location}. Compare prices, read reviews, and book directly. Expert guide to ${location}'s top wellness destinations.`,
      keywords: [
        `${type} yoga retreat ${location}`,
        `yoga retreat ${location}`,
        `${location} wellness retreat`,
        `yoga ${location}`,
        `retreat ${location} bali`
      ],
      categories: ['Yoga Retreats', 'Travel Guides', location],
      tags: ['yoga retreat', location.toLowerCase(), type, 'wellness', 'bali'],
      author: 'Bali Yoga Expert',
      publishDate: new Date().toISOString().split('T')[0],
      readTime: '8 min read',
      status: 'draft' as const,
      featured: false,
      content: this.generateRetreatGuideContent(location, type),
      featuredImage: `/images/guides/${slug}.jpg`,
      locationFocus: [location],
      retreatTypes: [type],
      targetAudience: ['beginners', 'intermediate', 'advanced'],
      seoKeywords: [
        `best yoga retreats ${location}`,
        `${location} yoga retreat guide`,
        `affordable yoga retreats ${location}`,
        `luxury yoga retreats ${location}`
      ],
      priceRange: '$500 - $3,000',
      seasonalInfo: {
        bestMonths: ['April', 'May', 'September', 'October'],
        peakSeason: ['July', 'August', 'December', 'January'],
        lowSeason: ['February', 'March', 'November']
      }
    }
  }

  /**
   * Generate retreat guide content template
   */
  private generateRetreatGuideContent(location: string, type: string): string {
    return `
<p>${location} offers some of the world's most transformative ${type} yoga retreat experiences. This comprehensive guide will help you find the perfect retreat for your wellness journey on the Island of the Gods.</p>

<h2>Why Choose ${location} for Your Yoga Retreat?</h2>
<p>[Location-specific benefits and unique features]</p>

<h2>Top ${type} Yoga Retreats in ${location}</h2>
<p>[Curated list of the best retreats with descriptions]</p>

<h3>Luxury Retreats</h3>
<p>[High-end options with premium amenities]</p>

<h3>Budget-Friendly Options</h3>
<p>[Affordable retreats without compromising quality]</p>

<h3>Specialty Programs</h3>
<p>[Unique offerings like teacher training, detox, etc.]</p>

<h2>What to Expect</h2>
<p>[Daily schedule, activities, meals, accommodations]</p>

<h2>Best Time to Visit</h2>
<p>[Seasonal considerations, weather, pricing]</p>

<h2>Planning Your Retreat</h2>
<p>[Practical tips for booking, packing, preparation]</p>

<h3>Essential Packing List</h3>
<ul>
<li>Yoga mat (or check if provided)</li>
<li>Comfortable yoga clothing</li>
<li>Reef-safe sunscreen</li>
<li>Insect repellent</li>
<li>Light rain jacket</li>
</ul>

<h2>Booking Your Perfect Retreat</h2>
<p>[Booking tips, what to look for, questions to ask]</p>

<h2>Conclusion</h2>
<p>${location} offers an incredible array of ${type} yoga retreats for every budget and preference. Whether you're seeking luxury accommodations or budget-friendly options, spiritual growth or physical challenge, you'll find your perfect match in this magical destination.</p>
    `.trim()
  }

  /**
   * Save content to JSON files
   */
  saveBlogPost(post: BlogPost): void {
    const posts = this.getBlogPosts()
    const existingIndex = posts.findIndex(p => p.id === post.id)

    if (existingIndex >= 0) {
      posts[existingIndex] = post
    } else {
      posts.push(post)
    }

    fs.writeFileSync(this.blogDataPath, JSON.stringify(posts, null, 2))
  }

  /**
   * Save retreat guide
   */
  saveRetreatGuide(guide: RetreatGuide): void {
    let guides: RetreatGuide[] = []

    try {
      if (fs.existsSync(this.guidesDataPath)) {
        const data = fs.readFileSync(this.guidesDataPath, 'utf8')
        guides = JSON.parse(data)
      }
    } catch (error) {
      console.error('Error loading existing guides:', error)
    }

    const existingIndex = guides.findIndex(g => g.id === guide.id)

    if (existingIndex >= 0) {
      guides[existingIndex] = guide
    } else {
      guides.push(guide)
    }

    fs.writeFileSync(this.guidesDataPath, JSON.stringify(guides, null, 2))
  }
}

// Singleton instance for app-wide use
export const contentService = new ContentService()

// Helper function to get content by type and category
export function getContentByType(
  type: 'blog' | 'guide',
  category?: string,
  limit?: number
): (BlogPost | RetreatGuide)[] {
  const service = new ContentService()

  if (type === 'blog') {
    const posts = category
      ? service.getBlogPostsByCategory(category)
      : service.getBlogPosts()
    return limit ? posts.slice(0, limit) : posts
  } else {
    const guides = category
      ? service.getRetreatGuidesByLocation(category)
      : service.getRetreatGuides()
    return limit ? guides.slice(0, limit) : guides
  }
}