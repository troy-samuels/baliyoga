"use client"

import { WishlistProvider } from "@/contexts/wishlist-context"
import { Analytics, PrivacyBanner } from "@/components/analytics"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Temporarily disabled dynamic components to fix SSR issues
// const ClientOnlyComponents = dynamic(
//   () => import("./client-enhancements"),
//   { 
//     ssr: false,
//     loading: () => <div style={{ display: 'none' }} />
//   }
// )

// Main providers wrapper - handles all client-side state
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      {children}
      <Analytics />
      <PrivacyBanner />
      {/* Temporarily disabled to fix SSR issues
      <Suspense fallback={<div style={{ display: 'none' }} />}>
        <ClientOnlyComponents />
      </Suspense>
      */}
    </WishlistProvider>
  )
}