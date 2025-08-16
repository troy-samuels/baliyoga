import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Clock, Users, Camera, Waves, Mountain, Sun, Leaf } from "lucide-react"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getSupabaseStudios, getSupabaseRetreats } from "@/lib/supabase-data-utils"
import { LazySection } from "@/components/lazy-section"
import { PopularitySortedGrid } from "@/components/popularity-sorted-grid"
import { PopularityDemo } from "@/components/popularity-demo"
import { 
  getLocationInfo, 
  POPULAR_LOCATIONS 
} from "@/lib/location-data"
import { generateColorFallback } from "@/lib/image-fallback"
import type { Studio, Retreat } from "@/lib/data-utils"

interface LocationPageProps {
  params: Promise<{
    location: string
  }>
}

export async function generateStaticParams() {
  // Generate params for all popular locations
  return POPULAR_LOCATIONS.map(location => ({ location }))
}

export async function generateMetadata({ params }: LocationPageProps) {
  const { location } = await params
  const locationInfo = getLocationInfo(location)
  
  if (!locationInfo) {
    return {
      title: "Location not found",
      description: "The requested location could not be found.",
    }
  }
  
  return {
    title: `Yoga in ${locationInfo.displayName}, Bali | Studios & Retreats | Bali Yoga`,
    description: `${locationInfo.description} Discover the best yoga studios and retreats in ${locationInfo.displayName}, Bali.`,
    keywords: `yoga ${locationInfo.displayName}, ${locationInfo.displayName} yoga studios, ${locationInfo.displayName} retreats, Bali yoga, ${locationInfo.bestFor.join(', ')}`,
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { location } = await params
  const locationInfo = getLocationInfo(location)
  
  if (!locationInfo) {
    notFound()
  }
  
  // Get studios and retreats data
  const [allStudios, allRetreats] = await Promise.all([
    getSupabaseStudios(),
    getSupabaseRetreats()
  ])
  
  // Filter by location slug
  const locationStudios = allStudios.filter((studio: Studio) => 
    studio.locationSlug === location
  )
  
  const locationRetreats = allRetreats.filter((retreat: Retreat) => 
    retreat.locationSlug === location
  )
  
  // Get top-rated items for highlights
  const topStudios = locationStudios
    .filter(s => s.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map(studio => ({ ...studio, type: 'studio' as const }))
    
  const topRetreats = locationRetreats
    .filter(r => r.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map(retreat => ({ ...retreat, type: 'retreat' as const }))
  
  // Calculate location stats
  const avgStudioRating = locationStudios.length > 0 
    ? (locationStudios.reduce((sum, s) => sum + s.rating, 0) / locationStudios.length).toFixed(1)
    : 0
    
  const avgRetreatRating = locationRetreats.length > 0 
    ? (locationRetreats.reduce((sum, r) => sum + r.rating, 0) / locationRetreats.length).toFixed(1)
    : 0
    
  const totalReviews = [...locationStudios, ...locationRetreats]
    .reduce((sum, item) => sum + (item.reviewCount || 0), 0)

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />

      {/* Hero Section */}
      <div className="relative bg-[#e6ceb3] py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5d4c42]/20 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-[#5d4c42] sm:text-5xl md:text-6xl">
                  Yoga in {locationInfo.displayName}
                  <span className="block text-2xl font-normal text-[#5d4c42]/80 sm:text-3xl mt-2">
                    Bali, Indonesia
                  </span>
                </h1>
                <p className="mt-4 text-lg text-[#5d4c42]/80 leading-relaxed">
                  {locationInfo.description}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#5d4c42]">{locationStudios.length}</div>
                  <div className="text-sm text-[#5d4c42]/70">Studios</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#5d4c42]">{locationRetreats.length}</div>
                  <div className="text-sm text-[#5d4c42]/70">Retreats</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#5d4c42]">{avgStudioRating || avgRetreatRating}</div>
                  <div className="text-sm text-[#5d4c42]/70">Avg Rating</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#5d4c42]">{totalReviews}</div>
                  <div className="text-sm text-[#5d4c42]/70">Reviews</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {locationStudios.length > 0 && (
                  <Link
                    href={`/studios/${location}`}
                    className="bg-[#5d4c42] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a39188] transition-colors text-center"
                  >
                    View Studios ({locationStudios.length})
                  </Link>
                )}
                {locationRetreats.length > 0 && (
                  <Link
                    href={`/retreats/${location}`}
                    className="border-2 border-[#5d4c42] text-[#5d4c42] px-8 py-3 rounded-lg font-semibold hover:bg-[#5d4c42] hover:text-white transition-colors text-center"
                  >
                    View Retreats ({locationRetreats.length})
                  </Link>
                )}
              </div>
            </div>

            {/* Location Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                <div 
                  className="w-full h-full bg-gradient-to-br from-[#e6ceb3] to-[#a39188] flex items-center justify-center"
                  style={{
                    backgroundImage: `url("${generateColorFallback(600, 450, '#e6ceb3')}")`
                  }}
                >
                  <div className="text-center text-[#5d4c42]">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-60" />
                    <p className="text-lg font-medium">{locationInfo.displayName}</p>
                    <p className="text-sm opacity-70">Beautiful Bali Location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Highlights */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-3xl font-bold text-[#5d4c42] text-center mb-12">
            Why Practice Yoga in {locationInfo.displayName}?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locationInfo.highlights.map((highlight, index) => {
              const icons = [Leaf, Mountain, Sun, Waves, Star, Users]
              const Icon = icons[index % icons.length]
              
              return (
                <div key={index} className="text-center p-6 rounded-lg bg-[#f9f3e9] border border-[#e6ceb3]">
                  <Icon className="w-12 h-12 text-[#5d4c42] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">{highlight}</h3>
                </div>
              )
            })}
          </div>

          {/* Location Details */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#f9f3e9] rounded-lg p-6 border border-[#e6ceb3]">
              <h3 className="text-xl font-semibold text-[#5d4c42] mb-4">Location Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#5d4c42]" />
                  <span className="text-[#5d4c42]/80">{locationInfo.atmosphere}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#5d4c42]" />
                  <span className="text-[#5d4c42]/80">{locationInfo.crowdLevel} area</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-[#5d4c42]" />
                  <span className="text-[#5d4c42]/80">{locationInfo.priceRange} price range</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f9f3e9] rounded-lg p-6 border border-[#e6ceb3]">
              <h3 className="text-xl font-semibold text-[#5d4c42] mb-4">Perfect For</h3>
              <div className="flex flex-wrap gap-2">
                {locationInfo.bestFor.map((item, index) => (
                  <span 
                    key={index}
                    className="bg-[#e6ceb3] text-[#5d4c42] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Studios Section */}
      {topStudios.length > 0 && (
        <div className="py-16 bg-[#f9f3e9]">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#5d4c42]">
                Top Yoga Studios in {locationInfo.displayName}
              </h2>
              <Link 
                href={`/studios/${location}`}
                className="text-[#5d4c42] hover:text-[#a39188] font-medium"
              >
                View All Studios →
              </Link>
            </div>
            <LazySection>
              <PopularitySortedGrid items={topStudios} type="studio" />
            </LazySection>
          </div>
        </div>
      )}

      {/* Top Retreats Section */}
      {topRetreats.length > 0 && (
        <div className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#5d4c42]">
                Top Yoga Retreats in {locationInfo.displayName}
              </h2>
              <Link 
                href={`/retreats/${location}`}
                className="text-[#5d4c42] hover:text-[#a39188] font-medium"
              >
                View All Retreats →
              </Link>
            </div>
            <LazySection>
              <PopularitySortedGrid items={topRetreats} type="retreat" />
            </LazySection>
          </div>
        </div>
      )}

      {/* Location Navigation */}
      <div className="py-16 bg-[#e6ceb3]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-3xl font-bold text-[#5d4c42] text-center mb-8">
            Explore Other Bali Locations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POPULAR_LOCATIONS.filter(loc => loc !== location).slice(0, 8).map((loc) => {
              const info = getLocationInfo(loc)
              if (!info) return null
              
              return (
                <Link
                  key={loc}
                  href={`/locations/${loc}`}
                  className="bg-white rounded-lg p-4 text-center hover:bg-[#f9f3e9] transition-colors border border-white hover:border-[#5d4c42]"
                >
                  <h3 className="font-semibold text-[#5d4c42] mb-1">{info.displayName}</h3>
                  <p className="text-sm text-[#5d4c42]/70">{info.priceRange}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <MobileOptimizedFooter />
      <PopularityDemo />
    </div>
  )
}