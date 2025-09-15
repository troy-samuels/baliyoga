/**
 * Image Validation Utilities for Bali Yoga App
 * Ensures only authentic yoga-related images are prioritized in listings
 * Complies with CLAUDE.md: mobile-first, performance optimized, error handling
 */

import { parseImageUrls } from './image-utils'

/**
 * Check if an image URL is a fallback/placeholder image
 */
export function isFallbackImage(url: string): boolean {
  if (!url || typeof url !== 'string') return true
  
  const fallbackPatterns = [
    'placeholder',
    'data:image/svg',
    'fallback',
    'e6ceb3', // Our brand color used in fallbacks
    'generateColorFallback',
    'loading',
    'skeleton',
    'default-image'
  ]
  
  return fallbackPatterns.some(pattern => 
    url.toLowerCase().includes(pattern.toLowerCase())
  )
}

/**
 * Count authentic (non-fallback) images in an array
 */
export function countAuthenticImages(images: string[] | string | null | undefined): number {
  const parsedImages = parseImageUrls(images)
  if (!parsedImages || parsedImages.length === 0) return 0
  
  return parsedImages.filter(img => !isFallbackImage(img)).length
}

/**
 * Check if a profile has authentic yoga images
 */
export function hasAuthenticImages(images: string[] | string | null | undefined): boolean {
  return countAuthenticImages(images) > 0
}

/**
 * Calculate image quality score for sorting
 * Returns: 0-100 score where higher = better image quality
 */
export function calculateImageScore(images: string[] | string | null | undefined): number {
  const authenticCount = countAuthenticImages(images)
  
  if (authenticCount === 0) return 0 // No authentic images
  
  // Base score: 20 points for having any authentic images
  let score = 20
  
  // Additional points per authentic image (up to 5 images)
  score += Math.min(authenticCount * 15, 75) // Max 75 points for images
  
  // Bonus for multiple images (variety)
  if (authenticCount >= 3) score += 5 // Small bonus for 3+ images
  
  return Math.min(score, 100) // Cap at 100
}

/**
 * Enhanced sorting function that heavily prioritizes profiles with authentic images
 * This is the main function to use for profile listings
 */
export function sortProfilesByImagePriority<T extends { 
  images?: string[] | string | null | undefined
  rating?: number
  reviewCount?: number
  review_score?: number
  review_count?: number
}>(profiles: T[]): T[] {
  return [...profiles].sort((a, b) => {
    // Get authentic image counts
    const aImageCount = countAuthenticImages(a.images)
    const bImageCount = countAuthenticImages(b.images)
    
    // AGGRESSIVE IMAGE PRIORITY: Profiles without images go to bottom
    if (aImageCount === 0 && bImageCount > 0) return 1  // a goes down
    if (bImageCount === 0 && aImageCount > 0) return -1 // b goes down
    
    // Both have images OR both don't have images - use other criteria
    if (aImageCount > 0 && bImageCount > 0) {
      // Both have images - sort by image quality score first
      const aImageScore = calculateImageScore(a.images)
      const bImageScore = calculateImageScore(b.images)
      
      if (aImageScore !== bImageScore) {
        return bImageScore - aImageScore // Higher image score first
      }
    }
    
    // Secondary: Sort by rating
    const aRating = a.rating || a.review_score || 0
    const bRating = b.rating || b.review_score || 0
    
    if (aRating !== bRating) {
      return bRating - aRating
    }
    
    // Tertiary: Sort by review count
    const aReviewCount = a.reviewCount || a.review_count || 0
    const bReviewCount = b.reviewCount || b.review_count || 0
    
    if (aReviewCount !== bReviewCount) {
      return bReviewCount - aReviewCount
    }
    
    // Final: Alphabetical by name if available
    const aName = 'name' in a ? (a as any).name : ''
    const bName = 'name' in b ? (b as any).name : ''
    
    return aName.localeCompare(bName)
  })
}

/**
 * Filter profiles to only include those with authentic images
 * Useful for "featured" or "with photos" sections
 */
export function filterProfilesWithImages<T extends { 
  images?: string[] | string | null | undefined 
}>(profiles: T[]): T[] {
  return profiles.filter(profile => hasAuthenticImages(profile.images))
}

/**
 * Separate profiles into those with and without images
 * Returns { withImages: T[], withoutImages: T[] }
 */
export function separateProfilesByImageStatus<T extends { 
  images?: string[] | string | null | undefined 
}>(profiles: T[]): { withImages: T[], withoutImages: T[] } {
  const withImages: T[] = []
  const withoutImages: T[] = []
  
  profiles.forEach(profile => {
    if (hasAuthenticImages(profile.images)) {
      withImages.push(profile)
    } else {
      withoutImages.push(profile)
    }
  })
  
  return { withImages, withoutImages }
}

/**
 * Get image priority stats for debugging/reporting
 */
export function getImageStats<T extends { 
  images?: string[] | string | null | undefined 
}>(profiles: T[]): {
  total: number
  withImages: number
  withoutImages: number
  percentageWithImages: number
  averageImageCount: number
} {
  const total = profiles.length
  const withImages = profiles.filter(p => hasAuthenticImages(p.images)).length
  const withoutImages = total - withImages
  
  const totalImageCount = profiles.reduce((sum, profile) => {
    return sum + countAuthenticImages(profile.images)
  }, 0)
  
  return {
    total,
    withImages,
    withoutImages,
    percentageWithImages: total > 0 ? (withImages / total) * 100 : 0,
    averageImageCount: total > 0 ? totalImageCount / total : 0
  }
}