"use client"

import { Suspense, lazy, useState, useEffect, useRef } from 'react'
import { ClientOnly } from './client-only'

interface OptimizedLazySectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

// Skeleton loader component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-[#e6ceb3] overflow-hidden animate-pulse">
    <div className="h-[200px] bg-[#e6ceb3]"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-[#e6ceb3] rounded w-3/4"></div>
      <div className="h-3 bg-[#e6ceb3] rounded w-1/2"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-[#e6ceb3] rounded-full w-16"></div>
        <div className="h-6 bg-[#e6ceb3] rounded-full w-20"></div>
      </div>
    </div>
  </div>
)

const DefaultSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
    {Array.from({ length: 4 }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export function OptimizedLazySection({ 
  children, 
  fallback = <DefaultSkeleton />,
  threshold = 0.1,
  rootMargin = "50px",
  className = ""
}: OptimizedLazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={ref} className={className}>
      <ClientOnly fallback={fallback}>
        {isVisible ? (
          <Suspense fallback={fallback}>
            {children}
          </Suspense>
        ) : (
          fallback
        )}
      </ClientOnly>
    </div>
  )
}