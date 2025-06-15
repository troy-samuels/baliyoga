// Security utilities for enhanced protection

// Rate limiting configuration
const RATE_LIMITS = {
  WISHLIST_ACTIONS: 10, // max 10 wishlist changes per minute
  POPULARITY_DEMO: 20,  // max 20 demo clicks per minute
} as const

// Rate limiting storage
interface RateLimitEntry {
  count: number
  resetTime: number
}

// Get rate limit storage key
function getRateLimitKey(action: string, identifier: string = 'anonymous'): string {
  return `rate-limit-${action}-${identifier}`
}

// Check if action is rate limited
export function isRateLimited(action: keyof typeof RATE_LIMITS, identifier?: string): boolean {
  if (typeof window === 'undefined') return false
  
  const key = getRateLimitKey(action, identifier)
  const limit = RATE_LIMITS[action]
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return false
    
    const entry: RateLimitEntry = JSON.parse(stored)
    
    // Reset if window has passed
    if (now > entry.resetTime) {
      localStorage.removeItem(key)
      return false
    }
    
    // Check if limit exceeded
    return entry.count >= limit
  } catch (error) {
    console.error('Rate limit check error:', error)
    return false
  }
}

// Record an action for rate limiting
export function recordAction(action: keyof typeof RATE_LIMITS, identifier?: string): void {
  if (typeof window === 'undefined') return
  
  const key = getRateLimitKey(action, identifier)
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  
  try {
    const stored = localStorage.getItem(key)
    let entry: RateLimitEntry
    
    if (stored) {
      entry = JSON.parse(stored)
      
      // Reset if window has passed
      if (now > entry.resetTime) {
        entry = { count: 1, resetTime: now + windowMs }
      } else {
        entry.count += 1
      }
    } else {
      entry = { count: 1, resetTime: now + windowMs }
    }
    
    localStorage.setItem(key, JSON.stringify(entry))
  } catch (error) {
    console.error('Rate limit recording error:', error)
  }
}

// Get remaining actions before rate limit
export function getRemainingActions(action: keyof typeof RATE_LIMITS, identifier?: string): number {
  if (typeof window === 'undefined') return RATE_LIMITS[action]
  
  const key = getRateLimitKey(action, identifier)
  const limit = RATE_LIMITS[action]
  const now = Date.now()
  
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return limit
    
    const entry: RateLimitEntry = JSON.parse(stored)
    
    // Reset if window has passed
    if (now > entry.resetTime) {
      return limit
    }
    
    return Math.max(0, limit - entry.count)
  } catch (error) {
    console.error('Rate limit check error:', error)
    return limit
  }
}

// Input validation utilities
export function isValidItemId(id: string): boolean {
  // Allow alphanumeric characters, hyphens, and underscores
  // Length between 1 and 50 characters
  return /^[a-zA-Z0-9-_]{1,50}$/.test(id)
}

export function isValidItemType(type: string): type is 'studio' | 'retreat' {
  return type === 'studio' || type === 'retreat'
}

export function sanitizeString(input: string, maxLength: number = 100): string {
  if (typeof input !== 'string') return ''
  
  // Remove potentially dangerous characters
  const sanitized = input
    .replace(/[<>'"&]/g, '') // Remove HTML/script injection chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim()
  
  // Truncate to max length
  return sanitized.slice(0, maxLength)
}

export function validatePopularityScore(score: unknown): number {
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 0) {
    return 0
  }
  
  // Cap at reasonable maximum to prevent manipulation
  return Math.min(score, 10000)
}

// Secure localStorage operations with error handling
export function secureGetItem(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Secure localStorage get error:', error)
    return null
  }
}

export function secureSetItem(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined') return false
    
    // Check storage quota (approximate)
    const testKey = 'storage-test'
    const testValue = 'x'.repeat(1024) // 1KB test
    
    localStorage.setItem(testKey, testValue)
    localStorage.removeItem(testKey)
    
    // If test passes, set the actual item
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error('Secure localStorage set error:', error)
    return false
  }
}

// Clean up old rate limit entries
export function cleanupRateLimits(): void {
  if (typeof window === 'undefined') return
  
  try {
    const now = Date.now()
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('rate-limit-')) {
        const stored = localStorage.getItem(key)
        if (stored) {
          const entry: RateLimitEntry = JSON.parse(stored)
          if (now > entry.resetTime) {
            keysToRemove.push(key)
          }
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.error('Rate limit cleanup error:', error)
  }
}

// Initialize security utilities
export function initializeSecurity(): void {
  // Clean up old rate limits on initialization
  cleanupRateLimits()
  
  // Set up periodic cleanup (every 5 minutes)
  if (typeof window !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000)
  }
} 