"use client"

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'

// All client-side features loaded dynamically with SSR disabled
const Analytics = dynamic(() => import('@/components/analytics').then(mod => mod.Analytics), { 
  ssr: false,
  loading: () => null 
})

const MobileTouchOptimizer = dynamic(() => import('@/components/mobile-touch-optimizer').then(mod => mod.MobileTouchOptimizer), { 
  ssr: false,
  loading: () => null 
})

// Service worker registration
function ServiceWorkerManager() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then(() => console.log('Service Worker registered'))
          .catch((error) => console.warn('Service Worker registration failed:', error))
      })
    }
  }, [])
  
  return null
}

export default function ClientEnhancements() {
  const [isHydrated, setIsHydrated] = React.useState(false)
  
  // Client-side initialization - follows CLAUDE.md "proper loading states" pattern
  useEffect(() => {
    setIsHydrated(true)
    document.documentElement.setAttribute('data-client-loaded', 'true')
  }, [])

  // Return consistent empty state during SSR - no typeof window check
  if (!isHydrated) {
    return null
  }

  return (
    <>
      <Analytics />
      <MobileTouchOptimizer />
      <ServiceWorkerManager />
    </>
  )
}