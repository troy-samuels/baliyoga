import { createServerClient } from '@/lib/supabase'
import { 
  isRateLimited, 
  recordAction, 
  isValidItemId, 
  validatePopularityScore, 
  secureGetItem, 
  secureSetItem 
} from '@/lib/security-utils'

export interface PopularityScore {
  item_id: string
  item_type: 'studio' | 'retreat'
  wishlist_count: number
  last_updated: string
}

// Function to get popularity scores from localStorage (client-side simulation)
export function getPopularityScores(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  
  try {
    const scores = secureGetItem('bali-yoga-popularity-scores')
    if (!scores) return {}
    
    const parsed = JSON.parse(scores)
    
    // Validate and sanitize the data
    const sanitized: Record<string, number> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (isValidItemId(key)) {
        sanitized[key] = validatePopularityScore(value)
      }
    }
    
    return sanitized
  } catch (error) {
    console.error('Error loading popularity scores:', error)
    return {}
  }
}

// Function to save popularity scores to localStorage (client-side simulation)
export function savePopularityScores(scores: Record<string, number>): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    // Validate and sanitize scores before saving
    const sanitized: Record<string, number> = {}
    for (const [key, value] of Object.entries(scores)) {
      if (isValidItemId(key)) {
        sanitized[key] = validatePopularityScore(value)
      }
    }
    
    return secureSetItem('bali-yoga-popularity-scores', JSON.stringify(sanitized))
  } catch (error) {
    console.error('Error saving popularity scores:', error)
    return false
  }
}

// Function to increment popularity score when item is added to wishlist
export function incrementPopularityScore(itemId: string): boolean {
  // Validate input
  if (!isValidItemId(itemId)) {
    console.warn('Invalid item ID for popularity increment:', itemId)
    return false
  }
  
  // Check rate limiting
  if (isRateLimited('WISHLIST_ACTIONS')) {
    console.warn('Rate limit exceeded for wishlist actions')
    return false
  }
  
  // Record the action for rate limiting
  recordAction('WISHLIST_ACTIONS')
  
  const scores = getPopularityScores()
  scores[itemId] = (scores[itemId] || 0) + 1
  return savePopularityScores(scores)
}

// Function to decrement popularity score when item is removed from wishlist
export function decrementPopularityScore(itemId: string): boolean {
  // Validate input
  if (!isValidItemId(itemId)) {
    console.warn('Invalid item ID for popularity decrement:', itemId)
    return false
  }
  
  // Check rate limiting
  if (isRateLimited('WISHLIST_ACTIONS')) {
    console.warn('Rate limit exceeded for wishlist actions')
    return false
  }
  
  // Record the action for rate limiting
  recordAction('WISHLIST_ACTIONS')
  
  const scores = getPopularityScores()
  if (scores[itemId] && scores[itemId] > 0) {
    scores[itemId] -= 1
  }
  return savePopularityScores(scores)
}

// Function to get popularity score for a specific item
export function getItemPopularityScore(itemId: string): number {
  if (!isValidItemId(itemId)) {
    return 0
  }
  
  const scores = getPopularityScores()
  return validatePopularityScore(scores[itemId])
}

// Function to sort items by popularity (higher scores first)
export function sortByPopularity<T extends { id: string | number }>(items: T[]): T[] {
  const scores = getPopularityScores()
  
  return [...items].sort((a, b) => {
    const idA = String(a.id)
    const idB = String(b.id)
    
    // Validate IDs before using them
    const scoreA = isValidItemId(idA) ? (scores[idA] || 0) : 0
    const scoreB = isValidItemId(idB) ? (scores[idB] || 0) : 0
    
    // Primary sort: by popularity score (descending)
    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }
    
    // Secondary sort: by rating if available (descending)
    const ratingA = 'rating' in a ? (a as any).rating : 0
    const ratingB = 'rating' in b ? (b as any).rating : 0
    if (ratingA !== ratingB) {
      return ratingB - ratingA
    }
    
    // Tertiary sort: by name (ascending)
    const nameA = 'name' in a ? (a as any).name : ''
    const nameB = 'name' in b ? (b as any).name : ''
    return nameA.localeCompare(nameB)
  })
}

// Server-side function to get popularity scores from Supabase (future implementation)
export async function getSupabasePopularityScores(): Promise<Record<string, number>> {
  try {
    const supabase = createServerClient()
    
    // This would query a popularity_scores table in the future
    // For now, return empty object as we're using localStorage
    const { data, error } = await supabase
      .from('popularity_scores')
      .select('item_id, wishlist_count')
    
    if (error) {
      console.error('Error fetching popularity scores:', error)
      return {}
    }
    
    const scores: Record<string, number> = {}
    data?.forEach((item: { item_id: string; wishlist_count: number }) => {
      // Validate data from database
      if (isValidItemId(item.item_id)) {
        scores[item.item_id] = validatePopularityScore(item.wishlist_count)
      }
    })
    
    return scores
  } catch (error) {
    console.error('Error fetching popularity scores from Supabase:', error)
    return {}
  }
}

// Function to calculate popularity boost for sorting
export function calculatePopularityBoost(wishlistCount: number): number {
  const validatedCount = validatePopularityScore(wishlistCount)
  
  // Logarithmic scaling to prevent extremely popular items from dominating
  // Base boost of 0.1 per wishlist addition, with diminishing returns
  return Math.log(validatedCount + 1) * 0.1
}

// Enhanced sorting function that combines rating and popularity
export function sortByPopularityAndRating<T extends { id: string | number; rating?: number }>(items: T[]): T[] {
  const scores = getPopularityScores()
  
  return [...items].sort((a, b) => {
    const idA = String(a.id)
    const idB = String(b.id)
    
    // Validate IDs and get scores
    const popularityA = isValidItemId(idA) ? validatePopularityScore(scores[idA]) : 0
    const popularityB = isValidItemId(idB) ? validatePopularityScore(scores[idB]) : 0
    
    const ratingA = a.rating || 0
    const ratingB = b.rating || 0
    
    // Calculate combined score: rating + popularity boost
    const scoreA = ratingA + calculatePopularityBoost(popularityA)
    const scoreB = ratingB + calculatePopularityBoost(popularityB)
    
    // Primary sort: by combined score (descending)
    if (Math.abs(scoreA - scoreB) > 0.01) { // Use small threshold for floating point comparison
      return scoreB - scoreA
    }
    
    // Secondary sort: by pure popularity if combined scores are very close
    if (popularityA !== popularityB) {
      return popularityB - popularityA
    }
    
    // Tertiary sort: by rating
    if (ratingA !== ratingB) {
      return ratingB - ratingA
    }
    
    // Final sort: by name
    const nameA = 'name' in a ? (a as any).name : ''
    const nameB = 'name' in b ? (b as any).name : ''
    return nameA.localeCompare(nameB)
  })
} 