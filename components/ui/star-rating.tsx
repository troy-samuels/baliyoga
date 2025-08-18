"use client"

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  showRatingText?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5', 
  lg: 'w-6 h-6'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

export function StarRating({
  rating,
  onRatingChange,
  size = 'md',
  readonly = false,
  showRatingText = false,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const displayRating = isHovering ? hoverRating : rating
  const isInteractive = !readonly && onRatingChange

  const handleClick = (starRating: number) => {
    if (isInteractive) {
      onRatingChange?.(starRating)
    }
  }

  const handleMouseEnter = (starRating: number) => {
    if (isInteractive) {
      setHoverRating(starRating)
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    if (isInteractive) {
      setIsHovering(false)
      setHoverRating(0)
    }
  }

  const getRatingText = (currentRating: number) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good', 
      4: 'Very Good',
      5: 'Excellent'
    }
    return labels[currentRating as keyof typeof labels] || ''
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating
          const isPartiallyFilled = !Number.isInteger(displayRating) && 
                                   star === Math.ceil(displayRating) && 
                                   star > displayRating

          return (
            <div
              key={star}
              className={cn(
                'relative',
                isInteractive && 'cursor-pointer hover:scale-110 transition-transform'
              )}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors duration-150',
                  isFilled 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : isInteractive && isHovering
                    ? 'fill-yellow-200 text-yellow-200'
                    : 'fill-gray-200 text-gray-300'
                )}
              />
              {isPartiallyFilled && (
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ 
                    width: `${((displayRating - (star - 1)) * 100)}%` 
                  }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      'fill-yellow-400 text-yellow-400'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {showRatingText && (
        <span className={cn(
          'ml-2 font-medium text-gray-700',
          textSizeClasses[size]
        )}>
          {isHovering && hoverRating > 0 
            ? getRatingText(hoverRating)
            : rating > 0 
            ? `${rating.toFixed(1)} ${getRatingText(Math.round(rating))}`
            : 'No rating'
          }
        </span>
      )}
    </div>
  )
}

// Display-only version for showing ratings without interaction
export function StarDisplay({
  rating,
  size = 'md',
  showRatingText = false,
  showCount = false,
  reviewCount = 0,
  className
}: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showRatingText?: boolean
  showCount?: boolean
  reviewCount?: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <StarRating 
        rating={rating} 
        size={size} 
        readonly 
        showRatingText={showRatingText}
      />
      {showCount && reviewCount > 0 && (
        <span className={cn(
          'text-gray-600',
          textSizeClasses[size]
        )}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}

// Compact version for cards
export function StarRatingCompact({
  rating,
  reviewCount = 0,
  className
}: {
  rating: number
  reviewCount?: number
  className?: string
}) {
  if (rating === 0) return null

  return (
    <div className={cn('flex items-center gap-1 text-sm', className)}>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium text-gray-900">
        {rating.toFixed(1)}
      </span>
      {reviewCount > 0 && (
        <span className="text-gray-600">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}