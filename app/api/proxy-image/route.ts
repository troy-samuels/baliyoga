import { NextResponse } from "next/server"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
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
  'cdn.pixabay.com'
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
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
        'Cache-Control': 'public, max-age=31536000',
        'Content-Security-Policy': "default-src 'self'",
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
} 