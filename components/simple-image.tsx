'use client'

import Image from 'next/image'
import { useState } from 'react'
import { generateColorFallback } from '@/lib/image-fallback'

interface SimpleImageProps {
  src: string | undefined
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  fallbackColor?: string
}

/**
 * Simple image component that uses database images directly.
 * Follows CLAUDE.md best practices: Next.js Image component, proper error handling,
 * mobile-first design, and no hydration issues.
 */
export function SimpleImage({
  src,
  alt,
  width = 400,
  height = 240,
  fill = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  fallbackColor = '#e6ceb3'
}: SimpleImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Generate fallback image
  const fallbackSrc = generateColorFallback(
    fill ? 600 : width, 
    fill ? 400 : height, 
    fallbackColor
  )

  // Use fallback if no src or error occurred
  const finalSrc = (!src || imageError) ? fallbackSrc : src

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const baseProps = {
    alt,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    className: `${className} transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    }`,
    quality: 85
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        <Image
          {...baseProps}
          src={finalSrc}
          fill
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    )
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" 
             style={{ width, height }} />
      )}
      <Image
        {...baseProps}
        src={finalSrc}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  )
}
