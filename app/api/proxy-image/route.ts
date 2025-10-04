import { NextResponse } from "next/server"

export const runtime = 'edge'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const CACHE_DURATION = 60 * 60 * 24 * 365 // 1 year in seconds
const ALLOWED_DOMAINS = [
  'googleusercontent.com',
  'googleapis.com',
  'lh3.googleusercontent.com',
  'maps.googleapis.com',
  'maps.gstatic.com',
  'streetviewpixels-pa.googleapis.com',
  'photos.hotelbeds.com',
  'images.trvl-media.com',
  'www.iceportal.com',
  'dynamic-media-cdn.tripadvisor.com',
  'media-cdn.tripadvisor.com',
  'cf.bstatic.com',
  'q-xx.bstatic.com',
  'pix10.agoda.net',
  'images.unsplash.com',
  'cdn.pixabay.com',
  'cdn.worldota.net'
]

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ALLOWED_DOMAINS.some(domain => parsedUrl.hostname.endsWith(domain))
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return NextResponse.json({ error: 'No image URL provided' }, { status: 400 })
  }

  if (!isValidUrl(imageUrl)) {
    console.warn('Invalid image URL:', imageUrl)
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
  }

  try {
    const forwardedProto = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0].trim()
    const forwardedHost = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0].trim()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const referer = siteUrl || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : undefined)
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ...(referer ? { Referer: referer } : {})
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    
    // Check content type
    if (!contentType?.startsWith('image/')) {
      console.warn('Invalid content type:', contentType)
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const buffer = await response.arrayBuffer()
    
    // Check file size
    if (buffer.byteLength > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image too large' }, { status: 400 })
    }
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${CACHE_DURATION}, immutable`,
        'Content-Security-Policy': "default-src 'self'",
        'X-Content-Type-Options': 'nosniff',
        'Vary': 'Accept-Encoding',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
} 