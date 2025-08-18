import { NextRequest, NextResponse } from 'next/server'
import { verifyReview } from '@/lib/review-utils'

// POST /api/reviews/verify - Verify a review using token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = body.token
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      )
    }

    const result = await verifyReview(token)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        needs_moderation: true
      })
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in POST /api/reviews/verify:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/reviews/verify - Verify via URL parameter (for email links)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      )
    }

    const result = await verifyReview(token)
    
    if (result.success) {
      // Redirect to a success page
      return NextResponse.redirect(new URL('/review-verified?success=true', request.url))
    } else {
      // Redirect to an error page
      return NextResponse.redirect(new URL('/review-verified?success=false&message=' + encodeURIComponent(result.message), request.url))
    }

  } catch (error) {
    console.error('Error in GET /api/reviews/verify:', error)
    return NextResponse.redirect(new URL('/review-verified?success=false&message=Internal%20server%20error', request.url))
  }
}