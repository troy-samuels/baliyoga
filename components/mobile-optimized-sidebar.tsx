"use client"

import { Filter, X, Calendar } from "lucide-react"
import { useState } from "react"
import { YogaFlowerIcon } from "./yoga-flower-icon"

export function MobileOptimizedSidebar() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [ratingFilter, setRatingFilter] = useState(3)

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6ceb3] px-4 py-3 font-medium text-[#5d4c42]"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[#f2e8dc] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#5d4c42]">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="rounded-full bg-[#a39188] p-2 text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-6rem)] lg:w-72 lg:overflow-auto">
        <div className="space-y-6 rounded-2xl bg-[#f2e8dc] p-6 shadow-sm">
          <FilterContent ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} />
        </div>
      </div>
    </>
  )
}

interface FilterContentProps {
  ratingFilter: number
  setRatingFilter: (rating: number) => void
}

function FilterContent({ ratingFilter, setRatingFilter }: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Location Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Location</h3>
        <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
          {["Ubud", "Canggu", "Seminyak", "Uluwatu"].map((location) => (
            <div key={location} className="flex items-center justify-between">
              <span className="text-sm lg:text-base">{location}</span>
              <input type="checkbox" className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Quality Rating Filter with Slider */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Quality Rating</h3>
        <div className="space-y-4 rounded-xl bg-[#a39188] p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm lg:text-base">Rating: {ratingFilter}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <YogaFlowerIcon key={i} className="h-4 w-4" filled={i < Math.floor(ratingFilter)} />
              ))}
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min="3"
              max="5"
              step="0.5"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer transition-all duration-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
              style={{ 
                left: `${((ratingFilter - 3) / 2) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <YogaFlowerIcon className="h-6 w-6" filled={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Yoga Style Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Yoga Style</h3>
        <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
          {["Hatha", "Vinyasa", "Yin", "Ashtanga", "Kundalini"].map((style) => (
            <div key={style} className="flex items-center justify-between">
              <span className="text-sm lg:text-base">{style}</span>
              <input type="checkbox" className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Availability</h3>
        <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm lg:text-base">Select dates</span>
          </div>
          <div className="space-y-2">
            {["Morning", "Afternoon", "Evening"].map((time) => (
              <div key={time} className="flex items-center justify-between">
                <span className="text-sm lg:text-base">{time}</span>
                <input type="checkbox" className="h-4 w-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Price Range</h3>
        <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
          {["Free", "<$20/day", "$20–$100/day", "$100+"].map((price) => (
            <div key={price} className="flex items-center justify-between">
              <span className="text-sm lg:text-base">{price}</span>
              <input type="checkbox" className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Amenities</h3>
        <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
          {["Pool", "Vegan Meals", "Wi-Fi", "Air Conditioning", "Spa"].map((amenity) => (
            <div key={amenity} className="flex items-center justify-between">
              <span className="text-sm lg:text-base">{amenity}</span>
              <input type="checkbox" className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Apply Button */}
      <div className="lg:hidden">
        <button className="w-full rounded-xl bg-[#e6ceb3] py-3 font-medium text-[#5d4c42]">Apply Filters</button>
      </div>
    </div>
  )
}
