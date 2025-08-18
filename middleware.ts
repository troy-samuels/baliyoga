import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Helper function to generate location slug
  const generateLocationSlug = (location: string) => {
    return location
      .toLowerCase()
      .replace(/\s+(regency|city|district)$/i, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }
  
  // Handle retreat URL redirects
  // Old structure: /retreats?location=Location&type=Type
  // New structure: /retreats/location/type
  if (url.pathname === '/retreats' && url.searchParams.has('location') && url.searchParams.has('type')) {
    const location = url.searchParams.get('location')
    const type = url.searchParams.get('type')
    
    if (location && type) {
      const locationSlug = generateLocationSlug(location)
      
      // Map type to retreat type slug
      const retreatTypeMap: Record<string, string> = {
        'wellness': 'wellness-retreat',
        'yoga': 'yoga-retreat',
        'spiritual': 'spiritual-retreat',
        'adventure': 'adventure-retreat',
        'luxury': 'luxury-retreat',
        'teacher-training': 'teacher-training',
        'retreat': 'yoga-retreat' // Default fallback
      }
      
      const typeSlug = retreatTypeMap[type.toLowerCase()] || 'yoga-retreat'
      
      // Redirect to new URL structure
      url.pathname = `/retreats/${locationSlug}/${typeSlug}`
      url.search = '' // Remove query parameters
      
      return NextResponse.redirect(url, 301) // Permanent redirect
    }
  }
  
  // Handle location-only retreat redirects
  // Old structure: /retreats?location=Location
  // New structure: /retreats/location  
  if (url.pathname === '/retreats' && url.searchParams.has('location') && !url.searchParams.has('type')) {
    const location = url.searchParams.get('location')
    
    if (location && location !== 'all') {
      const locationSlug = generateLocationSlug(location)
      
      url.pathname = `/retreats/${locationSlug}`
      url.search = '' // Remove query parameters
      
      return NextResponse.redirect(url, 301) // Permanent redirect
    }
  }
  
  // Handle studio URL redirects
  // Old structure: /studios?location=Location&type=Type
  // New structure: /studios/location/type
  if (url.pathname === '/studios' && url.searchParams.has('location') && url.searchParams.has('type')) {
    const location = url.searchParams.get('location')
    const type = url.searchParams.get('type')
    
    if (location && type) {
      const locationSlug = generateLocationSlug(location)
      
      // Map type to studio type slug
      const studioTypeMap: Record<string, string> = {
        'traditional': 'traditional-yoga-studio',
        'vinyasa': 'vinyasa-flow-studio',
        'hot': 'hot-yoga-studio',
        'power': 'power-yoga-studio',
        'ashtanga': 'ashtanga-yoga-studio',
        'wellness': 'wellness-yoga-studio',
        'boutique': 'boutique-yoga-studio',
        'community': 'community-yoga-studio',
        'yoga': 'traditional-yoga-studio', // Default fallback
        'studio': 'traditional-yoga-studio' // Default fallback
      }
      
      const typeSlug = studioTypeMap[type.toLowerCase()] || 'traditional-yoga-studio'
      
      // Redirect to new URL structure
      url.pathname = `/studios/${locationSlug}/${typeSlug}`
      url.search = '' // Remove query parameters
      
      return NextResponse.redirect(url, 301) // Permanent redirect
    }
  }
  
  // Handle location-only studio redirects
  // Old structure: /studios?location=Location
  // New structure: /studios/location  
  if (url.pathname === '/studios' && url.searchParams.has('location') && !url.searchParams.has('type')) {
    const location = url.searchParams.get('location')
    
    if (location && location !== 'all') {
      const locationSlug = generateLocationSlug(location)
      
      url.pathname = `/studios/${locationSlug}`
      url.search = '' // Remove query parameters
      
      return NextResponse.redirect(url, 301) // Permanent redirect
    }
  }
  
  // Continue with the request if no redirect is needed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}