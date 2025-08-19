"use client"

import Image from "next/image"
import { useState } from "react"
import { generateColorFallback } from "@/lib/image-fallback"

interface BlogImageProps {
  src?: string
  alt: string
  title: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  caption?: string
}

export function BlogImage({ 
  src, 
  alt, 
  title,
  width = 800, 
  height = 400,
  className = "",
  priority = false,
  caption
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src || generateColorFallback(width, height, '#e6ceb3'))
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(generateColorFallback(width, height, '#e6ceb3'))
    }
  }

  // Generate SEO-friendly alt text if not provided
  const seoAlt = alt || `${title} - Yoga and wellness in Bali`
  
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={imgSrc}
          alt={seoAlt}
          title={title}
          width={width}
          height={height}
          className={`${className} ${hasError ? 'opacity-90' : ''}`}
          onError={handleError}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[#5d4c42]/70 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}