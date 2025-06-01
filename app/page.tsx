import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { MobileOptimizedSidebar } from "@/components/mobile-optimized-sidebar"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedHero } from "@/components/mobile-optimized-hero"
import { OptimizedImage } from "@/components/optimized-image"
import { FunctionalSearchBar } from "@/components/functional-search-bar"
import { LazySection } from "@/components/lazy-section"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { getTopSupabaseStudios, getTopSupabaseRetreats } from "@/lib/supabase-data-utils"

export default async function Home() {
  // Get top rated data with most images from Supabase
  const topStudios = await getTopSupabaseStudios(3)
  const topRetreats = await getTopSupabaseRetreats(3)

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      <MobileOptimizedHero />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Left Sidebar Filters */}
          <MobileOptimizedSidebar />

          {/* Right Content Area */}
          <div className="flex-1 space-y-8 lg:space-y-12">
            {/* Top Rated Yoga Studios */}
            <LazySection>
              <section>
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                  <h2 className="text-xl font-bold text-[#5d4c42] sm:text-2xl">Top Rated Yoga Studios</h2>
                  <Link href="/studios" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188]">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {topStudios.map((studio) => (
                    <MobileOptimizedCard
                      key={studio.id}
                      id={String(studio.id)}
                      name={studio.name}
                      slug={studio.slug}
                      image={studio.image}
                      location={studio.location}
                      rating={studio.rating}
                      styles={studio.styles}
                      type="studio"
                    />
                  ))}
                </div>
              </section>
            </LazySection>

            {/* Top Rated Yoga Retreats */}
            <LazySection>
              <section>
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                  <h2 className="text-xl font-bold text-[#5d4c42] sm:text-2xl">Top Rated Yoga Retreats</h2>
                  <Link href="/retreats" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188]">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {topRetreats.map((retreat) => (
                    <MobileOptimizedCard
                      key={retreat.id}
                      id={String(retreat.id)}
                      name={retreat.name}
                      slug={retreat.slug}
                      image={retreat.image}
                      location={retreat.location}
                      rating={retreat.rating}
                      type="retreat"
                      duration={retreat.duration}
                      price={retreat.price}
                    />
                  ))}
                </div>
              </section>
            </LazySection>

            {/* Blog Section */}
            <section className="rounded-2xl bg-[#f2e8dc] p-4 shadow-sm sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl font-bold text-[#5d4c42] sm:text-2xl">Yoga & Wellness Insights from Bali</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                {[
                  {
                    title: "The Best Time to Practice Yoga in Bali",
                    excerpt: "Discover the optimal seasons and times of day to enhance your yoga practice in Bali.",
                  },
                  {
                    title: "Top 5 Vegan Cafes Near Yoga Studios in Ubud",
                    excerpt: "Explore the best plant-based dining options to complement your yoga practice in Ubud.",
                  },
                  {
                    title: "Healing Waters: Bali's Sacred Springs for Yogis",
                    excerpt: "Learn about the spiritual and physical benefits of Bali's natural water sources.",
                  },
                ].map((blog, index) => (
                  <div
                    key={`blog-${index}`}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="h-32 w-full overflow-hidden sm:h-40">
                      <Image
                        src={`/placeholder.svg?height=160&width=300&text=Blog ${index + 1}`}
                        alt={blog.title}
                        width={300}
                        height={160}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="mb-2 text-base font-semibold text-[#5d4c42] sm:text-lg">{blog.title}</h3>
                      <p className="text-sm text-[#5d4c42]/80">{blog.excerpt}</p>
                      <Link
                        href="/blog"
                        className="mt-2 inline-block text-sm font-medium text-[#a39188] hover:text-[#5d4c42] sm:mt-3"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="rounded-2xl bg-[#f2e8dc] p-4 shadow-sm sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl font-bold text-[#5d4c42] sm:text-2xl">What Our Community Says</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
      </div>

      <MobileOptimizedFooter />
    </div>
  )
}
