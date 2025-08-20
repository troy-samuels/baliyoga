"use client"

import { Heart } from 'lucide-react'
import { useWishlist } from '@/contexts/wishlist-context'
import { useState } from 'react'

interface WishlistHeartProps {
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

export function WishlistHeart({ item, className = '' }: WishlistHeartProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const isWishlisted = isInWishlist(item.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the heart
    e.stopPropagation() // Prevent event bubbling
    
    setIsAnimating(true)
    
    if (isWishlisted) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleToggle}
      className={`group relative z-20 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-sm transition-all duration-200 hover:bg-white hover:scale-110 ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`h-4 w-4 transition-all duration-200 ${
          isWishlisted
            ? 'fill-red-500 text-red-500'
            : 'fill-transparent text-gray-600 group-hover:text-red-500'
        } ${
          isAnimating ? 'scale-125' : 'scale-100'
        }`}
      />
      
      {/* Pulse animation for add action */}
      {isAnimating && !isWishlisted && (
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
      )}
    </button>
  )
} 