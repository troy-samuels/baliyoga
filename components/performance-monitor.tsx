"use client"

import { useEffect, useState } from 'react'
import { trackPageLoadTime, trackError } from '@/lib/analytics'

interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  })

  useEffect(() => {
    // Track page load time
    const startTime = performance.now()
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime
      trackPageLoadTime(loadTime)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    // Monitor Core Web Vitals
    const observePerformance = () => {
      try {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          entries.forEach((entry: any) => {
            const fid = entry.processingStart - entry.startTime
            setMetrics(prev => ({ ...prev, fid }))
          })
        }).observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift (CLS)
        let clsValue = 0
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        }).observe({ entryTypes: ['layout-shift'] })

        // First Contentful Paint (FCP)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint') as any
          if (fcpEntry) {
            setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }))
          }
        }).observe({ entryTypes: ['paint'] })

        // Time to First Byte (TTFB)
        const navEntry = performance.getEntriesByType('navigation')[0] as any
        if (navEntry) {
          const ttfb = navEntry.responseStart - navEntry.requestStart
          setMetrics(prev => ({ ...prev, ttfb }))
        }

      } catch (error) {
        console.warn('Performance monitoring not supported:', error)
        trackError(`Performance monitoring error: ${error}`)
      }
    }

    // Start monitoring
    observePerformance()

    // Error boundary for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      trackError(`${event.error?.name || 'Unknown Error'}: ${event.message}`, window.location.pathname)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(`Unhandled Promise Rejection: ${event.reason}`, window.location.pathname)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('load', handleLoad)
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-400'
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-600' : value <= 4000 ? 'text-yellow-600' : 'text-red-600'
      case 'fid':
        return value <= 100 ? 'text-green-600' : value <= 300 ? 'text-yellow-600' : 'text-red-600'
      case 'cls':
        return value <= 0.1 ? 'text-green-600' : value <= 0.25 ? 'text-yellow-600' : 'text-red-600'
      case 'fcp':
        return value <= 1800 ? 'text-green-600' : value <= 3000 ? 'text-yellow-600' : 'text-red-600'
      case 'ttfb':
        return value <= 800 ? 'text-green-600' : value <= 1800 ? 'text-yellow-600' : 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatValue = (metric: string, value: number | null) => {
    if (value === null) return '-'
    
    switch (metric) {
      case 'cls':
        return value.toFixed(3)
      default:
        return `${Math.round(value)}ms`
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs font-mono max-w-xs z-50">
      <div className="font-semibold text-gray-800 mb-2">Performance Metrics</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor('lcp', metrics.lcp)}>
            {formatValue('lcp', metrics.lcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getScoreColor('fid', metrics.fid)}>
            {formatValue('fid', metrics.fid)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor('cls', metrics.cls)}>
            {formatValue('cls', metrics.cls)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor('fcp', metrics.fcp)}>
            {formatValue('fcp', metrics.fcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor('ttfb', metrics.ttfb)}>
            {formatValue('ttfb', metrics.ttfb)}
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
        🟢 Good 🟡 Needs Improvement 🔴 Poor
      </div>
    </div>
  )
}

// Hook for lazy loading components
export function useLazyLoading() {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref])

  return { isVisible, ref: setRef }
} 