"use client"

import { OptimizedImage } from "./optimized-image"
import { Search } from "lucide-react"
import { useState } from "react"

export function MobileOptimizedHero() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative h-[400px] w-full sm:h-[500px] md:h-[600px]">
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src="/images/hero-yoga-bali-realistic.png"
          alt="Serene yoga setup with mat and props overlooking beautiful Balinese rice terraces, palm trees, and traditional temple architecture"
          fill
          className="object-cover object-center"
          priority={true}
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
          Find Your Ideal Yoga Experience in Bali
        </h1>

        {/* Mobile-First Search */}
        <div className="w-full max-w-3xl">
          {/* Mobile Search - Simplified */}
          <div className="block sm:hidden">
            <div className="rounded-2xl bg-white p-3 shadow-lg">
              <div className="flex items-center rounded-xl bg-gray-100 px-4 py-3">
                <Search className="mr-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search yoga studios and retreats"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              <button className="mt-3 w-full rounded-xl bg-[#e6ceb3] py-3 font-medium text-[#5d4c42] transition-colors hover:bg-[#d9b99a]">
                Search
              </button>
            </div>
          </div>

          {/* Desktop Search - Simplified */}
          <div className="hidden rounded-full bg-white p-2 shadow-lg sm:block">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
                <Search className="mr-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search yoga studios and retreats"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              <button className="rounded-full bg-[#e6ceb3] px-6 py-2 font-medium text-[#5d4c42] transition-colors hover:bg-[#d9b99a]">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
