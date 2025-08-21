import { notFound } from "next/navigation"
import { Search } from "lucide-react"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getAllStudios } from "@/lib/supabase-server"
import { LazySection } from "@/components/lazy-section"
import { filterStudios, getLocationDisplayName } from "@/lib/search-utils"
import { MobileOptimizedSidebar } from "@/components/mobile-optimized-sidebar"
import { FunctionalSearchBar } from "@/components/functional-search-bar"
import { PopularitySortedGrid } from "@/components/popularity-sorted-grid"
import { PopularityDemo } from "@/components/popularity-demo"
import { CategorySchema } from "@/components/category-schema"
import { 
  STUDIO_LOCATION_SLUG_MAPPING, 
  STUDIO_TYPE_MAPPING, 
  getStudioTypeBySlug,
  getAllStudioLocationSlugs,
  getAllStudioTypeSlugs 
} from "@/lib/studio-types"
import type { Studio } from "@/lib/supabase-server"

interface StudioLocationTypePageProps {
  params: Promise<{
    location: string
    type: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  // Generate all possible location/type combinations for static generation
  const locations = getAllStudioLocationSlugs()
  const types = getAllStudioTypeSlugs()
  
  const params = []
  for (const location of locations) {
    for (const type of types) {
      params.push({ location, type })
    }
  }
  
  return params
}

export async function generateMetadata({ params }: StudioLocationTypePageProps) {
  const { location, type } = await params
  
  // Validate location and type
  const isValidLocation = getAllStudioLocationSlugs().includes(location)
  const studioType = getStudioTypeBySlug(type)
  
  if (!isValidLocation || !studioType) {
    return {
      title: "Studios not found",
      description: "The requested studio category could not be found.",
    }
  }
  
  // Get location display name
  const locationDisplay = Object.entries(STUDIO_LOCATION_SLUG_MAPPING).find(
    ([key, slug]) => slug === location
  )?.[0] || location
  
  return {
    title: `${studioType.displayName}s in ${locationDisplay}, Bali | Bali Yoga`,
    description: `Discover ${studioType.description} in ${locationDisplay}, Bali. Find the perfect ${studioType.displayName.toLowerCase()} for your yoga practice.`,
    keywords: `${studioType.displayName}, ${locationDisplay}, Bali, yoga studios, ${studioType.styles?.join(', ')}`,
  }
}

export default async function StudioLocationTypePage({ 
  params, 
  searchParams 
}: StudioLocationTypePageProps) {
  const { location, type } = await params
  const resolvedSearchParams = await searchParams
  
  // Validate location and type parameters
  const isValidLocation = getAllStudioLocationSlugs().includes(location)
  const studioType = getStudioTypeBySlug(type)
  
  if (!isValidLocation || !studioType) {
    notFound()
  }
  
  // Get location display name
  const locationDisplay = Object.entries(STUDIO_LOCATION_SLUG_MAPPING).find(
    ([key, slug]) => slug === location
  )?.[0] || location
  
  // Parse search params
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined
  const rating = typeof resolvedSearchParams.rating === "string" ? parseFloat(resolvedSearchParams.rating) : undefined
  const reviews = typeof resolvedSearchParams.reviews === "string" ? parseInt(resolvedSearchParams.reviews) : undefined
  const images = resolvedSearchParams.images === "true"
  
  // Server-side data fetching with cached results
  const allStudios = await getAllStudios()
  
  // Filter studios by location and type
  const filteredByLocation = allStudios.filter((studio: Studio) => {
    if (!studio.locationSlug) return false
    return studio.locationSlug === location
  })
  
  const filteredByType = filteredByLocation.filter((studio: Studio) => {
    if (!studio.typeSlug) return false
    return studio.typeSlug === type
  })
  
  // Apply additional filters
  const finalFilteredStudios = filterStudios(filteredByType, {
    query,
    location: "all", // Already filtered by location
    type: "studio",
    rating,
    reviews,
    images,
  })
  
  const hasFilters = query || rating || reviews || images
  
  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <CategorySchema 
        type="studios" 
        items={finalFilteredStudios} 
        totalCount={allStudios.length}
      />
      <MobileOptimizedHeader />

      {/* Header */}
      <div className="bg-[#e6ceb3] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-center text-2xl font-bold text-[#5d4c42] sm:text-3xl md:text-4xl">
            {studioType.displayName}s in {locationDisplay}
            <span className="block text-lg font-normal text-[#5d4c42]/80 sm:text-xl mt-2">
              Bali, Indonesia
            </span>
          </h1>
          <p className="mt-2 text-center text-base text-[#5d4c42]/80 sm:text-lg">
            {studioType.description}
          </p>
          
          {/* Breadcrumb navigation */}
          <div className="mt-4 text-center">
            <nav className="text-sm text-[#5d4c42]/70">
              <span className="hover:text-[#5d4c42]">
                <a href="/studios">All Studios</a>
              </span>
              <span className="mx-2">›</span>
              <span className="hover:text-[#5d4c42]">
                <a href={`/studios/${location}`}>
                  {locationDisplay} Studios
                </a>
              </span>
              <span className="mx-2">›</span>
              <span className="font-medium text-[#5d4c42]">
                {studioType.displayName}s
              </span>
            </nav>
          </div>

          {/* Search Results Info */}
          {hasFilters && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#5d4c42]/70">
                {query && `Searching for "${query}" in ${studioType.displayName.toLowerCase()}s`}
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
            {/* Studio Type Description */}
            {studioType && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6ceb3]">
                <h2 className="text-lg font-semibold text-[#5d4c42] mb-2">
                  About {studioType.displayName}s in {locationDisplay}
                </h2>
                <p className="text-[#5d4c42]/80 mb-4">
                  {studioType.description} Experience authentic yoga practice in the heart of {locationDisplay}, Bali.
                </p>
                {studioType.styles && studioType.styles.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-[#5d4c42] mr-2">Popular styles:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {studioType.styles.map((style, index) => (
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

            {/* Studios Count */}
            <div className="mb-2 sm:mb-4">
              <p className="text-sm text-[#5d4c42] sm:text-base">
                <span className="font-medium">{finalFilteredStudios.length}</span> {studioType.displayName.toLowerCase()}s found in {locationDisplay}
                {hasFilters && (
                  <span className="ml-2 text-xs text-[#5d4c42]/60">
                    (filtered from {filteredByLocation.length} total studios in {locationDisplay})
                  </span>
                )}
              </p>
            </div>

            {/* Empty State */}
            {finalFilteredStudios.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <Search className="h-12 w-12 text-[#5d4c42]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">
                  No {studioType.displayName.toLowerCase()}s found in {locationDisplay}
                </h3>
                <p className="text-[#5d4c42]/70 mb-4">
                  Try adjusting your filters or explore other locations
                </p>
                <div className="space-x-4">
                  <a 
                    href="/studios" 
                    className="inline-block bg-[#5d4c42] text-white px-6 py-2 rounded-lg hover:bg-[#a39188]"
                  >
                    View All Studios
                  </a>
                  <a 
                    href={`/studios/${location}`}
                    className="inline-block border border-[#5d4c42] text-[#5d4c42] px-6 py-2 rounded-lg hover:bg-[#e6ceb3]"
                  >
                    All {locationDisplay} Studios
                  </a>
                </div>
              </div>
            )}

            {/* Studios Grid with Popularity Sorting */}
            {finalFilteredStudios.length > 0 && (
              <LazySection>
                <PopularitySortedGrid items={finalFilteredStudios} type="studio" />
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