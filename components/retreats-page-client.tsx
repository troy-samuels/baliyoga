"use client"

import { useState, useCallback } from "react"
import { RetreatFilterSidebar } from "./retreat-filter-sidebar"
import { PopularitySortedGrid } from "./popularity-sorted-grid"
import { LazySection } from "./lazy-section"
import { UniversalFilterLayout } from "./universal-filter-layout"
import type { Retreat } from "@/lib/types"

interface RetreatsPageClientProps {
  allRetreats: Retreat[]
  initialFilteredRetreats: Retreat[]
  hasFilters: boolean
}

export function RetreatsPageClient({
  allRetreats,
  initialFilteredRetreats,
  hasFilters
}: RetreatsPageClientProps) {
  const [filteredRetreats, setFilteredRetreats] = useState<Retreat[]>(initialFilteredRetreats)

  const handleFilterChange = useCallback((filtered: Retreat[]) => {
    setFilteredRetreats(filtered)
  }, [])

  // Create the filter sidebar component
  const filterSidebar = (
    <RetreatFilterSidebar
      retreats={allRetreats}
      onFilterChange={handleFilterChange}
      isMobile={false} // Will be handled by UniversalFilterLayout
    />
  )

  return (
    <UniversalFilterLayout
      filterSidebar={filterSidebar}
      resultsCount={filteredRetreats.length}
      totalCount={allRetreats.length}
      hasFilters={hasFilters}
      filterButtonText="Filter Retreats"
    >
      {/* Retreats Grid with Popularity Sorting */}
      <LazySection>
        <PopularitySortedGrid items={filteredRetreats} type="retreat" />
      </LazySection>
    </UniversalFilterLayout>
  )
}