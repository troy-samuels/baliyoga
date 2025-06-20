"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  placeholder?: "blur" | "empty"
  quality?: number
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  placeholder = "empty",
  quality = 75,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(priority)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }

  // Fallback for broken images
  const fallbackSrc = hasError 
    ? "/api/placeholder/400/300" // You can create a placeholder API endpoint
    : src

  const imageProps = {
    alt,
    className: `${className} transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    }`,
    onLoad: handleLoad,
    onError: handleError,
    priority,
    sizes,
    quality,
    ...(placeholder === "blur" && { placeholder: "blur" as const }),
  }

  if (fill) {
    return (
      <div ref={imgRef} className="relative w-full h-full overflow-hidden">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}
        
        {/* Actual image */}
        {isVisible && (
          <Image
            {...imageProps}
            src={fallbackSrc}
            fill
          />
        )}
      </div>
    )
  }

  return (
    <div 
      ref={imgRef} 
      className="relative overflow-hidden"
      style={{ width, height }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      
      {/* Actual image */}
      {isVisible && (
        <Image
          {...imageProps}
          src={fallbackSrc}
          width={width || 300}
          height={height || 200}
        />
      )}
    </div>
  )
} 