"use client"

import { useEffect, useState } from 'react'
import { TrendingUp, Flame, Star, Sparkles } from 'lucide-react'
import { getItemPopularityScore } from '@/lib/popularity-utils'

interface PopularityBadgeProps {
  itemId: string
  className?: string
}

export function PopularityBadge({ itemId, className = '' }: PopularityBadgeProps) {
  // Hide popularity badges from users - only show to admins
  return null
} 