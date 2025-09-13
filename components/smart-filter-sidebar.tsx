"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, DollarSign, Star, Hotel, Target, Check, X, Filter, Globe, Sparkles, Users } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronDown } from "lucide-react"
import { filterStudios, type SearchFilters } from "@/lib/search-utils"
import {
  getFilterCategories,
  calculateFilterCounts,
  getPopularFilters,
  type FilterCategory,
  type FilterOption
} from "@/lib/filter-options"
import type { Studio } from "@/lib/types"

interface SmartFilterSidebarProps {
  studios: Studio[]
  onFilterChange: (filteredStudios: Studio[]) => void
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

const CATEGORY_ICONS = {
  'location': MapPin,
  'quality': Star,
  'yoga-styles': Target,
  'amenities': Hotel,
  'languages': Globe,
  'features': Sparkles,
  'price': DollarSign
}

export function SmartFilterSidebar({
  studios,
  onFilterChange,
  isOpen,
  onClose,
  isMobile = false
}: SmartFilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || 'all',
    quality: searchParams.get('quality') || 'all',
    yogaStyles: searchParams.get('yogaStyles')?.split(',').filter(Boolean) || [],
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    languages: searchParams.get('languages')?.split(',').filter(Boolean) || [],
    features: searchParams.get('features')?.split(',').filter(Boolean) || [],
    price: searchParams.get('price') || 'all'
  })

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([
    'location', 'quality', 'yoga-styles' // Expand most important sections by default
  ]))

  // Get filter categories and options
  const filterCategories = getFilterCategories()
  const popularFilters = getPopularFilters()

  // Calculate filtered studios and counts
  const { filteredStudios, filterCounts } = useMemo(() => {
    const filtered = filterStudios(studios, filters)
    const counts = calculateFilterCounts(filtered)
    return { filteredStudios: filtered, filterCounts: counts }
  }, [studios, filters])

  // Update parent with filtered results
  useEffect(() => {
    onFilterChange(filteredStudios)
  }, [filteredStudios, onFilterChange])

  // Update URL when filters change
  const updateURL = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams()

    if (newFilters.query) params.set('q', newFilters.query)
    if (newFilters.location && newFilters.location !== 'all') params.set('location', newFilters.location)
    if (newFilters.quality && newFilters.quality !== 'all') params.set('quality', newFilters.quality)
    if (newFilters.yogaStyles?.length) params.set('yogaStyles', newFilters.yogaStyles.join(','))
    if (newFilters.amenities?.length) params.set('amenities', newFilters.amenities.join(','))
    if (newFilters.languages?.length) params.set('languages', newFilters.languages.join(','))
    if (newFilters.features?.length) params.set('features', newFilters.features.join(','))
    if (newFilters.price && newFilters.price !== 'all') params.set('price', newFilters.price)

    const url = params.toString() ? `/studios?${params.toString()}` : '/studios'
    router.push(url, { scroll: false })
  }, [router])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters)
    updateURL(newFilters)
  }, [updateURL])

  // Handle single select filter (location, quality, price)
  const handleSingleSelect = useCallback((category: string, value: string) => {
    const newFilters = {
      ...filters,
      [category]: value === 'all' ? 'all' : value
    }
    handleFilterChange(newFilters)
  }, [filters, handleFilterChange])

  // Handle multi-select filter (yoga styles, amenities, languages, features)
  const handleMultiSelect = useCallback((category: string, value: string) => {
    const currentValues = filters[category as keyof SearchFilters] as string[] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]

    const newFilters = { ...filters, [category]: newValues }
    handleFilterChange(newFilters)
  }, [filters, handleFilterChange])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: filters.query, // Keep search query
      location: 'all',
      quality: 'all',
      yogaStyles: [],
      amenities: [],
      languages: [],
      features: [],
      price: 'all'
    }
    handleFilterChange(clearedFilters)
  }, [filters.query, handleFilterChange])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.location !== 'all') count++
    if (filters.quality !== 'all') count++
    if (filters.yogaStyles?.length) count += filters.yogaStyles.length
    if (filters.amenities?.length) count += filters.amenities.length
    if (filters.languages?.length) count += filters.languages.length
    if (filters.features?.length) count += filters.features.length
    if (filters.price !== 'all') count++
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

  // Render filter option
  const renderFilterOption = useCallback((
    category: FilterCategory,
    option: FilterOption,
    isSelected: boolean
  ) => {
    const count = filterCounts[category.id]?.[option.id] || 0
    const isDisabled = count === 0 && !isSelected

    return (
      <div
        key={option.id}
        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${isSelected ? 'bg-[#f9f5f1] border border-[#e6ceb3]' : ''}`}
        onClick={() => {
          if (isDisabled) return

          if (category.multiSelect) {
            handleMultiSelect(category.id, option.id)
          } else {
            handleSingleSelect(category.id, option.id)
          }
        }}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {category.multiSelect && (
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              className="flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                isSelected ? 'text-[#a39188]' : 'text-gray-700'
              } truncate`}>
                {option.label}
              </span>
              {option.quality === 'high' && (
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
              )}
            </div>
            {option.description && (
              <p className="text-xs text-gray-500 truncate">
                {option.description}
              </p>
            )}
          </div>
        </div>
        <Badge
          variant="secondary"
          className={`ml-2 flex-shrink-0 ${
            count === 0 ? 'bg-gray-100 text-gray-400' : 'bg-[#e6ceb3] text-[#a39188]'
          }`}
        >
          {count}
        </Badge>
      </div>
    )
  }, [filterCounts, handleSingleSelect, handleMultiSelect])

  // Render filter category
  const renderFilterCategory = useCallback((category: FilterCategory) => {
    const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] || Filter
    const isExpanded = expandedSections.has(category.id)
    const visibleOptions = isExpanded ? category.options : category.options.slice(0, 6)

    // Get selected values for this category
    const getSelectedValues = (): string[] => {
      switch (category.id) {
        case 'location':
        case 'quality':
        case 'price':
          const singleValue = filters[category.id as keyof SearchFilters] as string
          return singleValue === 'all' ? [] : [singleValue]
        case 'yoga-styles':
          return filters.yogaStyles || []
        case 'amenities':
          return filters.amenities || []
        case 'languages':
          return filters.languages || []
        case 'features':
          return filters.features || []
        default:
          return []
      }
    }

    const selectedValues = getSelectedValues()
    const hasSelections = selectedValues.length > 0

    return (
      <div key={category.id} className="border-b border-gray-100 pb-4">
        <Collapsible>
          <CollapsibleTrigger
            className="w-full"
            onClick={() => toggleSection(category.id)}
          >
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-[#a39188]" />
                <span className="font-semibold text-gray-900">{category.label}</span>
                {hasSelections && (
                  <Badge className="bg-[#a39188] text-white">
                    {selectedValues.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                isExpanded ? 'transform rotate-180' : ''
              }`} />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 mt-2">
            {visibleOptions.map(option => renderFilterOption(
              category,
              option,
              selectedValues.includes(option.id)
            ))}

            {category.options.length > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection(category.id)}
                className="w-full text-[#a39188] hover:text-[#8b7355] mt-2"
              >
                {isExpanded ? 'Show Less' : `Show ${category.options.length - 6} More`}
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }, [expandedSections, filters, filterCounts, toggleSection, renderFilterOption])

  const filterSidebar = (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-[#a39188]" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge className="bg-[#a39188] text-white">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results summary */}
      <div className="px-4 py-3 bg-[#f9f5f1] border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing <span className="font-semibold text-[#a39188]">{filteredStudios.length}</span> of {studios.length} studios
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

      {/* Popular filters for quick access */}
      {activeFilterCount === 0 && (
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Filters</h3>
          <div className="flex flex-wrap gap-2">
            {popularFilters.slice(0, 6).map(filter => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  // Apply the popular filter based on its category
                  if (['south-bali', 'central-bali'].includes(filter.id)) {
                    handleSingleSelect('location', filter.id)
                  } else if (filter.id === 'excellent') {
                    handleSingleSelect('quality', filter.id)
                  } else if (['hatha', 'yin', 'vinyasa'].includes(filter.id)) {
                    handleMultiSelect('yogaStyles', filter.id)
                  } else if (['showers', 'yoga-mats'].includes(filter.id)) {
                    handleMultiSelect('amenities', filter.id)
                  } else if (['teacher-training', 'retreats'].includes(filter.id)) {
                    handleMultiSelect('features', filter.id)
                  }
                }}
                className="text-xs border-[#e6ceb3] hover:bg-[#f9f5f1] hover:border-[#a39188]"
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2 bg-[#e6ceb3] text-[#a39188]">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filter categories */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {filterCategories.map(renderFilterCategory)}
      </div>
    </div>
  )

  // For mobile, we'll be rendered inside the UniversalFilterLayout modal
  // For desktop, we'll be rendered inside the UniversalFilterLayout sidebar
  return (
    <div className="w-full h-full">
      {filterSidebar}
    </div>
  )
}