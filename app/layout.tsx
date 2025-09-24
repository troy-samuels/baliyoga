import type { Metadata } from "next"
import { Raleway, Cormorant_Garamond } from "next/font/google"
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
        <script
          defer
          data-website-id="68d3fce9cc708f179902907b"
          data-domain="baliyoga.com"
          src="https://datafa.st/js/script.js">
        </script>
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