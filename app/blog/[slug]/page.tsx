import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Share2, Tag, Twitter, User } from "lucide-react"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import DOMPurify from 'isomorphic-dompurify'

import { SiteFooter } from "@/components/site-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"

// This would normally come from a CMS or database
const getBlogPost = (slug: string) => {
  // Mock data for a single blog post
  return {
    title: "The Best Time to Practice Yoga in Bali",
    slug: "best-time-practice-yoga-bali",
    excerpt:
      "Discover the optimal seasons and times of day to enhance your yoga practice in Bali. Learn how the island's unique climate can influence your yoga journey.",
    content: `
      <p>Bali, often referred to as the Island of the Gods, has become a mecca for yoga enthusiasts from around the world. The island's spiritual energy, stunning natural landscapes, and vibrant yoga community make it an ideal destination for deepening your practice. However, to make the most of your yoga experience in Bali, it's important to consider the timing of your practice.</p>
      
      <h2>Understanding Bali's Climate</h2>
      
      <p>Bali has a tropical climate with two distinct seasons: the dry season (April to September) and the wet season (October to March). Each season offers unique advantages and challenges for yoga practitioners.</p>
      
      <h3>Dry Season (April to September)</h3>
      
      <p>The dry season is generally considered the best time to visit Bali for yoga practice. The weather is sunny with lower humidity, making it comfortable for more vigorous styles like Vinyasa or Ashtanga. The clear skies and moderate temperatures create perfect conditions for outdoor yoga sessions, especially in scenic locations like beach platforms or jungle studios.</p>
      
      <p>During this period, Bali hosts numerous yoga festivals and retreats, offering opportunities to learn from international teachers and connect with the global yoga community. However, this is also the peak tourist season, so popular yoga studios can be crowded, and prices for accommodations near yoga centers tend to be higher.</p>
      
      <h3>Wet Season (October to March)</h3>
      
      <p>The wet season brings regular rainfall, typically in the form of afternoon showers that clear up quickly. While this might seem less ideal, the wet season has its own charm for yoga practitioners. The island is lush and green, the air feels cleansed, and there are fewer tourists, creating a more peaceful atmosphere for your practice.</p>
      
      <p>This season is excellent for more introspective practices like Yin Yoga, meditation, or gentle Hatha. Many practitioners find that the rhythmic sound of rain creates a soothing backdrop for deeper meditation. Additionally, retreat centers and studios offer lower rates during this period, making it more accessible for extended stays or teacher training programs.</p>
      
      <h2>Best Times of Day for Yoga Practice in Bali</h2>
      
      <p>Beyond seasonal considerations, the time of day significantly impacts your yoga experience in Bali.</p>
      
      <h3>Early Morning (5:30 AM - 7:30 AM)</h3>
      
      <p>Early morning practice, known as "Sadhana" in yogic tradition, is highly recommended in Bali. The island wakes up early, with the first light appearing aroun  is highly recommended in Bali. The island wakes up early, with the first light appearing around 5:30 AM. Practicing yoga during these early hours allows you to experience the island's serene energy before the day's activities begin.

      <p>The air is coolest at this time, making it comfortable for more dynamic practices. Many studios in Ubud and Canggu offer sunrise yoga sessions that allow you to synchronize your practice with the awakening of nature. The morning light filtering through the jungle canopy or across the ocean creates a magical atmosphere that enhances your connection to the practice.</p>
      
      <h3>Mid-morning (8:30 AM - 10:30 AM)</h3>
      
      <p>After the early morning rush hour has passed, mid-morning offers another excellent window for practice. The temperature is still moderate, and there's a vibrant energy as the island is fully awake. This time is ideal for more detailed practice or workshops where you want to be mentally alert and physically warmed up.</p>
      
      <h3>Late Afternoon (4:00 PM - 6:00 PM)</h3>
      
      <p>As the heat of the day begins to dissipate, late afternoon becomes another prime time for yoga in Bali. The golden hour light creates a beautiful backdrop for your practice, especially in west-facing studios or beach locations. This time is perfect for unwinding after a day of activities and transitioning into a peaceful evening.</p>
      
      <p>Many practitioners find that their bodies are more open and flexible in the afternoon, making it ideal for deeper stretches and more advanced postures. Sunset yoga sessions, particularly along the beaches of Canggu, Seminyak, or Uluwatu, offer breathtaking views that elevate your practice to a meditative experience.</p>
      
      <h2>Special Considerations for Different Regions of Bali</h2>
      
      <h3>Ubud</h3>
      
      <p>As Bali's yoga hub, Ubud offers a cooler climate due to its elevation. Morning practices here often begin with a light mist over the rice fields, creating an ethereal atmosphere. The afternoon rain showers during wet season tend to be more predictable in Ubud, typically occurring between 2-4 PM, so plan your practice accordingly.</p>
      
      <h3>Coastal Areas (Canggu, Seminyak, Kuta)</h3>
      
      <p>The coastal regions tend to be hotter and more humid. Early morning and sunset practices are particularly recommended here to avoid the midday heat. Beach yoga sessions need to be timed with the tides – low tide offers firmer sand for a more stable practice.</p>
      
      <h3>Northern and Eastern Bali</h3>
      
      <p>The less touristy regions like Amed or Lovina offer a more authentic experience. These areas are generally drier than the south, making them good options during the wet season. The sunrise over Mount Agung or the Bali Sea provides a spectacular backdrop for morning practices in these regions.</p>
      
      <h2>Aligning with Balinese Cultural Rhythms</h2>
      
      <p>To truly enhance your yoga experience in Bali, consider aligning your practice with local cultural rhythms. The Balinese calendar is filled with ceremonies and special days that create unique energetic environments.</p>
      
      <p>Nyepi (Balinese Day of Silence), which occurs in March or April, offers a rare opportunity for deep introspection as the entire island observes silence for 24 hours. Many retreats offer special programs around this time for intensive meditation and inner work.</p>
      
      <p>Full moon and new moon days hold special significance in both Balinese tradition and yogic philosophy. Many studios offer special classes or ceremonies during these lunar phases, creating powerful collective experiences.</p>
      
      <h2>Conclusion</h2>
      
      <p>The best time to practice yoga in Bali depends on your personal preferences, the style of yoga you prefer, and what you hope to gain from your practice. The island offers year-round opportunities for yoga, each season and time of day providing its own unique benefits.</p>
      
      <p>Whether you're watching the sunrise from a mountain-top shala in Ubud, flowing through a sunset session on the beaches of Canggu, or deepening your practice during the quiet wet season, Bali's special energy creates the perfect backdrop for transformation through yoga.</p>
      
      <p>Remember that beyond timing, the most important aspect is consistency in your practice. The magic of practicing yoga in Bali isn't just about finding the perfect external conditions – it's about the internal journey that unfolds when you show up on your mat in this spiritually charged island paradise.</p>
    `,
    image: "/placeholder.svg?height=600&width=1200&text=Yoga+in+Bali",
    author: {
      name: "Maya Patel",
      bio: "Maya is a certified yoga instructor with over 10 years of experience teaching in Bali. She specializes in Vinyasa and meditation practices that connect practitioners with the island's unique energy.",
      image: "/placeholder.svg?height=200&width=200&text=Maya",
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
        image: "/placeholder.svg?height=300&width=500&text=Vegan+Food",
        author: "David Lee",
        date: "May 28, 2023",
      },
      {
        id: 3,
        title: "Healing Waters: Bali's Sacred Springs for Yogis",
        slug: "healing-waters-bali-sacred-springs-yogis",
        excerpt: "Learn about the spiritual and physical benefits of Bali's natural water sources.",
        image: "/placeholder.svg?height=300&width=500&text=Sacred+Springs",
        author: "Sarah Johnson",
        date: "May 10, 2023",
      },
      {
        id: 4,
        title: "Yoga for Beginners: Starting Your Practice in Bali",
        slug: "yoga-beginners-starting-practice-bali",
        excerpt: "New to yoga? This comprehensive guide will help you start your yoga journey in Bali with confidence.",
        image: "/placeholder.svg?height=300&width=500&text=Beginner+Yoga",
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
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={600}
            className="h-auto w-full object-cover"
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
                src={post.author.image || "/placeholder.svg"}
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
                    src={relatedPost.image || "/placeholder.svg"}
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
