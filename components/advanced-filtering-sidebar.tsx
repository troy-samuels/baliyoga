"use client"

import { Filter, X, DollarSign, MapPin, Clock, Users, Zap, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "./ui/checkbox"
import { createServerClient } from "@/lib/supabase"

const LOCATION_GROUPS = [
  { label: "All Locations", value: "all", locations: [] },
  { label: "South Bali", value: "South Bali", locations: ["Badung Regency", "Denpasar City", "Denpasar", "Uluwatu", "Padang-Padang", "Canggu", "Seminyak", "Sanur"] },
  { label: "Central Bali", value: "Central Bali", locations: ["Gianyar Regency", "Ubud", "Bangli Regency", "Gianyar"] },
  { label: "East Bali", value: "East Bali", locations: ["Karangasem Regency", "Abang", "Klungkung Regency", "Karangasem", "Klungkung"] },
  { label: "North Bali", value: "North Bali", locations: ["Buleleng Regency", "Buleleng", "Singaraja", "Lovina"] },
  { label: "West Bali", value: "West Bali", locations: ["Jembrana Regency", "Tabanan Regency", "Gunung", "Jembrana", "Tabanan", "Bedugul"] },
  { label: "Islands", value: "Islands", locations: ["Nusa Penida", "Nusa Lembongan", "Nusa Ceningan"] },
]

const YOGA_STYLES = [
  "Hatha", "Vinyasa", "Yin", "Ashtanga", "Kundalini", "Bikram", "Hot Yoga", 
  "Restorative", "Power Yoga", "Meditation", "Breathwork", "Sound Healing"
]

const AMENITIES = [
  { value: "mat_rental", label: "Mat Rental" },
  { value: "shower", label: "Shower" },
  { value: "changing_room", label: "Changing Room" },
  { value: "parking", label: "Parking" },
  { value: "cafe", label: "Café" },
  { value: "shop", label: "Shop" },
  { value: "wifi", label: "WiFi" },
  { value: "air_conditioning", label: "AC" },
  { value: "outdoor_space", label: "Outdoor Space" },
]

const PRICE_RANGES = [
  { value: "budget", label: "Budget ($5-15)" },
  { value: "mid-range", label: "Mid-range ($15-25)" },
  { value: "luxury", label: "Luxury ($25-40)" },
  { value: "premium", label: "Premium ($40+)" },
]

const BEACH_PROXIMITY = [
  { value: "beachfront", label: "Beachfront" },
  { value: "walking_distance", label: "Walking Distance" },
  { value: "nearby", label: "Nearby" },
  { value: "inland", label: "Inland" },
]

export function AdvancedFilteringSidebar({ type = "studio" }: { type?: "studio" | "retreat" }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<Record<string, any>>({})

  // Get current filter values from URL
  const currentFilters: Record<string, any> = {
    location: searchParams.get('location') || 'all',
    yoga_styles: searchParams.get('yoga_styles')?.split(',') || [],
    price_range: searchParams.get('price_range') || '',
    amenities: searchParams.get('amenities')?.split(',') || [],
    beach_proximity: searchParams.get('beach_proximity') || '',
    beginner_friendly: searchParams.get('beginner_friendly') === 'true',
    advanced_classes: searchParams.get('advanced_classes') === 'true',
    teacher_training: searchParams.get('teacher_training') === 'true',
    meditation_offered: searchParams.get('meditation_offered') === 'true',
    sound_healing: searchParams.get('sound_healing') === 'true',
    outdoor_space: searchParams.get('outdoor_space') === 'true',
    // Retreat-specific filters
    ...(type === 'retreat' && {
      retreat_duration: searchParams.get('retreat_duration') || '',
      accommodation_included: searchParams.get('accommodation_included') === 'true',
      meals_included: searchParams.get('meals_included') === 'true',
      retreat_type: searchParams.get('retreat_type') || '',
    })
  }

  // Initialize temp filters
  useEffect(() => {
    setTempFilters(currentFilters)
  }, [searchParams])

  // Function to update URL with new filters
  const updateFilters = (updates: Record<string, any>) => {
    try {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all' || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'boolean' && !value)) {
          current.delete(key)
        } else if (Array.isArray(value)) {
          current.set(key, value.join(','))
        } else {
          current.set(key, value.toString())
        }
      })
      
      const search = current.toString()
      const query = search ? `?${search}` : ''
      
      if (typeof window !== 'undefined') {
        router.push(window.location.pathname + query)
      }
    } catch (error) {
      console.warn('Error updating filters:', error)
    }
  }

  // Apply filters function for mobile
  const applyFilters = () => {
    updateFilters(tempFilters)
    setIsFilterOpen(false)
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: any, isMobile: boolean = false) => {
    if (isMobile) {
      setTempFilters(prev => ({ ...prev, [key]: value }))
    } else {
      updateFilters({ [key]: value })
    }
  }

  // Handle array filter changes (yoga styles, amenities)
  const handleArrayFilterChange = (key: string, item: string, isMobile: boolean = false) => {
    const targetFilters = isMobile ? tempFilters : currentFilters
    const currentArray = targetFilters[key] || []
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i: string) => i !== item)
      : [...currentArray, item]
    
    handleFilterChange(key, newArray, isMobile)
  }

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = Object.keys(currentFilters).reduce((acc: Record<string, any>, key) => {
      acc[key] = key === 'location' ? 'all' : (Array.isArray(currentFilters[key]) ? [] : '')
      return acc
    }, {})
    
    updateFilters(clearedFilters)
  }

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6ceb3] px-4 py-3 font-medium text-[#5d4c42]"
        >
          <Filter className="h-5 w-5" />
          Advanced Filters
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-[#f2e8dc] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#5d4c42]">Advanced Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="rounded-full bg-[#a39188] p-2 text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent
              type={type}
              filters={tempFilters}
              onFilterChange={(key, value) => handleFilterChange(key, value, true)}
              onArrayFilterChange={(key, item) => handleArrayFilterChange(key, item, true)}
              onApplyFilters={applyFilters}
              onClearFilters={clearAllFilters}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-6rem)] lg:w-80 lg:overflow-auto">
        <div className="space-y-6 rounded-2xl bg-[#f2e8dc] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#5d4c42]">Advanced Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#a39188] hover:text-[#5d4c42] transition-colors"
            >
              Clear All
            </button>
          </div>
          <FilterContent
            type={type}
            filters={currentFilters}
            onFilterChange={(key, value) => handleFilterChange(key, value, false)}
            onArrayFilterChange={(key, item) => handleArrayFilterChange(key, item, false)}
            isMobile={false}
          />
        </div>
      </div>
    </>
  )
}

interface FilterContentProps {
  type: "studio" | "retreat"
  filters: Record<string, any>
  onFilterChange: (key: string, value: any) => void
  onArrayFilterChange: (key: string, item: string) => void
  onApplyFilters?: () => void
  onClearFilters?: () => void
  isMobile: boolean
}

function FilterContent({ 
  type,
  filters,
  onFilterChange,
  onArrayFilterChange,
  onApplyFilters,
  onClearFilters,
  isMobile
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Location Filter */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d4c42]">
          <MapPin className="h-4 w-4" />
          Location
        </h4>
        <div className="space-y-2 rounded-xl bg-[#a39188] p-3 text-white">
          {LOCATION_GROUPS.map((group) => (
            <div key={group.value} className="flex items-center justify-between">
              <span className="text-sm">{group.label}</span>
              <input
                type="radio"
                name={isMobile ? "mobile-location" : "desktop-location"}
                value={group.value}
                checked={filters.location === group.value}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="h-3 w-3 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Yoga Styles Filter */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d4c42]">
          <Zap className="h-4 w-4" />
          Yoga Styles
        </h4>
        <div className="space-y-2 rounded-xl bg-white p-3 border border-[#e6ceb3]">
          {YOGA_STYLES.map((style) => (
            <div key={style} className="flex items-center space-x-2">
              <Checkbox
                id={`${isMobile ? 'mobile-' : 'desktop-'}style-${style}`}
                checked={filters.yoga_styles?.includes(style) || false}
                onCheckedChange={() => onArrayFilterChange('yoga_styles', style)}
              />
              <label 
                htmlFor={`${isMobile ? 'mobile-' : 'desktop-'}style-${style}`}
                className="text-sm text-[#5d4c42] cursor-pointer"
              >
                {style}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d4c42]">
          <DollarSign className="h-4 w-4" />
          Price Range
        </h4>
        <div className="space-y-2 rounded-xl bg-[#a39188] p-3 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm">Any Price</span>
            <input
              type="radio"
              name={isMobile ? "mobile-price" : "desktop-price"}
              value=""
              checked={filters.price_range === ''}
              onChange={(e) => onFilterChange('price_range', e.target.value)}
              className="h-3 w-3 cursor-pointer"
            />
          </div>
          {PRICE_RANGES.map((range) => (
            <div key={range.value} className="flex items-center justify-between">
              <span className="text-sm">{range.label}</span>
              <input
                type="radio"
                name={isMobile ? "mobile-price" : "desktop-price"}
                value={range.value}
                checked={filters.price_range === range.value}
                onChange={(e) => onFilterChange('price_range', e.target.value)}
                className="h-3 w-3 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Beach Proximity Filter */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d4c42]">
          <MapPin className="h-4 w-4" />
          Beach Proximity
        </h4>
        <div className="space-y-2 rounded-xl bg-[#a39188] p-3 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm">Any Distance</span>
            <input
              type="radio"
              name={isMobile ? "mobile-beach" : "desktop-beach"}
              value=""
              checked={filters.beach_proximity === ''}
              onChange={(e) => onFilterChange('beach_proximity', e.target.value)}
              className="h-3 w-3 cursor-pointer"
            />
          </div>
          {BEACH_PROXIMITY.map((proximity) => (
            <div key={proximity.value} className="flex items-center justify-between">
              <span className="text-sm">{proximity.label}</span>
              <input
                type="radio"
                name={isMobile ? "mobile-beach" : "desktop-beach"}
                value={proximity.value}
                checked={filters.beach_proximity === proximity.value}
                onChange={(e) => onFilterChange('beach_proximity', e.target.value)}
                className="h-3 w-3 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d4c42]">
          <Users className="h-4 w-4" />
          Amenities
        </h4>
        <div className="space-y-2 rounded-xl bg-white p-3 border border-[#e6ceb3]">
          {AMENITIES.map((amenity) => (
            <div key={amenity.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${isMobile ? 'mobile-' : 'desktop-'}amenity-${amenity.value}`}
                checked={filters.amenities?.includes(amenity.value) || false}
                onCheckedChange={() => onArrayFilterChange('amenities', amenity.value)}
              />
              <label 
                htmlFor={`${isMobile ? 'mobile-' : 'desktop-'}amenity-${amenity.value}`}
                className="text-sm text-[#5d4c42] cursor-pointer"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Level & Features */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d4c42]">
          <Clock className="h-4 w-4" />
          Experience & Features
        </h4>
        <div className="space-y-2 rounded-xl bg-white p-3 border border-[#e6ceb3]">
          {[
            { key: 'beginner_friendly', label: 'Beginner Friendly' },
            { key: 'advanced_classes', label: 'Advanced Classes' },
            { key: 'teacher_training', label: 'Teacher Training' },
            { key: 'meditation_offered', label: 'Meditation' },
            { key: 'sound_healing', label: 'Sound Healing' },
            { key: 'outdoor_space', label: 'Outdoor Space' },
          ].map((feature) => (
            <div key={feature.key} className="flex items-center space-x-2">
              <Checkbox
                id={`${isMobile ? 'mobile-' : 'desktop-'}${feature.key}`}
                checked={filters[feature.key] || false}
                onCheckedChange={(checked) => onFilterChange(feature.key, checked)}
              />
              <label 
                htmlFor={`${isMobile ? 'mobile-' : 'desktop-'}${feature.key}`}
                className="text-sm text-[#5d4c42] cursor-pointer"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Retreat-specific filters */}
      {type === 'retreat' && (
        <>
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d4c42]">
              <Calendar className="h-4 w-4" />
              Retreat Duration
            </h4>
            <div className="space-y-2 rounded-xl bg-[#a39188] p-3 text-white">
              {[
                { value: '', label: 'Any Duration' },
                { value: '1-3', label: '1-3 days' },
                { value: '4-7', label: '4-7 days' },
                { value: '8-14', label: '1-2 weeks' },
                { value: '15+', label: '2+ weeks' },
              ].map((duration) => (
                <div key={duration.value} className="flex items-center justify-between">
                  <span className="text-sm">{duration.label}</span>
                  <input
                    type="radio"
                    name={isMobile ? "mobile-duration" : "desktop-duration"}
                    value={duration.value}
                    checked={filters.retreat_duration === duration.value}
                    onChange={(e) => onFilterChange('retreat_duration', e.target.value)}
                    className="h-3 w-3 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#5d4c42]">Retreat Inclusions</h4>
            <div className="space-y-2 rounded-xl bg-white p-3 border border-[#e6ceb3]">
              {[
                { key: 'accommodation_included', label: 'Accommodation Included' },
                { key: 'meals_included', label: 'Meals Included' },
              ].map((inclusion) => (
                <div key={inclusion.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${isMobile ? 'mobile-' : 'desktop-'}${inclusion.key}`}
                    checked={filters[inclusion.key] || false}
                    onCheckedChange={(checked) => onFilterChange(inclusion.key, checked)}
                  />
                  <label 
                    htmlFor={`${isMobile ? 'mobile-' : 'desktop-'}${inclusion.key}`}
                    className="text-sm text-[#5d4c42] cursor-pointer"
                  >
                    {inclusion.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="flex gap-2 pt-4">
          <button 
            onClick={onClearFilters}
            className="flex-1 rounded-xl bg-gray-200 py-3 font-medium text-[#5d4c42] hover:bg-gray-300 transition-colors"
          >
            Clear All
          </button>
          <button 
            onClick={onApplyFilters}
            className="flex-1 rounded-xl bg-[#e6ceb3] py-3 font-medium text-[#5d4c42] hover:bg-[#d9b99a] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
} 