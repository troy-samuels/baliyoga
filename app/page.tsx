import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedHero } from "@/components/mobile-optimized-hero"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { LazySection } from "@/components/lazy-section"
import { getTopSupabaseStudios, getTopSupabaseRetreats } from "@/lib/supabase-data-utils"
import type { Studio, Retreat } from "@/lib/data-utils"
import fs from "fs"
import path from "path"
import { generateColorFallback } from "@/lib/image-fallback"

// Blog post interface
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  author: string
  publishDate: string
  readTime: string
  categories?: string[]
  status?: string
}

// Load blog posts from JSON file
function loadBlogPosts(): BlogPost[] {
  try {
    const filePath = path.join(process.cwd(), "data", "blog-posts.json")
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8")
      return JSON.parse(data).filter((post: BlogPost) => post.status === "published")
    }
  } catch (error) {
    console.error("Error loading blog posts:", error)
  }
  return []
}

export default async function Home() {
  // Get top rated data with most images from Supabase
  const [topStudios, topRetreats] = await Promise.all([
    getTopSupabaseStudios(4),
    getTopSupabaseRetreats(4),
  ])

  // Load real blog posts
  const blogPosts = loadBlogPosts()
  const featuredBlogs = blogPosts.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      <MobileOptimizedHero />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-6">
        <div className="space-y-8 lg:space-y-12">
          {/* Top Rated Yoga Studios */}
          <LazySection>
            <section>
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <h2 className="text-xl font-bold text-[#5d4c42] sm:text-2xl">Top Rated Yoga Studios</h2>
                <Link href="/studios" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188]">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {topStudios.map((studio: Studio, idx: number) => (
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
                    phone_number={studio.phone_number}
                    website={studio.website}
                    featured={idx === 0}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {topRetreats.map((retreat: Retreat, idx: number) => (
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
                    phone_number={retreat.phone_number}
                    website={retreat.website}
                    featured={idx === 0}
                  />
                ))}
              </div>
            </section>
          </LazySection>

          {/* Blog Section */}
          <section className="rounded-2xl bg-[#f2e8dc] p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="text-xl font-bold text-[#5d4c42] sm:text-2xl">Yoga & Wellness Insights from Bali</h2>
              <Link href="/blog" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188]">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {featuredBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-32 w-full overflow-hidden sm:h-40">
                    <Image
                      src={blog.featuredImage || generateColorFallback(300, 160, '#e6ceb3')}
                      alt={blog.title}
                      width={300}
                      height={160}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="mb-2 text-base font-semibold text-[#5d4c42] sm:text-lg line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-[#5d4c42]/80 line-clamp-2">{blog.excerpt}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#5d4c42]/70 sm:mt-3">
                      <span>{blog.author}</span>
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                </Link>
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

      <MobileOptimizedFooter />
    </div>
  )
}
