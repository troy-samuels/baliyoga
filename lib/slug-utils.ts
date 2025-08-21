/**
 * Comprehensive slug generation and routing utilities for Bali Yoga
 * Ensures consistent URL patterns across the application
 */

// Internal base slug generation
function createBaseSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100) // Limit length
}

// Base slug generation - clean and SEO-friendly
export function generateSlug(text: string, location?: string, type?: 'studio' | 'retreat'): string {
  // If all parameters provided, use specific generators
  if (type && location) {
    return type === 'studio' 
      ? createStudioSlug(text, location)
      : createRetreatSlug(text, location)
  }
  
  // Otherwise, generate basic slug
  return createBaseSlug(text)
}

// Studio slug generation with location context
export function createStudioSlug(name: string, city?: string): string {
  const baseName = createBaseSlug(name)
  const location = city ? createBaseSlug(city) : 'bali'
  return `${baseName}-${location}-yoga-studio`
}

// Retreat slug generation with location context  
export function createRetreatSlug(name: string, city?: string): string {
  const baseName = createBaseSlug(name)
  const location = city ? createBaseSlug(city) : 'bali'
  return `${baseName}-${location}-yoga-retreat`
}

// Blog post slug generation
export function createBlogSlug(title: string): string {
  return createBaseSlug(title)
}

// Location slug generation
export function createLocationSlug(location: string): string {
  return createBaseSlug(location)
}

// Route path generators - ensure consistent URL structure
export const ROUTE_PATTERNS = {
  // Individual item routes
  studio: (slug: string) => `/studios/detail?slug=${slug}`,
  retreat: (slug: string) => `/retreats/detail?slug=${slug}`,
  blog: (slug: string) => `/blog/${slug}`,
  
  // Category routes
  studios: () => '/studios',
  retreats: () => '/retreats',
  
  // Location-based routes
  studiosByLocation: (location: string) => `/studios/${createLocationSlug(location)}`,
  retreatsByLocation: (location: string) => `/retreats/${createLocationSlug(location)}`,
  locationPage: (location: string) => `/locations/${createLocationSlug(location)}`,
  
  // Type-based routes (for future expansion)
  studiosByType: (location: string, type: string) => 
    `/studios/${createLocationSlug(location)}/${generateSlug(type)}`,
  retreatsByType: (location: string, type: string) => 
    `/retreats/${createLocationSlug(location)}/${generateSlug(type)}`,
}

// Canonical URL generators
export function getCanonicalUrl(type: 'studio' | 'retreat' | 'blog', slug: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://baliyoga.com'
  
  switch (type) {
    case 'studio':
      return `${base}${ROUTE_PATTERNS.studio(slug)}`
    case 'retreat':
      return `${base}${ROUTE_PATTERNS.retreat(slug)}`
    case 'blog':
      return `${base}${ROUTE_PATTERNS.blog(slug)}`
    default:
      return base
  }
}

// Slug validation
export function isValidSlug(slug: string): boolean {
  // Check if slug matches our generation pattern
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug) && slug.length <= 100 && slug.length >= 1
}

// Parse slug components for studios/retreats
export function parseSlug(slug: string): {
  name: string
  location?: string
  type?: string
} {
  // Split slug and identify components
  const parts = slug.split('-')
  
  // Look for common endings to identify type and location
  if (slug.includes('-yoga-studio')) {
    const withoutSuffix = slug.replace('-yoga-studio', '')
    const partsWithoutSuffix = withoutSuffix.split('-')
    
    return {
      name: partsWithoutSuffix.slice(0, -1).join('-'),
      location: partsWithoutSuffix[partsWithoutSuffix.length - 1],
      type: 'studio'
    }
  }
  
  if (slug.includes('-yoga-retreat')) {
    const withoutSuffix = slug.replace('-yoga-retreat', '')
    const partsWithoutSuffix = withoutSuffix.split('-')
    
    return {
      name: partsWithoutSuffix.slice(0, -1).join('-'),
      location: partsWithoutSuffix[partsWithoutSuffix.length - 1],
      type: 'retreat'
    }
  }
  
  // Fallback for other patterns
  return {
    name: slug,
    location: undefined,
    type: undefined
  }
}

// Generate sitemap entries
export function generateSitemapEntry(
  url: string,
  lastModified?: Date,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.5
) {
  return {
    url,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority: Math.min(Math.max(priority, 0), 1) // Clamp between 0 and 1
  }
}

// Common location mappings for consistent naming
export const LOCATION_MAPPINGS = {
  'ubud': 'Ubud',
  'canggu': 'Canggu', 
  'seminyak': 'Seminyak',
  'sanur': 'Sanur',
  'denpasar': 'Denpasar',
  'jimbaran': 'Jimbaran',
  'kuta': 'Kuta',
  'legian': 'Legian',
  'nusa-dua': 'Nusa Dua',
  'uluwatu': 'Uluwatu',
  'tabanan': 'Tabanan',
  'candidasa': 'Candidasa',
  'amed': 'Amed',
  'lovina': 'Lovina',
  'pemuteran': 'Pemuteran',
  'munduk': 'Munduk',
  'sidemen': 'Sidemen'
} as const

export type LocationSlug = keyof typeof LOCATION_MAPPINGS
export type LocationName = typeof LOCATION_MAPPINGS[LocationSlug]

// Convert between location formats
export function getLocationDisplayName(slug: string): string {
  return LOCATION_MAPPINGS[slug as LocationSlug] || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getLocationSlug(displayName: string): string {
  // Find by value first
  const entry = Object.entries(LOCATION_MAPPINGS).find(
    ([_, name]) => name.toLowerCase() === displayName.toLowerCase()
  )
  
  if (entry) {
    return entry[0]
  }
  
  // Fallback to slug generation
  return createBaseSlug(displayName)
}

// Breadcrumb generation for consistent navigation
export function generateBreadcrumbs(
  type: 'studio' | 'retreat' | 'blog',
  item?: { name: string; slug: string; location?: string }
) {
  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ]
  
  switch (type) {
    case 'studio':
      breadcrumbs.push({ label: 'Studios', href: ROUTE_PATTERNS.studios() })
      if (item?.location) {
        breadcrumbs.push({ 
          label: `${getLocationDisplayName(item.location)} Studios`, 
          href: ROUTE_PATTERNS.studiosByLocation(item.location) 
        })
      }
      if (item) {
        breadcrumbs.push({ 
          label: item.name, 
          href: ROUTE_PATTERNS.studio(item.slug) 
        })
      }
      break
      
    case 'retreat':
      breadcrumbs.push({ label: 'Retreats', href: ROUTE_PATTERNS.retreats() })
      if (item?.location) {
        breadcrumbs.push({ 
          label: `${getLocationDisplayName(item.location)} Retreats`, 
          href: ROUTE_PATTERNS.retreatsByLocation(item.location) 
        })
      }
      if (item) {
        breadcrumbs.push({ 
          label: item.name, 
          href: ROUTE_PATTERNS.retreat(item.slug) 
        })
      }
      break
      
    case 'blog':
      breadcrumbs.push({ label: 'Blog', href: '/blog' })
      if (item) {
        breadcrumbs.push({ 
          label: item.name, 
          href: ROUTE_PATTERNS.blog(item.slug) 
        })
      }
      break
  }
  
  return breadcrumbs
}

// URL parameter parsing utilities
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    query: searchParams.get('q') || undefined,
    location: searchParams.get('location') || undefined,
    type: searchParams.get('type') || undefined,
    rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
    reviews: searchParams.get('reviews') ? parseInt(searchParams.get('reviews')!) : undefined,
    images: searchParams.get('images') === 'true',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12
  }
}

// Generate filter URLs
export function buildFilterUrl(
  basePath: string, 
  filters: Record<string, string | number | boolean | undefined>
): string {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })
  
  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}