"use client"

import { useState, useCallback } from "react"
import { SmartFilterSidebar } from "./smart-filter-sidebar"
import { PopularitySortedGrid } from "./popularity-sorted-grid"
import { LazySection } from "./lazy-section"
import { UniversalFilterLayout } from "./universal-filter-layout"
import type { Studio } from "@/lib/types"

// Use the actual Studio type from lib/types.ts
type StudioProfile = Studio

interface StudiosPageClientProps {
  allStudios: StudioProfile[]
  initialFilteredStudios: StudioProfile[]
  hasFilters: boolean
}

export function StudiosPageClient({
  allStudios,
  initialFilteredStudios,
  hasFilters
}: StudiosPageClientProps) {
  const [filteredStudios, setFilteredStudios] = useState<StudioProfile[]>(initialFilteredStudios)

  const handleFilterChange = useCallback((filtered: StudioProfile[]) => {
    setFilteredStudios(filtered)
  }, [])

  // Create the filter sidebar component
  const filterSidebar = (
    <SmartFilterSidebar
      studios={allStudios}
      onFilterChange={handleFilterChange}
      isMobile={false} // Will be handled by UniversalFilterLayout
    />
  )

  return (
    <UniversalFilterLayout
      filterSidebar={filterSidebar}
      resultsCount={filteredStudios.length}
      totalCount={allStudios.length}
      hasFilters={hasFilters}
      filterButtonText="Filter Studios"
    >
      {/* Studios Grid with Popularity Sorting */}
      <LazySection>
        <PopularitySortedGrid items={filteredStudios} type="studio" />
      </LazySection>
    </UniversalFilterLayout>
  )
}