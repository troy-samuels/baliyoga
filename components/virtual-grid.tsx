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
    phone_number?: string
    website?: string
    business_description?: string
    email?: string
    instagram_url?: string
    facebook_url?: string
    whatsapp_number?: string
    youtube_url?: string
    tiktok_url?: string
  }>
  type: "studio" | "retreat"
  itemsPerPage?: number
}

export function VirtualGrid({ items, type, itemsPerPage = 20 }: VirtualGridProps) {
  const [page, setPage] = useState(0)

  const paginatedItems = useMemo(() => {
    const start = page * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }, [items, page, itemsPerPage])

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const hasNextPage = page < totalPages - 1

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            phone_number={item.phone_number}
            website={item.website}
            business_description={item.business_description}
            email={item.email}
            instagram_url={item.instagram_url}
            facebook_url={item.facebook_url}
            whatsapp_number={item.whatsapp_number}
            youtube_url={item.youtube_url}
            tiktok_url={item.tiktok_url}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="rounded-xl bg-[#e6ceb3] px-6 py-3 font-medium text-[#5d4c42] transition-colors hover:bg-[#d9c1a0]"
          >
            Load More {type === "studio" ? "Studios" : "Retreats"}
          </button>
        </div>
      )}
    </div>
  )
}
