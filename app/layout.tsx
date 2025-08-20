import type React from "react"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { SecurityInitializer } from "@/components/security-initializer"
import { Analytics, PrivacyBanner } from "@/components/analytics"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { MobileTouchOptimizer } from "@/components/mobile-touch-optimizer"
import { AnalyticsTracker } from "@/components/analytics-tracker"

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
        {/* Mobile-first viewport configuration */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#f9f3e9" />
        
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
              font-family: var(--font-cormorant), Georgia, serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeSpeed;
              background-color: #f9f3e9;
              -webkit-tap-highlight-color: transparent;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            
            /* Performance optimizations */
            * {
              box-sizing: border-box;
            }
            
            /* Mobile-first optimizations */
            html {
              -webkit-text-size-adjust: 100%;
              height: 100%;
            }
            
            /* Touch interactions */
            .touch-manipulation {
              touch-action: manipulation;
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              user-select: none;
            }
            
            /* Safe area support */
            .safe-top { padding-top: max(1rem, env(safe-area-inset-top)); }
            .safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
            .safe-left { padding-left: max(1rem, env(safe-area-inset-left)); }
            .safe-right { padding-right: max(1rem, env(safe-area-inset-right)); }
            
            /* Prevent flash of unstyled content */
            .header-nav { min-height: 70px; }
            .hero-section { min-height: 350px; }
            .card-grid { min-height: 280px; }
            
            /* Loading skeleton animation */
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            
            /* Mobile scroll optimizations */
            @media (max-width: 768px) {
              body {
                overflow-x: hidden;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                height: 100%;
              }
              
              html {
                height: 100%;
                overflow-y: auto;
              }
              
              /* Improved text legibility on mobile */
              h1, h2, h3, h4, h5, h6 {
                -webkit-font-smoothing: antialiased;
                line-height: 1.2;
              }
              
              /* Better button touch targets */
              button, a {
                min-height: 44px;
                min-width: 44px;
              }
            }
          `
        }} />
      </head>
      <body className="font-cormorant">
        <SecurityInitializer />
        <PerformanceOptimizer />
        <MobileTouchOptimizer />
        <WishlistProvider>
          <AnalyticsTracker />
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
