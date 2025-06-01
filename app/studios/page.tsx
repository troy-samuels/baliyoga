import { Search } from "lucide-react"

import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { getSupabaseStudios } from "@/lib/supabase-data-utils"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { LazySection } from "@/components/lazy-section"
import { filterStudios, getLocationDisplayName } from "@/lib/search-utils"
import { MobileOptimizedSidebar } from "@/components/mobile-optimized-sidebar"

interface SearchParams {
  q?: string
  location?: string
}

interface StudiosPageProps {
  searchParams: SearchParams
}

export default async function StudiosPage({ searchParams }: StudiosPageProps) {
  // Get studios data from Supabase
  const allStudios = await getSupabaseStudios()

  // Apply filters
  const filteredStudios = filterStudios(allStudios, {
    query: searchParams.q,
    location: searchParams.location,
  })

  const hasFilters = searchParams.q || (searchParams.location && searchParams.location !== "all")
  const locationDisplay = searchParams.location ? getLocationDisplayName(searchParams.location) : null

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
                {searchParams.q && `Searching for "${searchParams.q}"`}
                {searchParams.q && locationDisplay && locationDisplay !== "All Locations" && " in "}
                {locationDisplay && locationDisplay !== "All Locations" && locationDisplay}
              </p>
            </div>
          )}

          {/* Mobile-Optimized Search Bar */}
          <div className="mx-auto mt-4 max-w-3xl sm:mt-6">
            <div className="flex rounded-2xl bg-white p-2 shadow-md sm:rounded-full">
              <div className="flex flex-1 items-center rounded-xl bg-gray-100 px-4 py-2 sm:rounded-full">
                <Search className="mr-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search studios by name, style, or location..."
                  className="w-full bg-transparent text-sm focus:outline-none sm:text-base"
                  defaultValue={searchParams.q || ""}
                />
              </div>
              <button className="ml-2 rounded-xl bg-[#a39188] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8a7b73] sm:rounded-full sm:px-6">
                Search
              </button>
            </div>
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
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm font-medium text-[#5d4c42] sm:px-4 sm:py-2">
                All Styles
              </span>
              {["Hatha", "Vinyasa", "Yin", "Ashtanga", "Restorative"].map((style) => (
                <span
                  key={style}
                  className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#5d4c42] hover:bg-[#e6ceb3] sm:px-4 sm:py-2"
                >
                  {style}
                </span>
              ))}
            </div>

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
