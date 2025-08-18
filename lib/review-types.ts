// Review system types and interfaces

export interface Review {
  id: string
  item_id: string
  item_type: 'studio' | 'retreat'
  user_email: string
  user_name: string
  rating: number // 1-5 stars
  title: string
  content: string
  helpful_count: number
  is_verified: boolean
  is_approved: boolean
  verification_token?: string
  moderation_notes?: string
  created_at: string
  updated_at: string
  verified_at?: string
  approved_at?: string
}

export interface PublicReview {
  id: string
  item_id: string
  item_type: 'studio' | 'retreat'
  user_name: string
  rating: number
  title: string
  content: string
  helpful_count: number
  created_at: string
  verified_at: string
}

export interface ReviewSubmission {
  item_id: string
  item_type: 'studio' | 'retreat'
  user_email: string
  user_name: string
  rating: number
  title: string
  content: string
}

export interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
}

export interface ReviewHelpfulness {
  id: string
  review_id: string
  user_ip: string
  user_fingerprint?: string
  created_at: string
}

export interface ReviewModerationData extends Review {
  // Extends Review with additional moderation info
}

export interface ReviewFormData {
  user_name: string
  user_email: string
  rating: number
  title: string
  content: string
}

export interface ReviewValidationErrors {
  user_name?: string
  user_email?: string
  rating?: string
  title?: string
  content?: string
  general?: string
}

// Review sorting options
export type ReviewSortOption = 'newest' | 'oldest' | 'highest_rated' | 'lowest_rated' | 'most_helpful'

// Review filtering options
export interface ReviewFilters {
  rating?: number // Filter by specific rating
  minRating?: number // Minimum rating
  maxRating?: number // Maximum rating
  sortBy: ReviewSortOption
  limit?: number
  offset?: number
}

// API Response types
export interface ReviewsResponse {
  reviews: PublicReview[]
  stats: ReviewStats
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface ReviewSubmissionResponse {
  success: boolean
  message: string
  review_id?: string
  verification_required?: boolean
}

export interface ReviewVerificationResponse {
  success: boolean
  message: string
  needs_moderation?: boolean
}

export interface ReviewModerationResponse {
  success: boolean
  message: string
  review?: ReviewModerationData
}

// Constants
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair', 
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
} as const

export const REVIEW_SORT_OPTIONS = {
  newest: 'Newest First',
  oldest: 'Oldest First',
  highest_rated: 'Highest Rated',
  lowest_rated: 'Lowest Rated',
  most_helpful: 'Most Helpful'
} as const

// Validation constants
export const REVIEW_LIMITS = {
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 100,
  MIN_CONTENT_LENGTH: 20,
  MAX_CONTENT_LENGTH: 2000,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50
} as const

// Helper functions
export function getRatingLabel(rating: number): string {
  return RATING_LABELS[rating as keyof typeof RATING_LABELS] || 'Unknown'
}

export function getRatingPercentage(rating: number, total: number): number {
  return total > 0 ? Math.round((rating / total) * 100) : 0
}

export function getAverageRatingDisplay(average: number): string {
  return average > 0 ? average.toFixed(1) : '0.0'
}

export function getReviewCountDisplay(count: number): string {
  if (count === 0) return 'No reviews'
  if (count === 1) return '1 review'
  return `${count} reviews`
}

export function validateReviewForm(data: ReviewFormData): ReviewValidationErrors {
  const errors: ReviewValidationErrors = {}

  // Validate name
  if (!data.user_name?.trim()) {
    errors.user_name = 'Name is required'
  } else if (data.user_name.trim().length < REVIEW_LIMITS.MIN_NAME_LENGTH) {
    errors.user_name = `Name must be at least ${REVIEW_LIMITS.MIN_NAME_LENGTH} characters`
  } else if (data.user_name.trim().length > REVIEW_LIMITS.MAX_NAME_LENGTH) {
    errors.user_name = `Name must be no more than ${REVIEW_LIMITS.MAX_NAME_LENGTH} characters`
  }

  // Validate email
  if (!data.user_email?.trim()) {
    errors.user_email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user_email)) {
    errors.user_email = 'Please enter a valid email address'
  }

  // Validate rating
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Please select a rating from 1 to 5 stars'
  }

  // Validate title
  if (!data.title?.trim()) {
    errors.title = 'Review title is required'
  } else if (data.title.trim().length < REVIEW_LIMITS.MIN_TITLE_LENGTH) {
    errors.title = `Title must be at least ${REVIEW_LIMITS.MIN_TITLE_LENGTH} characters`
  } else if (data.title.trim().length > REVIEW_LIMITS.MAX_TITLE_LENGTH) {
    errors.title = `Title must be no more than ${REVIEW_LIMITS.MAX_TITLE_LENGTH} characters`
  }

  // Validate content
  if (!data.content?.trim()) {
    errors.content = 'Review content is required'
  } else if (data.content.trim().length < REVIEW_LIMITS.MIN_CONTENT_LENGTH) {
    errors.content = `Review must be at least ${REVIEW_LIMITS.MIN_CONTENT_LENGTH} characters`
  } else if (data.content.trim().length > REVIEW_LIMITS.MAX_CONTENT_LENGTH) {
    errors.content = `Review must be no more than ${REVIEW_LIMITS.MAX_CONTENT_LENGTH} characters`
  }

  return errors
}

export function hasValidationErrors(errors: ReviewValidationErrors): boolean {
  return Object.keys(errors).length > 0
}