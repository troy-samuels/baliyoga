import { Search } from "lucide-react"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getAllStudios } from "@/lib/supabase-server"
import { LazySection } from "@/components/lazy-section"
import { filterStudios, getLocationDisplayName } from "@/lib/search-utils"
import { StudiosPageClient } from "@/components/studios-page-client"
import { FunctionalSearchBar } from "@/components/functional-search-bar"
import { CategorySchema } from "@/components/category-schema"

/**
 * @param {{ searchParams: Record<string, string | string[] | undefined> }} props
 */
export default async function StudiosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined;
  const location = typeof resolvedSearchParams.location === "string" ? resolvedSearchParams.location : undefined;
  const type = typeof resolvedSearchParams.type === "string" ? resolvedSearchParams.type : "studio";
  const rating = typeof resolvedSearchParams.rating === "string" ? parseFloat(resolvedSearchParams.rating) : undefined;
  const reviews = typeof resolvedSearchParams.reviews === "string" ? parseInt(resolvedSearchParams.reviews) : undefined;
  const images = resolvedSearchParams.images === "true";

  // Server-side data fetching with cached results
  const allStudios = await getAllStudios()

  // Apply basic filters for server-side rendering
  const basicFilteredStudios = filterStudios(allStudios, {
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
      <CategorySchema type="studios" items={basicFilteredStudios} totalCount={allStudios.length} />
      <MobileOptimizedHeader />

      {/* Header */}
      <div className="bg-[#e6ceb3] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-center text-2xl font-bold text-[#5d4c42] sm:text-3xl md:text-4xl">
            Yoga Studios in Bali
            {locationDisplay && locationDisplay !== "All Locations" && (
              <span className="block text-lg font-normal text-[#5d4c42]/80 sm:text-xl">in {locationDisplay}</span>
            )}
          </h1>
          <p className="mt-2 text-center text-base text-[#5d4c42]/80 sm:text-lg">
            Find the perfect studio for your practice with our smart filters
          </p>

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
        </div>
      </div>

      {/* Main Content with Enhanced Filtering */}
      <StudiosPageClient 
        allStudios={allStudios}
        initialFilteredStudios={basicFilteredStudios}
        hasFilters={hasFilters}
      />

      <MobileOptimizedFooter />
    </div>
  )
}
