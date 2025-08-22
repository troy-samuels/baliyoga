"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { generateColorFallback } from "@/lib/image-fallback"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  placeholder?: "blur" | "empty"
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  placeholder = "empty",
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  
  // Use Intersection Observer for lazy loading non-priority images
  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }
    
    // Use a ref-based approach for intersection observer
    const imageElement = document.querySelector(`[data-image-src="${src}"]`) as HTMLElement
    if (!imageElement) {
      setIsInView(true) // Fallback to show image immediately
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1
      }
    )
    
    observer.observe(imageElement)
    
    return () => observer.disconnect()
  }, [src, priority])

  const handleError = () => {
    console.warn(`Image failed to load: ${src}, retry count: ${retryCount}`)
    
    // Retry logic - try up to 2 times
    if (retryCount < 2 && src && !src.startsWith('data:')) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setImageError(false)
        setIsLoading(true)
      }, 1000 * (retryCount + 1)) // Exponential backoff
    } else {
      setImageError(true)
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    setRetryCount(0) // Reset retry count on successful load
  }

  // Fallback image for errors
  const fallbackSrc = fill
    ? generateColorFallback(600, 400, '#e6ceb3')
    : generateColorFallback(width || 300, height || 200, '#e6ceb3')

  // Use fallback if there's an error or if src is invalid
  const finalSrc = (!src || imageError) ? fallbackSrc : src

  const imageProps = {
    alt,
    className: `${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    sizes,
    ...(placeholder === "blur" && { placeholder: "blur" as const }),
  }

  if (fill) {
    return (
      <div className="relative w-full h-full" data-image-src={src}>
        {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />}
        {isInView && (
          <Image {...imageProps} key={`${finalSrc}-${retryCount}`} src={finalSrc} fill loading={priority ? "eager" : "lazy"} />
        )}
      </div>
    )
  }

  return (
    <div className="relative" style={{ width, height }} data-image-src={src}>
      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" style={{ width, height }} />}
      {isInView && (
        <Image {...imageProps} key={`${finalSrc}-${retryCount}`} src={finalSrc} width={width || 300} height={height || 200} loading={priority ? "eager" : "lazy"} />
      )}
    </div>
  )
}
