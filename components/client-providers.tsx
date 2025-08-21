"use client"

import { WishlistProvider } from "@/contexts/wishlist-context"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Lazy load client-only components to prevent SSR issues
const ClientOnlyComponents = dynamic(
  () => import("./client-enhancements"),
  { 
    ssr: false,
    loading: () => null
  }
)

// Main providers wrapper - handles all client-side state
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      {children}
      <Suspense fallback={null}>
        <ClientOnlyComponents />
      </Suspense>
    </WishlistProvider>
  )
}