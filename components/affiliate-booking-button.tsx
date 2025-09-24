'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, Star, Shield, Clock } from 'lucide-react'
import { RetreatBookingData } from '@/lib/types'
import { affiliateService } from '@/lib/affiliate-service'
import { FeatureFlags } from '@/lib/feature-flags'

interface AffiliateBookingButtonProps {
  retreatId: string
  partnerId: string
  partnerName?: string
  bookingUrl?: string
  price?: string
  commissionRate?: number
  availability?: 'available' | 'limited' | 'sold_out'
  specialOffers?: string[]
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  trackingData?: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
  }
}

/**
 * Affiliate Booking Button Component
 * Handles click tracking and redirects to partner booking pages
 */
export function AffiliateBookingButton({
  retreatId,
  partnerId,
  partnerName,
  bookingUrl,
  price,
  commissionRate,
  availability = 'available',
  specialOffers = [],
  className = '',
  variant = 'primary',
  size = 'md',
  trackingData = {}
}: AffiliateBookingButtonProps) {
  const [isTracking, setIsTracking] = useState(false)
  const affiliateLinksEnabled = FeatureFlags.isAffiliateLinksEnabled()

  const handleClick = async () => {
    if (!affiliateLinksEnabled) {
      // Fallback to direct URL if affiliate links are disabled
      if (bookingUrl) {
        window.open(bookingUrl, '_blank', 'noopener,noreferrer')
      }
      return
    }

    try {
      setIsTracking(true)

      const utmParams = {
        utm_source: trackingData.source || 'baliyoga',
        utm_medium: trackingData.medium || 'booking-button',
        utm_campaign: trackingData.campaign || 'retreat-marketplace',
        utm_content: trackingData.content || `${partnerId}-${availability}`
      }

      const trackingUrl = await affiliateService.trackAndRedirect(
        retreatId,
        partnerId,
        navigator.userAgent,
        document.referrer,
        utmParams
      )

      // Open in new tab
      window.open(trackingUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking affiliate click:', error)

      // Fallback to direct URL
      if (bookingUrl) {
        window.open(bookingUrl, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setIsTracking(false)
    }
  }

  const isDisabled = availability === 'sold_out' || isTracking

  // Button styling based on variant and size
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    const variantClasses = {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 disabled:bg-gray-400',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400',
      outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500 disabled:border-gray-300 disabled:text-gray-400'
    }

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`
  }

  const getAvailabilityColor = () => {
    switch (availability) {
      case 'available':
        return 'text-green-600'
      case 'limited':
        return 'text-yellow-600'
      case 'sold_out':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getAvailabilityIcon = () => {
    switch (availability) {
      case 'available':
        return <Shield className="h-4 w-4" />
      case 'limited':
        return <Clock className="h-4 w-4" />
      case 'sold_out':
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={getButtonClasses()}
      >
        {isTracking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {availability === 'sold_out' ? (
              'Sold Out'
            ) : (
              <>
                Book with {partnerName || partnerId}
                <ExternalLink className="h-4 w-4" />
              </>
            )}
          </>
        )}
      </button>

      {/* Additional information display */}
      <div className="mt-2 space-y-1">
        {/* Availability status */}
        <div className={`flex items-center gap-1 text-xs ${getAvailabilityColor()}`}>
          {getAvailabilityIcon()}
          <span>
            {availability === 'available' && 'Available now'}
            {availability === 'limited' && 'Limited availability'}
            {availability === 'sold_out' && 'Currently sold out'}
          </span>
        </div>

        {/* Price display */}
        {price && (
          <div className="text-sm font-medium text-gray-900">
            {price}
          </div>
        )}

        {/* Special offers */}
        {specialOffers.length > 0 && (
          <div className="space-y-1">
            {specialOffers.slice(0, 2).map((offer, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-emerald-600">
                <Star className="h-3 w-3 fill-current" />
                <span>{offer}</span>
              </div>
            ))}
          </div>
        )}

        {/* Commission rate (for development/testing) */}
        {process.env.NODE_ENV === 'development' && commissionRate && (
          <div className="text-xs text-gray-500">
            Commission: {(commissionRate * 100).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Multi-Partner Booking Section Component
 * Shows multiple booking options from different partners
 */
interface MultiPartnerBookingSectionProps {
  retreatId: string
  bookingOptions: RetreatBookingData[]
  loading?: boolean
  className?: string
  trackingData?: {
    source?: string
    medium?: string
    campaign?: string
  }
}

export function MultiPartnerBookingSection({
  retreatId,
  bookingOptions,
  loading = false,
  className = '',
  trackingData = {}
}: MultiPartnerBookingSectionProps) {
  const multiPartnerEnabled = FeatureFlags.isMultiPartnerComparisonEnabled()

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
                <div className="h-10 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!multiPartnerEnabled || bookingOptions.length === 0) {
    return null
  }

  // Sort by availability and then by commission rate
  const sortedOptions = [...bookingOptions].sort((a, b) => {
    const availabilityOrder = { 'available': 0, 'limited': 1, 'sold_out': 2 }
    const availabilityDiff = availabilityOrder[a.availability] - availabilityOrder[b.availability]

    if (availabilityDiff !== 0) return availabilityDiff
    return b.commission_rate - a.commission_rate
  })

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Book This Retreat ({bookingOptions.length} option{bookingOptions.length !== 1 ? 's' : ''})
      </h3>

      <div className="space-y-3">
        {sortedOptions.map((option, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 pr-4">
              <div className="font-medium text-gray-900">{option.partner_name}</div>
              <div className="text-sm text-gray-600 mb-1">{option.price_range}</div>

              {option.special_offers && option.special_offers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {option.special_offers.slice(0, 2).map((offer, offerIndex) => (
                    <span
                      key={offerIndex}
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"
                    >
                      <Star className="h-3 w-3 fill-current" />
                      {offer}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <AffiliateBookingButton
              retreatId={retreatId}
              partnerId={option.partner_name.toLowerCase().replace(/\s+/g, '')}
              partnerName={option.partner_name}
              bookingUrl={option.booking_url}
              price={option.price_range}
              commissionRate={option.commission_rate}
              availability={option.availability}
              specialOffers={option.special_offers}
              size="sm"
              variant={index === 0 ? 'primary' : 'secondary'}
              trackingData={{
                ...trackingData,
                content: `multi-partner-${index + 1}`
              }}
            />
          </div>
        ))}
      </div>

      {bookingOptions.length > 0 && (
        <div className="mt-4 pt-4 border-t text-xs text-gray-500 text-center">
          Compare prices and availability across trusted booking partners
        </div>
      )}
    </div>
  )
}

export default AffiliateBookingButton