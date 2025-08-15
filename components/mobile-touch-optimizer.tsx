"use client"

import { useEffect } from 'react'

export function MobileTouchOptimizer() {
  useEffect(() => {
    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    // Add touch event listeners
    document.addEventListener('touchend', preventZoom, { passive: false })

    // Optimize touch response times
    const optimizeTouchTargets = () => {
      const touchElements = document.querySelectorAll('button, a, [role="button"], [role="link"]')
      
      touchElements.forEach(element => {
        const el = element as HTMLElement
        
        // Ensure minimum touch target size (44px x 44px as per accessibility guidelines)
        const rect = el.getBoundingClientRect()
        if (rect.width < 44 || rect.height < 44) {
          el.style.position = 'relative'
          el.style.minHeight = '44px'
          el.style.minWidth = '44px'
          el.style.display = 'flex'
          el.style.alignItems = 'center'
          el.style.justifyContent = 'center'
        }

        // Add touch-manipulation for better performance
        if (!el.style.touchAction) {
          el.style.touchAction = 'manipulation'
        }

        // Optimize tap highlight
        (el.style as any).webkitTapHighlightColor = 'transparent'
        
        // Add visual feedback for touch interactions
        const addTouchFeedback = (e: TouchEvent) => {
          el.style.transform = 'scale(0.98)'
          el.style.transition = 'transform 0.1s ease'
        }
        
        const removeTouchFeedback = () => {
          el.style.transform = 'scale(1)'
        }

        el.addEventListener('touchstart', addTouchFeedback, { passive: true })
        el.addEventListener('touchend', removeTouchFeedback, { passive: true })
        el.addEventListener('touchcancel', removeTouchFeedback, { passive: true })
      })
    }

    // Run optimization after DOM is ready
    optimizeTouchTargets()
    
    // Re-run when new elements are added to the DOM
    const observer = new MutationObserver(() => {
      optimizeTouchTargets()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Optimize scroll performance on mobile
    const optimizeScroll = () => {
      (document.body.style as any).webkitOverflowScrolling = 'touch'
      document.body.style.overflowY = 'auto'
      
      // Prevent bounce scrolling on iOS
      document.body.addEventListener('touchmove', (e) => {
        const target = e.target as HTMLElement
        const scrollableParent = target.closest('[data-scrollable]') || 
                                target.closest('.overflow-auto') ||
                                target.closest('.overflow-y-auto') ||
                                target.closest('.overflow-scroll')
        
        if (!scrollableParent) {
          e.preventDefault()
        }
      }, { passive: false })
    }

    optimizeScroll()

    // Add mobile-specific keyboard event handling
    const handleMobileKeyboard = () => {
      const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement
      const originalContent = viewport?.content

      // Adjust viewport when keyboard appears
      window.addEventListener('resize', () => {
        if (document.activeElement && 
            (document.activeElement.tagName === 'INPUT' || 
             document.activeElement.tagName === 'TEXTAREA')) {
          // Keyboard is likely open
          if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no'
          }
        } else {
          // Keyboard is likely closed
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