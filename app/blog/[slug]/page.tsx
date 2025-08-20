import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Share2, Tag, Twitter, User } from "lucide-react"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { generateColorFallback } from "@/lib/image-fallback"
import { sanitizeHtml } from "@/lib/sanitize"
import { Metadata } from "next"
import fs from "fs"
import path from "path"

import { SiteFooter } from "@/components/site-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"

// Blog post interface
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  featuredImage?: string
  author: string
  publishDate: string
  readTime: string
  categories?: string[]
  tags?: string[]
  status?: string
  createdAt?: string
  updatedAt?: string
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

// Get single blog post by slug
const getBlogPost = (slug: string) => {
  const posts = loadBlogPosts()
  const post = posts.find(p => p.slug === slug)
  
  if (post) {
    return {
      ...post,
      author: {
        name: post.author,
        bio: "Experienced yoga practitioner and wellness expert sharing insights from the beautiful island of Bali.",
        image: generateColorFallback(200, 200, '#a39188'),
      },
      relatedPosts: posts
        .filter(p => p.slug !== slug)
        .slice(0, 3)
        .map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          image: p.featuredImage,
          author: p.author,
          date: new Date(p.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }))
    }
  }
  
  // Fallback to original mock data if not found
  return {
    id: 1,
    title: "The Ultimate Guide to Finding Your Perfect Yoga Studio in Bali",
    slug: "ultimate-guide-yoga-studio-bali",
    excerpt: "Discover the best yoga studios across Bali, from the rice terraces of Ubud to the beaches of Canggu.",
    content: `
<h2>Finding Your Perfect Yoga Studio in Bali</h2>

<p>Bali is home to some of the world's most incredible yoga studios. Whether you're a beginner or an advanced practitioner, the Island of the Gods offers something for everyone.</p>

<h2>The Magic of Ubud</h2>

<p>Ubud, nestled among emerald rice terraces, is considered the spiritual heart of Bali. Here you'll find:</p>

<ul>
<li><strong>Traditional Balinese yoga studios</strong> that incorporate local philosophy</li>
<li><strong>World-class teachers</strong> from around the globe</li>
<li><strong>Sacred spaces</strong> designed for deep spiritual practice</li>
</ul>

<h2>Beach Yoga in Canggu</h2>

<p>For those who prefer practicing with ocean views:</p>

<ul>
<li><strong>Beachfront studios</strong> with stunning sunset sessions</li>
<li><strong>Surf and yoga</strong> packages for the adventurous</li>
<li><strong>Modern facilities</strong> with international standards</li>
</ul>

<h2>What to Look For</h2>

<p>When choosing a yoga studio in Bali, consider:</p>

<ol>
<li><strong>Teaching style</strong> - Does it match your preference?</li>
<li><strong>Location</strong> - Is it convenient to your accommodation?</li>
<li><strong>Class schedule</strong> - Does it fit your travel itinerary?</li>
<li><strong>Community</strong> - Do you feel welcomed and comfortable?</li>
</ol>

<p>Remember, the best yoga studio is one where you feel inspired to practice and grow.</p>
`,
    featuredImage: generateColorFallback(1200, 600, '#e6ceb3'),
    author: {
      name: "Maya Patel",
      bio: "Maya is a certified yoga instructor with over 10 years of experience teaching in Bali. She specializes in Vinyasa and meditation practices that connect practitioners with the island's unique energy.",
      image: generateColorFallback(200, 200, '#a39188'),
    },
    publishDate: "2023-06-15",
    updatedAt: "2023-06-15",
    readTime: "8 min read",
    categories: ["Yoga Practice", "Bali Travel"],
    tags: ["yoga", "bali", "wellness", "travel", "meditation"],
    keywords: ["yoga studio bali", "best yoga bali", "ubud yoga", "canggu yoga", "bali wellness"],
    relatedPosts: [
      {
        id: "2",
        title: "Top 5 Vegan Cafes Near Yoga Studios in Ubud",
        slug: "top-vegan-cafes-near-yoga-studios-ubud",
        excerpt: "Explore the best plant-based dining options to complement your yoga practice in Ubud.",
        image: generateColorFallback(500, 300, '#e6ceb3'),
        author: "David Lee",
        date: "May 28, 2023",
      },
      {
        id: "3",
        title: "Healing Waters: Bali's Sacred Springs for Yogis",
        slug: "healing-waters-bali-sacred-springs-yogis",
        excerpt: "Learn about the spiritual and physical benefits of Bali's natural water sources.",
        image: generateColorFallback(500, 300, '#e6ceb3'),
        author: "Sarah Johnson",
        date: "May 10, 2023",
      },
      {
        id: "4",
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

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const posts = loadBlogPosts()
  const post = posts.find(p => p.slug === slug)
  
  if (!post) {
    return {
      title: "Blog Post Not Found - Bali Yoga",
      description: "The requested blog post could not be found.",
    }
  }

  const title = post.metaTitle || `${post.title} - Bali Yoga Blog`
  const description = post.metaDescription || post.excerpt
  
  return {
    title,
    description,
    keywords: post.keywords?.join(", "),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishDate,
      modifiedTime: post.updatedAt || post.publishDate,
      authors: [post.author],
      images: post.featuredImage ? [{
        url: post.featuredImage,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [],
      siteName: "Bali Yoga",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

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
            {post.categories?.map((category, index) => (
              <span
                key={index}
                className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm text-[#5d4c42]"
              >
                {category}
              </span>
            ))}
          </div>
          <h1 className="mb-4 text-3xl font-bold text-[#5d4c42] md:text-4xl lg:text-5xl">{post.title}</h1>
          <p className="mb-6 text-lg text-[#5d4c42]/80 md:text-xl">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#5d4c42]/70">
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              <span>{typeof post.author === 'string' ? post.author : post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'June 15, 2023'}</span>
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
            src={post.featuredImage || generateColorFallback(800, 400, '#e6ceb3')}
            alt={post.title}
            width={800}
            height={400}
            className="h-64 w-full object-cover md:h-80 lg:h-96"
            priority
          />
        </div>

        {/* Article Content with Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "image": post.featuredImage,
              "datePublished": post.publishDate,
              "dateModified": post.updatedAt || post.publishDate,
              "author": {
                "@type": "Person",
                "name": typeof post.author === 'string' ? post.author : post.author.name,
              },
              "publisher": {
                "@type": "Organization",
                "name": "Bali Yoga",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://baliyoga.com/logo.png",
                },
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://baliyoga.com/blog/${slug}`,
              },
              "keywords": post.keywords?.join(", ") || post.tags?.join(", "),
            }),
          }}
        />
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-[#5d4c42] prose-p:text-[#5d4c42]/90 prose-a:text-[#a39188] prose-a:no-underline prose-a:hover:text-[#5d4c42] prose-a:hover:underline prose-ul:text-[#5d4c42]/90 prose-ol:text-[#5d4c42]/90 prose-li:text-[#5d4c42]/90 prose-strong:text-[#5d4c42] prose-blockquote:text-[#5d4c42]/80 prose-blockquote:border-l-[#a39188] prose-code:text-[#5d4c42] prose-code:bg-[#f2e8dc] prose-pre:bg-[#f2e8dc]">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
        </div>

        {/* Tags */}
        <div className="my-8 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-[#5d4c42]" />
          {post.tags?.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-[#f2e8dc] px-3 py-1 text-sm text-[#5d4c42]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Share Buttons */}
        <div className="my-8 rounded-xl bg-[#f2e8dc] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#5d4c42]">Share this article</h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (typeof window !== 'undefined' && navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  })
                } else if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }
              }}
              className="flex items-center gap-2 rounded-full bg-[#a39188] px-4 py-2 text-white transition-colors hover:bg-[#8a7b73]"
            >
              <Share2 className="h-5 w-5" />
              Share Article
            </button>
            <span className="text-sm text-[#5d4c42]/70">
              Share this article with friends or save the link
            </span>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mb-12 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={typeof post.author === 'object' ? post.author.image : generateColorFallback(200, 200, '#a39188')}
                alt={typeof post.author === 'string' ? post.author : post.author.name}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-[#5d4c42]">
                About {typeof post.author === 'string' ? post.author : post.author.name}
              </h3>
              <p className="text-[#5d4c42]/80">
                {typeof post.author === 'string' 
                  ? 'Experienced yoga practitioner and wellness expert sharing insights from the beautiful island of Bali.' 
                  : post.author.bio}
              </p>
              <span className="mt-2 inline-block text-sm text-[#a39188]">
                Author: {typeof post.author === 'string' ? post.author : post.author.name}
              </span>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
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
        )}

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