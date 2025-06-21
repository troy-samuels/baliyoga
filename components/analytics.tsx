"use client"

import { useEffect, useState, Suspense } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { 
  pageview, 
  GA_TRACKING_ID, 
  isAnalyticsEnabled, 
  hasConsent, 
  grantConsent, 
  denyConsent,
  trackStudioView,
  trackRetreatView,
  trackBlogView,
  trackSearch,
  trackWishlistAdd,
  trackWishlistRemove,
  trackContactForm,
  trackOutboundLink,
  trackScrollDepth,
  trackError,
  trackRetreatBookingStart
} from '@/lib/analytics'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isAnalyticsEnabled || !hasConsent()) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    pageview(url)
  }, [pathname, searchParams])

  return null
}

export function Analytics() {
  // Don't load analytics in development or if no tracking ID
  if (!isAnalyticsEnabled) {
    return null
  }

  return (
    <>
      {/* Google Analytics Global Site Tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={() => {
          // Initialize dataLayer
          window.dataLayer = window.dataLayer || []
          
          // Define gtag function
          function gtag(...args: any[]) {
            window.dataLayer.push(args)
          }
          
          // Make gtag available globally
          window.gtag = gtag
          
          // Initialize with privacy-first settings
          gtag('js', new Date())
          
          // Set default consent to denied (GDPR compliance)
          gtag('consent', 'default', {
            analytics_storage: hasConsent() ? 'granted' : 'denied',
            ad_storage: 'denied', // Always deny ad storage for privacy
            functionality_storage: 'denied',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500,
          })
          
          // Configure GA4 with privacy settings
          gtag('config', GA_TRACKING_ID, {
            // Privacy settings
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            
            // Performance settings
            send_page_view: false, // We handle this manually
            
            // Enhanced measurement (automatically tracks some events)
            enhanced_measurements: {
              scrolls: true,
              outbound_clicks: true,
              site_search: true,
              video_engagement: false, // Disable if no videos
              file_downloads: true,
            },
            
            // Custom parameters
            custom_map: {
              custom_parameter_1: 'yoga_style',
              custom_parameter_2: 'location_type',
            },
          })
        }}
      />
      
      {/* Enhanced performance monitoring */}
      <Script
        id="performance-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track Core Web Vitals
            if (typeof window !== 'undefined' && window.gtag) {
              // LCP - Largest Contentful Paint
              new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                window.gtag('event', 'core_web_vitals', {
                  event_category: 'Performance',
                  metric_name: 'LCP',
                  metric_value: Math.round(lastEntry.startTime),
                  metric_rating: lastEntry.startTime > 4000 ? 'poor' : lastEntry.startTime > 2500 ? 'needs-improvement' : 'good'
                });
              }).observe({entryTypes: ['largest-contentful-paint']});
              
              // FID - First Input Delay
              new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                  window.gtag('event', 'core_web_vitals', {
                    event_category: 'Performance',
                    metric_name: 'FID',
                    metric_value: Math.round(entry.processingStart - entry.startTime),
                    metric_rating: entry.processingStart - entry.startTime > 300 ? 'poor' : entry.processingStart - entry.startTime > 100 ? 'needs-improvement' : 'good'
                  });
                });
              }).observe({entryTypes: ['first-input']});
              
              // CLS - Cumulative Layout Shift
              let clsValue = 0;
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                  }
                }
                window.gtag('event', 'core_web_vitals', {
                  event_category: 'Performance',
                  metric_name: 'CLS',
                  metric_value: Math.round(clsValue * 1000),
                  metric_rating: clsValue > 0.25 ? 'poor' : clsValue > 0.1 ? 'needs-improvement' : 'good'
                });
              }).observe({entryTypes: ['layout-shift']});
            }
          `,
        }}
      />
      
      {/* Suspense boundary for useSearchParams */}
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>
    </>
  )
}

// Privacy banner component for GDPR compliance
export function PrivacyBanner() {
  const [showBanner, setShowBanner] = useState(false)
  
  useEffect(() => {
    // Show banner if no consent decision has been made
    const consent = localStorage.getItem('analytics_consent')
    if (!consent && isAnalyticsEnabled) {
      setShowBanner(true)
    }
  }, [])
  
  const handleAccept = () => {
    grantConsent()
    setShowBanner(false)
    
    // Trigger analytics initialization without page reload
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
      })
      
      // Track the consent acceptance event
      window.gtag('event', 'consent_granted', {
        event_category: 'Privacy',
        event_label: 'Analytics Consent Granted'
      })
    }
  }
  
  const handleDecline = () => {
    denyConsent()
    setShowBanner(false)
  }
  
  if (!showBanner) return null
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <p>
            We use analytics to improve your experience. Your privacy is important to us.{' '}
            <Link href="/privacy" className="underline text-blue-600">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for tracking events in components
export function useAnalytics() {
  return {
    trackStudioView,
    trackRetreatView,
    trackBlogView,
    trackSearch,
    trackWishlistAdd,
    trackWishlistRemove,
    trackContactForm,
    trackOutboundLink,
    trackScrollDepth,
    trackError,
    trackRetreatBookingStart,
  }
} 