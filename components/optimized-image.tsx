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
  
  // Use Intersection Observer for lazy loading non-priority images
  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { rootMargin: '50px' }
    )
    
    const element = document.querySelector(`[data-image-src="${src}"]`)
    if (element) {
      observer.observe(element)
    }
    
    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [src, priority])

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Fallback image for errors
  const fallbackSrc = fill
    ? generateColorFallback(600, 400, '#e6ceb3')
    : generateColorFallback(width || 300, height || 200, '#e6ceb3')

  // Only use fallback if there's an error or not in view yet
  const finalSrc = imageError ? fallbackSrc : (isInView ? src : fallbackSrc)

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
        <Image {...imageProps} src={finalSrc} fill loading={priority ? "eager" : "lazy"} />
      </div>
    )
  }

  return (
    <div className="relative" style={{ width, height }} data-image-src={src}>
      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" style={{ width, height }} />}
      <Image {...imageProps} src={finalSrc} width={width || 300} height={height || 200} loading={priority ? "eager" : "lazy"} />
    </div>
  )
}
