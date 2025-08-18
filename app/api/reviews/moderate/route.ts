import { NextRequest, NextResponse } from 'next/server'
import { moderateReview, getReviewsForModeration } from '@/lib/review-utils'

// GET /api/reviews/moderate - Get reviews for moderation (admin only)
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd check for admin authentication here
    // For now, we'll add a simple check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reviews = await getReviewsForModeration()
    
    return NextResponse.json({
      success: true,
      reviews
    })

  } catch (error) {
    console.error('Error in GET /api/reviews/moderate:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews/moderate - Moderate a review (approve/reject)
export async function POST(request: NextRequest) {
  try {
    // In a real app, you'd check for admin authentication here
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { review_id, approved, notes } = body
    
    if (!review_id || typeof approved !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'review_id and approved status are required' },
        { status: 400 }
      )
    }

    const result = await moderateReview(review_id, approved, notes)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      })
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in POST /api/reviews/moderate:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}