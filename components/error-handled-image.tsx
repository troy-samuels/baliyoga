"use client"

import Image from "next/image"
import { useState } from "react"

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
  fallbackSrc = "/placeholder.svg?height=600&width=800&text=Image+Not+Available"
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