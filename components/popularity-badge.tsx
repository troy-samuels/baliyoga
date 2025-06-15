"use client"

import { useEffect, useState } from 'react'
import { TrendingUp, Flame, Star, Sparkles } from 'lucide-react'
import { getItemPopularityScore } from '@/lib/popularity-utils'

interface PopularityBadgeProps {
  itemId: string
  className?: string
}

export function PopularityBadge({ itemId, className = '' }: PopularityBadgeProps) {
  const [popularityScore, setPopularityScore] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const score = getItemPopularityScore(itemId)
      setPopularityScore(score)
    }
  }, [itemId, isClient])

  // Don't render anything during SSR or if score is too low
  if (!isClient || popularityScore < 3) {
    return null
  }

  const getBadgeConfig = (score: number) => {
    if (score >= 20) {
      return {
        label: 'Very Popular',
        icon: Flame,
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        animation: 'animate-pulse'
      }
    } else if (score >= 10) {
      return {
        label: 'Popular',
        icon: TrendingUp,
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        animation: ''
      }
    } else if (score >= 5) {
      return {
        label: 'Trending',
        icon: Star,
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
        animation: ''
      }
    } else {
      return {
        label: 'Rising',
        icon: Sparkles,
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        animation: ''
      }
    }
  }

  const config = getBadgeConfig(popularityScore)
  const Icon = config.icon

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold shadow-lg ${config.bgColor} ${config.textColor} ${config.animation} ${className}`}
      title={`${popularityScore} people added this to their wishlist`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
} 