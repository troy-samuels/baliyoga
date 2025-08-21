/**
 * Loading state components for consistent UX across the application
 * All components are designed to be hydration-safe and accessible
 */

import { Loader2 } from 'lucide-react'

// Base skeleton component
export function Skeleton({ 
  className = '', 
  children 
}: { 
  className?: string
  children?: React.ReactNode 
}) {
  return (
    <div className={`loading-skeleton rounded ${className}`} aria-hidden="true">
      {children}
    </div>
  )
}

// Page-level loading component
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#f9f3e9] flex items-center justify-center" role="status" aria-label={message}>
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#5d4c42] animate-spin mx-auto mb-4" />
        <p className="text-[#5d4c42]/70 text-lg">{message}</p>
      </div>
    </div>
  )
}

// Card grid loading skeleton
export function CardGridLoading({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-[#e6ceb3]/20 overflow-hidden">
          {/* Image skeleton */}
          <Skeleton className="aspect-video w-full" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <Skeleton className="h-5 w-3/4" />
            
            {/* Location and rating */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            {/* Tags */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Individual card loading skeleton
export function CardLoading() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e6ceb3]/20 overflow-hidden" role="status" aria-label="Loading card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  )
}

// Detail page loading skeleton
export function DetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6" role="status" aria-label="Loading page details">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <Skeleton className="aspect-video w-full rounded-xl" />
          
          {/* Title and meta */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-18" />
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Gallery */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact info card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e6ceb3]/20 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          
          {/* Map card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e6ceb3]/20">
            <Skeleton className="h-5 w-16 mb-2" />
            <Skeleton className="h-[180px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline loading spinner
export function InlineLoading({ 
  message = "Loading...",
  size = "sm" 
}: { 
  message?: string
  size?: "sm" | "md" | "lg"
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }
  
  return (
    <div className="flex items-center gap-2 text-[#5d4c42]/70" role="status" aria-label={message}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      <span className="text-sm">{message}</span>
    </div>
  )
}

// Button loading state
export function ButtonLoading({ 
  children, 
  loading = false,
  className = "",
  ...props 
}: { 
  children: React.ReactNode
  loading?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className={`relative ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  )
}

// Map loading placeholder
export function MapLoading({ height = "180px" }: { height?: string }) {
  return (
    <div 
      className="bg-[#e6ceb3] rounded-lg flex items-center justify-center"
      style={{ height }}
      role="status" 
      aria-label="Loading map"
    >
      <div className="text-center text-[#5d4c42]/60">
        <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-2"></div>
        <div className="text-sm">Loading map...</div>
      </div>
    </div>
  )
}