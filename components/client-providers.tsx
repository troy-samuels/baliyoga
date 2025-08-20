"use client"

import dynamic from "next/dynamic"

// Dynamically import client-side only components to prevent SSR issues
const PerformanceMonitor = dynamic(() => import("@/components/performance-monitor").then(mod => mod.PerformanceMonitor), { ssr: false })
const PerformanceOptimizer = dynamic(() => import("@/components/performance-optimizer").then(mod => mod.PerformanceOptimizer), { ssr: false })
const MobileTouchOptimizer = dynamic(() => import("@/components/mobile-touch-optimizer").then(mod => mod.MobileTouchOptimizer), { ssr: false })
const AnalyticsTracker = dynamic(() => import("@/components/analytics-tracker").then(mod => mod.AnalyticsTracker), { ssr: false })
const Analytics = dynamic(() => import("@/components/analytics").then(mod => mod.Analytics), { ssr: false })
const PrivacyBanner = dynamic(() => import("@/components/analytics").then(mod => mod.PrivacyBanner), { ssr: false })
const SecurityInitializer = dynamic(() => import("@/components/security-initializer").then(mod => mod.SecurityInitializer), { ssr: false })

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
