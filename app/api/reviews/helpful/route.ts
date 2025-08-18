import { NextRequest, NextResponse } from 'next/server'
import { markReviewHelpful, getClientIP } from '@/lib/review-utils'

// POST /api/reviews/helpful - Mark a review as helpful
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const reviewId = body.review_id
    
    if (!reviewId) {
      return NextResponse.json(
        { success: false, message: 'review_id is required' },
        { status: 400 }
      )
    }

    const userIp = getClientIP(request)
    const userFingerprint = body.fingerprint // Optional client-side fingerprint
    
    const result = await markReviewHelpful(reviewId, userIp, userFingerprint)
    
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
    console.error('Error in POST /api/reviews/helpful:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}