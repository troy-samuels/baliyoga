// Fallback image system to replace placeholder SVGs
export const FALLBACK_IMAGES = {
  // Studio and retreat fallbacks
  studio: "/images/fallback-studio.jpg",
  retreat: "/images/fallback-retreat.jpg", 
  
  // Blog fallbacks
  blog: "/images/fallback-blog.jpg",
  
  // Person/author fallbacks
  person: "/images/fallback-person.jpg",
  
  // General fallback
  general: "/images/fallback-general.jpg",
  
  // Hero/background fallbacks
  hero: "/images/fallback-hero.jpg",
  background: "/images/fallback-background.jpg"
} as const

export type FallbackImageType = keyof typeof FALLBACK_IMAGES

export function getFallbackImage(type: FallbackImageType = 'general'): string {
  return FALLBACK_IMAGES[type]
}

export function getImageWithFallback(src: string | null | undefined, fallbackType: FallbackImageType = 'general'): string {
  if (!src || src.includes('placeholder.svg')) {
    return getFallbackImage(fallbackType)
  }
  return src
}

// Generate a solid color image as ultimate fallback
export function generateColorFallback(width: number = 300, height: number = 200, color: string = '#e6ceb3'): string {
  return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`
} 