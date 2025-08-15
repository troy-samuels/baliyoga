import { unstable_cache } from 'next/cache'

// Cache keys
export const CACHE_KEYS = {
  ALL_STUDIOS: 'all-studios',
  ALL_RETREATS: 'all-retreats',
  TOP_STUDIOS: 'top-studios',
  TOP_RETREATS: 'top-retreats',
  STUDIO_BY_SLUG: 'studio-by-slug',
  RETREAT_BY_SLUG: 'retreat-by-slug',
  SIMILAR_ITEMS: 'similar-items',
} as const

// Cache configurations
export const CACHE_CONFIG = {
  // Short cache for frequently changing data
  SHORT: {
    revalidate: 300, // 5 minutes
    tags: ['short-cache'] as string[]
  },
  // Medium cache for moderately changing data
  MEDIUM: {
    revalidate: 1800, // 30 minutes
    tags: ['medium-cache'] as string[]
  },
  // Long cache for stable data
  LONG: {
    revalidate: 3600, // 1 hour
    tags: ['long-cache'] as string[]
  },
  // Very long cache for nearly static data
  STATIC: {
    revalidate: 86400, // 24 hours
    tags: ['static-cache'] as string[]
  }
}

// Utility function to create cache key with parameters
export function createCacheKey(baseKey: string, params?: Record<string, any>): string {
  if (!params) return baseKey
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('-')
  
  return `${baseKey}-${sortedParams}`
}

// Memory cache for client-side caching
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    const isExpired = Date.now() - item.timestamp > item.ttl
    
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key)
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const memoryCache = new MemoryCache()

// Clean up memory cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup()
  }, 5 * 60 * 1000)
}

// Cached function wrapper
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
  config = CACHE_CONFIG.MEDIUM
): T {
  return unstable_cache(fn, [cacheKey], config) as T
}

// Client-side cache wrapper
export function withMemoryCache<T>(
  fn: () => Promise<T>,
  key: string,
  ttlSeconds: number = 300
): () => Promise<T> {
  return async () => {
    // Check memory cache first
    const cached = memoryCache.get(key)
    if (cached) {
      return cached
    }
    
    // Fetch fresh data
    const data = await fn()
    
    // Store in memory cache
    memoryCache.set(key, data, ttlSeconds)
    
    return data
  }
}