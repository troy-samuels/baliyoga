"use client"

import { useState, useCallback, ReactNode } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "./ui/button"

interface UniversalFilterLayoutProps {
  // Filter sidebar component
  filterSidebar: ReactNode
  // Main content area
  children: ReactNode
  // Results count display
  resultsCount?: number
  totalCount?: number
  hasFilters?: boolean
  // Mobile filter button customization
  filterButtonText?: string
}

export function UniversalFilterLayout({
  filterSidebar,
  children,
  resultsCount,
  totalCount,
  hasFilters = false,
  filterButtonText = "Filters"
}: UniversalFilterLayoutProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const handleMobileFilterToggle = useCallback(() => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }, [isMobileFilterOpen])

  const handleMobileFilterClose = useCallback(() => {
    setIsMobileFilterOpen(false)
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 md:px-6">
      {/* Mobile Filter Button - Fixed at bottom on small screens */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <Button
          onClick={handleMobileFilterToggle}
          className="h-14 w-14 rounded-full bg-[#a39188] text-white shadow-lg hover:bg-[#8b7355] active:scale-95 transition-all duration-200"
          size="sm"
        >
          <Filter className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleMobileFilterClose}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl transform transition-transform duration-300"
               style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#5d4c42]">{filterButtonText}</h3>
              <Button
                onClick={handleMobileFilterClose}
                variant="ghost"
                size="sm"
                className="rounded-full bg-[#a39188] p-2.5 text-white hover:bg-[#8b7355]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {/* Render filter sidebar with mobile props */}
            <div className="mobile-filter-content">
              {filterSidebar}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Horizontal Layout */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left Sidebar - Desktop only */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
            {filterSidebar}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Results Count */}
          {typeof resultsCount === 'number' && (
            <div className="mb-4">
              <p className="text-sm text-[#5d4c42] sm:text-base">
                <span className="font-medium">{resultsCount}</span> {resultsCount === 1 ? 'result' : 'results'} found
                {hasFilters && typeof totalCount === 'number' && (
                  <span className="ml-2 text-xs text-[#5d4c42]/60">
                    (filtered from {totalCount} total)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Main Content */}
          {children}
        </div>
      </div>
    </div>
  )
}