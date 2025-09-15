"use client"

import { useEffect } from 'react'

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical routes
    const preloadRoutes = ['/studios', '/retreats']
    
    preloadRoutes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })

    // Intersection Observer for lazy loading below-the-fold content
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    }

    const lazyElements = document.querySelectorAll('[data-lazy]')
    
    if ('IntersectionObserver' in window && lazyElements.length > 0) {
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            element.classList.remove('opacity-0')
            element.classList.add('opacity-100', 'transition-opacity', 'duration-300')
            lazyObserver.unobserve(element)
          }
        })
      }, observerOptions)

      lazyElements.forEach(el => lazyObserver.observe(el))

      return () => lazyObserver.disconnect()
    }

    // Resource hints for external services
    const resourceHints = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://maps.googleapis.com' },
      { rel: 'preconnect', href: 'https://www.googletagmanager.com' }
    ]

    resourceHints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`)
      if (!existing) {
        const link = document.createElement('link')
        link.rel = hint.rel
        link.href = hint.href
        if (hint.rel === 'preconnect') {
          link.crossOrigin = 'anonymous'
        }
        document.head.appendChild(link)
      }
    })

    // Service Worker registration for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .catch(error => console.warn('SW registration failed:', error))
    }

    // Performance observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          // Performance metrics could be sent to analytics here
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            const performanceEntry = entry as any
            if (performanceEntry.processingStart) {
              // FID metrics could be sent to analytics here
            }
          })
        }).observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          // CLS metrics could be sent to analytics here
        }).observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('Performance observer error:', error)
      }
    }

  }, [])

  return null
}