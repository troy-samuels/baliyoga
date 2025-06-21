"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { incrementPopularityScore, decrementPopularityScore } from '@/lib/popularity-utils'
import { isValidItemId, sanitizeString, secureGetItem, secureSetItem, isRateLimited, getRemainingActions } from '@/lib/security-utils'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  image?: string
  location: string
  rating: number
  type: 'studio' | 'retreat'
  styles?: string[]
  duration?: string
  price?: string
  phone_number?: string
  website?: string
  addedAt: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => boolean
  removeFromWishlist: (id: string) => boolean
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
  remainingActions: number
  isRateLimited: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = secureGetItem('bali-yoga-wishlist')
      if (savedWishlist) {
        let parsed: any
        try {
          parsed = JSON.parse(savedWishlist)
        } catch (parseError) {
          console.warn('Error parsing wishlist JSON:', parseError)
          setIsLoaded(true)
          return
        }
        
        // Validate and sanitize wishlist items
        const validatedItems: WishlistItem[] = []
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && typeof item === 'object' && isValidItemId(item.id)) {
              validatedItems.push({
                id: item.id,
                name: sanitizeString(item.name, 100),
                slug: sanitizeString(item.slug, 100),
                image: item.image ? sanitizeString(item.image, 500) : undefined,
                location: sanitizeString(item.location, 100),
                rating: typeof item.rating === 'number' ? Math.max(0, Math.min(5, item.rating)) : 0,
                type: (item.type === 'studio' || item.type === 'retreat') ? item.type : 'studio',
                styles: Array.isArray(item.styles) ? item.styles.map((s: any) => sanitizeString(s, 50)).slice(0, 10) : undefined,
                duration: item.duration ? sanitizeString(item.duration, 50) : undefined,
                price: item.price ? sanitizeString(item.price, 50) : undefined,
                phone_number: item.phone_number ? sanitizeString(item.phone_number, 50) : undefined,
                website: item.website ? sanitizeString(item.website, 200) : undefined,
                addedAt: item.addedAt || new Date().toISOString()
              })
            }
          }
        }
        
        setWishlistItems(validatedItems)
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        secureSetItem('bali-yoga-wishlist', JSON.stringify(wishlistItems))
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error)
      }
    }
  }, [wishlistItems, isLoaded])

  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>): boolean => {
    // Validate input
    if (!isValidItemId(item.id)) {
      console.warn('Invalid item ID for wishlist:', item.id)
      return false
    }
    
    // Check rate limiting
    if (isRateLimited('WISHLIST_ACTIONS')) {
      console.warn('Rate limit exceeded for wishlist actions')
      return false
    }
    
    // Sanitize item data
    const sanitizedItem: WishlistItem = {
      id: item.id,
      name: sanitizeString(item.name, 100),
      slug: sanitizeString(item.slug, 100),
      image: item.image ? sanitizeString(item.image, 500) : undefined,
      location: sanitizeString(item.location, 100),
      rating: typeof item.rating === 'number' ? Math.max(0, Math.min(5, item.rating)) : 0,
      type: (item.type === 'studio' || item.type === 'retreat') ? item.type : 'studio',
      styles: Array.isArray(item.styles) ? item.styles.map(s => sanitizeString(s, 50)).slice(0, 10) : undefined,
      duration: item.duration ? sanitizeString(item.duration, 50) : undefined,
      price: item.price ? sanitizeString(item.price, 50) : undefined,
      phone_number: item.phone_number ? sanitizeString(item.phone_number, 50) : undefined,
      website: item.website ? sanitizeString(item.website, 200) : undefined,
      addedAt: new Date().toISOString()
    }
    
    let success = false
    
    setWishlistItems(prev => {
      // Check if item already exists
      if (prev.some(existingItem => existingItem.id === item.id)) {
        return prev
      }
      
      // Increment popularity score when adding to wishlist
      success = incrementPopularityScore(item.id)
      
      if (success) {
        return [sanitizedItem, ...prev]
      } else {
        return prev
      }
    })
    
    return success
  }

  const removeFromWishlist = (id: string): boolean => {
    // Validate input
    if (!isValidItemId(id)) {
      console.warn('Invalid item ID for wishlist removal:', id)
      return false
    }
    
    // Check rate limiting
    if (isRateLimited('WISHLIST_ACTIONS')) {
      console.warn('Rate limit exceeded for wishlist actions')
      return false
    }
    
    let success = false
    
    setWishlistItems(prev => {
      const itemExists = prev.some(item => item.id === id)
      if (itemExists) {
        // Decrement popularity score when removing from wishlist
        success = decrementPopularityScore(id)
        
        if (success) {
          return prev.filter(item => item.id !== id)
        }
      }
      return prev
    })
    
    return success
  }

  const isInWishlist = (id: string) => {
    if (!isValidItemId(id)) return false
    return wishlistItems.some(item => item.id === id)
  }

  const clearWishlist = () => {
    // Remove popularity scores for all items
    wishlistItems.forEach(item => {
      decrementPopularityScore(item.id)
    })
    
    setWishlistItems([])
  }

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
    remainingActions: getRemainingActions('WISHLIST_ACTIONS'),
    isRateLimited: isRateLimited('WISHLIST_ACTIONS')
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
} 