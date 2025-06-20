"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from "@/components/ui/skeleton"

// Dynamic imports for heavy components
export const DynamicGoogleMap = dynamic(
  () => import('@/components/location-map').then(mod => ({ default: mod.LocationMap })),
  {
    loading: () => (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading map...</div>
      </div>
    ),
    ssr: false // Maps don't work well with SSR
  }
)

export const DynamicBlogEditor = dynamic(
  () => import('@/app/admin/blog/page').then(mod => ({ default: mod.default })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }
)

export const DynamicImageUpload = dynamic(
  () => import('@/components/ui/image-upload').then(mod => ({ default: mod.ImageUpload })),
  {
    loading: () => (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <div className="text-gray-400">Loading image upload...</div>
        </div>
      </div>
    )
  }
)

export const DynamicCarousel = dynamic(
  () => import('@/components/ui/carousel').then(mod => ({
    default: mod.Carousel,
    CarouselContent: mod.CarouselContent,
    CarouselItem: mod.CarouselItem,
    CarouselNext: mod.CarouselNext,
    CarouselPrevious: mod.CarouselPrevious
  })),
  {
    loading: () => (
      <div className="flex space-x-4 animate-pulse">
        <Skeleton className="h-48 w-72" />
        <Skeleton className="h-48 w-72" />
        <Skeleton className="h-48 w-72" />
      </div>
    )
  }
)

// Optimized section wrapper that loads content when visible
interface OptimizedSectionProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

export function OptimizedSection({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "50px"
}: OptimizedSectionProps) {
  return (
    <Suspense fallback={
      <div className={`${className} animate-pulse bg-gray-100 rounded-lg p-8`}>
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    }>
      <section className={className}>
        {children}
      </section>
    </Suspense>
  )
}

// Performance-optimized card grid
interface OptimizedGridProps {
  children: React.ReactNode
  className?: string
  itemsPerRow?: number
}

export function OptimizedGrid({
  children,
  className = "",
  itemsPerRow = 3
}: OptimizedGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={`grid ${gridCols[itemsPerRow as keyof typeof gridCols]} gap-6 ${className}`}>
      {children}
    </div>
  )
}

// Note: Commented out until virtualized-list component is created
// export const DynamicVirtualizedList = dynamic(
//   () => import('@/components/virtualized-list').then(mod => ({ default: mod.VirtualizedList })),
//   {
//     loading: () => (
//       <div className="space-y-2">
//         {[...Array(5)].map((_, i) => (
//           <Skeleton key={i} className="h-16 w-full" />
//         ))}
//       </div>
//     ),
//     ssr: false
//   }
// ) 