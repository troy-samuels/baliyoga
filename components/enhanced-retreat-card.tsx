'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Users, ExternalLink, Sparkles } from 'lucide-react'
import { RetreatCardProps, RetreatBookingData, EnhancedRetreat } from '@/lib/types'
import { affiliateService } from '@/lib/affiliate-service'
import { FeatureFlags } from '@/lib/feature-flags'

interface EnhancedRetreatCardProps extends RetreatCardProps {
  enhanced?: boolean
  showBookingOptions?: boolean
  affiliateEnabled?: boolean
}

/**
 * Enhanced Retreat Card Component for Affiliate Marketplace
 * Features affiliate booking options, enhanced visuals, and conversion optimization
 */
export function EnhancedRetreatCard({
  id,
  name,
  slug,
  image,
  location,
  rating,
  reviewCount,
  duration,
  price,
  phone_number,
  website,
  featured,
  className = '',
  enhanced = false,
  showBookingOptions = false,
  affiliateEnabled = false,
  onClick
}: EnhancedRetreatCardProps) {
  const [bookingOptions, setBookingOptions] = useState<RetreatBookingData[]>([])
  const [loadingBookingOptions, setLoadingBookingOptions] = useState(false)
  const [showAllOptions, setShowAllOptions] = useState(false)

  // Feature flag checks
  const affiliateLinksEnabled = FeatureFlags.isAffiliateLinksEnabled()
  const enhancedPagesEnabled = FeatureFlags.isEnhancedRetreatPagesEnabled()

  useEffect(() => {
    if (showBookingOptions && affiliateEnabled && affiliateLinksEnabled) {
      loadBookingOptions()
    }
  }, [showBookingOptions, affiliateEnabled, affiliateLinksEnabled, id])

  const loadBookingOptions = async () => {
    try {
      setLoadingBookingOptions(true)
      const options = await affiliateService.getRetreatBookingOptions(id)
      setBookingOptions(options)
    } catch (error) {
      console.error('Error loading booking options:', error)
    } finally {
      setLoadingBookingOptions(false)
    }
  }

  const handleAffiliateClick = async (partnerId: string, retreatId: string) => {
    try {
      const trackingUrl = await affiliateService.trackAndRedirect(
        retreatId,
        partnerId,
        navigator.userAgent,
        document.referrer,
        {
          utm_source: 'baliyoga',
          utm_medium: 'retreat-card',
          utm_campaign: 'enhanced-marketplace'
        }
      )

      // Open in new tab
      window.open(trackingUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking affiliate click:', error)
    }
  }

  const displayedOptions = showAllOptions ? bookingOptions : bookingOptions.slice(0, 2)

  return (
    <div className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Enhanced visual treatment for premium features */}
      {enhanced && enhancedPagesEnabled && (
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            Enhanced
          </div>
        </div>
      )}

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        </div>
      )}

      {/* Retreat Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
            <div className="text-emerald-600 text-6xl opacity-20">🧘‍♀️</div>
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            <Link href={`/retreats/${slug}`} className="hover:underline">
              {name}
            </Link>
          </h3>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>{location}</span>
            </div>

            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
                <span className="text-gray-400">({reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Retreat Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {duration && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          {price && (
            <div className="text-right">
              <div className="text-lg font-semibold text-emerald-700">{price}</div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
          )}
        </div>

        {/* Enhanced booking options section */}
        {showBookingOptions && affiliateEnabled && affiliateLinksEnabled && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Booking Options</h4>

            {loadingBookingOptions ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : bookingOptions.length > 0 ? (
              <div className="space-y-2">
                {displayedOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{option.partner_name}</div>
                      <div className="text-xs text-gray-600">{option.price_range}</div>
                      {option.special_offers && option.special_offers.length > 0 && (
                        <div className="text-xs text-emerald-600 mt-1">
                          {option.special_offers[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs ${
                        option.availability === 'available' ? 'bg-green-100 text-green-800' :
                        option.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {option.availability === 'available' ? 'Available' :
                         option.availability === 'limited' ? 'Limited' : 'Sold Out'}
                      </div>

                      <button
                        onClick={() => handleAffiliateClick(option.partner_name.toLowerCase().replace(' ', ''), id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
                        disabled={option.availability === 'sold_out'}
                      >
                        Book
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {bookingOptions.length > 2 && !showAllOptions && (
                  <button
                    onClick={() => setShowAllOptions(true)}
                    className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2"
                  >
                    Show {bookingOptions.length - 2} more option{bookingOptions.length - 2 !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 py-4 text-center">
                Booking options not available
              </div>
            )}
          </div>
        )}

        {/* Traditional contact options (fallback) */}
        {(!showBookingOptions || !affiliateLinksEnabled) && (
          <div className="flex gap-3">
            {website && (
              <Link
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Visit Website
              </Link>
            )}

            {phone_number && (
              <Link
                href={`tel:${phone_number}`}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Call
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Enhanced Retreat List Component
 * Displays multiple retreat cards with filtering and sorting
 */
interface EnhancedRetreatListProps {
  retreats: RetreatCardProps[]
  loading?: boolean
  enhanced?: boolean
  affiliateEnabled?: boolean
  className?: string
}

export function EnhancedRetreatList({
  retreats,
  loading = false,
  enhanced = false,
  affiliateEnabled = false,
  className = ''
}: EnhancedRetreatListProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (retreats.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 opacity-20">🧘‍♀️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No retreats found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or browse all retreats.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {retreats.map((retreat) => (
        <EnhancedRetreatCard
          key={retreat.id}
          {...retreat}
          enhanced={enhanced}
          showBookingOptions={affiliateEnabled}
          affiliateEnabled={affiliateEnabled}
        />
      ))}
    </div>
  )
}

export default EnhancedRetreatCard