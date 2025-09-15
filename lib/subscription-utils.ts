/**
 * Subscription Utilities
 * Helper functions for checking premium status and features
 */

import { hasStudioPremiumFeatures, getStudioSubscription } from './subscription-service'
import { Studio, Retreat } from './types'

/**
 * Check if a studio has premium subscription
 */
export async function checkStudioPremiumStatus(studioId: string): Promise<boolean> {
  try {
    return await hasStudioPremiumFeatures(studioId)
  } catch (error) {
    console.error('Error checking premium status:', error)
    return false
  }
}

/**
 * Add premium status to studio data
 */
export async function enrichStudioWithPremiumStatus(studio: Studio): Promise<Studio & { isPremium: boolean }> {
  const isPremium = await checkStudioPremiumStatus(studio.id)
  return {
    ...studio,
    isPremium
  }
}

/**
 * Add premium status to multiple studios
 */
export async function enrichStudiosWithPremiumStatus(
  studios: Studio[]
): Promise<Array<Studio & { isPremium: boolean }>> {
  const enrichedStudios = await Promise.all(
    studios.map(async (studio) => {
      const isPremium = await checkStudioPremiumStatus(studio.id)
      return {
        ...studio,
        isPremium
      }
    })
  )
  return enrichedStudios
}

/**
 * Calculate priority score for search ranking
 * Higher scores appear first in search results
 */
export function calculatePriorityScore(
  studio: Studio & { isPremium?: boolean }
): number {
  let score = 0

  // Base score from rating and review count
  score += (studio.rating || 0) * 10
  score += Math.min((studio.reviewCount || 0) / 10, 20) // Cap review bonus at 20

  // Premium boost (significant but not overwhelming)
  if (studio.isPremium) {
    score += 50 // Premium studios get substantial boost
  }

  // Quality indicators
  if (studio.phone_number?.trim()) score += 5
  if (studio.website?.trim()) score += 5
  if (studio.business_description?.trim()) score += 5
  if (studio.images && studio.images.length > 1) score += 3

  // Social media presence
  if (studio.instagram_url?.trim()) score += 2
  if (studio.facebook_url?.trim()) score += 2
  if (studio.whatsapp_number?.trim()) score += 3

  return score
}

/**
 * Sort studios with premium priority
 * Premium studios appear higher in results while maintaining quality relevance
 */
export function sortStudiosByPriority(
  studios: Array<Studio & { isPremium?: boolean }>
): Array<Studio & { isPremium?: boolean; priorityScore?: number }> {
  return studios
    .map(studio => ({
      ...studio,
      priorityScore: calculatePriorityScore(studio)
    }))
    .sort((a, b) => {
      // First sort by premium status
      if (a.isPremium && !b.isPremium) return -1
      if (!a.isPremium && b.isPremium) return 1

      // Then by priority score
      return (b.priorityScore || 0) - (a.priorityScore || 0)
    })
}

/**
 * Filter studios by subscription tier for admin purposes
 */
export function filterStudiosBySubscription(
  studios: Array<Studio & { isPremium?: boolean }>,
  tier: 'all' | 'premium' | 'free'
): Array<Studio & { isPremium?: boolean }> {
  switch (tier) {
    case 'premium':
      return studios.filter(studio => studio.isPremium)
    case 'free':
      return studios.filter(studio => !studio.isPremium)
    case 'all':
    default:
      return studios
  }
}

/**
 * Get premium feature limits for a subscription tier
 */
export function getPremiumFeatureLimits(isPremium: boolean): {
  maxImages: number
  hasAnalytics: boolean
  hasPriorityPlacement: boolean
  hasWhatsAppIntegration: boolean
  hasSocialScheduling: boolean
  hasPrioritySupport: boolean
} {
  if (isPremium) {
    return {
      maxImages: Infinity, // Unlimited for premium
      hasAnalytics: true,
      hasPriorityPlacement: true,
      hasWhatsAppIntegration: true,
      hasSocialScheduling: true,
      hasPrioritySupport: true
    }
  }

  return {
    maxImages: 3, // Limited for free tier
    hasAnalytics: false,
    hasPriorityPlacement: false,
    hasWhatsAppIntegration: false,
    hasSocialScheduling: false,
    hasPrioritySupport: false
  }
}

/**
 * Check if a feature is available for a subscription tier
 */
export function hasFeatureAccess(
  isPremium: boolean,
  feature: 'unlimited_images' | 'analytics' | 'priority_placement' | 'whatsapp_tools' | 'social_scheduling' | 'priority_support'
): boolean {
  const limits = getPremiumFeatureLimits(isPremium)

  switch (feature) {
    case 'unlimited_images':
      return limits.maxImages === Infinity
    case 'analytics':
      return limits.hasAnalytics
    case 'priority_placement':
      return limits.hasPriorityPlacement
    case 'whatsapp_tools':
      return limits.hasWhatsAppIntegration
    case 'social_scheduling':
      return limits.hasSocialScheduling
    case 'priority_support':
      return limits.hasPrioritySupport
    default:
      return false
  }
}

/**
 * Format subscription status for display
 */
export function formatSubscriptionStatus(isPremium: boolean, isActive: boolean = true): {
  label: string
  color: string
  bgColor: string
} {
  if (isPremium && isActive) {
    return {
      label: 'Premium',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100'
    }
  }

  if (isPremium && !isActive) {
    return {
      label: 'Premium (Expired)',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100'
    }
  }

  return {
    label: 'Free',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100'
  }
}

/**
 * Calculate revenue impact of premium features
 */
export function calculateRevenueImpact(
  premiumCount: number,
  freeCount: number,
  monthlyPremiumPrice: number = 45
): {
  monthly_subscription_revenue: number
  projected_annual_revenue: number
  conversion_rate: number
  potential_revenue_if_10_percent_convert: number
} {
  const monthlyRevenue = premiumCount * monthlyPremiumPrice
  const totalStudios = premiumCount + freeCount
  const conversionRate = totalStudios > 0 ? (premiumCount / totalStudios) * 100 : 0

  const potentialConversions = Math.floor(freeCount * 0.1) // 10% conversion assumption
  const potentialRevenue = (premiumCount + potentialConversions) * monthlyPremiumPrice

  return {
    monthly_subscription_revenue: monthlyRevenue,
    projected_annual_revenue: monthlyRevenue * 12,
    conversion_rate: conversionRate,
    potential_revenue_if_10_percent_convert: potentialRevenue
  }
}

/**
 * Mock function to simulate premium status for development
 * Remove this in production when real subscription data is available
 */
export function mockStudioPremiumStatus(studioId: string): boolean {
  // Mock: Every 3rd studio is premium for testing
  // In production, this should query the actual subscription service
  const hash = studioId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return hash % 3 === 0
}

export {
  checkStudioPremiumStatus,
  enrichStudioWithPremiumStatus,
  enrichStudiosWithPremiumStatus,
  calculatePriorityScore,
  sortStudiosByPriority,
  filterStudiosBySubscription,
  getPremiumFeatureLimits,
  hasFeatureAccess,
  formatSubscriptionStatus,
  calculateRevenueImpact,
  mockStudioPremiumStatus
}