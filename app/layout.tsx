import type React from "react"
import { Cormorant_Garamond, Raleway } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { SecurityInitializer } from "@/components/security-initializer"
import { Analytics, PrivacyBanner } from "@/components/analytics"
import { PerformanceMonitor } from "@/components/performance-monitor"

// Initialize the Cormorant Garamond font for headings with optimizations
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
  preload: true,
  fallback: ["serif"],
})

// Initialize the Raleway font for body text with optimizations
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
  preload: true,
  fallback: ["sans-serif"],
})

export const metadata: Metadata = {
  title: {
    default: "Bali Yoga - Discover the Best Yoga Studios & Retreats in Bali",
    template: "%s | Bali Yoga"
  },
  description: "Find authentic yoga experiences, world-class instructors, and transformative retreats across the Island of the Gods. Discover Bali's best yoga studios and wellness centers.",
  keywords: ["bali yoga", "yoga retreats bali", "yoga studios bali", "ubud yoga", "canggu yoga", "seminyak yoga", "bali wellness", "yoga indonesia"],
  authors: [{ name: "Bali Yoga Directory" }],
  creator: "Bali Yoga Directory",
  publisher: "Bali Yoga Directory",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Bali Yoga - Discover the Best Yoga Studios & Retreats in Bali",
    description: "Find authentic yoga experiences, world-class instructors, and transformative retreats across the Island of the Gods.",
    url: "https://baliyoga.com",
    siteName: "Bali Yoga",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bali Yoga - Discover the Best Yoga Studios & Retreats in Bali",
    description: "Find authentic yoga experiences, world-class instructors, and transformative retreats across the Island of the Gods.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  generator: 'Next.js',
  applicationName: 'Bali Yoga Directory',
  referrer: 'origin-when-cross-origin',
  category: 'travel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${raleway.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS prefetch for other external resources */}
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
        
        {/* Critical CSS for font loading */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent layout shift during font loading */
            .font-raleway { font-family: var(--font-raleway), system-ui, -apple-system, sans-serif; }
            .font-cormorant { font-family: var(--font-cormorant), Georgia, serif; }
            
            /* Critical above-the-fold styles */
            body { 
              margin: 0; 
              font-family: var(--font-raleway), system-ui, -apple-system, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
            }
            
            /* Optimize font rendering */
            * {
              font-feature-settings: 'kern' 1;
              -webkit-font-feature-settings: 'kern' 1;
              -moz-font-feature-settings: 'kern' 1;
            }
          `
        }} />
      </head>
      <body className="font-raleway">
        <SecurityInitializer />
        <WishlistProvider>
          {children}
        </WishlistProvider>
        <Analytics />
        <PrivacyBanner />
        <PerformanceMonitor />
        
        {/* Service Worker for offline support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
