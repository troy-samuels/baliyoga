"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Heart } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"

export function MobileOptimizedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { wishlistCount } = useWishlist()

  return (
    <nav className="sticky top-0 z-50 bg-[#f9f3e9] px-4 py-4 shadow-sm md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="rounded-full bg-[#e6ceb3] px-4 py-2 text-lg font-bold text-[#5d4c42] md:px-6 md:text-xl">
            BALI YOGA
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 rounded-full bg-[#a39188] px-4 py-2 md:flex">
          <Link href="/studios" className="px-3 py-1 text-sm text-white hover:text-[#e6ceb3] md:px-4 md:text-base">
            Studios
          </Link>
          <Link href="/retreats" className="px-3 py-1 text-sm text-white hover:text-[#e6ceb3] md:px-4 md:text-base">
            Retreats
          </Link>
          <Link href="/become-a-partner" className="px-3 py-1 text-sm text-white hover:text-[#e6ceb3] md:px-4 md:text-base">
            Become a Partner
          </Link>
        </div>

        {/* Right Side - Wishlist and Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Wishlist Icon */}
          <Link 
            href="/wishlist" 
            className="relative rounded-lg bg-[#e6ceb3] p-2 text-[#5d4c42] transition-colors hover:bg-[#a39188] hover:text-white"
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg bg-[#e6ceb3] p-2 text-[#5d4c42] md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-40 bg-[#f9f3e9] shadow-lg md:hidden">
          <div className="flex flex-col space-y-1 p-4">
            <Link
              href="/studios"
              className="rounded-lg px-4 py-3 text-[#5d4c42] hover:bg-[#e6ceb3]"
              onClick={() => setIsMenuOpen(false)}
            >
              Studios
            </Link>
            <Link
              href="/retreats"
              className="rounded-lg px-4 py-3 text-[#5d4c42] hover:bg-[#e6ceb3]"
              onClick={() => setIsMenuOpen(false)}
            >
              Retreats
            </Link>
            <Link
              href="/become-a-partner"
              className="rounded-lg px-4 py-3 text-[#5d4c42] hover:bg-[#e6ceb3]"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Partner
            </Link>
            <Link
              href="/wishlist"
              className="rounded-lg px-4 py-3 text-[#5d4c42] hover:bg-[#e6ceb3] flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>My Wishlist</span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
