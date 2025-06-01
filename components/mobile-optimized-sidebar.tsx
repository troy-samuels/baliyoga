"use client"

import { Filter, X, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { YogaFlowerIcon } from "./yoga-flower-icon"
import { Checkbox } from "./ui/checkbox"
import { createServerClient } from "@/lib/supabase"

const LOCATION_GROUPS = [
  { label: "South Bali", value: "South Bali", locations: ["Badung Regency", "Denpasar City", "Denpasar", "Uluwatu", "Padang-Padang", "Canggu"] },
  { label: "Central Bali", value: "Central Bali", locations: ["Gianyar Regency", "Ubud", "Bangli Regency"] },
  { label: "East Bali", value: "East Bali", locations: ["Karangasem Regency", "Abang", "Klungkung Regency"] },
  { label: "North Bali", value: "North Bali", locations: ["Buleleng Regency"] },
  { label: "West Bali", value: "West Bali", locations: ["Jembrana Regency", "Tabanan Regency", "Gunung"] },
  { label: "Islands", value: "Islands", locations: ["Nusa Penida"] },
]

export function MobileOptimizedSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  const [postcodes, setPostcodes] = useState<string[]>([])

  // Get current filter values from URL (only location now)
  const selectedLocation = searchParams.get('location') || 'all'

  // Function to update URL with new filters
  const updateFilters = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(window.location.pathname + query)
  }

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
              cities={cities}
              selectedLocation={selectedLocation}
              updateFilters={updateFilters}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-6rem)] lg:w-72 lg:overflow-auto">
        <div className="space-y-6 rounded-2xl bg-[#f2e8dc] p-6 shadow-sm">
          <FilterContent
            cities={cities}
            selectedLocation={selectedLocation}
            updateFilters={updateFilters}
          />
        </div>
      </div>
    </>
  )
}

interface FilterContentProps {
  cities: string[]
  selectedLocation: string
  updateFilters: (updates: Record<string, string | null>) => void
}

function FilterContent({ 
  cities,
  selectedLocation,
  updateFilters
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
              <input
                type="radio"
                name="location"
                value={group.value}
                checked={selectedLocation === group.value}
                onChange={(e) => updateFilters({ location: e.target.value })}
                className="h-4 w-4"
              />
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
