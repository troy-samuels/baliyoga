import { notFound } from "next/navigation"
import { Search } from "lucide-react"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getSupabaseRetreats } from "@/lib/supabase-data-utils"
import { LazySection } from "@/components/lazy-section"
import { filterRetreats, getLocationDisplayName } from "@/lib/search-utils"
import { MobileOptimizedSidebar } from "@/components/mobile-optimized-sidebar"
import { FunctionalSearchBar } from "@/components/functional-search-bar"
import { PopularitySortedGrid } from "@/components/popularity-sorted-grid"
import { PopularityDemo } from "@/components/popularity-demo"
import { CategorySchema } from "@/components/category-schema"
import { 
  LOCATION_SLUG_MAPPING, 
  RETREAT_TYPE_MAPPING, 
  getRetreatTypeBySlug,
  getAllLocationSlugs,
  getAllRetreatTypeSlugs 
} from "@/lib/retreat-types"
import type { Retreat } from "@/lib/data-utils"

interface RetreatLocationTypePageProps {
  params: Promise<{
    location: string
    type: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  // Generate all possible location/type combinations for static generation
  const locations = getAllLocationSlugs()
  const types = getAllRetreatTypeSlugs()
  
  const params = []
  for (const location of locations) {
    for (const type of types) {
      params.push({ location, type })
    }
  }
  
  return params
}

export async function generateMetadata({ params }: RetreatLocationTypePageProps) {
  const { location, type } = await params
  
  // Validate location and type
  const isValidLocation = getAllLocationSlugs().includes(location)
  const retreatType = getRetreatTypeBySlug(type)
  
  if (!isValidLocation || !retreatType) {
    return {
      title: "Retreats not found",
      description: "The requested retreat category could not be found.",
    }
  }
  
  // Get location display name
  const locationDisplay = Object.entries(LOCATION_SLUG_MAPPING).find(
    ([key, slug]) => slug === location
  )?.[0] || location
  
  return {
    title: `${retreatType.displayName}s in ${locationDisplay}, Bali | Bali Yoga`,
    description: `Discover ${retreatType.description} in ${locationDisplay}, Bali. Find the perfect ${retreatType.displayName.toLowerCase()} for your wellness journey.`,
    keywords: `${retreatType.displayName}, ${locationDisplay}, Bali, yoga retreats, wellness, ${retreatType.styles?.join(', ')}`,
  }
}

export default async function RetreatLocationTypePage({ 
  params, 
  searchParams 
}: RetreatLocationTypePageProps) {
  const { location, type } = await params
  const resolvedSearchParams = await searchParams
  
  // Validate location and type parameters
  const isValidLocation = getAllLocationSlugs().includes(location)
  const retreatType = getRetreatTypeBySlug(type)
  
  if (!isValidLocation || !retreatType) {
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
  
  // Filter retreats by location and type
  const filteredByLocation = allRetreats.filter((retreat: Retreat) => {
    if (!retreat.locationSlug) return false
    return retreat.locationSlug === location
  })
  
  const filteredByType = filteredByLocation.filter((retreat: Retreat) => {
    if (!retreat.typeSlug) return false
    return retreat.typeSlug === type
  })
  
  // Apply additional filters
  const finalFilteredRetreats = filterRetreats(filteredByType, {
    query,
    location: "all", // Already filtered by location
    type: "retreat",
    rating,
    reviews,
    images,
  })
  
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
            {retreatType.displayName}s in {locationDisplay}
            <span className="block text-lg font-normal text-[#5d4c42]/80 sm:text-xl mt-2">
              Bali, Indonesia
            </span>
          </h1>
          <p className="mt-2 text-center text-base text-[#5d4c42]/80 sm:text-lg">
            {retreatType.description}
          </p>
          
          {/* Breadcrumb navigation */}
          <div className="mt-4 text-center">
            <nav className="text-sm text-[#5d4c42]/70">
              <span className="hover:text-[#5d4c42]">
                <a href="/retreats">All Retreats</a>
              </span>
              <span className="mx-2">›</span>
              <span className="hover:text-[#5d4c42]">
                <a href={`/retreats/${location}`}>
                  {locationDisplay} Retreats
                </a>
              </span>
              <span className="mx-2">›</span>
              <span className="font-medium text-[#5d4c42]">
                {retreatType.displayName}s
              </span>
            </nav>
          </div>

          {/* Search Results Info */}
          {hasFilters && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#5d4c42]/70">
                {query && `Searching for "${query}" in ${retreatType.displayName.toLowerCase()}s`}
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
            {/* Retreat Type Description */}
            {retreatType && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6ceb3]">
                <h2 className="text-lg font-semibold text-[#5d4c42] mb-2">
                  About {retreatType.displayName}s in {locationDisplay}
                </h2>
                <p className="text-[#5d4c42]/80 mb-4">
                  {retreatType.description} Experience transformative wellness practices in the heart of {locationDisplay}, Bali.
                </p>
                {retreatType.styles && retreatType.styles.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-[#5d4c42] mr-2">Popular styles:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {retreatType.styles.map((style, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-[#e6ceb3] text-[#5d4c42] text-xs px-2 py-1 rounded-full"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Retreats Count */}
            <div className="mb-2 sm:mb-4">
              <p className="text-sm text-[#5d4c42] sm:text-base">
                <span className="font-medium">{finalFilteredRetreats.length}</span> {retreatType.displayName.toLowerCase()}s found in {locationDisplay}
                {hasFilters && (
                  <span className="ml-2 text-xs text-[#5d4c42]/60">
                    (filtered from {filteredByLocation.length} total retreats in {locationDisplay})
                  </span>
                )}
              </p>
            </div>

            {/* Empty State */}
            {finalFilteredRetreats.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <Search className="h-12 w-12 text-[#5d4c42]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">
                  No {retreatType.displayName.toLowerCase()}s found in {locationDisplay}
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
                  <a 
                    href={`/retreats/${location}`}
                    className="inline-block border border-[#5d4c42] text-[#5d4c42] px-6 py-2 rounded-lg hover:bg-[#e6ceb3]"
                  >
                    All {locationDisplay} Retreats
                  </a>
                </div>
              </div>
            )}

            {/* Retreats Grid with Popularity Sorting */}
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