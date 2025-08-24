'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCachedImage } from '@/hooks/use-cached-image'

interface CachedImageProps {
  studioName: string
  alt: string
  studioId: string
  location?: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
}

export function CachedImage({
  studioName,
  alt,
  studioId,
  location,
  className = '',
  fill = false,
  sizes,
  priority = false,
  width,
  height
}: CachedImageProps) {

  const { src: cachedSrc, isLoading, error, fromCache } = useCachedImage(studioName, studioId, location)
  const [hasImageError, setHasImageError] = useState(false)

  // Only show image if we have a valid cached source and no errors
  const shouldShowImage = cachedSrc && !error && !hasImageError

  const handleError = () => {
    setHasImageError(true)
  }

  // If no image should be shown, return null (nothing rendered)
  if (!shouldShowImage && !isLoading) {
    return null
  }

  const imageProps = {
    src: cachedSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    onError: handleError,
    ...(fill ? { fill: true, sizes } : { width: width || 400, height: height || 240 })
  }

  return (
    <div className="relative bg-accent-light/20 rounded-lg overflow-hidden">
      {shouldShowImage && <Image {...imageProps} alt={alt} />}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-accent-light/50 animate-pulse flex items-center justify-center">
          <div className="text-xs text-brown-light">Loading image...</div>
        </div>
      )}

      {/* Cache indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && fromCache && shouldShowImage && (
        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
          Cached
        </div>
      )}

      {/* No image indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && !shouldShowImage && !isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-xs text-gray-500">No image available</div>
        </div>
      )}
    </div>
  )
}
