import { notFound } from "next/navigation"
import Link from "next/link"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getSupabaseStudios } from "@/lib/supabase-data-utils"
import { LazySection } from "@/components/lazy-section"
import { filterStudios } from "@/lib/search-utils"
import { MobileOptimizedSidebar } from "@/components/mobile-optimized-sidebar"
import { PopularitySortedGrid } from "@/components/popularity-sorted-grid"
import { PopularityDemo } from "@/components/popularity-demo"
import { CategorySchema } from "@/components/category-schema"
import { 
  STUDIO_LOCATION_SLUG_MAPPING, 
  STUDIO_TYPE_MAPPING,
  getAllStudioLocationSlugs
} from "@/lib/studio-types"
import type { Studio } from "@/lib/data-utils"

interface StudioLocationPageProps {
  params: Promise<{
    location: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  // Generate all possible location params for static generation
  const locations = getAllStudioLocationSlugs()
  return locations.map(location => ({ location }))
}

export async function generateMetadata({ params }: StudioLocationPageProps) {
  const { location } = await params
  
  // Validate location
  const isValidLocation = getAllStudioLocationSlugs().includes(location)
  
  if (!isValidLocation) {
    return {
      title: "Location not found",
      description: "The requested location could not be found.",
    }
  }
  
  // Get location display name
  const locationDisplay = Object.entries(STUDIO_LOCATION_SLUG_MAPPING).find(
    ([key, slug]) => slug === location
  )?.[0] || location
  
  return {
    title: `Yoga Studios in ${locationDisplay}, Bali | Bali Yoga`,
    description: `Discover authentic yoga studios in ${locationDisplay}, Bali. Find traditional studios, hot yoga, vinyasa flow, and wellness-focused practices in this beautiful location.`,
    keywords: `yoga studios, ${locationDisplay}, Bali, yoga classes, traditional yoga, vinyasa flow`,
  }
}

export default async function StudioLocationPage({ 
  params, 
  searchParams 
}: StudioLocationPageProps) {
  const { location } = await params
  const resolvedSearchParams = await searchParams
  
  // Validate location parameter
  const isValidLocation = getAllStudioLocationSlugs().includes(location)
  
  if (!isValidLocation) {
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
  
  // Get all studios data from Supabase
  const allStudios = await getSupabaseStudios()
  
  // Filter studios by location
  const locationFilteredStudios = allStudios.filter((studio: Studio) => {
    if (!studio.locationSlug) return false
    return studio.locationSlug === location
  })
  
  // Apply additional filters
  const finalFilteredStudios = filterStudios(locationFilteredStudios, {
    query,
    location: "all", // Already filtered by location
    type: "studio",
    rating,
    reviews,
    images,
  })
  
  // Group studios by type for display
  const studiosByType = finalFilteredStudios.reduce((acc: Record<string, Studio[]>, studio) => {
    const typeSlug = studio.typeSlug || 'traditional-yoga-studio'
    if (!acc[typeSlug]) {
      acc[typeSlug] = []
    }
    acc[typeSlug].push(studio)
    return acc
  }, {})
  
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
            Yoga Studios in {locationDisplay}
            <span className="block text-lg font-normal text-[#5d4c42]/80 sm:text-xl mt-2">
              Bali, Indonesia
            </span>
          </h1>
          <p className="mt-2 text-center text-base text-[#5d4c42]/80 sm:text-lg">
            Discover authentic yoga practices in {locationDisplay}
          </p>
          
          {/* Breadcrumb navigation */}
          <div className="mt-4 text-center">
            <nav className="text-sm text-[#5d4c42]/70">
              <span className="hover:text-[#5d4c42]">
                <a href="/studios">All Studios</a>
              </span>
              <span className="mx-2">›</span>
              <span className="font-medium text-[#5d4c42]">
                {locationDisplay} Studios
              </span>
            </nav>
          </div>

          {/* Search Results Info */}
          {hasFilters && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#5d4c42]/70">
                {query && `Searching for "${query}" in ${locationDisplay} studios`}
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
                Studios in {locationDisplay}
              </h2>
              <p className="text-[#5d4c42]/80 mb-4">
                {locationDisplay} offers a diverse range of yoga studios in Bali. 
                Discover various studio types from traditional practices to modern fitness-focused classes.
              </p>
            </div>

            {/* Studio Types Quick Links */}
            {Object.keys(studiosByType).length > 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6ceb3]">
                <h3 className="text-md font-semibold text-[#5d4c42] mb-4">
                  Browse by Studio Type
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(studiosByType).map(([typeSlug, studios]) => {
                    const studioType = Object.values(STUDIO_TYPE_MAPPING).find(t => t.slug === typeSlug)
                    if (!studioType) return null
                    
                    return (
                      <Link
                        key={typeSlug}
                        href={`/studios/${location}/${typeSlug}`}
                        className="block p-3 border border-[#e6ceb3] rounded-lg hover:bg-[#f9f3e9] transition-colors"
                      >
                        <div className="font-medium text-[#5d4c42] text-sm">
                          {studioType.displayName}
                        </div>
                        <div className="text-xs text-[#5d4c42]/70 mt-1">
                          {studios.length} studio{studios.length !== 1 ? 's' : ''}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Studios Count */}
            <div className="mb-2 sm:mb-4">
              <p className="text-sm text-[#5d4c42] sm:text-base">
                <span className="font-medium">{finalFilteredStudios.length}</span> studios found in {locationDisplay}
                {hasFilters && (
                  <span className="ml-2 text-xs text-[#5d4c42]/60">
                    (filtered from {locationFilteredStudios.length} total)
                  </span>
                )}
              </p>
            </div>

            {/* Empty State */}
            {finalFilteredStudios.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">
                  No studios found in {locationDisplay}
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
                </div>
              </div>
            )}

            {/* All Studios Grid */}
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