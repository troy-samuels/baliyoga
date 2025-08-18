import { NextRequest, NextResponse } from 'next/server'
import { 
  getReviews, 
  submitReview, 
  sanitizeReviewContent, 
  sanitizeReviewTitle, 
  sanitizeUserName 
} from '@/lib/review-utils'
import { 
  ReviewSubmission, 
  validateReviewForm, 
  hasValidationErrors,
  ReviewFilters 
} from '@/lib/review-types'

// GET /api/reviews - Get reviews for an item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('item_id')
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, message: 'item_id is required' },
        { status: 400 }
      )
    }

    const filters: ReviewFilters = {
      sortBy: (searchParams.get('sort') as any) || 'most_helpful',
      rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
      minRating: searchParams.get('min_rating') ? parseInt(searchParams.get('min_rating')!) : undefined,
      maxRating: searchParams.get('max_rating') ? parseInt(searchParams.get('max_rating')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    }

    const reviewsData = await getReviews(itemId, filters)
    
    return NextResponse.json({
      success: true,
      ...reviewsData
    })

  } catch (error) {
    console.error('Error in GET /api/reviews:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const submission: ReviewSubmission = {
      item_id: body.item_id,
      item_type: body.item_type,
      user_email: body.user_email,
      user_name: body.user_name,
      rating: body.rating,
      title: body.title,
      content: body.content
    }

    // Validate the submission
    const validationErrors = validateReviewForm({
      user_name: submission.user_name,
      user_email: submission.user_email,
      rating: submission.rating,
      title: submission.title,
      content: submission.content
    })

    if (hasValidationErrors(validationErrors)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validationErrors
        },
        { status: 400 }
      )
    }

    // Sanitize inputs
    submission.user_name = sanitizeUserName(submission.user_name)
    submission.title = sanitizeReviewTitle(submission.title)
    submission.content = sanitizeReviewContent(submission.content)
    submission.user_email = submission.user_email.toLowerCase().trim()

    // Validate item_type
    if (!['studio', 'retreat'].includes(submission.item_type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item type' },
        { status: 400 }
      )
    }

    const result = await submitReview(submission)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        review_id: result.review_id,
        verification_required: true
      })
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in POST /api/reviews:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}