import {
  AffiliatePartner,
  AffiliateClick,
  AffiliateConversion,
  AffiliateLink,
  EnhancedRetreat,
  RetreatBookingData,
  AttributionTouchpoint
} from './types'

/**
 * Core Affiliate Service for Retreat Marketplace Transformation
 * Handles tracking, attribution, and partner integrations
 */

export class AffiliateTrackingService {
  private readonly baseUrl: string
  private readonly trackingDomain: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baliyoga.com'
    this.trackingDomain = process.env.AFFILIATE_TRACKING_DOMAIN || 'track.baliyoga.com'
  }

  /**
   * Generate affiliate tracking URL with UTM parameters
   */
  generateTrackingUrl(
    retreatId: string,
    partnerId: string,
    source?: string,
    medium?: string,
    campaign?: string
  ): string {
    const baseTrackingUrl = `${this.baseUrl}/track/${partnerId}/${retreatId}`
    const utmParams = new URLSearchParams()

    // Core UTM parameters
    utmParams.set('utm_source', source || 'baliyoga')
    utmParams.set('utm_medium', medium || 'affiliate')
    utmParams.set('utm_campaign', campaign || 'retreat-marketplace')

    // Internal tracking
    utmParams.set('ref', partnerId)
    utmParams.set('retreat_id', retreatId)
    utmParams.set('timestamp', Date.now().toString())

    return `${baseTrackingUrl}?${utmParams.toString()}`
  }

  /**
   * Track affiliate click event
   */
  async trackClick(clickData: Omit<AffiliateClick, 'id' | 'clicked_at'>): Promise<void> {
    try {
      // In production, this would save to database
      // For development, we'll use localStorage/analytics

      const clickEvent = {
        ...clickData,
        id: crypto.randomUUID(),
        clicked_at: new Date().toISOString()
      }

      // Track with analytics service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'affiliate_click', {
          partner_id: clickData.affiliate_partner_id,
          retreat_id: clickData.retreat_id,
          utm_source: clickData.utm_source,
          utm_medium: clickData.utm_medium,
          utm_campaign: clickData.utm_campaign
        })
      }

      // Store for development/testing
      if (typeof window !== 'undefined') {
        const existingClicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]')
        existingClicks.push(clickEvent)
        localStorage.setItem('affiliate_clicks', JSON.stringify(existingClicks))
      }

      console.log('Affiliate click tracked:', clickEvent)
    } catch (error) {
      console.error('Error tracking affiliate click:', error)
    }
  }

  /**
   * Track conversion event (booking, inquiry, etc.)
   */
  async trackConversion(conversionData: Omit<AffiliateConversion, 'id' | 'converted_at'>): Promise<void> {
    try {
      const conversionEvent = {
        ...conversionData,
        id: crypto.randomUUID(),
        converted_at: new Date().toISOString()
      }

      // Track with analytics service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: conversionEvent.id,
          value: conversionData.conversion_value,
          currency: conversionData.currency,
          items: [{
            item_id: conversionData.retreat_id,
            item_name: `Retreat Booking`,
            category: 'retreat',
            quantity: conversionData.participants_count || 1,
            price: conversionData.conversion_value
          }]
        })
      }

      // Store for development/testing
      if (typeof window !== 'undefined') {
        const existingConversions = JSON.parse(localStorage.getItem('affiliate_conversions') || '[]')
        existingConversions.push(conversionEvent)
        localStorage.setItem('affiliate_conversions', JSON.stringify(existingConversions))
      }

      console.log('Affiliate conversion tracked:', conversionEvent)
    } catch (error) {
      console.error('Error tracking affiliate conversion:', error)
    }
  }

  /**
   * Get affiliate link data for a retreat
   */
  async getAffiliateLinks(retreatId: string): Promise<AffiliateLink[]> {
    // Mock data for development - in production this would query the database
    return [
      {
        retreat_id: retreatId,
        partner_id: 'bookretreats',
        tracking_url: this.generateTrackingUrl(retreatId, 'bookretreats'),
        utm_parameters: {
          utm_source: 'baliyoga',
          utm_medium: 'affiliate',
          utm_campaign: 'retreat-marketplace'
        },
        click_count: 0,
        conversion_count: 0,
        revenue_generated: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  /**
   * Calculate revenue attribution across touchpoints
   */
  calculateTimeDecayAttribution(
    touchpoints: AttributionTouchpoint[],
    conversionValue: number,
    halfLifeDays: number = 7
  ): { touchpoint_id: string; attributed_value: number; attribution_percentage: number }[] {
    const halfLifeMs = halfLifeDays * 24 * 60 * 60 * 1000
    const conversionTime = Date.now()

    const weightedTouchpoints = touchpoints.map(touchpoint => {
      const timeDiff = conversionTime - new Date(touchpoint.timestamp).getTime()
      const decayFactor = Math.pow(0.5, timeDiff / halfLifeMs)

      return {
        touchpoint_id: touchpoint.id,
        channel: touchpoint.channel,
        weight: decayFactor
      }
    })

    const totalWeight = weightedTouchpoints.reduce((sum, tp) => sum + tp.weight, 0)

    return weightedTouchpoints.map(tp => ({
      touchpoint_id: tp.touchpoint_id,
      attributed_value: (tp.weight / totalWeight) * conversionValue,
      attribution_percentage: (tp.weight / totalWeight) * 100
    }))
  }
}

/**
 * Specific affiliate partner integrations
 */

export class BookRetreatsIntegration {
  private readonly affiliateId: string
  private readonly trackingDomain: string

  constructor() {
    this.affiliateId = process.env.BOOKRETREATS_AFFILIATE_ID || 'test_affiliate_id'
    this.trackingDomain = 'bookretreats.com'
  }

  generateBookingUrl(retreatId: string, utmParams?: Record<string, string>): string {
    const baseUrl = `https://bookretreats.com/retreat/${retreatId}`
    const params = new URLSearchParams()

    params.set('affiliate', this.affiliateId)
    params.set('ref', 'baliyoga')

    // Add UTM parameters
    if (utmParams) {
      Object.entries(utmParams).forEach(([key, value]) => {
        params.set(key, value)
      })
    }

    return `${baseUrl}?${params.toString()}`
  }

  async getRetreatData(retreatId: string): Promise<RetreatBookingData | null> {
    try {
      // Mock data for development - in production this would call BookRetreats API
      return {
        retreat_id: retreatId,
        partner_name: 'BookRetreats',
        booking_url: this.generateBookingUrl(retreatId),
        price_range: '$800 - $2,400',
        availability: 'available',
        commission_rate: 0.12, // 12% commission
        special_offers: ['Early Bird 15% Off', 'Group Discount Available'],
        last_updated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching BookRetreats data:', error)
      return null
    }
  }
}

export class TripaneerIntegration {
  private readonly partnerId: string
  private readonly apiKey: string

  constructor() {
    this.partnerId = process.env.TRIPANEER_PARTNER_ID || 'test_partner_id'
    this.apiKey = process.env.TRIPANEER_API_KEY || 'test_api_key'
  }

  generateBookingUrl(retreatId: string, utmParams?: Record<string, string>): string {
    const baseUrl = `https://www.tripaneer.com/yoga-retreats/${retreatId}`
    const params = new URLSearchParams()

    params.set('partner', this.partnerId)
    params.set('ref', 'baliyoga')

    if (utmParams) {
      Object.entries(utmParams).forEach(([key, value]) => {
        params.set(key, value)
      })
    }

    return `${baseUrl}?${params.toString()}`
  }

  async getRetreatData(retreatId: string): Promise<RetreatBookingData | null> {
    try {
      // Mock data for development
      return {
        retreat_id: retreatId,
        partner_name: 'Tripaneer',
        booking_url: this.generateBookingUrl(retreatId),
        price_range: '$600 - $3,200',
        availability: 'limited',
        commission_rate: 0.35, // 35% commission
        special_offers: ['Payment Plan Available', 'Free Cancellation'],
        last_updated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching Tripaneer data:', error)
      return null
    }
  }
}

export class RetreatGuruIntegration {
  private readonly affiliateToken: string

  constructor() {
    this.affiliateToken = process.env.RETREATGURU_AFFILIATE_TOKEN || 'test_token'
  }

  generateBookingUrl(retreatId: string, utmParams?: Record<string, string>): string {
    const baseUrl = `https://retreatguru.com/retreat/${retreatId}`
    const params = new URLSearchParams()

    params.set('affiliate_token', this.affiliateToken)
    params.set('source', 'baliyoga')

    if (utmParams) {
      Object.entries(utmParams).forEach(([key, value]) => {
        params.set(key, value)
      })
    }

    return `${baseUrl}?${params.toString()}`
  }

  async getRetreatData(retreatId: string): Promise<RetreatBookingData | null> {
    try {
      // Mock data for development
      return {
        retreat_id: retreatId,
        partner_name: 'RetreatGuru',
        booking_url: this.generateBookingUrl(retreatId),
        price_range: '$1,200 - $4,000',
        availability: 'available',
        commission_rate: 0.14, // 14% commission
        special_offers: ['Luxury Accommodations', 'All Meals Included'],
        last_updated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching RetreatGuru data:', error)
      return null
    }
  }
}

/**
 * Main affiliate service that orchestrates all partner integrations
 */
export class AffiliateIntegrationService {
  private trackingService: AffiliateTrackingService
  private bookRetreats: BookRetreatsIntegration
  private tripaneer: TripaneerIntegration
  private retreatGuru: RetreatGuruIntegration

  constructor() {
    this.trackingService = new AffiliateTrackingService()
    this.bookRetreats = new BookRetreatsIntegration()
    this.tripaneer = new TripaneerIntegration()
    this.retreatGuru = new RetreatGuruIntegration()
  }

  /**
   * Get all available booking options for a retreat
   */
  async getRetreatBookingOptions(retreatId: string): Promise<RetreatBookingData[]> {
    const options = await Promise.allSettled([
      this.bookRetreats.getRetreatData(retreatId),
      this.tripaneer.getRetreatData(retreatId),
      this.retreatGuru.getRetreatData(retreatId)
    ])

    return options
      .filter((result): result is PromiseFulfilledResult<RetreatBookingData> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
  }

  /**
   * Track click and generate appropriate affiliate URL
   */
  async trackAndRedirect(
    retreatId: string,
    partnerId: string,
    userAgent?: string,
    referrer?: string,
    utmParams?: Record<string, string>
  ): Promise<string> {
    // Track the click
    await this.trackingService.trackClick({
      affiliate_partner_id: partnerId,
      retreat_id: retreatId,
      referrer_url: referrer,
      user_agent: userAgent,
      utm_source: utmParams?.utm_source,
      utm_medium: utmParams?.utm_medium,
      utm_campaign: utmParams?.utm_campaign,
      utm_content: utmParams?.utm_content,
      utm_term: utmParams?.utm_term
    })

    // Generate appropriate booking URL based on partner
    switch (partnerId) {
      case 'bookretreats':
        return this.bookRetreats.generateBookingUrl(retreatId, utmParams)
      case 'tripaneer':
        return this.tripaneer.generateBookingUrl(retreatId, utmParams)
      case 'retreatguru':
        return this.retreatGuru.generateBookingUrl(retreatId, utmParams)
      default:
        throw new Error(`Unknown affiliate partner: ${partnerId}`)
    }
  }

  /**
   * Get tracking service for direct access
   */
  getTrackingService(): AffiliateTrackingService {
    return this.trackingService
  }
}

// Singleton instance for app-wide use
export const affiliateService = new AffiliateIntegrationService()