"use client"

import { Filter, X, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { YogaFlowerIcon } from "./yoga-flower-icon"
import { Checkbox } from "./ui/checkbox"
import { createServerClient } from "@/lib/supabase"

const LOCATION_GROUPS = [
  { label: "Ubud", value: "Ubud" },
  { label: "Uluwatu", value: "Uluwatu" },
  { label: "Canggu", value: "Canggu" },
  { label: "South Bali", value: "South Bali", locations: ["Badung Regency", "Denpasar City", "Denpasar", "Uluwatu", "Padang-Padang", "Canggu"] },
  { label: "Central Bali", value: "Central Bali", locations: ["Gianyar Regency", "Ubud", "Bangli Regency"] },
  { label: "East Bali", value: "East Bali", locations: ["Karangasem Regency", "Abang", "Klungkung Regency"] },
  { label: "North Bali", value: "North Bali", locations: ["Buleleng Regency"] },
  { label: "West Bali", value: "West Bali", locations: ["Jembrana Regency", "Tabanan Regency", "Gunung"] },
  { label: "Islands", value: "Islands", locations: ["Nusa Penida"] },
]

export function MobileOptimizedSidebar() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [ratingFilter, setRatingFilter] = useState(3)
  const [reviewCountFilter, setReviewCountFilter] = useState(0)
  const [hasImages, setHasImages] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [postcodes, setPostcodes] = useState<string[]>([])

  // Fetch filter options from Supabase
  useEffect(() => {
    async function fetchFilterOptions() {
      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('v2_bali_yoga_studios_and_retreats')
        .select('city, postcode, images')
      if (error) return
      setCities(Array.from(new Set(data.map((d: any) => d.city).filter(Boolean))))
      setPostcodes(Array.from(new Set(data.map((d: any) => d.postcode).filter(Boolean))))
    }
    fetchFilterOptions()
  }, [])

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
            <FilterContent
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              reviewCountFilter={reviewCountFilter}
              setReviewCountFilter={setReviewCountFilter}
              hasImages={hasImages}
              setHasImages={setHasImages}
              cities={cities}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              postcodes={postcodes}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-6rem)] lg:w-72 lg:overflow-auto">
        <div className="space-y-6 rounded-2xl bg-[#f2e8dc] p-6 shadow-sm">
          <FilterContent
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            reviewCountFilter={reviewCountFilter}
            setReviewCountFilter={setReviewCountFilter}
            hasImages={hasImages}
            setHasImages={setHasImages}
            cities={cities}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            postcodes={postcodes}
          />
        </div>
      </div>
    </>
  )
}

interface FilterContentProps {
  ratingFilter: number
  setRatingFilter: (rating: number) => void
  reviewCountFilter: number
  setReviewCountFilter: (count: number) => void
  hasImages: boolean
  setHasImages: (val: boolean) => void
  cities: string[]
  selectedType: string
  setSelectedType: (type: string) => void
  postcodes: string[]
}

function FilterContent({ 
  ratingFilter, 
  setRatingFilter, 
  reviewCountFilter, 
  setReviewCountFilter, 
  hasImages, 
  setHasImages, 
  cities,
  selectedType,
  setSelectedType
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Location/Area Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Area</h3>
        <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
          {LOCATION_GROUPS.map((group) => (
            <div key={group.value} className="flex items-center justify-between">
              <span className="text-sm lg:text-base">{group.label}</span>
              <Checkbox />
            </div>
          ))}
        </div>
      </div>
      {/* Type Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Type</h3>
        <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm lg:text-base">All</span>
            <input
              type="radio"
              name="type"
              value="all"
              checked={selectedType === "all"}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm lg:text-base">Yoga Studios</span>
            <input
              type="radio"
              name="type"
              value="studio"
              checked={selectedType === "studio"}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm lg:text-base">Retreats</span>
            <input
              type="radio"
              name="type"
              value="retreat"
              checked={selectedType === "retreat"}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-4 w-4"
            />
          </div>
        </div>
      </div>
      {/* Rating Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Quality Rating</h3>
        <div className="space-y-4 rounded-xl bg-[#a39188] p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm lg:text-base">Rating: {ratingFilter}+</span>
          </div>
          <input
            type="range"
            min="3"
            max="5"
            step="0.5"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>
      {/* Minimum Reviews Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Minimum Reviews</h3>
        <div className="space-y-4 rounded-xl bg-[#a39188] p-4 text-white">
          <input
            type="number"
            min="0"
            value={reviewCountFilter}
            onChange={(e) => setReviewCountFilter(Number(e.target.value))}
            className="w-full rounded px-2 py-1 text-[#5d4c42]"
            placeholder="e.g. 10"
          />
        </div>
      </div>
      {/* Has Images Filter */}
      <div>
        <h3 className="mb-3 text-base font-cormorant font-semibold text-[#5d4c42] lg:text-lg">Has Images</h3>
        <div className="rounded-xl bg-[#a39188] p-4 text-white flex items-center gap-2">
          <input type="checkbox" checked={hasImages} onChange={e => setHasImages(e.target.checked)} />
          <span className="text-sm lg:text-base">Only show listings with images</span>
        </div>
      </div>
      {/* Mobile Apply Button */}
      <div className="lg:hidden">
        <button className="w-full rounded-xl bg-[#e6ceb3] py-3 font-medium text-[#5d4c42]">Apply Filters</button>
      </div>
    </div>
  )
}
