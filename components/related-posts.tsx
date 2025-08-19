import Image from "next/image"
import Link from "next/link"
import { generateColorFallback } from "@/lib/image-fallback"

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  author: string
  publishDate: string
  readTime?: string
  categories?: string[]
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  currentSlug: string
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  // Filter out current post and get up to 6 related posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 6)

  if (relatedPosts.length === 0) return null

  return (
    <section className="my-12">
      <h2 className="mb-6 text-2xl font-bold text-[#5d4c42]">Related Articles</h2>
      
      {/* Grid layout for related posts */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <article
            key={post.id}
            className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.featuredImage || generateColorFallback(400, 300, '#e6ceb3')}
                  alt={post.title}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                {post.categories && post.categories.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-[#5d4c42]">
                      {post.categories[0]}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="mb-2 font-semibold text-[#5d4c42] line-clamp-2 group-hover:text-[#a39188] transition-colors">
                  {post.title}
                </h3>
                <p className="mb-3 text-sm text-[#5d4c42]/80 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-[#5d4c42]/60">
                  <span>{post.author}</span>
                  <span>{new Date(post.publishDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {/* View all posts link */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full bg-[#f2e8dc] px-6 py-3 font-medium text-[#5d4c42] transition-colors hover:bg-[#e6ceb3]"
        >
          View All Articles
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}