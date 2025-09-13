"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, DollarSign, Star, Calendar, Users, Target, Check, X, Filter, Clock } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronDown } from "lucide-react"
import { filterRetreats, type SearchFilters } from "@/lib/search-utils"
import type { Retreat } from "@/lib/types"

interface RetreatFilterSidebarProps {
  retreats: Retreat[]
  onFilterChange: (filteredRetreats: Retreat[]) => void
  isMobile?: boolean
}

// Retreat-specific filter options
const RETREAT_DURATION_OPTIONS = [
  { id: 'weekend', label: '2-3 Days', count: 0 },
  { id: 'week', label: '5-7 Days', count: 0 },
  { id: 'extended', label: '10+ Days', count: 0 },
  { id: 'month', label: '21+ Days', count: 0 }
]

const RETREAT_TYPE_OPTIONS = [
  { id: 'wellness', label: 'Wellness Retreat', count: 0 },
  { id: 'spiritual', label: 'Spiritual Journey', count: 0 },
  { id: 'detox', label: 'Detox & Cleanse', count: 0 },
  { id: 'adventure', label: 'Adventure Yoga', count: 0 },
  { id: 'couples', label: 'Couples Retreat', count: 0 },
  { id: 'solo', label: 'Solo Friendly', count: 0 }
]

const ACCOMMODATION_OPTIONS = [
  { id: 'shared', label: 'Shared Room', count: 0 },
  { id: 'private', label: 'Private Room', count: 0 },
  { id: 'villa', label: 'Private Villa', count: 0 },
  { id: 'glamping', label: 'Eco Glamping', count: 0 }
]

const PRICE_RANGE_OPTIONS = [
  { id: 'budget', label: 'Budget ($0-$500)', count: 0 },
  { id: 'mid', label: 'Mid-range ($500-$1500)', count: 0 },
  { id: 'luxury', label: 'Luxury ($1500+)', count: 0 }
]

const LOCATION_GROUPS = [
  { id: 'south-bali', label: 'South Bali', count: 0 },
  { id: 'central-bali', label: 'Central Bali', count: 0 },
  { id: 'east-bali', label: 'East Bali', count: 0 },
  { id: 'north-bali', label: 'North Bali', count: 0 },
  { id: 'west-bali', label: 'West Bali', count: 0 },
  { id: 'islands', label: 'Islands', count: 0 }
]

export function RetreatFilterSidebar({
  retreats,
  onFilterChange,
  isMobile = false
}: RetreatFilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || 'all',
    duration: searchParams.get('duration') || 'all',
    retreatType: searchParams.get('type') || 'all',
    accommodation: searchParams.get('accommodation') || 'all',
    price: searchParams.get('price') || 'all',
    features: searchParams.get('features')?.split(',').filter(Boolean) || []
  })

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([
    'location', 'duration', 'price'
  ]))

  // Calculate filtered retreats and counts
  const { filteredRetreats, filterCounts } = useMemo(() => {
    const filtered = filterRetreats(retreats, filters)

    // Calculate counts for each filter option
    const counts = {
      location: { ...Object.fromEntries(LOCATION_GROUPS.map(g => [g.id, 0])) },
      duration: { ...Object.fromEntries(RETREAT_DURATION_OPTIONS.map(d => [d.id, 0])) },
      retreatType: { ...Object.fromEntries(RETREAT_TYPE_OPTIONS.map(t => [t.id, 0])) },
      accommodation: { ...Object.fromEntries(ACCOMMODATION_OPTIONS.map(a => [a.id, 0])) },
      price: { ...Object.fromEntries(PRICE_RANGE_OPTIONS.map(p => [p.id, 0])) }
    }

    // Count matching retreats for each filter
    retreats.forEach(retreat => {
      // Location counts (simplified for now)
      if (retreat.location?.toLowerCase().includes('ubud') || retreat.location?.toLowerCase().includes('gianyar')) {
        counts.location['central-bali']++
      } else if (retreat.location?.toLowerCase().includes('canggu') || retreat.location?.toLowerCase().includes('seminyak')) {
        counts.location['south-bali']++
      }

      // Duration counts (based on retreat duration field)
      if (retreat.duration) {
        const duration = retreat.duration.toLowerCase()
        if (duration.includes('weekend') || duration.includes('2') || duration.includes('3')) {
          counts.duration.weekend++
        } else if (duration.includes('week') || duration.includes('5') || duration.includes('7')) {
          counts.duration.week++
        } else if (duration.includes('10') || duration.includes('14')) {
          counts.duration.extended++
        } else if (duration.includes('21') || duration.includes('month')) {
          counts.duration.month++
        }
      }

      // Price range counts (based on retreat price)
      if (retreat.price) {
        const priceNum = parseFloat(retreat.price.replace(/[^\d]/g, ''))
        if (priceNum <= 500) {
          counts.price.budget++
        } else if (priceNum <= 1500) {
          counts.price.mid++
        } else {
          counts.price.luxury++
        }
      }
    })

    return { filteredRetreats: filtered, filterCounts: counts }
  }, [retreats, filters])

  // Update parent with filtered results
  useEffect(() => {
    onFilterChange(filteredRetreats)
  }, [filteredRetreats, onFilterChange])

  // Update URL when filters change
  const updateURL = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams()

    if (newFilters.query) params.set('q', newFilters.query)
    if (newFilters.location && newFilters.location !== 'all') params.set('location', newFilters.location)
    if (newFilters.duration && newFilters.duration !== 'all') params.set('duration', newFilters.duration)
    if (newFilters.retreatType && newFilters.retreatType !== 'all') params.set('type', newFilters.retreatType)
    if (newFilters.accommodation && newFilters.accommodation !== 'all') params.set('accommodation', newFilters.accommodation)
    if (newFilters.price && newFilters.price !== 'all') params.set('price', newFilters.price)
    if (newFilters.features?.length) params.set('features', newFilters.features.join(','))

    const url = params.toString() ? `/retreats?${params.toString()}` : '/retreats'
    router.push(url, { scroll: false })
  }, [router])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters)
    updateURL(newFilters)
  }, [updateURL])

  // Handle single select filter
  const handleSingleSelect = useCallback((category: string, value: string) => {
    const newFilters = {
      ...filters,
      [category]: value === 'all' ? 'all' : value
    }
    handleFilterChange(newFilters)
  }, [filters, handleFilterChange])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: filters.query,
      location: 'all',
      duration: 'all',
      retreatType: 'all',
      accommodation: 'all',
      price: 'all',
      features: []
    }
    handleFilterChange(clearedFilters)
  }, [filters.query, handleFilterChange])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.location !== 'all') count++
    if (filters.duration !== 'all') count++
    if (filters.retreatType !== 'all') count++
    if (filters.accommodation !== 'all') count++
    if (filters.price !== 'all') count++
    if (filters.features?.length) count += filters.features.length
    return count
  }, [filters])

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }, [])

  // Render filter section
  const renderFilterSection = (
    id: string,
    icon: React.ElementType,
    label: string,
    options: Array<{ id: string, label: string, count: number }>,
    selectedValue: string,
    countsCategory: keyof typeof filterCounts
  ) => {
    const Icon = icon
    const isExpanded = expandedSections.has(id)

    return (
      <div key={id} className="border-b border-gray-100 pb-4">
        <Collapsible>
          <CollapsibleTrigger
            className="w-full"
            onClick={() => toggleSection(id)}
          >
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-[#a39188]" />
                <span className="font-semibold text-gray-900">{label}</span>
                {selectedValue !== 'all' && (
                  <Badge className="bg-[#a39188] text-white">1</Badge>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                isExpanded ? 'transform rotate-180' : ''
              }`} />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 mt-2">
            <div
              className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
                selectedValue === 'all' ? 'bg-[#f9f5f1] border border-[#e6ceb3]' : ''
              }`}
              onClick={() => handleSingleSelect(id, 'all')}
            >
              <span className="text-sm font-medium text-gray-700">All {label}</span>
              <Badge variant="secondary" className="bg-[#e6ceb3] text-[#a39188]">
                {retreats.length}
              </Badge>
            </div>

            {options.map(option => {
              const count = filterCounts[countsCategory]?.[option.id] || 0
              const isSelected = selectedValue === option.id
              const isDisabled = count === 0 && !isSelected

              return (
                <div
                  key={option.id}
                  className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } ${isSelected ? 'bg-[#f9f5f1] border border-[#e6ceb3]' : ''}`}
                  onClick={() => {
                    if (!isDisabled) {
                      handleSingleSelect(id, option.id)
                    }
                  }}
                >
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-[#a39188]' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`${
                      count === 0 ? 'bg-gray-100 text-gray-400' : 'bg-[#e6ceb3] text-[#a39188]'
                    }`}
                  >
                    {count}
                  </Badge>
                </div>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-[#a39188]" />
          <h2 className="text-lg font-semibold text-gray-900">Retreat Filters</h2>
          {activeFilterCount > 0 && (
            <Badge className="bg-[#a39188] text-white">
              {activeFilterCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="px-4 py-3 bg-[#f9f5f1] border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing <span className="font-semibold text-[#a39188]">{filteredRetreats.length}</span> of {retreats.length} retreats
          </span>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-[#a39188] hover:text-[#8b7355] p-1"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter sections */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {renderFilterSection('location', MapPin, 'Location', LOCATION_GROUPS, filters.location || 'all', 'location')}
        {renderFilterSection('duration', Calendar, 'Duration', RETREAT_DURATION_OPTIONS, filters.duration || 'all', 'duration')}
        {renderFilterSection('price', DollarSign, 'Price Range', PRICE_RANGE_OPTIONS, filters.price || 'all', 'price')}
        {renderFilterSection('accommodation', Users, 'Accommodation', ACCOMMODATION_OPTIONS, filters.accommodation || 'all', 'accommodation')}
      </div>
    </div>
  )
}