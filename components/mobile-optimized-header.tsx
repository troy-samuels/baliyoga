"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function MobileOptimizedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu on escape key and outside click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleOutsideClick)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleOutsideClick)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <nav className="sticky top-0 z-50 bg-[#f9f3e9] px-4 py-3 shadow-sm border-b border-[#e6ceb3]/20 md:px-6 md:py-4 header-nav"
         style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center touch-manipulation" aria-label="Bali Yoga Home">
          <div className="rounded-full bg-[#e6ceb3] px-3 py-1.5 text-base font-bold text-[#5d4c42] transition-colors hover:bg-[#d4c1a1] xs:px-4 xs:py-2 xs:text-lg md:px-6 md:text-xl">
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
            className="flex items-center justify-center rounded-lg bg-[#e6ceb3] p-2.5 text-[#5d4c42] transition-all duration-200 hover:bg-[#d4c1a1] active:scale-95 md:hidden touch-manipulation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute left-0 right-0 top-full z-40 bg-[#f9f3e9] shadow-lg border-b border-[#e6ceb3]/20 md:hidden transition-all duration-300 ${
        isMenuOpen 
          ? 'opacity-100 translate-y-0 visible' 
          : 'opacity-0 -translate-y-2 invisible'
      }`}>
        <div className="flex flex-col p-4 space-y-1">
          {[
            { href: '/studios', label: 'Studios' },
            { href: '/retreats', label: 'Retreats' },
            { href: '/blog', label: 'Blog' },
            { href: '/about', label: 'About Us' },
            { href: '/become-a-partner', label: 'Become a Partner' }
          ].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-4 text-base font-medium text-[#5d4c42] transition-all duration-200 hover:bg-[#e6ceb3] hover:text-[#4a3d36] active:bg-[#d4c1a1] touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
