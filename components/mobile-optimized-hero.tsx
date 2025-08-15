"use client"

import { OptimizedImage } from "./optimized-image"

export function MobileOptimizedHero() {
  return (
    <section className="relative h-[350px] w-full xs:h-[400px] sm:h-[500px] md:h-[600px] hero-section"
             style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center safe-left safe-right">
        <h1 className="mb-3 text-xl font-bold text-white leading-tight xs:mb-4 xs:text-2xl sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
          Discover the Best Yoga Studios & Retreats in Bali
        </h1>
        <h2 className="mb-6 text-sm text-white/90 leading-relaxed xs:text-base xs:mb-8 sm:text-lg md:text-xl lg:text-2xl max-w-4xl">
          Find authentic yoga experiences, world-class instructors, and transformative retreats across the Island of the Gods
        </h2>
        <div className="flex flex-col gap-3 w-full max-w-sm xs:gap-4 sm:flex-row sm:gap-6 sm:max-w-none">
          <a
            href="/studios"
            className="rounded-full bg-[#e6ceb3] px-6 py-3 font-semibold text-[#5d4c42] transition-all duration-200 hover:bg-[#d9b99a] active:scale-95 touch-manipulation xs:px-8 sm:px-10 sm:py-4"
          >
            Explore Studios
          </a>
          <a
            href="/retreats"
            className="rounded-full border-2 border-white px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#5d4c42] active:scale-95 touch-manipulation xs:px-8 sm:px-10 sm:py-4"
          >
            Find Retreats
          </a>
        </div>
      </div>
    </section>
  )
}
