"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

interface FunctionalSearchBarProps {
  placeholder?: string
  type?: "studio" | "retreat"
  className?: string
}

export function FunctionalSearchBar({ 
  placeholder = "Search...", 
  type = "studio",
  className = "" 
}: FunctionalSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get current search params
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove the query parameter
    if (query.trim()) {
      params.set("q", query.trim())
    } else {
      params.delete("q")
    }
    
    // Navigate to the same page with updated search params
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex rounded-2xl bg-white p-2 shadow-md sm:rounded-full">
        <div className="flex flex-1 items-center rounded-xl bg-gray-100 px-4 py-2 sm:rounded-full">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-transparent text-sm focus:outline-none sm:text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button 
          type="submit"
          className="ml-2 rounded-xl bg-[#a39188] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8a7b73] sm:rounded-full sm:px-6"
        >
          Search
        </button>
      </div>
    </form>
  )
}
