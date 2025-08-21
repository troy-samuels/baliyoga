import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedHero } from "@/components/mobile-optimized-hero"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { LazySection } from "@/components/lazy-section"
import { HomepageSchema } from "@/components/homepage-schema"
import { getFeaturedStudios, getFeaturedRetreats } from "@/lib/supabase-server"
import type { Studio, Retreat } from "@/lib/types"

export default async function Home() {
  try {
    // Server-side data fetching with cached results
    const [topStudios, topRetreats] = await Promise.all([
      getFeaturedStudios(4),
      getFeaturedRetreats(4),
    ])

    console.log('Homepage data loaded:', {
      studiosCount: topStudios.length,
      retreatsCount: topRetreats.length
    })

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <HomepageSchema />
      <MobileOptimizedHeader />
      <MobileOptimizedHero />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-4 safe-left safe-right xs:py-6 sm:py-8 md:px-6">
        <div className="space-y-6 xs:space-y-8 lg:space-y-12">

          {/* Top Rated Yoga Studios */}
          <LazySection>
            <section>
              <div className="mb-4 flex items-center justify-between xs:mb-5 sm:mb-6">
                <h2 className="text-lg font-bold text-[#5d4c42] xs:text-xl sm:text-2xl">Top Rated Yoga Studios</h2>
                <Link href="/studios" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188] touch-manipulation">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 card-grid">
                {topStudios.map((studio: Studio) => (
                  <MobileOptimizedCard
                    key={studio.id}
                    id={String(studio.id)}
                    name={studio.name}
                    slug={studio.slug}
                    image={studio.image}
                    location={studio.location}
                    rating={studio.rating}
                    reviewCount={studio.reviewCount}
                    styles={studio.styles}
                    type="studio"
                    phone_number={studio.phone_number}
                    website={studio.website}
                    featured={false}
                  />
                ))}
              </div>
            </section>
          </LazySection>

          {/* Top Rated Yoga Retreats */}
          <LazySection>
            <section>
              <div className="mb-4 flex items-center justify-between xs:mb-5 sm:mb-6">
                <h2 className="text-lg font-bold text-[#5d4c42] xs:text-xl sm:text-2xl">Top Rated Yoga Retreats</h2>
                <Link href="/retreats" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188] touch-manipulation">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 card-grid">
                {topRetreats.map((retreat: Retreat) => (
                  <MobileOptimizedCard
                    key={retreat.id}
                    id={String(retreat.id)}
                    name={retreat.name}
                    slug={retreat.slug}
                    image={retreat.image}
                    location={retreat.location}
                    rating={retreat.rating}
                    reviewCount={retreat.reviewCount}
                    type="retreat"
                    duration={retreat.duration}
                    price={retreat.price}
                    phone_number={retreat.phone_number}
                    website={retreat.website}
                    featured={false}
                  />
                ))}
              </div>
            </section>
          </LazySection>

          {/* Testimonials Section */}
          <section className="rounded-xl bg-[#f2e8dc] p-4 shadow-sm xs:p-5 sm:p-6 safe-left safe-right">
            <div className="mb-4 xs:mb-5 sm:mb-6">
              <h2 className="text-lg font-bold text-[#5d4c42] xs:text-xl sm:text-2xl">What Our Community Says</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:gap-6 md:grid-cols-2">
              {[
                {
                  name: "Sarah M.",
                  location: "Australia",
                  rating: 5,
                  text: "The yoga retreat I found through Bali Yoga completely transformed my practice. The instructors were world-class and the location was breathtaking.",
                },
                {
                  name: "David L.",
                  location: "United States",
                  rating: 5,
                  text: "I discovered my favorite yoga studio in Ubud through this platform. The filtering options made it easy to find exactly what I was looking for.",
                },
                {
                  name: "Emma K.",
                  location: "United Kingdom",
                  rating: 4,
                  text: "As a yoga instructor visiting Bali, this site helped me connect with local studios for guest teaching opportunities. Invaluable resource!",
                },
                {
                  name: "Michael T.",
                  location: "Canada",
                  rating: 5,
                  text: "The detailed descriptions and authentic reviews helped me choose the perfect retreat for my skill level. Will definitely use Bali Yoga again.",
                },
              ].map((testimonial, index) => (
                <div key={`testimonial-${index}`} className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
                  <div className="mb-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mb-3 text-sm italic text-[#5d4c42]/80">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#5d4c42] sm:text-base">{testimonial.name}</p>
                      <p className="text-xs text-[#5d4c42]/70">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="rounded-2xl bg-[#e6ceb3] p-4 shadow-sm sm:p-6">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#5d4c42] sm:text-xl">
                  Stay updated with the best yoga spots in Bali
                </h2>
                <p className="mt-1 text-sm text-[#5d4c42]/80">
                  Get exclusive offers, new listings, and wellness tips delivered to your inbox.
                </p>
              </div>
              <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none sm:py-2"
                />
                <button className="rounded-full bg-[#a39188] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8a7b73] sm:px-6">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileOptimizedFooter />
      </div>
    )
  } catch (error) {
    console.error('Error rendering Home page:', error)
    
    // Return a fallback UI if there's an error
    return (
      <div className="min-h-screen bg-[#f9f3e9]">
        <HomepageSchema />
        <MobileOptimizedHeader />
        <MobileOptimizedHero />

        {/* Error Fallback Content */}
        <div className="mx-auto max-w-7xl px-4 py-4 safe-left safe-right xs:py-6 sm:py-8 md:px-6">
          <div className="space-y-6 xs:space-y-8 lg:space-y-12">
            <section className="text-center py-12">
              <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">Welcome to Bali Yoga</h2>
              <p className="text-[#5d4c42]/80 mb-8">We're currently updating our featured content. Please check back soon or explore our full directory.</p>
              <div className="flex gap-4 justify-center">
                <a href="/studios" className="bg-[#5d4c42] text-white px-6 py-3 rounded-lg hover:bg-[#a39188] transition-colors">
                  View All Studios
                </a>
                <a href="/retreats" className="bg-[#a39188] text-white px-6 py-3 rounded-lg hover:bg-[#5d4c42] transition-colors">
                  View All Retreats
                </a>
              </div>
            </section>
          </div>
        </div>

        <MobileOptimizedFooter />
      </div>
    )
  }
}
