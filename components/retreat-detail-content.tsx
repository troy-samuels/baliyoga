import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, MapPin, Phone, Globe, Calendar, Users, Star, Clock, DollarSign, Instagram, Facebook, MessageCircle, Youtube, Music } from "lucide-react"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import GoogleMapWrapper from "@/components/google-maps-wrapper"
import { WishlistHeartWrapper } from "@/components/wishlist-heart-wrapper"
import { PopularityBadge } from "@/components/popularity-badge"
import { ErrorHandledImage } from "@/components/error-handled-image"
import { StructuredData } from "@/components/structured-data"
import { HydrationSafeDate } from "@/lib/date-utils"
import type { Retreat } from "@/lib/types"

interface RetreatDetailContentProps {
  retreat: Retreat
}

export function RetreatDetailContent({ retreat }: RetreatDetailContentProps) {
  const wishlistItem = {
    id: retreat.id,
    name: retreat.name,
    slug: retreat.slug,
    image: retreat.image,
    location: retreat.location,
    rating: retreat.rating,
    type: 'retreat' as const,
    duration: retreat.duration,
    price: retreat.price,
    phone_number: retreat.phone_number,
    website: retreat.website,
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <StructuredData item={retreat} type="retreat" />
      <MobileOptimizedHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-4 safe-left safe-right xs:py-6 sm:py-8 md:px-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            href="/retreats" 
            className="inline-flex items-center gap-2 text-sm text-[#5d4c42] hover:text-[#a39188] transition-colors touch-manipulation"
            aria-label="Back to retreats"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Retreats
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#e6ceb3] mb-6">
              {retreat.image && (
                <ErrorHandledImage
                  src={retreat.image}
                  alt={`${retreat.name} yoga retreat in ${retreat.location}`}
                  width={800}
                  height={450}
                  className="object-cover w-full h-full"
                />
              )}
              
              {/* Overlay with badges */}
              <div className="absolute top-4 left-4 z-10">
                <PopularityBadge itemId={retreat.id} />
              </div>
              
              <div className="absolute top-4 right-4 z-10">
                <WishlistHeartWrapper item={retreat} />
              </div>
            </div>

            {/* Retreat Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#5d4c42] mb-2 xs:text-3xl sm:text-4xl">
                {retreat.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-[#5d4c42]/80">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{retreat.location}, Bali</span>
                </div>
                
                {retreat.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{retreat.rating.toFixed(1)}</span>
                    <span>({retreat.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Duration and Price */}
              <div className="flex flex-wrap gap-4 mb-4">
                {retreat.duration && (
                  <div className="flex items-center gap-2 rounded-full bg-[#e6ceb3] px-3 py-1">
                    <Calendar className="w-4 h-4 text-[#5d4c42]" />
                    <span className="text-sm font-medium text-[#5d4c42]">{retreat.duration}</span>
                  </div>
                )}
                
                {retreat.price && (
                  <div className="flex items-center gap-2 rounded-full bg-[#a39188] px-3 py-1">
                    <DollarSign className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{retreat.price}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {retreat.business_description && (
                <div className="prose prose-sm max-w-none text-[#5d4c42] mb-6">
                  <p>{retreat.business_description}</p>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {retreat.images && Array.isArray(retreat.images) && retreat.images.length > 1 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {retreat.images.slice(1, 7).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-[#e6ceb3]">
                      <ErrorHandledImage
                        src={image}
                        alt={`${retreat.name} image ${index + 2}`}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Level Requirements */}
            {retreat.level_requirements && retreat.level_requirements.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Level Requirements</h2>
                <div className="flex flex-wrap gap-2">
                  {retreat.level_requirements.map((level, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm text-[#5d4c42]"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {retreat.accommodation_type && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e6ceb3]/20">
                    <div className="w-8 h-8 rounded-full bg-[#e6ceb3] flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#5d4c42]" />
                    </div>
                    <div>
                      <div className="font-medium text-[#5d4c42]">Accommodation</div>
                      <div className="text-sm text-[#5d4c42]/70">{retreat.accommodation_type}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e6ceb3]/20">
                  <div className="w-8 h-8 rounded-full bg-[#e6ceb3] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#5d4c42]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#5d4c42]">Meals</div>
                    <div className="text-sm text-[#5d4c42]/70">
                      {retreat.meals_included ? 'Included' : 'Not included'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e6ceb3]/20">
                  <div className="w-8 h-8 rounded-full bg-[#e6ceb3] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#5d4c42]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#5d4c42]">Transportation</div>
                    <div className="text-sm text-[#5d4c42]/70">
                      {retreat.transportation_included ? 'Included' : 'Not included'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e6ceb3]/20">
                  <div className="w-8 h-8 rounded-full bg-[#e6ceb3] flex items-center justify-center">
                    <Star className="w-4 h-4 text-[#5d4c42]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#5d4c42]">Certification</div>
                    <div className="text-sm text-[#5d4c42]/70">
                      {retreat.certification_offered ? 'Available' : 'Not offered'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Info */}
              <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                <h3 className="text-lg font-semibold text-[#5d4c42] mb-4">Quick Info</h3>
                
                <div className="space-y-3">
                  {retreat.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#a39188] flex-shrink-0" />
                      <div>
                        <span className="text-sm text-[#5d4c42]/70">Duration:</span>
                        <span className="ml-1 font-medium text-[#5d4c42]">{retreat.duration}</span>
                      </div>
                    </div>
                  )}
                  
                  {retreat.max_participants && (
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-[#a39188] flex-shrink-0" />
                      <div>
                        <span className="text-sm text-[#5d4c42]/70">Max Participants:</span>
                        <span className="ml-1 font-medium text-[#5d4c42]">{retreat.max_participants}</span>
                      </div>
                    </div>
                  )}
                  
                  {(retreat.start_date || retreat.end_date) && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#a39188] flex-shrink-0" />
                      <div>
                        <span className="text-sm text-[#5d4c42]/70">Dates:</span>
                        <div className="text-sm text-[#5d4c42]">
                          <HydrationSafeDate date={retreat.start_date} />
                          {retreat.start_date && retreat.end_date && ' - '}
                          <HydrationSafeDate date={retreat.end_date} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                <h3 className="text-lg font-semibold text-[#5d4c42] mb-4">Contact Information</h3>
                
                <div className="space-y-3">
                  {retreat.location_details.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#a39188] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#5d4c42]">{retreat.location_details.address}</span>
                    </div>
                  )}
                  
                  {retreat.phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#a39188] flex-shrink-0" />
                      <a 
                        href={`tel:${retreat.phone_number}`}
                        className="text-sm text-[#5d4c42] hover:text-[#a39188] transition-colors"
                      >
                        {retreat.phone_number}
                      </a>
                    </div>
                  )}
                  
                  {retreat.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-[#a39188] flex-shrink-0" />
                      <a 
                        href={retreat.website}
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

              {/* Social Media */}
              {(retreat.instagram_url || retreat.facebook_url || retreat.youtube_url || retreat.tiktok_url || retreat.whatsapp_number) && (
                <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-4">Connect</h3>

                  <div className="grid grid-cols-2 gap-3">
                    {retreat.instagram_url && (
                      <a
                        href={retreat.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-md transition-all touch-manipulation min-h-[44px]"
                        aria-label={`Follow ${retreat.name} on Instagram`}
                      >
                        <Instagram className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium">Instagram</div>
                          {retreat.instagram_handle && (
                            <div className="text-xs opacity-90 truncate">
                              {retreat.instagram_handle.startsWith('@') ? retreat.instagram_handle : `@${retreat.instagram_handle}`}
                            </div>
                          )}
                        </div>
                      </a>
                    )}

                    {retreat.facebook_url && (
                      <a
                        href={retreat.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg bg-[#1877F2] text-white hover:shadow-md transition-all touch-manipulation min-h-[44px]"
                        aria-label={`Follow ${retreat.name} on Facebook`}
                      >
                        <Facebook className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium">Facebook</div>
                          <div className="text-xs opacity-90">Follow us</div>
                        </div>
                      </a>
                    )}

                    {retreat.whatsapp_number && (
                      <a
                        href={`https://wa.me/${retreat.whatsapp_number.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg bg-[#25D366] text-white hover:shadow-md transition-all touch-manipulation min-h-[44px]"
                        aria-label={`Message ${retreat.name} on WhatsApp`}
                      >
                        <MessageCircle className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium">WhatsApp</div>
                          <div className="text-xs opacity-90">Chat now</div>
                        </div>
                      </a>
                    )}

                    {retreat.youtube_url && (
                      <a
                        href={retreat.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg bg-[#FF0000] text-white hover:shadow-md transition-all touch-manipulation min-h-[44px]"
                        aria-label={`Watch ${retreat.name} on YouTube`}
                      >
                        <Youtube className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium">YouTube</div>
                          <div className="text-xs opacity-90">Watch videos</div>
                        </div>
                      </a>
                    )}

                    {retreat.tiktok_url && (
                      <a
                        href={retreat.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg bg-black text-white hover:shadow-md transition-all touch-manipulation min-h-[44px]"
                        aria-label={`Follow ${retreat.name} on TikTok`}
                      >
                        <Music className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium">TikTok</div>
                          <div className="text-xs opacity-90">Follow</div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing */}
              {retreat.price && (
                <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-4">Pricing</h3>
                  
                  <div className="text-center p-4 bg-[#f2e8dc] rounded-lg">
                    <div className="text-2xl font-bold text-[#5d4c42] mb-1">{retreat.price}</div>
                    <div className="text-sm text-[#5d4c42]/70">
                      {retreat.duration && `for ${retreat.duration}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="rounded-xl bg-white p-4 shadow-sm border border-[#e6ceb3]/20">
                <GoogleMapWrapper
                  address={retreat.location_details?.address || ''}
                  name={retreat.name}
                  city={retreat.location}
                  id={retreat.id}
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