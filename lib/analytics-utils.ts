/**
 * Analytics utilities for tracking page views and user interactions
 */

import { isValidItemId, sanitizeString, secureGetItem, secureSetItem } from './security-utils'

export interface PageViewData {
  path: string
  timestamp: string
  userAgent?: string
  referrer?: string
  itemId?: string
  itemType?: 'studio' | 'retreat' | 'location'
}

export interface WishlistAnalytics {
  itemId: string
  itemName: string
  itemType: 'studio' | 'retreat'
  action: 'add' | 'remove'
  timestamp: string
}

export interface AnalyticsData {
  pageViews: PageViewData[]
  wishlistActions: WishlistAnalytics[]
  lastUpdated: string
}

// Analytics storage keys
const ANALYTICS_KEY = 'bali-yoga-analytics'
const MAX_STORED_ITEMS = 10000 // Limit storage size

/**
 * Get analytics data from localStorage
 */
export function getAnalyticsData(): AnalyticsData {
  try {
    const stored = secureGetItem(ANALYTICS_KEY)
    if (!stored) {
      return {
        pageViews: [],
        wishlistActions: [],
        lastUpdated: new Date().toISOString()
      }
    }
    
    const parsed = JSON.parse(stored)
    return {
      pageViews: Array.isArray(parsed.pageViews) ? parsed.pageViews : [],
      wishlistActions: Array.isArray(parsed.wishlistActions) ? parsed.wishlistActions : [],
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('Error reading analytics data:', error)
    return {
      pageViews: [],
      wishlistActions: [],
      lastUpdated: new Date().toISOString()
    }
  }
}

/**
 * Save analytics data to localStorage
 */
function saveAnalyticsData(data: AnalyticsData): void {
  try {
    // Trim data to prevent storage bloat
    const trimmedData = {
      ...data,
      pageViews: data.pageViews.slice(-MAX_STORED_ITEMS),
      wishlistActions: data.wishlistActions.slice(-MAX_STORED_ITEMS),
      lastUpdated: new Date().toISOString()
    }
    
    secureSetItem(ANALYTICS_KEY, JSON.stringify(trimmedData))
  } catch (error) {
    console.error('Error saving analytics data:', error)
  }
}

/**
 * Track a page view
 */
export function trackPageView(
  path: string, 
  itemId?: string, 
  itemType?: 'studio' | 'retreat' | 'location'
): void {
  try {
    // Don't track in development mode or for admin paths
    if (process.env.NODE_ENV === 'development' || path.includes('/admin')) {
      return
    }
    
    const analytics = getAnalyticsData()
    
    const pageView: PageViewData = {
      path: sanitizeString(path, 500),
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? sanitizeString(navigator.userAgent, 200) : undefined,
      referrer: typeof document !== 'undefined' ? sanitizeString(document.referrer, 500) : undefined,
      itemId: itemId && isValidItemId(itemId) ? itemId : undefined,
      itemType: itemType || undefined
    }
    
    analytics.pageViews.push(pageView)
    saveAnalyticsData(analytics)
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

/**
 * Track wishlist actions
 */
export function trackWishlistAction(
  itemId: string,
  itemName: string,
  itemType: 'studio' | 'retreat',
  action: 'add' | 'remove'
): void {
  try {
    // Don't track in development mode
    if (process.env.NODE_ENV === 'development') {
      return
    }
    
    if (!isValidItemId(itemId)) {
      return
    }
    
    const analytics = getAnalyticsData()
    
    const wishlistAction: WishlistAnalytics = {
      itemId: itemId,
      itemName: sanitizeString(itemName, 200),
      itemType: itemType,
      action: action,
      timestamp: new Date().toISOString()
    }
    
    analytics.wishlistActions.push(wishlistAction)
    saveAnalyticsData(analytics)
  } catch (error) {
    console.error('Error tracking wishlist action:', error)
  }
}

/**
 * Get analytics summary for admin dashboard
 */
export function getAnalyticsSummary() {
  const data = getAnalyticsData()
  const now = new Date()
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Page view analytics
  const totalPageViews = data.pageViews.length
  const pageViews24h = data.pageViews.filter(pv => new Date(pv.timestamp) > last24Hours).length
  const pageViews7d = data.pageViews.filter(pv => new Date(pv.timestamp) > last7Days).length
  const pageViews30d = data.pageViews.filter(pv => new Date(pv.timestamp) > last30Days).length
  
  // Wishlist analytics
  const totalWishlistActions = data.wishlistActions.length
  const wishlistAdds24h = data.wishlistActions.filter(wa => 
    new Date(wa.timestamp) > last24Hours && wa.action === 'add'
  ).length
  const wishlistAdds7d = data.wishlistActions.filter(wa => 
    new Date(wa.timestamp) > last7Days && wa.action === 'add'
  ).length
  const wishlistAdds30d = data.wishlistActions.filter(wa => 
    new Date(wa.timestamp) > last30Days && wa.action === 'add'
  ).length
  
  // Most popular pages
  const pageViewCounts = data.pageViews.reduce((acc, pv) => {
    acc[pv.path] = (acc[pv.path] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const popularPages = Object.entries(pageViewCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }))
  
  // Most wishlisted items
  const wishlistCounts = data.wishlistActions
    .filter(wa => wa.action === 'add')
    .reduce((acc, wa) => {
      const key = `${wa.itemName} (${wa.itemType})`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  
  const popularWishlistItems = Object.entries(wishlistCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([item, adds]) => ({ item, adds }))
  
  return {
    pageViews: {
      total: totalPageViews,
      last24h: pageViews24h,
      last7d: pageViews7d,
      last30d: pageViews30d,
      popular: popularPages
    },
    wishlist: {
      totalActions: totalWishlistActions,
      adds24h: wishlistAdds24h,
      adds7d: wishlistAdds7d,
      adds30d: wishlistAdds30d,
      popularItems: popularWishlistItems
    },
    lastUpdated: data.lastUpdated
  }
}

/**
 * Clear analytics data (admin function)
 */
export function clearAnalyticsData(): void {
  try {
    localStorage.removeItem(ANALYTICS_KEY)
  } catch (error) {
    console.error('Error clearing analytics data:', error)
  }
}