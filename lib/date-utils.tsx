'use client'

import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface HydrationSafeDateProps {
  date?: string | null
  formatString?: string
  fallback?: string
}

/**
 * HydrationSafeDate component that prevents hydration mismatches
 * by showing a fallback on server-side and formatted date on client-side
 */
export function HydrationSafeDate({ 
  date, 
  formatString = 'MMM d, yyyy',
  fallback = 'Date not available'
}: HydrationSafeDateProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!date) {
    return <span className="text-gray-500">{fallback}</span>
  }
  
  // Server-side and pre-mount: show simplified date to prevent hydration mismatch
  if (!mounted) {
    return <span suppressHydrationWarning>{date}</span>
  }
  
  try {
    // Client-side after mount: show properly formatted date
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return <span className="text-gray-500">{fallback}</span>
    }
    
    return <span>{format(parsedDate, formatString)}</span>
  } catch (error) {
    console.warn('Date formatting error:', error)
    return <span className="text-gray-500">{fallback}</span>
  }
}

/**
 * Utility function to format dates consistently
 * Use this for server-side date formatting where hydration isn't an issue
 */
export function formatDate(date: string | Date, formatString: string = 'MMM d, yyyy'): string {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date'
    }
    return format(parsedDate, formatString)
  } catch (error) {
    console.warn('Date formatting error:', error)
    return 'Invalid date'
  }
}