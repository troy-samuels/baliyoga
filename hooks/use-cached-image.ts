'use client'

import { useState, useEffect } from 'react'

interface CachedImageResult {
  src: string
  isLoading: boolean
  error: string | null
  fromCache: boolean
}

export function useCachedImage(studioName: string, studioId: string, location?: string): CachedImageResult {
  const [src, setSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState<boolean>(false)

  useEffect(() => {
    // Skip if no studio name provided
    if (!studioName || !studioId) {
      setSrc('')
      return
    }

    const cacheImage = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Call our image caching API
        const params = new URLSearchParams({
          studioName,
          studioId,
          location: location || 'Bali',
          maxImages: '1'
        })

        const response = await fetch(`/api/images/cache?${params}`)
        const data = await response.json()

        if (data.success || data.cached) {
          const urls = data.cachedUrls || []
          if (urls.length > 0) {
            setSrc(urls[0])
            setFromCache(data.cached || data.fromCache || false)
          } else {
            setError('No images available')
          }
        } else {
          setError(data.error || 'Failed to load image')
        }
      } catch (err) {
        setError('Failed to load image')
        console.error('Image caching error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    cacheImage()
  }, [studioName, studioId, location])

  return { src, isLoading, error, fromCache }
}
