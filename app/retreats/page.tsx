import { Search } from "lucide-react"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getAllRetreats } from "@/lib/supabase-server"
import { LazySection } from "@/components/lazy-section"
import { filterRetreats, getLocationDisplayName } from "@/lib/search-utils"
import { FunctionalSearchBar } from "@/components/functional-search-bar"
import { PopularitySortedGrid } from "@/components/popularity-sorted-grid"
import { PopularityDemo } from "@/components/popularity-demo"
import { CategorySchema } from "@/components/category-schema"
import { RetreatsPageClient } from "@/components/retreats-page-client"

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
  const duration = typeof resolvedSearchParams.duration === "string" ? resolvedSearchParams.duration : undefined;
  const retreatType = typeof resolvedSearchParams.retreatType === "string" ? resolvedSearchParams.retreatType : undefined;
  const accommodation = typeof resolvedSearchParams.accommodation === "string" ? resolvedSearchParams.accommodation : undefined;
  const price = typeof resolvedSearchParams.price === "string" ? resolvedSearchParams.price : undefined;

  // Server-side data fetching with cached results
  const allRetreats = await getAllRetreats()

  // Apply basic filters for server-side rendering
  const basicFilteredRetreats = filterRetreats(allRetreats, {
    query,
    location,
    type,
    rating,
    reviews,
    images,
    duration,
    retreatType,
    accommodation,
    price,
  })

  const hasFilters = Boolean(
    query || (location && location !== "all") || rating || reviews || images || duration || retreatType || accommodation || price
  )
  const locationDisplay = location ? getLocationDisplayName(location) : null

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <CategorySchema type="retreats" items={basicFilteredRetreats} totalCount={allRetreats.length} />
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

      {/* Main Content with Enhanced Filtering */}
      <RetreatsPageClient
        allRetreats={allRetreats}
        initialFilteredRetreats={basicFilteredRetreats}
        hasFilters={hasFilters}
      />

      <MobileOptimizedFooter />
      
      {/* Popularity Demo Component */}
      <PopularityDemo />
    </div>
  )
}
