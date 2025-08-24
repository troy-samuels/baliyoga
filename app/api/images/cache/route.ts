import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getCachedImageUrls } from '@/lib/supabase-storage'

// Cache multiple Google images in Supabase Storage using proper Google Places API
export async function POST(request: NextRequest) {
  try {
    const { studioName, studioId, location, maxImages = 20 } = await request.json()
    
    if (!studioName || !studioId) {
      return NextResponse.json({ error: 'Missing studioName or studioId' }, { status: 400 })
    }

    const studioHash = crypto.createHash('md5').update(`${studioName}-${location || 'bali'}`).digest('hex')
    
    // Check if images are already cached in Supabase
    const cachedImages = await getCachedImageUrls(studioId, studioHash, maxImages)
    
    // If we have cached images, return them
    if (cachedImages.length > 0) {
      return NextResponse.json({ 
        success: true, 
        cachedUrls: cachedImages,
        fromCache: true,
        totalCached: cachedImages.length
      })
    }

    // No cached images found
    return NextResponse.json({ 
      error: 'No photos found for studio',
      studioName 
    }, { status: 404 })

  } catch (error) {
    console.error('Image caching error:', error)
    return NextResponse.json({ 
      error: 'Failed to cache images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Get cached images info from Supabase Storage
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studioName = searchParams.get('studioName')
  const studioId = searchParams.get('studioId')
  const location = searchParams.get('location')
  const maxImages = parseInt(searchParams.get('maxImages') || '10')
  
  if (!studioName || !studioId) {
    return NextResponse.json({ error: 'Missing studioName or studioId' }, { status: 400 })
  }

  const studioHash = crypto.createHash('md5').update(`${studioName}-${location || 'bali'}`).digest('hex')
  
  try {
    // Check for cached images in Supabase Storage
    const cachedImages = await getCachedImageUrls(studioId, studioHash, maxImages)
    
    if (cachedImages.length > 0) {
      return NextResponse.json({ 
        cached: true, 
        cachedUrls: cachedImages,
        totalCached: cachedImages.length
      })
    } else {
      return NextResponse.json({ 
        cached: false, 
        studioName 
      })
    }
  } catch (error) {
    console.error('Error checking cached images:', error)
    return NextResponse.json({ 
      error: 'Failed to check cached images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
