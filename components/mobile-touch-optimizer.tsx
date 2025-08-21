"use client"

import { useEffect } from 'react'

export function MobileTouchOptimizer() {
  useEffect(() => {
    // Prevent double-tap zoom on iOS for specific elements, not globally
    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const now = performance.now()
      
      // Only prevent zoom on specific elements, not all elements
      if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('[role="button"]')) {
        if (now - lastTouchEnd <= 300) {
          e.preventDefault()
        }
      }
      lastTouchEnd = now
    }

    // Add touch event listeners with better targeting
    document.addEventListener('touchend', preventZoom, { passive: false })

    // Optimize touch response times for interactive elements only
    const optimizeTouchTargets = () => {
      const touchElements = document.querySelectorAll('button, a, [role="button"], [role="link"]')
      
      touchElements.forEach(element => {
        const el = element as HTMLElement
        
        // Add touch-manipulation for better performance
        if (!el.style.touchAction) {
          el.style.touchAction = 'manipulation'
        }

        // Optimize tap highlight
        (el.style as any).webkitTapHighlightColor = 'transparent'
        
        // Add visual feedback for touch interactions
        let touchStarted = false
        
        const addTouchFeedback = () => {
          if (!touchStarted) {
            touchStarted = true
            el.style.transform = 'scale(0.98)'
            el.style.transition = 'transform 0.1s ease'
          }
        }
        
        const removeTouchFeedback = () => {
          if (touchStarted) {
            touchStarted = false
            el.style.transform = 'scale(1)'
          }
        }

        el.addEventListener('touchstart', addTouchFeedback, { passive: true })
        el.addEventListener('touchend', removeTouchFeedback, { passive: true })
        el.addEventListener('touchcancel', removeTouchFeedback, { passive: true })
      })
    }

    // Basic scroll optimization without preventing scroll events
    const optimizeScroll = () => {
      // Enable smooth scrolling for iOS
      (document.documentElement.style as any).webkitOverflowScrolling = 'touch'
      document.documentElement.style.scrollBehavior = 'smooth'
    }

    // Run optimizations
    optimizeTouchTargets()
    optimizeScroll()
    
    // Re-run touch optimization when new elements are added
    const observer = new MutationObserver(() => {
      optimizeTouchTargets()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Mobile keyboard handling
    const handleMobileKeyboard = () => {
      const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement
      const originalContent = viewport?.content

      window.addEventListener('resize', () => {
        if (document.activeElement && 
            (document.activeElement.tagName === 'INPUT' || 
             document.activeElement.tagName === 'TEXTAREA')) {
          if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no'
          }
        } else {
          if (viewport && originalContent) {
            viewport.content = originalContent
          }
        }
      })
    }

    handleMobileKeyboard()

    return () => {
      document.removeEventListener('touchend', preventZoom)
      observer.disconnect()
    }
  }, [])

  return null
}