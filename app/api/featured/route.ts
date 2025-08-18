import { NextRequest, NextResponse } from 'next/server'
import { 
  getCurrentWeeklyFeatured,
  isCurrentlyFeatured,
  getFeaturedListings,
  autoPopulateFeaturedPool
} from '@/lib/featured-utils'

// GET /api/featured - Get current week's featured items or featured listings for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'current' or 'admin'
    const itemId = searchParams.get('item_id')
    const itemType = searchParams.get('item_type') as 'studio' | 'retreat'

    // Check if specific item is featured
    if (itemId && itemType) {
      const isFeatured = await isCurrentlyFeatured(itemId, itemType)
      return NextResponse.json({
        success: true,
        is_featured: isFeatured
      })
    }

    // Get admin listings
    if (type === 'admin') {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.includes('admin')) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      }

      const listings = await getFeaturedListings()
      return NextResponse.json({
        success: true,
        listings
      })
    }

    // Get current week's featured items (default)
    const featured = await getCurrentWeeklyFeatured()
    return NextResponse.json({
      success: true,
      ...featured
    })

  } catch (error) {
    console.error('Error in GET /api/featured:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/featured - Admin actions for featured listings
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'auto_populate':
        const result = await autoPopulateFeaturedPool()
        return NextResponse.json(result)

      case 'generate_rotation':
        const { generateWeeklyFeaturedRotation } = await import('@/lib/featured-utils')
        const rotationResult = await generateWeeklyFeaturedRotation(
          body.week_start,
          body.studios_count || 3,
          body.retreats_count || 3
        )
        return NextResponse.json(rotationResult)

      case 'add_to_pool':
        const { addToFeaturedPool } = await import('@/lib/featured-utils')
        const addResult = await addToFeaturedPool(
          body.item_id,
          body.item_type,
          body.item_data,
          body.priority || 0
        )
        return NextResponse.json(addResult)

      case 'update_priority':
        const { updateFeaturedListingPriority } = await import('@/lib/featured-utils')
        const priorityResult = await updateFeaturedListingPriority(
          body.id,
          body.priority
        )
        return NextResponse.json(priorityResult)

      case 'toggle_eligibility':
        const { toggleFeaturedListingEligibility } = await import('@/lib/featured-utils')
        const eligibilityResult = await toggleFeaturedListingEligibility(
          body.id,
          body.is_eligible
        )
        return NextResponse.json(eligibilityResult)

      case 'remove_from_pool':
        const { removeFromFeaturedPool } = await import('@/lib/featured-utils')
        const removeResult = await removeFromFeaturedPool(body.id)
        return NextResponse.json(removeResult)

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in POST /api/featured:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}