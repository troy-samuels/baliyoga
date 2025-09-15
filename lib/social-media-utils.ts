/**
 * Social Media Utilities
 * Comprehensive tools for social media data extraction, validation, and normalization
 * Target: 100% social media coverage across all profiles
 */

interface SocialMediaProfile {
  instagram_url?: string
  instagram_handle?: string
  facebook_url?: string
  tiktok_url?: string
  youtube_url?: string
  source: 'website' | 'google_places' | 'predicted' | 'manual' | 'existing'
  confidence: 'high' | 'medium' | 'low'
  validated: boolean
  last_validated?: string
}

interface SocialMediaExtractionResult {
  profileId: string
  profileName: string
  extracted: SocialMediaProfile
  success: boolean
  sources_used: string[]
  errors: string[]
}

/**
 * Extract social media links from HTML content
 */
export function extractSocialMediaFromHTML(html: string, baseUrl?: string): Partial<SocialMediaProfile> {
  const socialMedia: Partial<SocialMediaProfile> = {
    source: 'website',
    confidence: 'high',
    validated: false
  }

  // Instagram patterns
  const instagramPatterns = [
    /instagram\.com\/([a-zA-Z0-9_.]+)/g,
    /instagr\.am\/([a-zA-Z0-9_.]+)/g,
    /@([a-zA-Z0-9_.]+)(?=\s|$|<)/g // Handle patterns in text
  ]

  // Facebook patterns
  const facebookPatterns = [
    /facebook\.com\/([a-zA-Z0-9_.]+)/g,
    /fb\.com\/([a-zA-Z0-9_.]+)/g,
    /m\.facebook\.com\/([a-zA-Z0-9_.]+)/g
  ]

  // TikTok patterns
  const tiktokPatterns = [
    /tiktok\.com\/@([a-zA-Z0-9_.]+)/g,
    /tiktok\.com\/([a-zA-Z0-9_.]+)/g
  ]

  // YouTube patterns
  const youtubePatterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/g,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/g,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/g,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/g,
    /youtu\.be\/([a-zA-Z0-9_-]+)/g
  ]

  // Extract Instagram
  for (const pattern of instagramPatterns) {
    const matches = [...html.matchAll(pattern)]
    for (const match of matches) {
      const handle = match[1]?.replace(/^@/, '')
      if (handle && isValidInstagramHandle(handle)) {
        socialMedia.instagram_handle = handle
        socialMedia.instagram_url = `https://instagram.com/${handle}`
        break
      }
    }
    if (socialMedia.instagram_url) break
  }

  // Extract Facebook
  for (const pattern of facebookPatterns) {
    const matches = [...html.matchAll(pattern)]
    for (const match of matches) {
      const page = match[1]
      if (page && isValidFacebookPage(page)) {
        socialMedia.facebook_url = `https://facebook.com/${page}`
        break
      }
    }
    if (socialMedia.facebook_url) break
  }

  // Extract TikTok
  for (const pattern of tiktokPatterns) {
    const matches = [...html.matchAll(pattern)]
    for (const match of matches) {
      const handle = match[1]?.replace(/^@/, '')
      if (handle && isValidTikTokHandle(handle)) {
        socialMedia.tiktok_url = `https://tiktok.com/@${handle}`
        break
      }
    }
    if (socialMedia.tiktok_url) break
  }

  // Extract YouTube
  for (const pattern of youtubePatterns) {
    const matches = [...html.matchAll(pattern)]
    for (const match of matches) {
      const channelId = match[1]
      if (channelId && channelId.length > 3) {
        socialMedia.youtube_url = match[0].startsWith('http') ? match[0] : `https://youtube.com/${match[0]}`
        break
      }
    }
    if (socialMedia.youtube_url) break
  }

  return socialMedia
}

/**
 * Generate potential Instagram handles based on business name
 */
export function generateInstagramHandleCandidates(businessName: string, city?: string): string[] {
  const candidates: string[] = []
  
  // Clean business name
  const cleanName = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/yoga|studio|center|retreat|bali|ubud|canggu|seminyak/g, '')
    .trim()

  // Base patterns
  candidates.push(cleanName)
  candidates.push(`${cleanName}yoga`)
  candidates.push(`${cleanName}bali`)
  candidates.push(`yoga${cleanName}`)
  candidates.push(`${cleanName}studio`)
  candidates.push(`${cleanName}_yoga`)
  candidates.push(`${cleanName}.yoga`)
  candidates.push(`${cleanName}_bali`)
  candidates.push(`${cleanName}.bali`)

  // Add original business name variations
  const originalClean = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')

  candidates.push(originalClean)
  candidates.push(originalClean.replace(/_/g, ''))
  candidates.push(originalClean.replace(/_/g, '.'))

  // Add city-specific variations if provided
  if (city) {
    const cityClean = city.toLowerCase().replace(/[^a-z0-9]/g, '')
    candidates.push(`${cleanName}${cityClean}`)
    candidates.push(`${cleanName}_${cityClean}`)
  }

  // Remove duplicates and invalid handles
  return [...new Set(candidates)]
    .filter(handle => handle.length >= 3 && handle.length <= 30)
    .filter(isValidInstagramHandle)
    .slice(0, 10) // Limit to top 10 candidates
}

/**
 * Validate Instagram handle format
 */
export function isValidInstagramHandle(handle: string): boolean {
  if (!handle || handle.length < 1 || handle.length > 30) return false
  
  // Instagram handle rules: letters, numbers, underscores, periods
  // Cannot start or end with period, cannot have consecutive periods
  const validPattern = /^[a-zA-Z0-9_]([a-zA-Z0-9_.]*[a-zA-Z0-9_])?$/
  
  if (!validPattern.test(handle)) return false
  if (handle.includes('..')) return false
  if (handle.startsWith('.') || handle.endsWith('.')) return false
  
  // Filter out common non-business handles
  const invalidKeywords = ['admin', 'test', 'temp', 'example', 'default']
  if (invalidKeywords.some(keyword => handle.toLowerCase().includes(keyword))) return false
  
  return true
}

/**
 * Validate Facebook page format
 */
export function isValidFacebookPage(page: string): boolean {
  if (!page || page.length < 3 || page.length > 50) return false
  
  // Exclude Facebook system pages
  const systemPages = ['pages', 'profile.php', 'people', 'home.php', 'login', 'sharer', 'plugins']
  if (systemPages.includes(page.toLowerCase())) return false
  
  // Basic format check
  return /^[a-zA-Z0-9._-]+$/.test(page)
}

/**
 * Validate TikTok handle format
 */
export function isValidTikTokHandle(handle: string): boolean {
  if (!handle || handle.length < 2 || handle.length > 24) return false
  
  // TikTok handle rules: letters, numbers, underscores, periods
  const validPattern = /^[a-zA-Z0-9_.]+$/
  return validPattern.test(handle)
}

/**
 * Normalize social media URLs
 */
export function normalizeSocialMediaUrls(profile: Partial<SocialMediaProfile>): Partial<SocialMediaProfile> {
  const normalized = { ...profile }

  // Normalize Instagram URL
  if (normalized.instagram_url) {
    const instagramMatch = normalized.instagram_url.match(/instagram\.com\/([a-zA-Z0-9_.]+)/)
    if (instagramMatch) {
      const handle = instagramMatch[1]
      normalized.instagram_url = `https://instagram.com/${handle}`
      normalized.instagram_handle = handle
    }
  }

  // Normalize Facebook URL
  if (normalized.facebook_url) {
    const facebookMatch = normalized.facebook_url.match(/facebook\.com\/([a-zA-Z0-9_.]+)/)
    if (facebookMatch) {
      normalized.facebook_url = `https://facebook.com/${facebookMatch[1]}`
    }
  }

  // Normalize TikTok URL
  if (normalized.tiktok_url) {
    const tiktokMatch = normalized.tiktok_url.match(/tiktok\.com\/@?([a-zA-Z0-9_.]+)/)
    if (tiktokMatch) {
      normalized.tiktok_url = `https://tiktok.com/@${tiktokMatch[1]}`
    }
  }

  // Normalize YouTube URL
  if (normalized.youtube_url && !normalized.youtube_url.startsWith('http')) {
    normalized.youtube_url = `https://${normalized.youtube_url}`
  }

  return normalized
}

/**
 * Validate if social media URL is active and authentic
 */
export async function validateSocialMediaUrl(url: string, timeout = 5000): Promise<{ valid: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    clearTimeout(timeoutId)

    return {
      valid: response.ok || response.status === 429, // 429 means rate limited but URL exists
      status: response.status
    }

  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check if Instagram handle exists (basic check)
 */
export async function checkInstagramHandleExists(handle: string): Promise<boolean> {
  try {
    const url = `https://instagram.com/${handle}`
    const result = await validateSocialMediaUrl(url, 3000)
    return result.valid
  } catch {
    return false
  }
}

/**
 * Merge social media data from multiple sources
 */
export function mergeSocialMediaData(
  existing: Partial<SocialMediaProfile>, 
  newData: Partial<SocialMediaProfile>
): Partial<SocialMediaProfile> {
  const merged = { ...existing }

  // Prioritize higher confidence sources
  const confidenceOrder = { high: 3, medium: 2, low: 1 }
  const existingConfidence = confidenceOrder[existing.confidence || 'low']
  const newConfidence = confidenceOrder[newData.confidence || 'low']

  // Only override if new data has higher confidence or existing data is empty
  Object.keys(newData).forEach(key => {
    const typedKey = key as keyof SocialMediaProfile
    if (newData[typedKey] && (!existing[typedKey] || newConfidence > existingConfidence)) {
      // @ts-ignore - Complex type handling
      merged[typedKey] = newData[typedKey]
    }
  })

  return merged
}

/**
 * Score social media completeness for quality assessment
 */
export function scoreSocialMediaCompleteness(profile: Partial<SocialMediaProfile>): {
  score: number
  maxScore: number
  completeness: number
} {
  const maxScore = 15 // 15 points for social media in quality scoring
  let score = 0

  // Instagram: 6 points (most important for yoga studios)
  if (profile.instagram_url && profile.instagram_handle) {
    score += 6
  } else if (profile.instagram_url || profile.instagram_handle) {
    score += 3
  }

  // Facebook: 4 points
  if (profile.facebook_url) {
    score += 4
  }

  // TikTok: 2 points
  if (profile.tiktok_url) {
    score += 2
  }

  // YouTube: 3 points
  if (profile.youtube_url) {
    score += 3
  }

  const completeness = (score / maxScore) * 100

  return { score, maxScore, completeness }
}