"use client"

import { useState } from "react"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { useWishlist } from "@/contexts/wishlist-context"
import { Heart, Filter, Trash2 } from "lucide-react"

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, wishlistCount } = useWishlist()
  const [filterType, setFilterType] = useState<'all' | 'studio' | 'retreat'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating'>('recent')

  // Filter items based on type
  const filteredItems = wishlistItems.filter(item => 
    filterType === 'all' || item.type === filterType
  )

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rating':
        return b.rating - a.rating
      case 'recent':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  })

  const studioCount = wishlistItems.filter(item => item.type === 'studio').length
  const retreatCount = wishlistItems.filter(item => item.type === 'retreat').length

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Hero Section */}
      <div className="bg-[#5d4c42] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 fill-red-500 text-red-500" />
            <h1 className="text-4xl font-bold md:text-5xl">My Wishlist</h1>
          </div>
          <p className="text-lg opacity-90">
            {wishlistCount === 0 
              ? "Start saving your favorite yoga studios and retreats"
              : `${wishlistCount} saved ${wishlistCount === 1 ? 'item' : 'items'}`
            }
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {wishlistCount === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-[#e6ceb3] rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-[#5d4c42]" />
            </div>
            <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">Your wishlist is empty</h2>
            <p className="text-[#5d4c42]/80 mb-8 max-w-md mx-auto">
              Start exploring and save your favorite yoga studios and retreats by clicking the heart icon on any listing.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/studios"
                className="rounded-lg bg-[#5d4c42] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
              >
                Browse Studios
              </a>
              <a
                href="/retreats"
                className="rounded-lg border-2 border-[#5d4c42] px-8 py-3 font-semibold text-[#5d4c42] transition-colors hover:bg-[#5d4c42] hover:text-white"
              >
                Browse Retreats
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-4">
                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#5d4c42]" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'studio' | 'retreat')}
                    className="rounded-lg border border-[#e6ceb3] px-3 py-2 text-[#5d4c42] focus:border-[#a39188] focus:outline-none focus:ring-2 focus:ring-[#a39188]/20"
                  >
                    <option value="all">All ({wishlistCount})</option>
                    <option value="studio">Studios ({studioCount})</option>
                    <option value="retreat">Retreats ({retreatCount})</option>
                  </select>
                </div>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'rating')}
                  className="rounded-lg border border-[#e6ceb3] px-3 py-2 text-[#5d4c42] focus:border-[#a39188] focus:outline-none focus:ring-2 focus:ring-[#a39188]/20"
                >
                  <option value="recent">Recently Added</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Clear All Button */}
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 rounded-lg border-2 border-red-500 px-4 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-[#5d4c42]/80">
                Showing {sortedItems.length} of {wishlistCount} saved {sortedItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedItems.map((item) => (
                <MobileOptimizedCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  slug={item.slug}
                  image={item.image}
                  location={item.location}
                  rating={item.rating}
                  styles={item.styles}
                  type={item.type}
                  duration={item.duration}
                  price={item.price}
                  phone_number={item.phone_number}
                  website={item.website}
                />
              ))}
            </div>

            {/* No Results for Filter */}
            {sortedItems.length === 0 && wishlistCount > 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-[#5d4c42]/80">
                  No {filterType === 'all' ? 'items' : filterType === 'studio' ? 'studios' : 'retreats'} found in your wishlist.
                </p>
                <button
                  onClick={() => setFilterType('all')}
                  className="mt-4 text-[#5d4c42] hover:text-[#a39188] font-medium"
                >
                  Show all items
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 