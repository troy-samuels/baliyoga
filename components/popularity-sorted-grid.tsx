"use client"

import { useEffect, useState } from 'react'
import { MobileOptimizedCard } from './mobile-optimized-card'
import { sortByPopularityAndRating } from '@/lib/popularity-utils'

interface Studio {
  id: string | number
  name: string
  slug: string
  image?: string
  location: string
  rating: number
  styles?: string[]
  type: 'studio'
  phone_number?: string
  website?: string
}

interface Retreat {
  id: string | number
  name: string
  slug: string
  image?: string
  location: string
  rating: number
  type: 'retreat'
  duration?: string
  price?: string
  phone_number?: string
  website?: string
}

type ListingItem = Studio | Retreat

interface PopularitySortedGridProps {
  items: ListingItem[]
  type: 'studio' | 'retreat'
}

export function PopularitySortedGrid({ items, type }: PopularitySortedGridProps) {
  const [sortedItems, setSortedItems] = useState<ListingItem[]>(items)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // Sort items by popularity and rating on the client side
      const sorted = sortByPopularityAndRating(items)
      setSortedItems(sorted)
    }
  }, [items, isClient])

  // Show unsorted items during SSR and initial hydration
  const displayItems = isClient ? sortedItems : items

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {displayItems.length > 0 ? (
        displayItems.map((item) => (
          <MobileOptimizedCard
            key={item.id}
            id={String(item.id)}
            name={item.name}
            slug={item.slug}
            image={item.image}
            location={item.location}
            rating={item.rating}
            styles={type === 'studio' ? (item as Studio).styles : undefined}
            type={type}
            duration={type === 'retreat' ? (item as Retreat).duration : undefined}
            price={type === 'retreat' ? (item as Retreat).price : undefined}
            phone_number={item.phone_number}
            website={item.website}
          />
        ))
      ) : (
        <div className="col-span-full py-8 text-center text-[#5d4c42]">
          <p className="text-lg font-medium">No {type}s found</p>
          <p className="mt-2 text-sm text-[#5d4c42]/70">
            Please check back later for new listings.
          </p>
        </div>
      )}
    </div>
  )
} 