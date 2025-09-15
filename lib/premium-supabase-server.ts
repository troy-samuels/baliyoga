/**
 * Premium-enhanced Supabase server functions
 * Extends the base functions with subscription-aware priority sorting
 */

import { cache } from 'react'
import { createServerClient } from './supabase'
import { transformStudio, transformRetreat } from './supabase-data-utils'
import {
  enrichStudiosWithPremiumStatus,
  sortStudiosByPriority,
  mockStudioPremiumStatus
} from './subscription-utils'
import type { Studio, Retreat } from './types'

const supabase = createServerClient()

/**
 * Enhanced getAllStudios with premium priority placement
 * Premium studios appear higher in search results while maintaining quality relevance
 */
export const getAllStudiosWithPremiumPriority = cache(async (): Promise<Array<Studio & {
  isPremium: boolean
  priorityScore?: number
}>> => {
  try {
    console.log('🔍 Fetching studios with premium priority...')

    // First, get all studios using the standard query
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('*')
      .eq('category_name', 'Yoga studio')
      .limit(500) // Remove the review_score ordering since we'll sort by priority

    if (error) {
      console.error('Error fetching studios:', error)
      return []
    }

    // Transform the raw data to Studio objects
    const studios = (data || []).map(transformStudio)
    console.log(`📊 Transformed ${studios.length} studios`)

    // For development: Use mock premium status until subscription system is fully implemented
    const studiosWithPremiumStatus = studios.map(studio => ({
      ...studio,
      isPremium: mockStudioPremiumStatus(studio.id)
    }))

    // Apply premium priority sorting
    const sortedStudios = sortStudiosByPriority(studiosWithPremiumStatus)

    const premiumCount = sortedStudios.filter(s => s.isPremium).length
    const freeCount = sortedStudios.length - premiumCount

    console.log(`✅ Premium priority applied: ${premiumCount} premium, ${freeCount} free studios`)
    console.log(`🏆 Top 5 studios by priority:`)
    sortedStudios.slice(0, 5).forEach((studio, index) => {
      console.log(`  ${index + 1}. ${studio.name} (${studio.isPremium ? 'Premium' : 'Free'}) - Score: ${studio.priorityScore}`)
    })

    return sortedStudios

  } catch (error) {
    console.error('Failed to fetch studios with premium priority:', error)
    return []
  }
})

/**
 * Enhanced getFeaturedStudios with premium consideration
 * Featured studios still need good ratings, but premium studios get priority
 */
export const getFeaturedStudiosWithPremiumPriority = cache(async (limit: number = 4): Promise<Array<Studio & {
  isPremium: boolean
  priorityScore?: number
}>> => {
  try {
    console.log('🌟 Fetching featured studios with premium consideration...')

    const studios = await getAllStudiosWithPremiumPriority()

    // Filter for featured-worthy studios (good ratings)
    const featuredCandidates = studios.filter(studio => {
      const hasGoodRating = studio.rating >= 4.5
      if (!hasGoodRating) {
        console.log(`Studio ${studio.name} excluded from featured - low rating: ${studio.rating}`)
      }
      return hasGoodRating
    })

    // Take the top studios (already sorted by premium priority)
    const featured = featuredCandidates.slice(0, limit)

    console.log(`Featured studios returned: ${featured.length}`)
    featured.forEach((studio, index) => {
      console.log(`  ${index + 1}. ${studio.name} (${studio.isPremium ? 'Premium' : 'Free'}) - Rating: ${studio.rating}`)
    })

    return featured

  } catch (error) {
    console.error('Failed to fetch featured studios:', error)
    return []
  }
})

/**
 * Enhanced getStudioBySlug with premium status
 */
export const getStudioBySlugWithPremiumStatus = cache(async (slug: string): Promise<(Studio & {
  isPremium: boolean
  priorityScore?: number
}) | null> => {
  try {
    const studios = await getAllStudiosWithPremiumPriority()
    return studios.find(studio => studio.slug === slug) || null
  } catch (error) {
    console.error('Failed to fetch studio by slug:', error)
    return null
  }
})

/**
 * Search studios with premium priority
 * Maintains search relevance while boosting premium studios
 */
export const searchStudiosWithPremiumPriority = cache(async (
  searchQuery?: string,
  locationFilter?: string,
  styleFilter?: string[]
): Promise<Array<Studio & {
  isPremium: boolean
  priorityScore?: number
}>> => {
  try {
    console.log(`🔍 Searching studios with query: "${searchQuery}", location: "${locationFilter}"`)

    let studios = await getAllStudiosWithPremiumPriority()

    // Apply search filters
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      studios = studios.filter(studio =>
        studio.name.toLowerCase().includes(query) ||
        studio.business_description?.toLowerCase().includes(query) ||
        studio.location.toLowerCase().includes(query) ||
        studio.styles?.some(style => style.toLowerCase().includes(query))
      )
    }

    // Apply location filter
    if (locationFilter && locationFilter !== 'all') {
      studios = studios.filter(studio =>
        studio.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Apply style filter
    if (styleFilter && styleFilter.length > 0) {
      studios = studios.filter(studio =>
        studio.styles?.some(style =>
          styleFilter.some(filterStyle =>
            style.toLowerCase().includes(filterStyle.toLowerCase())
          )
        )
      )
    }

    // Re-sort by priority after filtering (important for search results)
    const sortedResults = sortStudiosByPriority(studios)

    console.log(`📊 Search results: ${sortedResults.length} studios found`)
    console.log(`💎 Premium results: ${sortedResults.filter(s => s.isPremium).length} premium studios`)

    return sortedResults

  } catch (error) {
    console.error('Failed to search studios:', error)
    return []
  }
})

/**
 * Get studios by subscription tier (for admin/analytics purposes)
 */
export const getStudiosBySubscriptionTier = cache(async (
  tier: 'all' | 'premium' | 'free' = 'all'
): Promise<Array<Studio & {
  isPremium: boolean
  priorityScore?: number
}>> => {
  try {
    const studios = await getAllStudiosWithPremiumPriority()

    switch (tier) {
      case 'premium':
        return studios.filter(studio => studio.isPremium)
      case 'free':
        return studios.filter(studio => !studio.isPremium)
      case 'all':
      default:
        return studios
    }
  } catch (error) {
    console.error('Failed to fetch studios by subscription tier:', error)
    return []
  }
})

/**
 * Get premium subscription analytics
 */
export const getPremiumSubscriptionAnalytics = cache(async (): Promise<{
  total_studios: number
  premium_studios: number
  free_studios: number
  conversion_rate: number
  monthly_revenue: number
  top_premium_studios: Array<Studio & { isPremium: boolean; priorityScore?: number }>
}> => {
  try {
    const studios = await getAllStudiosWithPremiumPriority()

    const premiumStudios = studios.filter(s => s.isPremium)
    const freeStudios = studios.filter(s => !s.isPremium)

    const conversionRate = studios.length > 0 ? (premiumStudios.length / studios.length) * 100 : 0
    const monthlyRevenue = premiumStudios.length * 45 // $45 per premium subscription

    return {
      total_studios: studios.length,
      premium_studios: premiumStudios.length,
      free_studios: freeStudios.length,
      conversion_rate: conversionRate,
      monthly_revenue: monthlyRevenue,
      top_premium_studios: premiumStudios.slice(0, 10)
    }
  } catch (error) {
    console.error('Failed to get subscription analytics:', error)
    return {
      total_studios: 0,
      premium_studios: 0,
      free_studios: 0,
      conversion_rate: 0,
      monthly_revenue: 0,
      top_premium_studios: []
    }
  }
})

// Export all the enhanced functions
export {
  getAllStudiosWithPremiumPriority,
  getFeaturedStudiosWithPremiumPriority,
  getStudioBySlugWithPremiumStatus,
  searchStudiosWithPremiumPriority,
  getStudiosBySubscriptionTier,
  getPremiumSubscriptionAnalytics
}