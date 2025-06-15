import type React from "react"
import { Cormorant_Garamond, Raleway } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { WishlistProvider } from "@/contexts/wishlist-context"

// Initialize the Cormorant Garamond font for headings
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
})

// Initialize the Raleway font for body text
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
})

export const metadata: Metadata = {
  title: "Bali Yoga",
  description: "Find the best yoga studios and retreats in Bali",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${raleway.variable} font-raleway`}>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </body>
    </html>
  )
}
