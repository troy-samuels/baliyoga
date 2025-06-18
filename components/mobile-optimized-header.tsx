"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function MobileOptimizedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
        <div className="hidden items-center space-x-6 md:flex">
          <Link href="/studios" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188] md:text-base">
            Studios
          </Link>
          <Link href="/retreats" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188] md:text-base">
            Retreats
          </Link>
          <Link href="/blog" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188] md:text-base">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188] md:text-base">
            About Us
          </Link>
        </div>

        {/* Right Side - Become a Partner and Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Become a Partner Button - Desktop */}
          <Link 
            href="/become-a-partner" 
            className="hidden md:block rounded-lg bg-[#e6ceb3] px-4 py-2 text-sm font-medium text-[#5d4c42] transition-colors hover:bg-[#a39188] hover:text-white"
          >
            Become a Partner
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
              href="/blog"
              className="rounded-lg px-4 py-3 text-[#5d4c42] hover:bg-[#e6ceb3]"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-3 text-[#5d4c42] hover:bg-[#e6ceb3]"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/become-a-partner"
              className="rounded-lg px-4 py-3 text-[#5d4c42] hover:bg-[#e6ceb3]"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Partner
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
