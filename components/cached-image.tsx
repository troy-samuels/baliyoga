'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCachedImage } from '@/hooks/use-cached-image'
import { getResponsiveImageSizes } from '@/lib/image-utils'

interface CachedImageProps {
  studioName: string
  alt: string
  studioId: string
  location?: string
  type?: 'studio' | 'retreat'
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
  showPlaceholder?: boolean
  onImageLoad?: () => void
  onImageError?: (error: string) => void
}

export function CachedImage({
  studioName,
  alt,
  studioId,
  location,
  type = 'studio',
  className = '',
  fill = false,
  sizes,
  priority = false,
  width,
  height,
  showPlaceholder = true,
  onImageLoad,
  onImageError
}: CachedImageProps) {

  const { 
    src: cachedSrc, 
    isLoading, 
    error, 
    fromCache, 
    retryCount,
    placeholder 
  } = useCachedImage(studioName, studioId, location, type)
  
  const [hasImageError, setHasImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Determine what to show
  const shouldShowCachedImage = cachedSrc && !error && !hasImageError
  const shouldShowPlaceholder = showPlaceholder && (!shouldShowCachedImage || isLoading)
  
  // Use responsive sizes if not provided
  const imageSizes = sizes || (fill ? getResponsiveImageSizes() : undefined)

  const handleError = () => {
    console.error(`Image load error for ${studioName} (${studioId})`)
    setHasImageError(true)
    onImageError?.(error || 'Image failed to load')
  }

  const handleLoad = () => {
    setImageLoaded(true)
    onImageLoad?.()
  }

  // Reset image error state when source changes
  useEffect(() => {
    if (cachedSrc) {
      setHasImageError(false)
      setImageLoaded(false)
    }
  }, [cachedSrc])

  const baseImageProps = {
    alt,
    priority,
    onError: handleError,
    onLoad: handleLoad,
    ...(!fill && { width: width || 400, height: height || 240 }),
    ...(fill && { fill: true, sizes: imageSizes })
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden min-h-[240px]">
      {/* Progressive loading: Show placeholder first, then cached image */}
      
      {/* Placeholder Image */}
      {shouldShowPlaceholder && (
        <div className="absolute inset-0">
          <Image
            {...baseImageProps}
            src={placeholder}
            alt={`${alt} - Loading...`}
            className={`${className} transition-opacity duration-500 ${
              shouldShowCachedImage && imageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            priority={false} // Placeholder should not be priority
          />
        </div>
      )}

      {/* Cached Image */}
      {shouldShowCachedImage && (
        <div className="absolute inset-0">
          <Image
            {...baseImageProps}
            src={cachedSrc}
            className={`${className} transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } hover:scale-105`}
          />
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-3 shadow-lg">
            <div className="animate-spin h-5 w-5 border-2 border-[#8B4513] border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
          <div className="text-gray-400 text-sm mb-2">
            📷
          </div>
          <div className="text-xs text-gray-500 max-w-[200px]">
            Unable to load image
            {retryCount > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                (Tried {retryCount + 1} time{retryCount > 0 ? 's' : ''})
              </div>
            )}
          </div>
        </div>
      )}

      {/* Development Indicators */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-1 left-1 flex gap-1">
          {fromCache && shouldShowCachedImage && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              Cached
            </div>
          )}
          {retryCount > 0 && (
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Retry: {retryCount}
            </div>
          )}
          {type === 'retreat' && (
            <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">
              Retreat
            </div>
          )}
        </div>
      )}

      {/* Accessibility: Screen reader info */}
      {error && (
        <div className="sr-only">
          Image could not be loaded for {studioName}
        </div>
      )}
    </div>
  )
}
