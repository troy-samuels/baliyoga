import Image from "next/image"
import Link from "next/link"
import { Calendar, ChevronRight, Clock, Search, User, ArrowRight } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
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
      const posts = JSON.parse(data).filter((post: BlogPost) => post.status === "published")
      // Filter out posts without proper featured images
      return posts.filter((post: BlogPost) => 
        post.featuredImage && 
        post.featuredImage.trim() !== "" && 
        !post.featuredImage.includes('placeholder')
      )
    }
  } catch (error) {
    console.error("Error loading blog posts:", error)
  }

  // Return mock data if no posts exist - but filter out the problematic article
  const mockPosts = [
    {
      id: "2",
      title: "Top 5 Vegan Cafes Near Yoga Studios in Ubud",
      slug: "top-vegan-cafes-near-yoga-studios-ubud",
      excerpt: "Explore the best plant-based dining options to complement your yoga practice in Ubud.",
      featuredImage: generateColorFallback(600, 400, '#e6ceb3'),
      author: "David Lee",
      publishDate: "2023-05-28",
      readTime: "6 min read",
      categories: ["Food & Nutrition", "Ubud"],
      status: "published",
    },
    {
      id: "3",
      title: "Healing Waters: Bali's Sacred Springs for Yogis",
      slug: "healing-waters-bali-sacred-springs-yogis",
      excerpt: "Learn about the spiritual and physical benefits of Bali's natural water sources.",
      featuredImage: generateColorFallback(600, 400, '#e6ceb3'),
      author: "Sarah Johnson",
      publishDate: "2023-05-10",
      readTime: "10 min read",
      categories: ["Spirituality", "Wellness"],
      status: "published",
    },
  ]
  
  // Filter out any posts without proper images
  return mockPosts.filter((post: BlogPost) => 
    post.featuredImage && 
    post.featuredImage.trim() !== "" && 
    !post.featuredImage.includes('placeholder')
  )
}

export default function BlogPage() {
  const blogPosts = loadBlogPosts()
  const recentPosts = blogPosts

  const categories = [
    { name: "Yoga Practice", count: 15 },
    { name: "Meditation", count: 8 },
    { name: "Wellness", count: 12 },
    { name: "Food & Nutrition", count: 9 },
    { name: "Spirituality", count: 11 },
    { name: "Bali Travel", count: 14 },
    { name: "Culture", count: 7 },
    { name: "Teacher Training", count: 5 },
    { name: "Beginners", count: 6 },
  ]

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />

      {/* Hero Section */}
      <div className="bg-[#e6ceb3] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-center text-3xl font-bold text-[#5d4c42] md:text-4xl">
            Yoga & Wellness Insights from Bali
          </h1>
          <p className="mt-2 text-center text-lg text-[#5d4c42]/80">
            Discover tips, stories, and wisdom from our community of yoga practitioners and wellness experts
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-6 max-w-3xl">
            <div className="flex rounded-full bg-white p-2 shadow-md">
              <div className="flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
                <Search className="mr-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for articles, topics, or keywords..."
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              <button className="ml-2 rounded-full bg-[#a39188] px-6 py-2 font-medium text-white transition-colors hover:bg-[#8a7b73]">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="space-y-12">
          {/* Latest Articles */}
          {recentPosts.length > 0 && (
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#5d4c42]">Latest Articles</h2>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {recentPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-2xl bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={post.featuredImage || generateColorFallback(500, 300, '#e6ceb3')}
                          alt={post.title}
                          width={500}
                          height={300}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {post.categories?.map((category: string, index: number) => (
                            <span key={index} className="rounded-full bg-[#f2e8dc] px-2 py-0.5 text-xs text-[#5d4c42]">
                              {category}
                            </span>
                          ))}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-[#5d4c42] line-clamp-2">{post.title}</h3>
                        <p className="mb-4 text-sm text-[#5d4c42]/80 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-[#5d4c42]/70">
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter Signup */}
          <section className="rounded-2xl bg-[#e6ceb3] p-6 shadow-sm">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-xl font-bold text-[#5d4c42]">Join Our Newsletter</h2>
                <p className="mt-1 text-sm text-[#5d4c42]/80">
                  Get the latest articles, tips, and wellness insights delivered to your inbox.
                </p>
              </div>
              <div className="flex w-full flex-1 max-w-md flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-full px-4 py-2 focus:outline-none"
                />
                <button className="rounded-full bg-[#a39188] px-6 py-2 font-medium text-white transition-colors hover:bg-[#8a7b73]">
                  Subscribe
                </button>
              </div>
            </div>
          </section>

          {/* Submit Your Story */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-[#e6ceb3]">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#5d4c42] mb-2">Share Your Yoga Journey</h2>
              <p className="text-[#5d4c42]/80">
                Have a story, tip, or insight about yoga in Bali? We'd love to feature your experience on our blog.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f2e8dc] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="font-semibold text-[#5d4c42] mb-1">Write Your Story</h3>
                <p className="text-sm text-[#5d4c42]/70">Share your yoga experiences, tips, or insights</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f2e8dc] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold text-[#5d4c42] mb-1">Editorial Review</h3>
                <p className="text-sm text-[#5d4c42]/70">Our team reviews and optimizes for SEO</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f2e8dc] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="font-semibold text-[#5d4c42] mb-1">Get Published</h3>
                <p className="text-sm text-[#5d4c42]/70">Your story reaches our yoga community</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/blog/submit"
                className="inline-flex items-center rounded-full bg-[#e6ceb3] px-8 py-3 font-medium text-[#5d4c42] transition-colors hover:bg-[#d9b99a]"
              >
                Submit Your Blog Post
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
