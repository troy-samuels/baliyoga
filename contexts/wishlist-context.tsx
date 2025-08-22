"use client"

import React, { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react'

// Types
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

interface WishlistState {
  items: WishlistItem[]
  isHydrated: boolean
}

type WishlistAction = 
  | { type: 'HYDRATE'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'SET_HYDRATED' }

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => boolean
  removeFromWishlist: (id: string) => boolean
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
  isHydrated: boolean
}

// Constants
const WISHLIST_KEY = 'bali-yoga-wishlist'
const MAX_WISHLIST_ITEMS = 50

// Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Reducer for state management
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        items: action.payload,
        isHydrated: true,
      }
    case 'ADD_ITEM':
      // Prevent duplicates and enforce max items
      if (state.items.some(item => item.id === action.payload.id)) {
        return state
      }
      if (state.items.length >= MAX_WISHLIST_ITEMS) {
        // Remove oldest item if at max capacity
        return {
          ...state,
          items: [action.payload, ...state.items.slice(0, -1)],
        }
      }
      return {
        ...state,
        items: [action.payload, ...state.items],
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      }
    case 'CLEAR':
      return {
        ...state,
        items: [],
      }
    case 'SET_HYDRATED':
      return {
        ...state,
        isHydrated: true,
      }
    default:
      return state
  }
}

// Storage utilities with error handling
const storage = {
  get: (): WishlistItem[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (!stored) return []
      
      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return []
      
      // Validate and filter items
      return parsed.filter(item => 
        item && 
        typeof item === 'object' && 
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.slug === 'string'
      ).slice(0, MAX_WISHLIST_ITEMS)
    } catch (error) {
      console.error('Failed to load wishlist:', error)
      return []
    }
  },
  
  set: (items: WishlistItem[]): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save wishlist:', error)
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(WISHLIST_KEY)
    } catch (error) {
      console.error('Failed to clear wishlist:', error)
    }
  }
}

// Provider component
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    isHydrated: false,
  })

  // Hydrate from localStorage on mount
  useEffect(() => {
    const items = storage.get()
    dispatch({ type: 'HYDRATE', payload: items })
  }, [])

  // Persist to localStorage when items change (after hydration)
  useEffect(() => {
    if (state.isHydrated) {
      storage.set(state.items)
    }
  }, [state.items, state.isHydrated])

  // Memoized actions
  const addToWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>): boolean => {
    const newItem: WishlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    }
    
    // Check if already exists
    if (state.items.some(existing => existing.id === item.id)) {
      return false
    }
    
    dispatch({ type: 'ADD_ITEM', payload: newItem })
    return true
  }, [state.items])

  const removeFromWishlist = useCallback((id: string): boolean => {
    if (!state.items.some(item => item.id === id)) {
      return false
    }
    
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    return true
  }, [state.items])

  const isInWishlist = useCallback((id: string): boolean => {
    return state.items.some(item => item.id === id)
  }, [state.items])

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR' })
    storage.clear()
  }, [])

  // Memoized context value - return empty state during SSR to prevent hydration mismatch
  const value = useMemo<WishlistContextType>(() => ({
    wishlistItems: state.isHydrated ? state.items : [],
    addToWishlist,
    removeFromWishlist,
    isInWishlist: state.isHydrated ? isInWishlist : () => false,
    clearWishlist,
    wishlistCount: state.isHydrated ? state.items.length : 0,
    isHydrated: state.isHydrated,
  }), [state, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

// Hook to use wishlist context with error boundary
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    // In development, throw an error to help developers identify the issue
    if (process.env.NODE_ENV === 'development') {
      throw new Error('useWishlist must be used within a WishlistProvider')
    }
    
    // In production, return a fallback context to prevent crashes
    console.warn('useWishlist used outside WishlistProvider, returning fallback')
    return {
      wishlistItems: [],
      addToWishlist: () => false,
      removeFromWishlist: () => false,
      isInWishlist: () => false,
      clearWishlist: () => {},
      wishlistCount: 0,
      isHydrated: false,
    }
  }
  return context
}