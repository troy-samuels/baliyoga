/**
 * Image utility functions for consistent image handling and caching
 * Ensures proper mapping between studios/retreats and their cached images
 */

import crypto from 'crypto'

/**
 * Normalize studio/retreat name for consistent identification
 * Removes special characters, normalizes spacing, and converts to lowercase
 */
export function normalizeStudioName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces/hyphens with single space
    .replace(/[\s-]+/g, ' ')
    .trim()
}

/**
 * Normalize location name for consistent identification
 */
export function normalizeLocation(location: string): string {
  return location
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, ' ')
    .trim()
}

/**
 * Generate a consistent hash for studio/retreat identification
 * Uses normalized inputs to ensure consistency
 */
export function generateStudioHash(studioName: string, location: string): string {
  const normalizedName = normalizeStudioName(studioName)
  const normalizedLocation = normalizeLocation(location || 'bali')
  const combined = `${normalizedName}-${normalizedLocation}`
  
  return crypto.createHash('md5').update(combined).digest('hex')
}

/**
 * Generate the storage path for a studio's images
 * Uses studio ID as the primary identifier for better organization
 */
export function getStudioImagePath(studioId: string, type: 'studio' | 'retreat' = 'studio'): string {
  // Sanitize studio ID to ensure it's safe for file paths
  const sanitizedId = studioId.replace(/[^a-zA-Z0-9-_]/g, '_')
  return `${type}s/${sanitizedId}`
}

/**
 * Generate filename for cached image
 */
export function getCachedImageFilename(studioId: string, imageIndex: number, type: 'studio' | 'retreat' = 'studio'): string {
  const basePath = getStudioImagePath(studioId, type)
  return `${basePath}/image-${imageIndex}.jpg`
}

/**
 * Parse and validate image URLs from database
 * Handles both JSON string and array formats
 */
export function parseImageUrls(images: string | string[] | null | undefined): string[] {
  if (!images) return []
  
  try {
    if (typeof images === 'string') {
      // Try to parse as JSON first
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed.filter(url => typeof url === 'string') : []
    } else if (Array.isArray(images)) {
      return images.filter(url => typeof url === 'string')
    }
  } catch (error) {
    console.error('Error parsing image URLs:', error, 'for images:', images)
  }
  
  return []
}

/**
 * Check if a URL is from Supabase storage
 */
export function isSupabaseImageUrl(url: string): boolean {
  return url.includes('supabase') && url.includes('storage')
}

/**
 * Generate fallback image URL or data URI for placeholders
 */
export function generatePlaceholderImage(width: number = 400, height: number = 240, text?: string): string {
  // Create a simple data URI for a placeholder
  const canvas = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
      ${text || 'Loading...'}
    </text>
  </svg>`
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`
}

/**
 * Get responsive image sizes for different viewports
 * Optimized for mobile-first design
 */
export function getResponsiveImageSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
}

/**
 * Validate image URL and check if it's accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('Image validation failed:', error)
    return false
  }
}