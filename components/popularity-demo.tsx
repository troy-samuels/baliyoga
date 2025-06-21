"use client"

import { useState, useEffect } from 'react'
import { Heart, TrendingUp, Info, AlertTriangle } from 'lucide-react'
import { getPopularityScores, incrementPopularityScore } from '@/lib/popularity-utils'
import { isRateLimited, recordAction, getRemainingActions } from '@/lib/security-utils'

export function PopularityDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [demoScores, setDemoScores] = useState<Record<string, number>>({})
  const [isClient, setIsClient] = useState(false)
  const [remainingActions, setRemainingActions] = useState(20)
  const [isLimited, setIsLimited] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      setDemoScores(getPopularityScores())
      updateRateLimitStatus()
    }
  }, [isClient])

  const updateRateLimitStatus = () => {
    setRemainingActions(getRemainingActions('POPULARITY_DEMO'))
    setIsLimited(isRateLimited('POPULARITY_DEMO'))
  }

  const handleDemoWishlist = (itemId: string) => {
    // Check rate limiting before proceeding
    if (isRateLimited('POPULARITY_DEMO')) {
      console.warn('Rate limit exceeded for demo actions')
      updateRateLimitStatus()
      return
    }

    // Record the action for rate limiting
    recordAction('POPULARITY_DEMO')
    
    // Increment the score (this will also handle its own rate limiting)
    const success = incrementPopularityScore(itemId)
    
    if (success) {
      setDemoScores(getPopularityScores())
    }
    
    updateRateLimitStatus()
  }

  const demoItems = [
    { id: 'demo-studio-1', name: 'Serenity Yoga Studio', type: 'studio' },
    { id: 'demo-studio-2', name: 'Bliss Yoga Center', type: 'studio' },
    { id: 'demo-retreat-1', name: 'Jungle Wellness Retreat', type: 'retreat' },
  ]

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !isClient) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-[#5d4c42] px-4 py-2 text-white shadow-lg hover:bg-[#a39188] transition-colors"
      >
        <Info className="h-4 w-4" />
        Popularity Demo
        {isLimited && (
          <AlertTriangle className="h-4 w-4 text-yellow-300" />
        )}
      </button>

      {/* Demo Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 rounded-lg bg-white p-4 shadow-xl border border-gray-200">
          <div className="mb-3">
            <h3 className="font-semibold text-[#5d4c42] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Popularity Algorithm Demo
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Click hearts to see how wishlist additions affect ranking
            </p>
            
            {/* Rate Limit Status */}
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <div className="flex items-center justify-between">
                <span>Actions remaining:</span>
                <span className={`font-bold ${remainingActions <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                  {remainingActions}/20
                </span>
              </div>
              {isLimited && (
                <div className="mt-1 text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Rate limit reached. Wait 1 minute to continue.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {demoItems.map((item) => {
              const score = demoScores[item.id] || 0
              return (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {score} wishlist{score !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDemoWishlist(item.id)}
                    disabled={isLimited}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      isLimited 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-100 hover:bg-red-200'
                    }`}
                  >
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="text-xs">+1</span>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
            <strong>How it works:</strong> Items with more wishlist additions appear higher in search results. The algorithm combines popularity with ratings for balanced ranking.
          </div>

          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
            <strong>Security:</strong> Rate limiting prevents abuse (max 20 demo actions per minute).
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700"
          >
            Close Demo
          </button>
        </div>
      )}
    </div>
  )
} 