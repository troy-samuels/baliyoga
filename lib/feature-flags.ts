import { FeatureFlag, FeatureFlagEvaluation } from './types'

/**
 * Feature Flag System for Gradual Rollout
 * Enables safe deployment of retreat marketplace features
 */

interface FeatureFlagConfig {
  [key: string]: {
    enabled: boolean
    rolloutPercentage: number
    userSegments?: string[]
    environment?: string[]
  }
}

// Default feature flag configuration
const DEFAULT_FLAGS: FeatureFlagConfig = {
  // Phase 1: Foundation Features
  'affiliate-links': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },
  'enhanced-retreat-pages': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },
  'retreat-recommendations': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },

  // Phase 2: Content & SEO Features
  'retreat-content-hub': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },
  'email-capture-forms': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },
  'seo-enhanced-metadata': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },

  // Phase 3: Advanced Features
  'personalized-recommendations': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },
  'advanced-analytics': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  },
  'multi-partner-comparison': {
    enabled: false,
    rolloutPercentage: 0,
    environment: ['development', 'staging']
  }
}

export class FeatureFlagService {
  private flags: FeatureFlagConfig
  private environment: string

  constructor() {
    this.environment = process.env.NODE_ENV || 'development'
    this.flags = this.loadFlags()
  }

  private loadFlags(): FeatureFlagConfig {
    // In development, load from environment variables or use defaults
    const flagOverrides: Record<string, any> = {}

    // Check for environment variable overrides
    Object.keys(DEFAULT_FLAGS).forEach(flagKey => {
      const envKey = `FEATURE_FLAG_${flagKey.toUpperCase().replace(/-/g, '_')}`
      const envValue = process.env[envKey]

      if (envValue !== undefined) {
        flagOverrides[flagKey] = {
          ...DEFAULT_FLAGS[flagKey],
          enabled: envValue === 'true'
        }
      }
    })

    return { ...DEFAULT_FLAGS, ...flagOverrides } as FeatureFlagConfig
  }

  /**
   * Check if a feature flag is enabled for the current context
   */
  isEnabled(
    flagKey: string,
    userId?: string,
    sessionId?: string,
    userSegment?: string
  ): boolean {
    const flag = this.flags[flagKey]
    if (!flag) {
      console.warn(`Feature flag '${flagKey}' not found, defaulting to false`)
      return false
    }

    // Check environment restrictions
    if (flag.environment && !flag.environment.includes(this.environment)) {
      return false
    }

    // If flag is disabled globally
    if (!flag.enabled) {
      return false
    }

    // Check user segment restrictions
    if (flag.userSegments && userSegment && !flag.userSegments.includes(userSegment)) {
      return false
    }

    // Apply rollout percentage
    if (flag.rolloutPercentage < 100) {
      const hash = this.hashUserId(userId || sessionId || 'anonymous', flagKey)
      const userPercentile = hash % 100

      if (userPercentile >= flag.rolloutPercentage) {
        return false
      }
    }

    return true
  }

  /**
   * Evaluate a feature flag and return detailed information
   */
  evaluate(
    flagKey: string,
    userId?: string,
    sessionId?: string,
    userSegment?: string
  ): FeatureFlagEvaluation {
    const flag = this.flags[flagKey]
    const timestamp = new Date().toISOString()

    if (!flag) {
      return {
        flag_key: flagKey,
        enabled: false,
        user_id: userId,
        session_id: sessionId,
        evaluation_reason: 'flag_disabled',
        evaluated_at: timestamp
      }
    }

    // Check environment restrictions
    if (flag.environment && !flag.environment.includes(this.environment)) {
      return {
        flag_key: flagKey,
        enabled: false,
        user_id: userId,
        session_id: sessionId,
        evaluation_reason: 'flag_disabled',
        evaluated_at: timestamp
      }
    }

    // If flag is disabled globally
    if (!flag.enabled) {
      return {
        flag_key: flagKey,
        enabled: false,
        user_id: userId,
        session_id: sessionId,
        evaluation_reason: 'flag_disabled',
        evaluated_at: timestamp
      }
    }

    // Check user segment restrictions
    if (flag.userSegments && userSegment && !flag.userSegments.includes(userSegment)) {
      return {
        flag_key: flagKey,
        enabled: false,
        user_id: userId,
        session_id: sessionId,
        evaluation_reason: 'user_segment',
        evaluated_at: timestamp
      }
    }

    // Apply rollout percentage
    if (flag.rolloutPercentage < 100) {
      const hash = this.hashUserId(userId || sessionId || 'anonymous', flagKey)
      const userPercentile = hash % 100

      if (userPercentile >= flag.rolloutPercentage) {
        return {
          flag_key: flagKey,
          enabled: false,
          user_id: userId,
          session_id: sessionId,
          evaluation_reason: 'rollout_percentage',
          evaluated_at: timestamp
        }
      }
    }

    return {
      flag_key: flagKey,
      enabled: true,
      user_id: userId,
      session_id: sessionId,
      evaluation_reason: 'default',
      evaluated_at: timestamp
    }
  }

  /**
   * Get all feature flags and their current status
   */
  getAllFlags(userId?: string, sessionId?: string, userSegment?: string): Record<string, boolean> {
    const result: Record<string, boolean> = {}

    Object.keys(this.flags).forEach(flagKey => {
      result[flagKey] = this.isEnabled(flagKey, userId, sessionId, userSegment)
    })

    return result
  }

  /**
   * Update a feature flag configuration (for admin use)
   */
  updateFlag(flagKey: string, updates: Partial<FeatureFlagConfig[string]>): void {
    if (this.flags[flagKey]) {
      this.flags[flagKey] = { ...this.flags[flagKey], ...updates }
    } else {
      console.warn(`Attempted to update non-existent flag: ${flagKey}`)
    }
  }

  /**
   * Hash function for consistent user bucketing
   */
  private hashUserId(identifier: string, flagKey: string): number {
    const str = `${identifier}:${flagKey}`
    let hash = 0

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }

    return Math.abs(hash)
  }

  /**
   * Track feature flag usage for analytics
   */
  private trackUsage(evaluation: FeatureFlagEvaluation): void {
    // In development, log to console
    if (this.environment === 'development') {
      console.log('Feature flag evaluation:', evaluation)
    }

    // Track with analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'feature_flag_evaluation', {
        flag_key: evaluation.flag_key,
        enabled: evaluation.enabled,
        reason: evaluation.evaluation_reason,
        user_id: evaluation.user_id,
        session_id: evaluation.session_id
      })
    }
  }
}

/**
 * React hook for feature flags in components
 */
export function useFeatureFlag(
  flagKey: string,
  userId?: string,
  sessionId?: string,
  userSegment?: string
): boolean {
  // This would typically use React context and state management
  // For now, create a new instance (in production, use singleton)
  const flagService = new FeatureFlagService()
  return flagService.isEnabled(flagKey, userId, sessionId, userSegment)
}

/**
 * Utility functions for common feature flag checks
 */
export const FeatureFlags = {
  // Phase 1 flags
  isAffiliateLinksEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('affiliate-links', userId)
  },

  isEnhancedRetreatPagesEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('enhanced-retreat-pages', userId)
  },

  isRetreatRecommendationsEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('retreat-recommendations', userId)
  },

  // Phase 2 flags
  isRetreatContentHubEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('retreat-content-hub', userId)
  },

  isEmailCaptureEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('email-capture-forms', userId)
  },

  isSeoEnhancedMetadataEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('seo-enhanced-metadata', userId)
  },

  // Phase 3 flags
  isPersonalizedRecommendationsEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('personalized-recommendations', userId)
  },

  isAdvancedAnalyticsEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('advanced-analytics', userId)
  },

  isMultiPartnerComparisonEnabled: (userId?: string) => {
    const service = new FeatureFlagService()
    return service.isEnabled('multi-partner-comparison', userId)
  }
}

// Singleton instance for app-wide use
export const featureFlagService = new FeatureFlagService()

// Environment variable configuration guide for deployment
export const FEATURE_FLAG_ENV_GUIDE = `
# Feature Flag Environment Variables
# Set these in your deployment environment to control feature rollout

# Phase 1: Foundation Features
FEATURE_FLAG_AFFILIATE_LINKS=false
FEATURE_FLAG_ENHANCED_RETREAT_PAGES=false
FEATURE_FLAG_RETREAT_RECOMMENDATIONS=false

# Phase 2: Content & SEO Features
FEATURE_FLAG_RETREAT_CONTENT_HUB=false
FEATURE_FLAG_EMAIL_CAPTURE_FORMS=false
FEATURE_FLAG_SEO_ENHANCED_METADATA=false

# Phase 3: Advanced Features
FEATURE_FLAG_PERSONALIZED_RECOMMENDATIONS=false
FEATURE_FLAG_ADVANCED_ANALYTICS=false
FEATURE_FLAG_MULTI_PARTNER_COMPARISON=false

# Example: Enable affiliate links in staging
# FEATURE_FLAG_AFFILIATE_LINKS=true
`