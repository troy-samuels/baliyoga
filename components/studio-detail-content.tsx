import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, MapPin, Phone, Globe, Clock, Users, Star } from "lucide-react"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import GoogleMapWrapper from "@/components/google-maps-wrapper"
import { WishlistHeartWrapper } from "@/components/wishlist-heart-wrapper"
import { PopularityBadge } from "@/components/popularity-badge"
import { ErrorHandledImage } from "@/components/error-handled-image"
import type { Studio } from "@/lib/types"

interface StudioDetailContentProps {
  studio: Studio
}

export function StudioDetailContent({ studio }: StudioDetailContentProps) {
  const wishlistItem = {
    id: studio.id,
    name: studio.name,
    slug: studio.slug,
    image: studio.image,
    location: studio.location,
    rating: studio.rating,
    type: 'studio' as const,
    styles: studio.styles,
    phone_number: studio.phone_number,
    website: studio.website,
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-4 safe-left safe-right xs:py-6 sm:py-8 md:px-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            href="/studios" 
            className="inline-flex items-center gap-2 text-sm text-[#5d4c42] hover:text-[#a39188] transition-colors touch-manipulation"
            aria-label="Back to studios"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Studios
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#e6ceb3] mb-6">
              {studio.image && (
                <ErrorHandledImage
                  src={studio.image}
                  alt={`${studio.name} yoga studio in ${studio.location}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
                />
              )}
              
              {/* Overlay with badges */}
              <div className="absolute top-4 left-4 z-10">
                <PopularityBadge itemId={studio.id} />
              </div>
              
              <div className="absolute top-4 right-4 z-10">
                <WishlistHeartWrapper item={wishlistItem} />
              </div>
            </div>

            {/* Studio Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#5d4c42] mb-2 xs:text-3xl sm:text-4xl">
                {studio.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-[#5d4c42]/80">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{studio.location}, Bali</span>
                </div>
                
                {studio.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{studio.rating.toFixed(1)}</span>
                    <span>({studio.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Yoga Styles */}
              {studio.styles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {studio.styles.map((style, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[#a39188] px-3 py-1 text-xs text-white font-medium"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {studio.business_description && (
                <div className="prose prose-sm max-w-none text-[#5d4c42] mb-6">
                  <p>{studio.business_description}</p>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {studio.images && Array.isArray(studio.images) && studio.images.length > 1 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {studio.images.slice(1, 7).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-[#e6ceb3]">
                      <ErrorHandledImage
                        src={image}
                        alt={`${studio.name} image ${index + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {studio.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {studio.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#a39188]" />
                      <span className="text-sm text-[#5d4c42]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {studio.languages_spoken.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Languages Spoken</h2>
                <div className="flex flex-wrap gap-2">
                  {studio.languages_spoken.map((language, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm text-[#5d4c42]"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Contact Information */}
              <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                <h3 className="text-lg font-semibold text-[#5d4c42] mb-4">Contact Information</h3>
                
                <div className="space-y-3">
                  {studio.location_details.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#a39188] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#5d4c42]">{studio.location_details.address}</span>
                    </div>
                  )}
                  
                  {studio.phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#a39188] flex-shrink-0" />
                      <a 
                        href={`tel:${studio.phone_number}`}
                        className="text-sm text-[#5d4c42] hover:text-[#a39188] transition-colors"
                      >
                        {studio.phone_number}
                      </a>
                    </div>
                  )}
                  
                  {studio.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-[#a39188] flex-shrink-0" />
                      <a 
                        href={studio.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#5d4c42] hover:text-[#a39188] transition-colors truncate"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              {(studio.drop_in_price_usd || studio.price_range) && (
                <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-4">Pricing</h3>
                  
                  {studio.drop_in_price_usd && (
                    <div className="mb-2">
                      <span className="text-sm text-[#5d4c42]/70">Drop-in Class:</span>
                      <span className="ml-2 font-semibold text-[#5d4c42]">
                        ${studio.drop_in_price_usd} USD
                      </span>
                    </div>
                  )}
                  
                  {studio.price_range && (
                    <div>
                      <span className="text-sm text-[#5d4c42]/70">Price Range:</span>
                      <span className="ml-2 font-semibold text-[#5d4c42]">
                        {studio.price_range}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Opening Hours */}
              {studio.opening_hours && Array.isArray(studio.opening_hours) && studio.opening_hours.length > 0 && (
                <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Opening Hours
                  </h3>
                  
                  <div className="space-y-2">
                    {studio.opening_hours.map((hours, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-[#5d4c42]/70 capitalize">{hours.day}</span>
                        <span className="text-[#5d4c42]">
                          {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                <GoogleMapWrapper
                  address={studio.location_details.address}
                  name={studio.name}
                  city={studio.location}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <MobileOptimizedFooter />
    </div>
  )
}