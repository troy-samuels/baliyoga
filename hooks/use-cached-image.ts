'use client'

import { useState, useEffect, useCallback } from 'react'
import { normalizeStudioName, generatePlaceholderImage } from '@/lib/image-utils'

interface CachedImageResult {
  src: string
  isLoading: boolean
  error: string | null
  fromCache: boolean
  retryCount: number
  placeholder: string
}

const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second

export function useCachedImage(
  studioName: string, 
  studioId: string, 
  location?: string, 
  type: 'studio' | 'retreat' = 'studio'
): CachedImageResult {
  const [src, setSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [placeholder] = useState<string>(() => 
    generatePlaceholderImage(400, 240, normalizeStudioName(studioName))
  )

  const fetchCachedImage = useCallback(async (attempt: number = 0) => {
    if (attempt === 0) {
      setIsLoading(true)
      setError(null)
    }

    try {
      console.log(`Fetching cached image for ${studioName} (attempt ${attempt + 1})`)
      
      // Call our image caching API
      const params = new URLSearchParams({
        studioName,
        studioId,
        location: location || 'Bali',
        type,
        maxImages: '1'
      })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`/api/images/cache?${params}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success || data.cached) {
        const urls = data.cachedUrls || []
        if (urls.length > 0) {
          // Validate the first URL before using it
          const imageUrl = urls[0]
          
          // Test if the image is accessible
          const imgTest = new Image()
          imgTest.onload = () => {
            setSrc(imageUrl)
            setFromCache(data.cached || data.fromCache || false)
            setError(null)
            setRetryCount(attempt)
          }
          imgTest.onerror = () => {
            console.error(`Image failed to load: ${imageUrl}`)
            throw new Error('Image validation failed')
          }
          imgTest.src = imageUrl
          
        } else {
          throw new Error('No images available in response')
        }
      } else {
        throw new Error(data.error || 'Failed to load image')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load image'
      console.error(`Image caching error (attempt ${attempt + 1}):`, errorMessage)
      
      // Retry logic
      if (attempt < MAX_RETRIES) {
        setTimeout(() => {
          fetchCachedImage(attempt + 1)
        }, RETRY_DELAY * (attempt + 1)) // Exponential backoff
        return
      }
      
      // All retries failed
      setError(errorMessage)
      setRetryCount(attempt)
    } finally {
      if (attempt === 0 || attempt >= MAX_RETRIES) {
        setIsLoading(false)
      }
    }
  }, [studioName, studioId, location, type])

  useEffect(() => {
    // Reset state
    setSrc('')
    setError(null)
    setFromCache(false)
    setRetryCount(0)
    
    // Skip if no studio name provided
    if (!studioName || !studioId) {
      return
    }

    fetchCachedImage(0)
  }, [fetchCachedImage])

  return { 
    src, 
    isLoading, 
    error, 
    fromCache, 
    retryCount,
    placeholder
  }
}
