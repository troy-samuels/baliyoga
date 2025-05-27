import Image from "next/image"
import Link from "next/link"
import { Calendar, ChevronRight, Clock, Search, User } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import fs from "fs"
import path from "path"

// Load blog posts from JSON file
function loadBlogPosts() {
  try {
    const filePath = path.join(process.cwd(), "data", "blog-posts.json")
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8")
      return JSON.parse(data).filter((post: any) => post.status === "published")
    }
  } catch (error) {
    console.error("Error loading blog posts:", error)
  }

  // Return mock data if no posts exist
  return [
    {
      id: "1",
      title: "The Best Time to Practice Yoga in Bali",
      slug: "best-time-practice-yoga-bali",
      excerpt:
        "Discover the optimal seasons and times of day to enhance your yoga practice in Bali. Learn how the island's unique climate can influence your yoga journey.",
      featuredImage: "/placeholder.svg?height=400&width=600&text=Yoga+in+Bali",
      author: "Maya Patel",
      publishDate: "2023-06-15",
      readTime: "8 min read",
      categories: ["Yoga Practice", "Bali Travel"],
    },
    {
      id: "2",
      title: "Top 5 Vegan Cafes Near Yoga Studios in Ubud",
      slug: "top-vegan-cafes-near-yoga-studios-ubud",
      excerpt:
        "Explore the best plant-based dining options to complement your yoga practice in Ubud. These cafes offer nutritious and delicious meals for health-conscious yogis.",
      featuredImage: "/placeholder.svg?height=400&width=600&text=Vegan+Food",
      author: "David Lee",
      publishDate: "2023-05-28",
      readTime: "6 min read",
      categories: ["Food & Nutrition", "Ubud"],
    },
    {
      id: "3",
      title: "Healing Waters: Bali's Sacred Springs for Yogis",
      slug: "healing-waters-bali-sacred-springs-yogis",
      excerpt:
        "Learn about the spiritual and physical benefits of Bali's natural water sources. Discover how these sacred springs can enhance your yoga and meditation practice.",
      featuredImage: "/placeholder.svg?height=400&width=600&text=Sacred+Springs",
      author: "Sarah Johnson",
      publishDate: "2023-05-10",
      readTime: "7 min read",
      categories: ["Spirituality", "Wellness"],
    },
  ]
}

export default function BlogPage() {
  const blogPosts = loadBlogPosts()
  const featuredPosts = blogPosts.slice(0, 3)
  const recentPosts = blogPosts.slice(3)

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
      <SiteHeader />

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
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-bold text-[#5d4c42]">Featured Articles</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-2xl bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={post.featuredImage || "/placeholder.svg?height=400&width=600&text=Blog+Post"}
                          alt={post.title}
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 rounded-full bg-[#e6ceb3] px-3 py-1 text-xs font-medium text-[#5d4c42]">
                          Featured
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {post.categories?.map((category: string, index: number) => (
                            <span key={index} className="rounded-full bg-[#f2e8dc] px-2 py-0.5 text-xs text-[#5d4c42]">
                              {category}
                            </span>
                          ))}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-[#5d4c42] line-clamp-2">{post.title}</h3>
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

          {/* Category Tabs */}
          <section className="rounded-2xl bg-[#f2e8dc] p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#5d4c42]">Explore by Category</h2>
              <Link href="/admin/blog" className="text-sm font-medium text-[#5d4c42] hover:text-[#a39188]">
                Manage Blog
              </Link>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.slice(0, 6).map((category, index) => (
                <Link
                  key={index}
                  href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    index === 0 ? "bg-[#e6ceb3] text-[#5d4c42]" : "bg-white text-[#5d4c42] hover:bg-[#e6ceb3]"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>

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
                          src={post.featuredImage || "/placeholder.svg?height=300&width=500&text=Blog+Post"}
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
