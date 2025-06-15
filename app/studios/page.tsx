import { Search } from "lucide-react"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getSupabaseStudios } from "@/lib/supabase-data-utils"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { LazySection } from "@/components/lazy-section"
import { filterStudios, getLocationDisplayName } from "@/lib/search-utils"
import { MobileOptimizedSidebar } from "@/components/mobile-optimized-sidebar"
import { FunctionalSearchBar } from "@/components/functional-search-bar"

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

  // Get studios data from Supabase
  const allStudios = await getSupabaseStudios()

  // Apply filters
  const filteredStudios = filterStudios(allStudios, {
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
            Find the perfect studio for your practice
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

          {/* Mobile-Optimized Search Bar */}
          <div className="mx-auto mt-4 max-w-3xl sm:mt-6">
            <FunctionalSearchBar 
              placeholder="Search studios by name, style, or location..."
              type="studio"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Left Sidebar Filters */}
          <MobileOptimizedSidebar />

          {/* Right Content Area */}
          <div className="flex-1 space-y-6">
            {/* Studios Count */}
            <div className="mb-2 sm:mb-4">
              <p className="text-sm text-[#5d4c42] sm:text-base">
                <span className="font-medium">{filteredStudios.length}</span> studios found
                {hasFilters && (
                  <span className="ml-2 text-xs text-[#5d4c42]/60">(filtered from {allStudios.length} total)</span>
                )}
              </p>
            </div>

            {/* Studios Grid */}
            <LazySection>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {filteredStudios.length > 0 ? (
                  filteredStudios.map((studio) => (
                    <MobileOptimizedCard
                      key={studio.id}
                      id={studio.id}
                      name={studio.name}
                      slug={studio.slug}
                      image={studio.image}
                      location={studio.location}
                      rating={studio.rating}
                      styles={studio.styles}
                      type="studio"
                      phone_number={studio.phone_number}
                      website={studio.website}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-[#5d4c42]">
                    <p className="text-lg font-medium">No studios found</p>
                    <p className="mt-2 text-sm text-[#5d4c42]/70">
                      {hasFilters
                        ? "Try adjusting your search criteria or browse all studios."
                        : "Please check back later for new listings."}
                    </p>
                  </div>
                )}
              </div>
            </LazySection>
          </div>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
}
