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
    />
  )
} 