"use client"

import Image from "next/image"
import { useState } from "react"
import { generateColorFallback } from "@/lib/image-fallback"

interface ErrorHandledImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackSrc?: string
}

export function ErrorHandledImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "",
  fallbackSrc = generateColorFallback(width, height, '#e6ceb3')
}: ErrorHandledImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImageSrc(fallbackSrc)
    }
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={false}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwjA4YTXvl0QCeM0veuSnQA8nt3iuKynCgWCUAUKKwCUqjNwf8QAIJJ1j8fDe7bjhOKFuRfNOg=="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
} 