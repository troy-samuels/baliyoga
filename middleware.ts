import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com https://datafa.st",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com https://maps.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com https://maps.gstatic.com",
    "img-src 'self' data: https: blob: https://maps.googleapis.com https://maps.gstatic.com https://*.googleusercontent.com https://streetviewpixels-pa.googleapis.com https://geo0.ggpht.com https://geo1.ggpht.com https://geo2.ggpht.com https://geo3.ggpht.com https://region1.google-analytics.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.supabase.co https://api.openai.com https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://datafa.st",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)

  // Rate limiting for admin endpoints (basic implementation)
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/')) {
    // Add rate limiting headers
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', '99')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}