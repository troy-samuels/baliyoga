"use client"

import { OptimizedImage } from "./optimized-image"

export function MobileOptimizedHero() {
  return (
    <section className="relative h-[400px] w-full sm:h-[500px] md:h-[600px]">
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src="/images/hero-yoga-bali-realistic.png"
          alt="Serene yoga setup with mat and props overlooking beautiful Balinese rice terraces, palm trees, and traditional temple architecture"
          fill
          className="object-cover object-center"
          priority={true}
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
          Discover the Best Yoga Studios & Retreats in Bali
        </h1>
        <h2 className="mb-6 text-lg text-white/90 sm:text-xl md:text-2xl lg:text-3xl max-w-4xl">
          Find authentic yoga experiences, world-class instructors, and transformative retreats across the Island of the Gods
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <a
            href="/studios"
            className="rounded-full bg-[#e6ceb3] px-8 py-3 font-medium text-[#5d4c42] transition-colors hover:bg-[#d9b99a] sm:px-10 sm:py-4"
          >
            Explore Studios
          </a>
          <a
            href="/retreats"
            className="rounded-full border-2 border-white px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-[#5d4c42] sm:px-10 sm:py-4"
          >
            Find Retreats
          </a>
        </div>
      </div>
    </section>
  )
}
