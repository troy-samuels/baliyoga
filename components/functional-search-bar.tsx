"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, MapPin } from "lucide-react"

interface SearchBarProps {
  className?: string
}

export function FunctionalSearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const categoryRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "studios", label: "Yoga Studios" },
    { value: "retreats", label: "Yoga Retreats" },
  ]

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "ubud", label: "Ubud" },
    { value: "canggu", label: "Canggu" },
    { value: "seminyak", label: "Seminyak" },
    { value: "uluwatu", label: "Uluwatu" },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false)
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    // Build search parameters
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }

    if (selectedLocation !== "all") {
      params.set("location", selectedLocation)
    }

    // Navigate based on category
    if (selectedCategory === "studios") {
      router.push(`/studios?${params.toString()}`)
    } else if (selectedCategory === "retreats") {
      router.push(`/retreats?${params.toString()}`)
    } else {
      // For 'all', we'll go to a search results page or studios by default
      router.push(`/studios?${params.toString()}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getCategoryLabel = () => {
    return categories.find((cat) => cat.value === selectedCategory)?.label || "Category"
  }

  const getLocationLabel = () => {
    return locations.find((loc) => loc.value === selectedLocation)?.label || "Location"
  }

  return (
    <div className={`w-full max-w-3xl rounded-full bg-white p-2 shadow-lg ${className}`}>
      <div className="flex flex-col items-center gap-2 md:flex-row">
        {/* Search Input */}
        <div className="flex w-full flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for yoga studios, retreats, or instructors..."
            className="w-full bg-transparent focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Filters and Search Button */}
        <div className="flex w-full flex-wrap gap-2 md:w-auto">
          {/* Category Dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown)
                setShowLocationDropdown(false)
              }}
              className="flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e6ceb3]"
            >
              <span className="mr-2">{getCategoryLabel()}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full mt-1 w-48 rounded-lg bg-white shadow-lg border z-50">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setSelectedCategory(category.value)
                      setShowCategoryDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                      selectedCategory === category.value ? "bg-[#e6ceb3] text-[#5d4c42]" : "text-gray-700"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="relative" ref={locationRef}>
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown)
                setShowCategoryDropdown(false)
              }}
              className="flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e6ceb3]"
            >
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              <span className="mr-2">{getLocationLabel()}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showLocationDropdown && (
              <div className="absolute top-full mt-1 w-48 rounded-lg bg-white shadow-lg border z-50">
                {locations.map((location) => (
                  <button
                    key={location.value}
                    onClick={() => {
                      setSelectedLocation(location.value)
                      setShowLocationDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                      selectedLocation === location.value ? "bg-[#e6ceb3] text-[#5d4c42]" : "text-gray-700"
                    }`}
                  >
                    {location.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="rounded-full bg-[#e6ceb3] px-6 py-2 font-medium text-[#5d4c42] transition-colors hover:bg-[#d9b99a] focus:outline-none focus:ring-2 focus:ring-[#e6ceb3]"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
