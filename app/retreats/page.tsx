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

export default async function RetreatsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined;
  const location = typeof resolvedSearchParams.location === "string" ? resolvedSearchParams.location : undefined;
  const type = typeof resolvedSearchParams.type === "string" ? resolvedSearchParams.type : "retreat";
  const rating = typeof resolvedSearchParams.rating === "string" ? parseFloat(resolvedSearchParams.rating) : undefined;
  const reviews = typeof resolvedSearchParams.reviews === "string" ? parseInt(resolvedSearchParams.reviews) : undefined;
  const images = resolvedSearchParams.images === "true";

  // Get retreats data from Supabase
  const allRetreats = await getSupabaseRetreats()

  // Apply filters
  const filteredRetreats = filterRetreats(allRetreats, {
    query,
    location,
    type,
    rating,
    reviews,
    images,
  })

  const hasFilters = query || (location && location !== "all") || rating || reviews || images
  const locationDisplay = location ? getLocationDisplayName(location) : null

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <CategorySchema type="retreats" items={filteredRetreats} totalCount={allRetreats.length} />
      <MobileOptimizedHeader />

      {/* Header */}
      <div className="bg-[#e6ceb3] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-center text-2xl font-bold text-[#5d4c42] sm:text-3xl md:text-4xl">
            Yoga Retreats in Bali
            {locationDisplay && locationDisplay !== "All Locations" && (
              <span className="block text-lg font-normal text-[#5d4c42]/80 sm:text-xl">in {locationDisplay}</span>
            )}
          </h1>
          <p className="mt-2 text-center text-base text-[#5d4c42]/80 sm:text-lg">
            Immerse yourself in transformative yoga experiences
          </p>
          {/* Removed popularity sorting text to keep algorithm hidden from users */}

          {/* Search Results Info */}
          {hasFilters && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#5d4c42]/70">
                {query && `Searching for "${query}"`}
                {query && locationDisplay && locationDisplay !== "All Locations" && " in "}
                {locationDisplay && locationDisplay !== "All Locations" && locationDisplay}
              </p>
            </div>
          )}

          {/* Mobile-Optimized Search Bar - Removed for cleaner mobile experience */}
          {/* 
          <div className="mx-auto mt-4 max-w-3xl sm:mt-6">
            <FunctionalSearchBar 
              placeholder="Search retreats by name, duration, or location..."
              type="retreat"
            />
          </div>
          */}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Left Sidebar Filters */}
          <MobileOptimizedSidebar />

          {/* Right Content Area */}
          <div className="flex-1 space-y-6">
            {/* Retreats Count */}
            <div className="mb-2 sm:mb-4">
              <p className="text-sm text-[#5d4c42] sm:text-base">
                <span className="font-medium">{filteredRetreats.length}</span> retreats found
                {hasFilters && (
                  <span className="ml-2 text-xs text-[#5d4c42]/60">(filtered from {allRetreats.length} total)</span>
                )}
              </p>
            </div>

            {/* Retreats Grid with Popularity Sorting */}
            <LazySection>
              <PopularitySortedGrid items={filteredRetreats} type="retreat" />
            </LazySection>
          </div>
        </div>
      </div>

      <MobileOptimizedFooter />
      
      {/* Popularity Demo Component */}
      <PopularityDemo />
    </div>
  )
}
