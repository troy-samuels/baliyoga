"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, DollarSign, Star, Hotel, Target, Check, X, TrendingUp, Zap, Award, Clock, Sparkles, Filter, Waves, Palmtree, Trees, Sunrise, Sprout, Flame, Mountain, GraduationCap, Users, CheckCircle } from "lucide-react"
// Removed framer-motion dependency - using pure CSS animations
import { YogaFlowerIcon } from "./yoga-flower-icon"
import { Checkbox } from "./ui/checkbox"
import { Badge } from "./ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { applyIntelligentFilters } from "@/lib/filter-intelligence"
import type { Studio } from "@/lib/types"

// Use the actual Studio type from lib/types.ts with additional fields for quality calculation
type StudioProfile = Studio & {
  // Quality calculation fields - these won't exist in the data but are calculated
  enrichment_score?: number
  email_address?: string
  instagram_handle?: string
  facebook_url?: string
  whatsapp_number?: string
  computed?: any
}

// Quality metrics for studio profiles
type QualityMetrics = {
  completionPercentage: number
  verifiedFields: string[]
  lastUpdated?: Date
  verificationStatus: 'verified' | 'partial' | 'unverified'
  contactConfidenceScore: number
}

interface FilterCategory {
  id: string
  icon: React.ElementType
  label: string
  count: number
  options: FilterOption[]
}

interface FilterOption {
  id: string
  label: string
  icon?: React.ReactNode
  count: number
  verified?: boolean
  estimated?: boolean
  quality?: 'high' | 'medium' | 'low'
  completionBonus?: number
  urgency?: string
}

interface EnhancedFilterSidebarProps {
  studios: StudioProfile[]
  onFilterChange: (filteredStudios: StudioProfile[]) => void
}

// Consolidated 5 strategic filter categories
const filterCategories: Omit<FilterCategory, 'count' | 'options'>[] = [
  { id: 'location', icon: MapPin, label: 'Location' },
  { id: 'quality', icon: Star, label: 'Quality & Verification' },
  { id: 'experience', icon: Target, label: 'Experience & Styles' },
  { id: 'services', icon: Hotel, label: 'Services & Amenities' },
  { id: 'value', icon: DollarSign, label: 'Value & Contact' }
]

// Location Filter Dropdown Component
interface LocationFilterDropdownProps {
  locationOptions: FilterOption[]
  activeLocation: string | null
  onLocationSelect: (locationId: string | null) => void
  isMobile?: boolean
}

function LocationFilterDropdown({ locationOptions, activeLocation, onLocationSelect, isMobile = false }: LocationFilterDropdownProps) {
  const activeLocationOption = locationOptions.find(opt => opt.id === activeLocation)
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-white border-[#e6ceb3] hover:bg-[#f9f5f1] ${
            activeLocation ? 'border-[#a39188] bg-[#f9f5f1]' : ''
          } whitespace-nowrap`}
        >
          <MapPin className="h-4 w-4 mr-2 text-[#a39188]" />
          {activeLocationOption ? (
            <span className="flex items-center gap-2">
              {activeLocationOption.icon} {activeLocationOption.label}
            </span>
          ) : (
            'All Locations'
          )}
          {activeLocation && (
            <Badge className="ml-2 h-4 px-1 bg-[#a39188] text-white text-xs">1</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-[#f2e8dc] border-[#e6ceb3]" align="start">
        <div className="space-y-1">
          <button
            onClick={() => onLocationSelect(null)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              !activeLocation ? 'bg-[#e6ceb3] text-[#5d4c42]' : 'hover:bg-[#e6ceb3]/50'
            }`}
          >
            All Locations ({locationOptions.reduce((sum, opt) => sum + opt.count, 0)})
          </button>
          {locationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onLocationSelect(option.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between ${
                activeLocation === option.id ? 'bg-[#e6ceb3] text-[#5d4c42]' : 'hover:bg-[#e6ceb3]/50'
              }`}
            >
              <span className="flex items-center gap-2">
                {option.icon && <span>{option.icon}</span>}
                {option.label}
                {option.verified && <Check className="h-3 w-3 text-green-600" />}
              </span>
              <span className="text-xs text-[#a39188]">({option.count})</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Desktop Filter Chip Component
interface FilterChipProps {
  category: FilterCategory | undefined
  activeFilters: string[]
  onFilterToggle: (optionId: string, checked: boolean) => void
  icon: React.ReactNode
  label: string
}

function FilterChip({ category, activeFilters, onFilterToggle, icon, label }: FilterChipProps) {
  if (!category || !category.options.length) return null
  
  const hasActiveFilters = activeFilters.length > 0
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`px-4 py-2 bg-white border-[#e6ceb3] hover:bg-[#f9f5f1] ${
            hasActiveFilters ? 'border-[#a39188] bg-[#f9f5f1]' : ''
          } whitespace-nowrap flex items-center justify-center`}
        >
          <span className="mr-2">{icon}</span>
          {label}
          {hasActiveFilters && (
            <Badge className="ml-2 h-4 px-1 bg-[#a39188] text-white text-xs">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-[#f2e8dc] border-[#e6ceb3]" align="start">
        <div className="space-y-2">
          <h4 className="font-medium text-[#5d4c42] text-sm">{category.label}</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {category.options.map((option) => {
              const isChecked = activeFilters.includes(option.id)
              return (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-2 hover:bg-[#e6ceb3]/50 rounded transition-colors cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#a39188] focus:ring-opacity-50"
                  onClick={(e) => {
                    // Prevent event if clicking directly on checkbox
                    if ((e.target as HTMLElement).closest('[role="checkbox"]')) return
                    onFilterToggle(option.id, !isChecked)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onFilterToggle(option.id, !isChecked)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isChecked}
                  aria-label={`${isChecked ? 'Unselect' : 'Select'} ${option.label} filter option`}
                >
                  <div className="flex items-center gap-2 pointer-events-none">
                    {option.icon && <span>{option.icon}</span>}
                    <span className="text-sm">{option.label}</span>
                    {option.verified && <Check className="h-3 w-3 text-green-600" />}
                  </div>
                  <div className="flex items-center gap-2 pointer-events-none">
                    <span className="text-xs text-[#a39188]">({option.count})</span>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => onFilterToggle(option.id, checked as boolean)}
                      className="border-[#a39188] data-[state=checked]:bg-[#a39188] data-[state=checked]:border-[#a39188] pointer-events-auto"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Mobile Filter Chip Component
interface MobileFilterChipProps {
  icon: React.ReactNode
  label: string
  hasActive: boolean
  onClick: () => void
}

function MobileFilterChip({ icon, label, hasActive, onClick }: MobileFilterChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`px-4 py-2 text-sm bg-white border-[#e6ceb3] hover:bg-[#f9f5f1] ${
        hasActive ? 'border-[#a39188] bg-[#f9f5f1]' : ''
      } whitespace-nowrap flex-shrink-0 flex items-center justify-center`}
    >
      <span className="mr-2">{icon}</span>
      {label}
      {hasActive && (
        <div className="ml-1 h-2 w-2 bg-[#a39188] rounded-full"></div>
      )}
    </Button>
  )
}

// Calculate quality metrics for a studio
function calculateQualityMetrics(studio: StudioProfile): QualityMetrics {
  const fields = [
    'name', 'location', 'business_description', 'phone_number', 'website',
    'styles', 'amenities'
  ]
  
  const completedFields = fields.filter(field => {
    const value = studio[field as keyof StudioProfile]
    if (field === 'location') {
      return studio.location && studio.location.length > 0
    }
    if (field === 'business_description') {
      return studio.business_description && studio.business_description.length > 0
    }
    return value && (Array.isArray(value) ? value.length > 0 : true)
  })
  
  const verifiedFields = []
  if (studio.email_address) verifiedFields.push('email')
  if (studio.phone_number || studio.whatsapp_number) verifiedFields.push('contact')
  if (studio.website) verifiedFields.push('website')
  if (studio.rating >= 4.5) verifiedFields.push('highly_rated')
  
  const completionPercentage = Math.round((completedFields.length / fields.length) * 100)
  const contactConfidenceScore = (studio.email_address ? 40 : 0) + 
                                (studio.whatsapp_number ? 30 : 0) + 
                                (studio.phone_number ? 20 : 0) + 
                                (studio.website ? 10 : 0)
  
  let verificationStatus: 'verified' | 'partial' | 'unverified' = 'unverified'
  if (completionPercentage >= 80 && contactConfidenceScore >= 50) {
    verificationStatus = 'verified'
  } else if (completionPercentage >= 50 || contactConfidenceScore >= 30) {
    verificationStatus = 'partial'
  }
  
  return {
    completionPercentage,
    verifiedFields,
    verificationStatus,
    contactConfidenceScore
  }
}

export function EnhancedFilterSidebar({ studios, onFilterChange }: EnhancedFilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

  // Generate filter options with quality-driven intelligent counting
  const categoriesWithData = useMemo(() => {
    // Calculate quality metrics for all studios
    const studiosWithQuality = studios.map(studio => ({
      ...studio,
      qualityMetrics: calculateQualityMetrics(studio)
    }))
    
    return filterCategories.map(category => {
      let options: FilterOption[] = []
      let totalCount = 0

      switch (category.id) {
        case 'quality':
          // Profile completeness and verification options
          const qualityOptions = [
            {
              id: 'verified_studios',
              label: 'Verified Studios',
              icon: '✅',
              count: studiosWithQuality.filter(s => s.qualityMetrics.verificationStatus === 'verified').length,
              verified: true,
              quality: 'high' as const,
              urgency: 'Most Trusted'
            },
            {
              id: 'complete_profiles',
              label: 'Complete Profiles (80%+)',
              icon: <Star className="h-4 w-4 text-[#a39188]" />,
              count: studiosWithQuality.filter(s => s.qualityMetrics.completionPercentage >= 80).length,
              verified: true,
              quality: 'high' as const,
              completionBonus: 20
            },
            {
              id: 'premium_quality',
              label: '5-Star Studios',
              icon: <Award className="h-4 w-4 text-[#a39188]" />,
              count: studios.filter(s => s.rating >= 4.8).length,
              verified: true,
              quality: 'high' as const,
              urgency: 'Highest Rated'
            },
            {
              id: 'good_profiles',
              label: 'Good Profiles (60%+)',
              icon: <CheckCircle className="h-4 w-4 text-[#a39188]" />,
              count: studiosWithQuality.filter(s => s.qualityMetrics.completionPercentage >= 60).length,
              verified: true,
              quality: 'medium' as const
            }
          ]
          options = qualityOptions
          totalCount = studios.length
          break

        case 'location':
          // Geographic location areas with verification status
          const locationOptions = [
            { 
              id: 'canggu', 
              label: 'Canggu', 
              icon: <Waves className="h-4 w-4 text-[#a39188]" />,
              count: studios.filter(s => {
                const location = s.location?.toLowerCase() || ''
                const address = s.location_details?.address?.toLowerCase() || ''
                return location.includes('canggu') || address.includes('canggu')
              }).length,
              verified: true,
              urgency: 'Beach Vibes'
            },
            { 
              id: 'seminyak', 
              label: 'Seminyak', 
              icon: <Palmtree className="h-4 w-4 text-[#a39188]" />,
              count: studios.filter(s => {
                const location = s.location?.toLowerCase() || ''
                const address = s.location_details?.address?.toLowerCase() || ''
                return location.includes('seminyak') || address.includes('seminyak')
              }).length,
              verified: true,
              urgency: 'Luxury Zone'
            },
            { 
              id: 'ubud', 
              label: 'Ubud', 
              icon: <Trees className="h-4 w-4 text-[#a39188]" />,
              count: studios.filter(s => {
                const location = s.location?.toLowerCase() || ''
                const address = s.location_details?.address?.toLowerCase() || ''
                return location.includes('ubud') || address.includes('ubud')
              }).length,
              verified: true,
              urgency: 'Jungle Retreat'
            },
            { 
              id: 'sanur', 
              label: 'Sanur', 
              icon: <Sunrise className="h-4 w-4 text-[#a39188]" />,
              count: studios.filter(s => {
                const location = s.location?.toLowerCase() || ''
                const address = s.location_details?.address?.toLowerCase() || ''
                return location.includes('sanur') || address.includes('sanur')
              }).length,
              verified: true,
              urgency: 'Peaceful Bay'
            }
          ]
          options = locationOptions.filter(opt => opt.count > 0)
          totalCount = studios.length
          break

        case 'experience':
          // Combined experience levels and popular yoga styles
          const allStyles = studios.flatMap(s => s.styles || [])
          const styleCounts = allStyles.reduce((acc, style) => {
            acc[style] = (acc[style] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          
          const topStyles = Object.entries(styleCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 4)
            .map(([style, count]) => ({
              id: `style_${style.toLowerCase().replace(/\s+/g, '_')}`,
              label: style,
              icon: '🧘‍♀️',
              count,
              verified: true
            }))
          
          const experienceOptions = [
            {
              id: 'beginner_friendly',
              label: 'Beginner Friendly',
              icon: <Sprout className="h-4 w-4 text-[#a39188]" />,
              count: studios.filter(s => 
                s.styles?.some(style => 
                  style.toLowerCase().includes('hatha') || 
                  style.toLowerCase().includes('gentle') || 
                  style.toLowerCase().includes('restorative') ||
                  style.toLowerCase().includes('yin')
                )
              ).length,
              verified: true,
              urgency: 'Perfect for New Yogis'
            },
            {
              id: 'advanced_classes',
              label: 'Advanced Classes',
              icon: <Flame className="h-4 w-4 text-[#a39188]" />,
              count: studios.filter(s => 
                s.styles?.some(style => 
                  style.toLowerCase().includes('ashtanga') || 
                  style.toLowerCase().includes('power') || 
                  style.toLowerCase().includes('advanced') ||
                  style.toLowerCase().includes('vinyasa')
                )
              ).length,
              verified: true,
              urgency: 'Challenge Yourself'
            },
            ...topStyles
          ]
          options = experienceOptions.filter(opt => opt.count > 0)
          totalCount = studios.filter(s => s.styles?.length > 0).length
          break

        case 'value':
          const valueOptions = [
            { 
              id: 'budget_verified', 
              label: 'Budget + Verified Contact', 
              icon: '📚✅',
              count: studiosWithQuality.filter(s => {
                const price = s.drop_in_price_usd
                const isBudget = price ? price < 20 : s.price_range === 'budget'
                return isBudget && s.qualityMetrics.contactConfidenceScore >= 30
              }).length,
              quality: 'high' as const,
              urgency: 'Great Value'
            },
            { 
              id: 'mid', 
              label: 'Mid-Range', 
              icon: '💛',
              count: studios.filter(s => {
                const price = s.drop_in_price_usd
                return price ? (price >= 20 && price < 50) : s.price_range === 'mid-range'
              }).length,
              estimated: true
            },
            { 
              id: 'premium', 
              label: 'Premium', 
              icon: '🧡',
              count: studios.filter(s => {
                const price = s.drop_in_price_usd
                return price ? (price >= 50 && price < 80) : s.price_range === 'premium'
              }).length,
              estimated: true
            },
            { 
              id: 'luxury', 
              label: 'Luxury', 
              icon: '❤️',
              count: studios.filter(s => {
                const price = s.drop_in_price_usd
                return price ? price >= 80 : s.price_range === 'luxury'
              }).length,
              estimated: true
            }
          ]
          options = valueOptions.filter(opt => opt.count > 0)
          totalCount = studios.length
          break


        case 'services':
          // Use amenities array to determine services offered
          const allAmenities = studios.flatMap(s => s.amenities || [])
          const amenityCounts = allAmenities.reduce((acc, amenity) => {
            acc[amenity] = (acc[amenity] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          
          const serviceMapping = [
            { 
              id: 'accommodation', 
              label: 'Accommodation', 
              icon: <Hotel className="h-4 w-4 text-[#a39188]" />,
              keywords: ['accommodation', 'stay', 'lodge', 'hotel', 'room']
            },
            { 
              id: 'retreats', 
              label: 'Retreats', 
              icon: <Mountain className="h-4 w-4 text-[#a39188]" />,
              keywords: ['retreat', 'workshop', 'intensive', 'immersion']
            },
            { 
              id: 'teacher_training', 
              label: 'Teacher Training', 
              icon: <GraduationCap className="h-4 w-4 text-[#a39188]" />,
              keywords: ['teacher', 'training', 'certification', 'ttc', '200hr', '300hr']
            },
            { 
              id: 'private_classes', 
              label: 'Private Classes', 
              icon: <Users className="h-4 w-4 text-[#a39188]" />,
              keywords: ['private', 'one-on-one', 'personal', 'individual']
            }
          ]
          
          const serviceOptions = serviceMapping.map(service => ({
            ...service,
            count: studios.filter(s => {
              const amenities = (s.amenities || []).join(' ').toLowerCase()
              const description = (s.business_description || '').toLowerCase()
              return service.keywords.some(keyword => 
                amenities.includes(keyword) || description.includes(keyword)
              )
            }).length,
            verified: true
          }))
          
          options = serviceOptions.filter(opt => opt.count > 0)
          totalCount = studios.filter(s => (s.amenities?.length || 0) > 0).length
          break



        default:
          options = []
          totalCount = 0
      }

      // Debug logging
      console.log(`Category ${category.id}:`, {
        totalCount,
        optionsWithData: options.filter(option => option.count > 0).length,
        allOptions: options.length
      })

      return {
        ...category,
        count: totalCount,
        options: options.filter(option => option.count > 0) // Only show options with results
      }
    })
  }, [studios])

  // Apply filters when activeFilters change
  useEffect(() => {
    const filtered = applyIntelligentFilters(studios, activeFilters)
    onFilterChange(filtered)
  }, [activeFilters, studios, onFilterChange])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(current => 
      current === categoryId ? null : categoryId
    )
  }

  const handleFilterToggle = (categoryId: string, optionId: string, checked: boolean) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      
      // Mutual exclusion: Location and Natural Setting cannot be selected together
      if (checked) {
        if (categoryId === 'location' && newFilters['natural_setting']) {
          // Clear natural setting when selecting location
          delete newFilters['natural_setting']
        } else if (categoryId === 'natural_setting' && newFilters['location']) {
          // Clear location when selecting natural setting
          delete newFilters['location']
        }
      }
      
      if (!newFilters[categoryId]) {
        newFilters[categoryId] = []
      }
      
      if (checked) {
        // For location, use single-select (replace existing)
        if (categoryId === 'location') {
          newFilters[categoryId] = [optionId]
        } else {
          // For other categories, use multi-select
          if (!newFilters[categoryId].includes(optionId)) {
            newFilters[categoryId].push(optionId)
          }
        }
      } else {
        newFilters[categoryId] = newFilters[categoryId].filter((id: string) => id !== optionId)
        if (newFilters[categoryId].length === 0) {
          delete newFilters[categoryId]
        }
      }
      
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <>
      {/* Location-First Horizontal Filter Bar */}
      <div className="w-full bg-[#f2e8dc] border-b border-[#e6ceb3] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-3">
          
          {/* Desktop Filter Bar */}
          <div className="hidden md:flex items-center gap-4">
            {/* Location Filter - Primary */}
            <LocationFilterDropdown 
              locationOptions={categoriesWithData.find(c => c.id === 'location')?.options || []}
              activeLocation={activeFilters.location?.[0] || null}
              onLocationSelect={(locationId) => {
                if (locationId) {
                  handleFilterToggle('location', locationId, true)
                } else {
                  setActiveFilters(prev => {
                    const newFilters = { ...prev }
                    delete newFilters.location
                    return newFilters
                  })
                }
              }}
            />
            
            {/* Secondary Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Style Filter */}
              <FilterChip
                category={categoriesWithData.find(c => c.id === 'experience')}
                activeFilters={activeFilters.experience || []}
                onFilterToggle={(optionId, checked) => handleFilterToggle('experience', optionId, checked)}
                icon={<Target className="h-4 w-4 text-[#a39188]" />}
                label="Style"
              />
              
              {/* Price Filter */}
              <FilterChip
                category={categoriesWithData.find(c => c.id === 'value')}
                activeFilters={activeFilters.value || []}
                onFilterToggle={(optionId, checked) => handleFilterToggle('value', optionId, checked)}
                icon={<DollarSign className="h-4 w-4 text-[#a39188]" />}
                label="Price"
              />
              
              {/* Features Filter */}
              <FilterChip
                category={categoriesWithData.find(c => c.id === 'services')}
                activeFilters={activeFilters.services || []}
                onFilterToggle={(optionId, checked) => handleFilterToggle('services', optionId, checked)}
                icon={<Hotel className="h-4 w-4 text-[#a39188]" />}
                label="Features"
              />
              
              {/* Quality Filter */}
              <FilterChip
                category={categoriesWithData.find(c => c.id === 'quality')}
                activeFilters={activeFilters.quality || []}
                onFilterToggle={(optionId, checked) => handleFilterToggle('quality', optionId, checked)}
                icon={<CheckCircle className="h-4 w-4 text-[#a39188]" />}
                label="Quality"
              />
            </div>
            
            {/* Clear All Button */}
            {activeFilterCount > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="text-[#a39188] hover:text-[#5d4c42] text-xs ml-auto"
              >
                Clear all ({activeFilterCount})
              </Button>
            )}
          </div>
          
          {/* Mobile Filter Bar */}
          <div className="md:hidden">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Mobile Location Filter */}
              <LocationFilterDropdown 
                locationOptions={categoriesWithData.find(c => c.id === 'location')?.options || []}
                activeLocation={activeFilters.location?.[0] || null}
                onLocationSelect={(locationId) => {
                  if (locationId) {
                    handleFilterToggle('location', locationId, true)
                  } else {
                    setActiveFilters(prev => {
                      const newFilters = { ...prev }
                      delete newFilters.location
                      return newFilters
                    })
                  }
                }}
                isMobile
              />
              
              {/* Mobile Filter Chips */}
              <MobileFilterChip icon="🧘" label="Style" hasActive={activeFilters.experience?.length > 0} onClick={() => setIsMobileFilterOpen(true)} />
              <MobileFilterChip icon="💰" label="Price" hasActive={activeFilters.value?.length > 0} onClick={() => setIsMobileFilterOpen(true)} />
              <MobileFilterChip icon="⭐" label="Features" hasActive={activeFilters.services?.length > 0} onClick={() => setIsMobileFilterOpen(true)} />
              <MobileFilterChip icon="✅" label="Quality" hasActive={activeFilters.quality?.length > 0} onClick={() => setIsMobileFilterOpen(true)} />
              
              {activeFilterCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-[#a39188] hover:text-[#5d4c42] text-xs whitespace-nowrap ml-2"
                >
                  Clear ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl bg-[#f2e8dc] max-h-[85vh] overflow-y-auto">
          <SheetHeader className="text-center pb-4">
            <SheetTitle className="text-[#5d4c42]">Find Your Perfect Studio</SheetTitle>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#a39188] hover:text-[#5d4c42] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </SheetHeader>
          
          <FilterContent
            categories={categoriesWithData}
            expandedCategory={expandedCategory}
            activeFilters={activeFilters}
            onToggleCategory={toggleCategory}
            onFilterToggle={handleFilterToggle}
            isMobile={true}
            onClose={() => setIsMobileFilterOpen(false)}
          />
        </SheetContent>
      </Sheet>

    </>
  )
}

interface FilterContentProps {
  categories: FilterCategory[]
  expandedCategory: string | null
  activeFilters: Record<string, any>
  onToggleCategory: (categoryId: string) => void
  onFilterToggle: (categoryId: string, optionId: string, checked: boolean) => void
  isMobile: boolean
  onClose?: () => void
  showAsPopover?: boolean
}

function FilterContent({ 
  categories, 
  expandedCategory, 
  activeFilters,
  onToggleCategory, 
  onFilterToggle,
  isMobile,
  onClose,
  showAsPopover = false
}: FilterContentProps) {
  return (
    <div className="space-y-4">
      {showAsPopover ? (
        <div className="space-y-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            const hasActiveFilters = activeFilters[category.id]?.length > 0
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e6ceb3]">
                  <IconComponent className="h-5 w-5 text-[#a39188]" />
                  <h4 className="font-semibold text-[#5d4c42] text-sm">{category.label}</h4>
                  <Badge className="h-4 px-1.5 text-xs bg-[#e6ceb3] text-[#5d4c42]">
                    {category.count}
                  </Badge>
                  {hasActiveFilters && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                
                <div className="space-y-1 ml-2">
                  {category.options.map((option) => {
                    const isChecked = activeFilters[category.id]?.includes(option.id) || false
                    
                    return (
                      <div
                        key={option.id}
                        className="flex items-center justify-between py-3 px-2 hover:bg-white/50 rounded transition-colors cursor-pointer touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#a39188] focus:ring-opacity-50"
                        onClick={(e) => {
                          // Prevent event if clicking directly on checkbox
                          if ((e.target as HTMLElement).closest('[role="checkbox"]')) return
                          onFilterToggle(category.id, option.id, !isChecked)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onFilterToggle(category.id, option.id, !isChecked)
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isChecked}
                        aria-label={`${isChecked ? 'Unselect' : 'Select'} ${option.label} filter option`}
                      >
                        <div className="flex items-center gap-2 flex-1 pointer-events-none">
                          {option.icon && (
                            <span>{option.icon}</span>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-[#5d4c42]">{option.label}</span>
                              {option.verified && (
                                <Check className="inline h-3 w-3 text-green-500" />
                              )}
                              {option.estimated && (
                                <span className="text-xs text-amber-500">~</span>
                              )}
                              {option.quality === 'high' && (
                                <Award className="inline h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                            {option.urgency && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Zap className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-orange-600 font-medium">{option.urgency}</span>
                              </div>
                            )}
                            {option.completionBonus && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-600">+{option.completionBonus}% more info</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pointer-events-none">
                          <span className={`text-xs ${
                            option.quality === 'high'
                              ? 'text-green-600 font-semibold'
                              : 'text-gray-500'
                          }`}>({option.count})</span>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              onFilterToggle(category.id, option.id, checked as boolean)
                            }
                            className={`border-gray-300 pointer-events-auto ${
                              option.quality === 'high'
                                ? 'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500'
                                : 'data-[state=checked]:bg-[#a39188] data-[state=checked]:border-[#a39188]'
                            }`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 lg:gap-3 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon
              const isActive = expandedCategory === category.id
              const hasActiveFilters = activeFilters[category.id]?.length > 0
              
              return (
                <button
                  key={category.id}
                  onClick={() => onToggleCategory(category.id)}
                  className={`
                    relative flex items-center justify-center w-12 h-12 lg:w-10 lg:h-10 rounded-xl
                    transition-all duration-200 hover:scale-110 active:scale-95
                    ${isActive 
                      ? 'bg-[#a39188] text-white shadow-md' 
                      : 'bg-white text-[#a39188] hover:bg-[#a39188] hover:text-white'
                    }
                  `}
                  aria-label={category.label}
                >
                  <IconComponent className="h-5 w-5 lg:h-4 lg:w-4" />
                  
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-[#e6ceb3] text-[#5d4c42] flex items-center justify-center"
                  >
                    {category.count}
                  </Badge>
                  
                  {hasActiveFilters && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </button>
              )
            })}
          </div>

          {expandedCategory && (
            <div className="transition-all duration-300 ease-out overflow-hidden opacity-100 transform translate-y-0">
                <div className="rounded-xl bg-[#a39188] p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm">
                      {categories.find(c => c.id === expandedCategory)?.label}
                    </h3>
                    <button 
                      onClick={() => onToggleCategory(expandedCategory)}
                      className="p-1 rounded hover:bg-white/20 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {categories
                      .find(c => c.id === expandedCategory)
                      ?.options.map((option) => {
                        const isChecked = activeFilters[expandedCategory]?.includes(option.id) || false
                        
                        return (
                          <div
                            key={option.id}
                            className="flex items-center justify-between py-3 hover:bg-white/10 rounded px-2 -mx-2 transition-colors cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            onClick={(e) => {
                              // Prevent event if clicking directly on checkbox
                              if ((e.target as HTMLElement).closest('[role="checkbox"]')) return
                              onFilterToggle(expandedCategory, option.id, !isChecked)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                onFilterToggle(expandedCategory, option.id, !isChecked)
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-pressed={isChecked}
                            aria-label={`${isChecked ? 'Unselect' : 'Select'} ${option.label} filter option`}
                          >
                            <div className="flex items-center gap-2 pointer-events-none">
                              {option.icon && (
                                <span>{option.icon}</span>
                              )}
                              <span className="text-sm font-medium">{option.label}</span>
                              {option.verified && (
                                <Check className="h-3 w-3 text-green-300" />
                              )}
                              {option.estimated && (
                                <span className="text-xs text-amber-300">~</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pointer-events-none">
                              <span className="text-xs text-white/70">({option.count})</span>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  onFilterToggle(expandedCategory, option.id, checked as boolean)
                                }
                                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#a39188] pointer-events-auto"
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
            </div>
          )}
          
          {isMobile && (
            <div className="pt-4 space-y-2">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-[#e6ceb3] py-3 font-semibold text-[#5d4c42] transition-all duration-200 hover:bg-[#d9b99a] active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}