import { NextRequest, NextResponse } from 'next/server'
import { getCachedImageUrls } from '@/lib/supabase-storage'
import { normalizeStudioName, normalizeLocation } from '@/lib/image-utils'

// Cache multiple Google images in Supabase Storage using proper Google Places API
export async function POST(request: NextRequest) {
  try {
    const { studioName, studioId, location, type = 'studio', maxImages = 20 } = await request.json()
    
    if (!studioName || !studioId) {
      return NextResponse.json({ error: 'Missing studioName or studioId' }, { status: 400 })
    }

    console.log(`Fetching cached images for ${type}: ${normalizeStudioName(studioName)} (ID: ${studioId})`)
    
    // Check if images are already cached in Supabase using new structure
    const cachedImages = await getCachedImageUrls(
      studioId, 
      studioName, 
      location || undefined, 
      type as 'studio' | 'retreat', 
      maxImages
    )
    
    // If we have cached images, return them
    if (cachedImages.length > 0) {
      return NextResponse.json({ 
        success: true, 
        cachedUrls: cachedImages,
        fromCache: true,
        totalCached: cachedImages.length,
        studioId,
        normalizedName: normalizeStudioName(studioName)
      })
    }

    // No cached images found
    console.log(`No cached images found for ${type} ${studioName} (${studioId})`)
    return NextResponse.json({ 
      error: 'No photos found for studio',
      studioName,
      studioId,
      normalizedName: normalizeStudioName(studioName),
      type
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
  const type = (searchParams.get('type') || 'studio') as 'studio' | 'retreat'
  const maxImages = parseInt(searchParams.get('maxImages') || '10')
  
  if (!studioName || !studioId) {
    return NextResponse.json({ error: 'Missing studioName or studioId' }, { status: 400 })
  }

  console.log(`GET request for cached images: ${normalizeStudioName(studioName)} (ID: ${studioId})`)
  
  try {
    // Check for cached images in Supabase Storage using new structure
    const cachedImages = await getCachedImageUrls(studioId, studioName, location || undefined, type, maxImages)
    
    if (cachedImages.length > 0) {
      return NextResponse.json({ 
        cached: true, 
        cachedUrls: cachedImages,
        totalCached: cachedImages.length,
        studioId,
        normalizedName: normalizeStudioName(studioName),
        type
      })
    } else {
      return NextResponse.json({ 
        cached: false, 
        studioName,
        studioId,
        normalizedName: normalizeStudioName(studioName),
        type
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
