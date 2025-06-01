"use client"

import Image from "next/image"
import { useState } from "react"

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

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Fallback image for errors
  const fallbackSrc = fill
    ? "/placeholder.svg?height=400&width=600&text=Image+Not+Available"
    : `/placeholder.svg?height=${height || 200}&width=${width || 300}&text=Image+Not+Available`

  // Only use fallback if there's an error
  const finalSrc = imageError ? fallbackSrc : src

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
      <div className="relative w-full h-full">
        {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />}
        <Image {...imageProps} src={finalSrc} fill />
      </div>
    )
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" style={{ width, height }} />}
      <Image {...imageProps} src={finalSrc} width={width || 300} height={height || 200} />
    </div>
  )
}
