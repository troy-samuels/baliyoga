import type React from "react"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { SecurityInitializer } from "@/components/security-initializer"
import { Analytics, PrivacyBanner } from "@/components/analytics"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

// Initialize the Cormorant Garamond font for headings with optimizations
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],  // Reduced weights
  display: "swap",
  variable: "--font-cormorant",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false, // Disable automatic font fallback adjustment for better performance
})

// Initialize the Inter font for body text (Airbnb-style) with optimizations
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],  // Reduced weights
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: false, // Disable automatic font fallback adjustment for better performance
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
    <html lang="en" className={`${cormorantGaramond.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS prefetch for other external resources */}
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
        
        {/* Critical CSS for font loading and performance */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Font loading optimization */
            .font-inter { font-family: var(--font-inter), system-ui, -apple-system, sans-serif; }
            .font-cormorant { font-family: var(--font-cormorant), Georgia, serif; }
            
            /* Critical above-the-fold styles */
            body { 
              margin: 0; 
              font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeSpeed;
              background-color: #f9f3e9;
            }
            
            /* Performance optimizations */
            * {
              box-sizing: border-box;
            }
            
            /* Prevent flash of unstyled content */
            .header-nav { min-height: 80px; }
            .hero-section { min-height: 400px; }
            .card-grid { min-height: 300px; }
            
            /* Loading skeleton animation */
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          `
        }} />
      </head>
      <body className="font-inter">
        <SecurityInitializer />
        <PerformanceOptimizer />
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
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                try {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js', { scope: '/' })
                      .catch(function(error) {
                        console.warn('Service Worker registration failed:', error);
                      });
                  });
                } catch (error) {
                  console.warn('Service Worker setup error:', error);
                }
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
