"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics-utils'

/**
 * Analytics tracker component - automatically tracks page views
 * Place this in the root layout to track all page visits
 */
export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view on route change
    if (pathname) {
      // Extract item info from pathname if it's a specific item page
      let itemId: string | undefined
      let itemType: 'studio' | 'retreat' | 'location' | undefined

      // Check if this is a specific studio or retreat page
      const studioMatch = pathname.match(/^\/(studio|studios)\/(.+)$/)
      const retreatMatch = pathname.match(/^\/(retreat|retreats)\/(.+)$/)
      const locationMatch = pathname.match(/^\/locations\/(.+)$/)

      if (studioMatch) {
        itemType = 'studio'
        itemId = studioMatch[2]
      } else if (retreatMatch) {
        itemType = 'retreat'
        itemId = retreatMatch[2]
      } else if (locationMatch) {
        itemType = 'location'
        itemId = locationMatch[1]
      }

      trackPageView(pathname, itemId, itemType)
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}