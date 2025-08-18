import { notFound } from "next/navigation"
import Link from "next/link"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getSupabaseRetreats } from "@/lib/supabase-data-utils"
import { LazySection } from "@/components/lazy-section"
import { filterRetreats } from "@/lib/search-utils"
import { MobileOptimizedSidebar } from "@/components/mobile-optimized-sidebar"
import { PopularitySortedGrid } from "@/components/popularity-sorted-grid"
import { PopularityDemo } from "@/components/popularity-demo"
import { CategorySchema } from "@/components/category-schema"
import { 
  LOCATION_SLUG_MAPPING, 
  RETREAT_TYPE_MAPPING,
  getAllLocationSlugs
} from "@/lib/retreat-types"
import type { Retreat } from "@/lib/data-utils"

interface RetreatLocationPageProps {
  params: Promise<{
    location: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  // Generate all possible location params for static generation
  const locations = getAllLocationSlugs()
  return locations.map(location => ({ location }))
}

export async function generateMetadata({ params }: RetreatLocationPageProps) {
  const { location } = await params
  
  // Validate location
  const isValidLocation = getAllLocationSlugs().includes(location)
  
  if (!isValidLocation) {
    return {
      title: "Location not found",
      description: "The requested location could not be found.",
    }
  }
  
  // Get location display name
  const locationDisplay = Object.entries(LOCATION_SLUG_MAPPING).find(
    ([key, slug]) => slug === location
  )?.[0] || location
  
  return {
    title: `Yoga Retreats in ${locationDisplay}, Bali | Bali Yoga`,
    description: `Discover transformative yoga retreats in ${locationDisplay}, Bali. Find wellness retreats, yoga intensives, and spiritual experiences in this beautiful location.`,
    keywords: `yoga retreats, ${locationDisplay}, Bali, wellness, meditation, spiritual retreats`,
  }
}

export default async function RetreatLocationPage({ 
  params, 
  searchParams 
}: RetreatLocationPageProps) {
  const { location } = await params
  const resolvedSearchParams = await searchParams
  
  // Validate location parameter
  const isValidLocation = getAllLocationSlugs().includes(location)
  
  if (!isValidLocation) {
    notFound()
  }
  
  // Get location display name
  const locationDisplay = Object.entries(LOCATION_SLUG_MAPPING).find(
    ([key, slug]) => slug === location
  )?.[0] || location
  
  // Parse search params
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined
  const rating = typeof resolvedSearchParams.rating === "string" ? parseFloat(resolvedSearchParams.rating) : undefined
  const reviews = typeof resolvedSearchParams.reviews === "string" ? parseInt(resolvedSearchParams.reviews) : undefined
  const images = resolvedSearchParams.images === "true"
  
  // Get all retreats data from Supabase
  const allRetreats = await getSupabaseRetreats()
  
  // Filter retreats by location
  const locationFilteredRetreats = allRetreats.filter((retreat: Retreat) => {
    if (!retreat.locationSlug) return false
    return retreat.locationSlug === location
  })
  
  // Apply additional filters
  const finalFilteredRetreats = filterRetreats(locationFilteredRetreats, {
    query,
    location: "all", // Already filtered by location
    type: "retreat",
    rating,
    reviews,
    images,
  })
  
  // Group retreats by type for display
  const retreatsByType = finalFilteredRetreats.reduce((acc: Record<string, Retreat[]>, retreat) => {
    const typeSlug = retreat.typeSlug || 'yoga-retreat'
    if (!acc[typeSlug]) {
      acc[typeSlug] = []
    }
    acc[typeSlug].push(retreat)
    return acc
  }, {})
  
  const hasFilters = query || rating || reviews || images
  
  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <CategorySchema 
        type="retreats" 
        items={finalFilteredRetreats} 
        totalCount={allRetreats.length}
      />
      <MobileOptimizedHeader />

      {/* Header */}
      <div className="bg-[#e6ceb3] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-center text-2xl font-bold text-[#5d4c42] sm:text-3xl md:text-4xl">
            Yoga Retreats in {locationDisplay}
            <span className="block text-lg font-normal text-[#5d4c42]/80 sm:text-xl mt-2">
              Bali, Indonesia
            </span>
          </h1>
          <p className="mt-2 text-center text-base text-[#5d4c42]/80 sm:text-lg">
            Discover transformative wellness experiences in {locationDisplay}
          </p>
          
          {/* Breadcrumb navigation */}
          <div className="mt-4 text-center">
            <nav className="text-sm text-[#5d4c42]/70">
              <span className="hover:text-[#5d4c42]">
                <a href="/retreats">All Retreats</a>
              </span>
              <span className="mx-2">›</span>
              <span className="font-medium text-[#5d4c42]">
                {locationDisplay} Retreats
              </span>
            </nav>
          </div>

          {/* Search Results Info */}
          {hasFilters && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#5d4c42]/70">
                {query && `Searching for "${query}" in ${locationDisplay} retreats`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Left Sidebar Filters */}
          <MobileOptimizedSidebar />

          {/* Right Content Area */}
          <div className="flex-1 space-y-6">
            {/* Location Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6ceb3]">
              <h2 className="text-lg font-semibold text-[#5d4c42] mb-2">
                Retreats in {locationDisplay}
              </h2>
              <p className="text-[#5d4c42]/80 mb-4">
                {locationDisplay} offers a unique setting for yoga and wellness retreats in Bali. 
                Discover various retreat types from traditional yoga practices to luxury wellness experiences.
              </p>
            </div>

            {/* Retreat Types Quick Links */}
            {Object.keys(retreatsByType).length > 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6ceb3]">
                <h3 className="text-md font-semibold text-[#5d4c42] mb-4">
                  Browse by Retreat Type
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(retreatsByType).map(([typeSlug, retreats]) => {
                    const retreatType = Object.values(RETREAT_TYPE_MAPPING).find(t => t.slug === typeSlug)
                    if (!retreatType) return null
                    
                    return (
                      <Link
                        key={typeSlug}
                        href={`/retreats/${location}/${typeSlug}`}
                        className="block p-3 border border-[#e6ceb3] rounded-lg hover:bg-[#f9f3e9] transition-colors"
                      >
                        <div className="font-medium text-[#5d4c42] text-sm">
                          {retreatType.displayName}
                        </div>
                        <div className="text-xs text-[#5d4c42]/70 mt-1">
                          {retreats.length} retreat{retreats.length !== 1 ? 's' : ''}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Retreats Count */}
            <div className="mb-2 sm:mb-4">
              <p className="text-sm text-[#5d4c42] sm:text-base">
                <span className="font-medium">{finalFilteredRetreats.length}</span> retreats found in {locationDisplay}
                {hasFilters && (
                  <span className="ml-2 text-xs text-[#5d4c42]/60">
                    (filtered from {locationFilteredRetreats.length} total)
                  </span>
                )}
              </p>
            </div>

            {/* Empty State */}
            {finalFilteredRetreats.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">
                  No retreats found in {locationDisplay}
                </h3>
                <p className="text-[#5d4c42]/70 mb-4">
                  Try adjusting your filters or explore other locations
                </p>
                <div className="space-x-4">
                  <a 
                    href="/retreats" 
                    className="inline-block bg-[#5d4c42] text-white px-6 py-2 rounded-lg hover:bg-[#a39188]"
                  >
                    View All Retreats
                  </a>
                </div>
              </div>
            )}

            {/* All Retreats Grid */}
            {finalFilteredRetreats.length > 0 && (
              <LazySection>
                <PopularitySortedGrid items={finalFilteredRetreats} type="retreat" />
              </LazySection>
            )}
          </div>
        </div>
      </div>

      <MobileOptimizedFooter />
      
      {/* Popularity Demo Component */}
      <PopularityDemo />
    </div>
  )
}