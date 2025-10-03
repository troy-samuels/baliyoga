import type { Metadata } from "next"
import { Raleway, Cormorant_Garamond } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"

// Font configurations with proper optimization
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
  fallback: ["serif"],
})

// Static metadata configuration
export const metadata: Metadata = {
  title: {
    default: "Bali Yoga - Discover Authentic Yoga Studios & Retreats",
    template: "%s | Bali Yoga"
  },
  description: "Find the best yoga studios and retreats in Bali. Authentic experiences, world-class instructors, and transformative wellness journeys across the Island of the Gods.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://baliyoga.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Bali Yoga',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bali Yoga - Discover Studios & Retreats',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@baliyoga',
    creator: '@baliyoga',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-google-verification-code',
  },
  alternates: {
    canonical: '/',
  },
}

// Pure server-side root layout - zero client-side logic
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${raleway.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f9f3e9" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="preconnect" href="https://region1.google-analytics.com" crossOrigin="" />
        <link rel="preconnect" href="https://zioqkkdhvgrkznxyxtik.supabase.co" crossOrigin="" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="" />
        <Script
          src="https://datafa.st/js/script.js"
          strategy="afterInteractive"
          data-website-id="68d3fce9cc708f179902907b"
          data-domain="baliyoga.com"
        />
        {/* Analytics debugging script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Debug analytics loading
              (function() {
                console.log('🔍 Analytics Debug - Page loading...');
                console.log('Domain:', window.location?.hostname || 'unknown');
                console.log('URL:', window.location?.href || 'unknown');

                // Check script loading with retries
                let checkAttempts = 0;
                const maxAttempts = 10;

                function checkAnalytics() {
                  checkAttempts++;

                  // Check if datafa.st script is in DOM
                  const scripts = document.querySelectorAll('script[src*="datafa.st"]');
                  console.log('🔍 Check #' + checkAttempts + ' - Datafa.st scripts found:', scripts.length);

                  // Check for various analytics globals that might be created
                  const globals = ['plausible', 'gtag', 'ga', 'dataLayer', '_paq'];
                  const foundGlobals = globals.filter(g => typeof window[g] !== 'undefined');

                  if (foundGlobals.length > 0) {
                    console.log('✅ Analytics globals found:', foundGlobals);
                    // Try manual pageview
                    if (typeof window.plausible !== 'undefined') {
                      console.log('🚀 Triggering manual plausible pageview');
                      try {
                        window.plausible('pageview');
                      } catch(e) {
                        console.error('❌ Error triggering plausible:', e);
                      }
                    }
                  } else if (checkAttempts < maxAttempts) {
                    console.log('⏳ Analytics not ready, retrying in 1s...');
                    setTimeout(checkAnalytics, 1000);
                  } else {
                    console.error('❌ Analytics failed to load after ' + maxAttempts + ' attempts');
                    console.log('💡 Possible issues:');
                    console.log('  - Ad blocker blocking the script');
                    console.log('  - Network connectivity issues');
                    console.log('  - Script loading from https://datafa.st/js/script.js failed');
                    console.log('  - Website ID or domain mismatch');

                    // Test network connectivity to datafa.st
                    fetch('https://datafa.st/js/script.js')
                      .then(response => {
                        if (response.ok) {
                          console.log('✅ Network connectivity to datafa.st is working');
                          console.log('❓ Script loaded but analytics globals not found - possible configuration issue');
                        } else {
                          console.error('❌ HTTP error loading script:', response.status, response.statusText);
                        }
                      })
                      .catch(err => {
                        console.error('❌ Network error loading script:', err);
                        console.log('💡 This could be due to:');
                        console.log('  - CORS policy blocking the request');
                        console.log('  - Ad blocker or privacy extension');
                        console.log('  - Firewall or network restrictions');
                      });
                  }
                }

                // Start checking after DOM loads
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', checkAnalytics);
                } else {
                  checkAnalytics();
                }
              })();
            `
          }}
        />
      </head>
      <body 
        className={`${raleway.className} antialiased bg-[#f9f3e9] text-[#5d4c42] min-h-screen`}
        suppressHydrationWarning
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}