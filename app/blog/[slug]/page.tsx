import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Share2, Tag, Twitter, User } from "lucide-react"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import DOMPurify from 'isomorphic-dompurify'
import { generateColorFallback } from "@/lib/image-fallback"

import { SiteFooter } from "@/components/site-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"

// This would normally come from a CMS or database
const getBlogPost = (slug: string) => {
  // Mock data for a single blog post
  return {
    id: 1,
    title: "The Ultimate Guide to Finding Your Perfect Yoga Studio in Bali",
    slug: "ultimate-guide-yoga-studio-bali",
    excerpt: "Discover the best yoga studios across Bali, from the rice terraces of Ubud to the beaches of Canggu.",
    content: `
# Finding Your Perfect Yoga Studio in Bali

Bali is home to some of the world's most incredible yoga studios. Whether you're a beginner or an advanced practitioner, the Island of the Gods offers something for everyone.

## The Magic of Ubud

Ubud, nestled among emerald rice terraces, is considered the spiritual heart of Bali. Here you'll find:

- **Traditional Balinese yoga studios** that incorporate local philosophy
- **World-class teachers** from around the globe
- **Sacred spaces** designed for deep spiritual practice

## Beach Yoga in Canggu

For those who prefer practicing with ocean views:

- **Beachfront studios** with stunning sunset sessions
- **Surf and yoga** packages for the adventurous
- **Modern facilities** with international standards

## What to Look For

When choosing a yoga studio in Bali, consider:

1. **Teaching style** - Does it match your preference?
2. **Location** - Is it convenient to your accommodation?
3. **Class schedule** - Does it fit your travel itinerary?
4. **Community** - Do you feel welcomed and comfortable?

Remember, the best yoga studio is one where you feel inspired to practice and grow.
`,
    image: generateColorFallback(1200, 600, '#e6ceb3'),
    author: {
      name: "Maya Patel",
      bio: "Maya is a certified yoga instructor with over 10 years of experience teaching in Bali. She specializes in Vinyasa and meditation practices that connect practitioners with the island's unique energy.",
      image: generateColorFallback(200, 200, '#a39188'),
    },
    date: "June 15, 2023",
    readTime: "8 min read",
    categories: ["Yoga Practice", "Bali Travel"],
    tags: ["yoga", "bali", "wellness", "travel", "meditation"],
    relatedPosts: [
      {
        id: 2,
        title: "Top 5 Vegan Cafes Near Yoga Studios in Ubud",
        slug: "top-vegan-cafes-near-yoga-studios-ubud",
        excerpt: "Explore the best plant-based dining options to complement your yoga practice in Ubud.",
        image: generateColorFallback(500, 300, '#e6ceb3'),
        author: "David Lee",
        date: "May 28, 2023",
      },
      {
        id: 3,
        title: "Healing Waters: Bali's Sacred Springs for Yogis",
        slug: "healing-waters-bali-sacred-springs-yogis",
        excerpt: "Learn about the spiritual and physical benefits of Bali's natural water sources.",
        image: generateColorFallback(500, 300, '#e6ceb3'),
        author: "Sarah Johnson",
        date: "May 10, 2023",
      },
      {
        id: 4,
        title: "Yoga for Beginners: Starting Your Practice in Bali",
        slug: "yoga-beginners-starting-practice-bali",
        excerpt: "New to yoga? This comprehensive guide will help you start your yoga journey in Bali with confidence.",
        image: generateColorFallback(500, 300, '#e6ceb3'),
        author: "Emma Wilson",
        date: "June 5, 2023",
      },
    ],
  }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />

      <article className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-[#5d4c42] hover:text-[#a39188]">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories.map((category, index) => (
              <Link
                key={index}
                href={`/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm text-[#5d4c42] hover:bg-[#d9b99a]"
              >
                {category}
              </Link>
            ))}
          </div>
          <h1 className="mb-4 text-3xl font-bold text-[#5d4c42] md:text-4xl">{post.title}</h1>
          <p className="mb-6 text-lg text-[#5d4c42]/80">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#5d4c42]/70">
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 overflow-hidden rounded-2xl">
          <Image
            src={post.image || generateColorFallback(800, 400, '#e6ceb3')}
            alt={post.title}
            width={800}
            height={400}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-[#5d4c42] prose-p:text-[#5d4c42]/90 prose-a:text-[#a39188] prose-a:no-underline prose-a:hover:text-[#5d4c42] prose-a:hover:underline">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
        </div>

        {/* Tags */}
        <div className="my-8 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-[#5d4c42]" />
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/blog/tag/${tag}`}
              className="rounded-full bg-[#f2e8dc] px-3 py-1 text-sm text-[#5d4c42] hover:bg-[#e6ceb3]"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Share Buttons */}
        <div className="mb-8 rounded-xl bg-[#f2e8dc] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-medium text-[#5d4c42]">Share this article:</span>
            <div className="flex gap-2">
              <button className="rounded-full bg-[#e6ceb3] p-2 text-[#5d4c42] hover:bg-[#d9b99a]">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Share on Facebook</span>
              </button>
              <button className="rounded-full bg-[#e6ceb3] p-2 text-[#5d4c42] hover:bg-[#d9b99a]">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Share on Twitter</span>
              </button>
              <button className="rounded-full bg-[#e6ceb3] p-2 text-[#5d4c42] hover:bg-[#d9b99a]">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">Share on LinkedIn</span>
              </button>
              <button className="rounded-full bg-[#e6ceb3] p-2 text-[#5d4c42] hover:bg-[#d9b99a]">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Copy Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mb-12 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={post.author.image || generateColorFallback(200, 200, '#a39188')}
                alt={post.author.name}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-[#5d4c42]">About {post.author.name}</h3>
              <p className="text-[#5d4c42]/80">{post.author.bio}</p>
              <Link
                href={`/blog/author/${post.author.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="mt-2 inline-block font-medium text-[#a39188] hover:text-[#5d4c42] hover:underline"
              >
                View all posts by {post.author.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#5d4c42]">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {post.relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={relatedPost.image || generateColorFallback(500, 300, '#e6ceb3')}
                    alt={relatedPost.title}
                    width={500}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 font-semibold text-[#5d4c42] line-clamp-2">{relatedPost.title}</h3>
                  <p className="mb-3 text-sm text-[#5d4c42]/80 line-clamp-2">{relatedPost.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-[#5d4c42]/70">
                    <span>{relatedPost.author}</span>
                    <span>{relatedPost.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="rounded-xl bg-[#e6ceb3] p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-xl font-bold text-[#5d4c42]">Enjoyed this article?</h2>
              <p className="mt-1 text-[#5d4c42]/80">
                Subscribe to our newsletter for more yoga insights, wellness tips, and Bali travel guides.
              </p>
            </div>
            <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
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
        </div>
      </article>

      <SiteFooter />
    </div>
  )
}
