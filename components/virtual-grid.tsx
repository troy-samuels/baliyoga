"use client"

import { useState, useMemo } from "react"
import { PerformanceOptimizedCard } from "./performance-optimized-card"

interface VirtualGridProps {
  items: Array<{
    id: string
    name: string
    slug: string
    image?: string
    location: string
    rating: number
    styles?: string[]
    duration?: string
    price?: string
  }>
  type: "studio" | "retreat"
  itemsPerPage?: number
}

export function VirtualGrid({ items, type, itemsPerPage = 12 }: VirtualGridProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, currentPage, itemsPerPage])

  const totalPages = Math.ceil(items.length / itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedItems.map((item) => (
          <PerformanceOptimizedCard
            key={item.id}
            id={item.id}
            name={item.name}
            slug={item.slug}
            image={item.image}
            location={item.location}
            rating={item.rating}
            styles={item.styles}
            type={type}
            duration={item.duration}
            price={item.price}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-[#e6ceb3] text-[#5d4c42] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9b99a]"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? "bg-[#a39188] text-white"
                      : "bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-[#e6ceb3] text-[#5d4c42] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9b99a]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
