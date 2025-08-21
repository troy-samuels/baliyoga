"use client"

import dynamic from 'next/dynamic'
import { Heart } from 'lucide-react'
import { Suspense } from 'react'

// Loading component that matches the WishlistHeart design
function WishlistHeartSkeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`group relative z-20 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-sm transition-all duration-200 ${className}`}
      aria-label="Loading wishlist button"
    >
      <Heart className="h-4 w-4 fill-transparent text-gray-400 animate-pulse" />
    </div>
  )
}

// Dynamically import the WishlistHeart component to prevent SSR issues
const WishlistHeart = dynamic(
  () => import('./wishlist-heart').then(mod => ({ default: mod.WishlistHeart })),
  {
    ssr: false,
    loading: () => <WishlistHeartSkeleton />
  }
)

interface WishlistHeartWrapperProps {
  item: {
    id: string
    name: string
    slug: string
    image?: string
    location: string
    rating: number
    type: 'studio' | 'retreat'
    styles?: string[]
    duration?: string
    price?: string
    phone_number?: string
    website?: string
  }
  className?: string
}

export function WishlistHeartWrapper({ item, className }: WishlistHeartWrapperProps) {
  return (
    <Suspense fallback={<WishlistHeartSkeleton className={className} />}>
      <WishlistHeart item={item} className={className} />
    </Suspense>
  )
}