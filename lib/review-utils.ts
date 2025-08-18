import { createServerClient } from './supabase'
import { 
  PublicReview, 
  ReviewStats, 
  ReviewSubmission, 
  ReviewFilters,
  ReviewsResponse,
  Review
} from './review-types'
import { randomBytes } from 'crypto'

// Generate a verification token
export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex')
}

// Get reviews for an item
export async function getReviews(
  itemId: string, 
  filters: ReviewFilters = { sortBy: 'most_helpful' }
): Promise<ReviewsResponse> {
  const supabase = createServerClient()
  
  let query = supabase
    .from('public_reviews')
    .select('*')
    .eq('item_id', itemId)

  // Apply rating filters
  if (filters.rating) {
    query = query.eq('rating', filters.rating)
  }
  if (filters.minRating) {
    query = query.gte('rating', filters.minRating)
  }
  if (filters.maxRating) {
    query = query.lte('rating', filters.maxRating)
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'highest_rated':
      query = query.order('rating', { ascending: false })
      break
    case 'lowest_rated':
      query = query.order('rating', { ascending: true })
      break
    case 'most_helpful':
    default:
      query = query.order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false })
      break
  }

  // Apply pagination
  const limit = filters.limit || 10
  const offset = filters.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data: reviews, error } = await query

  if (error) {
    console.error('Error fetching reviews:', error)
    throw new Error('Failed to fetch reviews')
  }

  // Get review stats
  const stats = await getReviewStats(itemId)

  // Get total count for pagination
  const { count: totalCount } = await supabase
    .from('public_reviews')
    .select('*', { count: 'exact' })
    .eq('item_id', itemId)

  return {
    reviews: reviews || [],
    stats,
    pagination: {
      total: totalCount || 0,
      limit,
      offset,
      hasMore: (totalCount || 0) > offset + limit
    }
  }
}

// Get review statistics for an item
export async function getReviewStats(itemId: string): Promise<ReviewStats> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .rpc('get_review_stats', { p_item_id: itemId })

  if (error) {
    console.error('Error fetching review stats:', error)
    return {
      average_rating: 0,
      total_reviews: 0,
      rating_distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    }
  }

  const stats = data?.[0]
  return {
    average_rating: stats?.average_rating || 0,
    total_reviews: stats?.total_reviews || 0,
    rating_distribution: stats?.rating_distribution || { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
  }
}

// Submit a new review
export async function submitReview(submission: ReviewSubmission): Promise<{ success: boolean; message: string; review_id?: string }> {
  const supabase = createServerClient()

  const verificationToken = generateVerificationToken()

  const reviewData = {
    item_id: submission.item_id,
    item_type: submission.item_type,
    user_email: submission.user_email.toLowerCase().trim(),
    user_name: submission.user_name.trim(),
    rating: submission.rating,
    title: submission.title.trim(),
    content: submission.content.trim(),
    verification_token: verificationToken,
    is_verified: false,
    is_approved: false
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return {
        success: false,
        message: 'You have already submitted a review for this item.'
      }
    }
    console.error('Error submitting review:', error)
    return {
      success: false,
      message: 'Failed to submit review. Please try again.'
    }
  }

  // Send verification email (you'll need to implement this)
  try {
    await sendVerificationEmail(submission.user_email, submission.user_name, verificationToken)
  } catch (emailError) {
    console.error('Error sending verification email:', emailError)
    // Don't fail the review submission if email fails
  }

  return {
    success: true,
    message: 'Review submitted successfully. Please check your email for verification.',
    review_id: data.id
  }
}

// Verify a review using token
export async function verifyReview(token: string): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .rpc('verify_review', { p_token: token })

  if (error) {
    console.error('Error verifying review:', error)
    return {
      success: false,
      message: 'Failed to verify review. Please try again.'
    }
  }

  if (!data) {
    return {
      success: false,
      message: 'Invalid or expired verification token.'
    }
  }

  return {
    success: true,
    message: 'Review verified successfully. It will be published after moderation.'
  }
}

// Mark a review as helpful
export async function markReviewHelpful(reviewId: string, userIp: string, userFingerprint?: string): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('review_helpfulness')
    .insert({
      review_id: reviewId,
      user_ip: userIp,
      user_fingerprint: userFingerprint
    })

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return {
        success: false,
        message: 'You have already marked this review as helpful.'
      }
    }
    console.error('Error marking review helpful:', error)
    return {
      success: false,
      message: 'Failed to mark review as helpful. Please try again.'
    }
  }

  return {
    success: true,
    message: 'Thank you for your feedback!'
  }
}

// Get reviews for moderation
export async function getReviewsForModeration(): Promise<Review[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('reviews_moderation')
    .select('*')

  if (error) {
    console.error('Error fetching reviews for moderation:', error)
    throw new Error('Failed to fetch reviews for moderation')
  }

  return data || []
}

// Moderate a review (approve/reject)
export async function moderateReview(
  reviewId: string, 
  approved: boolean, 
  notes?: string
): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .rpc('moderate_review', { 
      p_review_id: reviewId, 
      p_approved: approved, 
      p_notes: notes 
    })

  if (error) {
    console.error('Error moderating review:', error)
    return {
      success: false,
      message: 'Failed to moderate review. Please try again.'
    }
  }

  if (!data) {
    return {
      success: false,
      message: 'Review not found or not eligible for moderation.'
    }
  }

  return {
    success: true,
    message: `Review ${approved ? 'approved' : 'rejected'} successfully.`
  }
}

// Send verification email (placeholder - implement with your email service)
async function sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
  // This is a placeholder. You'll need to implement this with your email service
  // For example, using SendGrid, Resend, or AWS SES
  
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-review?token=${token}`
  
  console.log(`Verification email would be sent to ${email}:`)
  console.log(`Hello ${name}, please verify your review: ${verificationUrl}`)
  
  // Example implementation with fetch (replace with your email service):
  /*
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      subject: 'Verify Your Bali Yoga Review',
      html: `
        <h2>Verify Your Review</h2>
        <p>Hello ${name},</p>
        <p>Thank you for submitting a review. Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Review</a>
        <p>If you didn't submit this review, please ignore this email.</p>
      `
    })
  })
  */
}

// Get user's client IP (for helpful votes)
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (real) {
    return real
  }
  
  return '127.0.0.1' // fallback
}

// Sanitize review content
export function sanitizeReviewContent(content: string): string {
  return content
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 2000) // Ensure max length
}

// Sanitize review title
export function sanitizeReviewTitle(title: string): string {
  return title
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100) // Ensure max length
}

// Sanitize user name
export function sanitizeUserName(name: string): string {
  return name
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 50) // Ensure max length
}