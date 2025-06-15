"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

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
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('bali-yoga-wishlist')
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist)
        setWishlistItems(parsed)
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
        localStorage.setItem('bali-yoga-wishlist', JSON.stringify(wishlistItems))
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error)
      }
    }
  }, [wishlistItems, isLoaded])

  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    const newItem: WishlistItem = {
      ...item,
      addedAt: new Date().toISOString()
    }
    
    setWishlistItems(prev => {
      // Check if item already exists
      if (prev.some(existingItem => existingItem.id === item.id)) {
        return prev
      }
      return [newItem, ...prev]
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length
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