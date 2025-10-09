import { Metadata } from 'next'
import Link from 'next/link'
import { Book, Clock, ArrowRight, Target, Users, Sparkles, DollarSign, Heart } from 'lucide-react'
import { MobileOptimizedHeader } from '@/components/mobile-optimized-header'
import { MobileOptimizedFooter } from '@/components/mobile-optimized-footer'
import { getAllGuides } from '@/lib/guide-data'
import { generateColorFallback } from '@/lib/image-fallback'

// SEO Metadata
export const metadata: Metadata = {
  title: 'Complete Yoga Guides for Bali | Expert Tips & Resources',
  description: 'Comprehensive guides to yoga in Bali. From beginner tips to luxury experiences, digital nomad resources to budget travel—everything you need for your perfect yoga journey in Bali.',
  keywords: 'yoga guides bali, bali yoga tips, yoga travel guides, bali yoga resources, yoga information bali',
  openGraph: {
    title: 'Complete Yoga Guides for Bali',
    description: 'Expert guides covering every aspect of yoga in Bali—from choosing studios to planning retreats.',
    type: 'website',
    siteName: 'Bali Yoga',
    images: [{
      url: '/images/guides/yoga-guides-bali.jpg',
      width: 1200,
      height: 630,
      alt: 'Bali Yoga Guides'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete Yoga Guides for Bali',
    description: 'Expert guides covering every aspect of yoga in Bali'
  },
  alternates: {
    canonical: '/guides'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function GuidesPage() {
  const guides = getAllGuides()

  // Guide categories with icons
  const guideCategories = [
    {
      icon: Target,
      title: 'Complete Guides',
      description: 'Comprehensive resources covering all aspects',
      count: guides.filter(g => g.category === 'Comprehensive Guides').length
    },
    {
      icon: Users,
      title: 'Beginner Resources',
      description: 'Perfect for those new to yoga',
      count: guides.filter(g => g.category === 'Beginner Guides').length
    },
    {
      icon: Sparkles,
      title: 'Lifestyle Guides',
      description: 'Integrating yoga with work and travel',
      count: guides.filter(g => g.category === 'Lifestyle Guides').length
    },
    {
      icon: DollarSign,
      title: 'Budget Travel',
      description: 'Quality yoga on any budget',
      count: guides.filter(g => g.category === 'Budget Travel').length
    },
    {
      icon: Heart,
      title: 'Luxury Experiences',
      description: 'Premium yoga and wellness',
      count: guides.filter(g => g.category === 'Luxury Travel').length
    }
  ]

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      {/* CollectionPage Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Yoga Guides for Bali',
            description: 'Comprehensive collection of expert guides for planning your yoga experience in Bali',
            url: 'https://baliyoga.com/guides',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: guides.map((guide, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Article',
                  name: guide.title,
                  description: guide.excerpt,
                  url: `https://baliyoga.com/guides/${guide.slug}`,
                  datePublished: guide.lastUpdated,
                  dateModified: guide.lastUpdated,
                  author: {
                    '@type': 'Organization',
                    name: guide.author
                  }
                }
              }))
            },
            about: {
              '@type': 'Thing',
              name: 'Yoga in Bali',
              description: 'Information and resources about yoga studios, retreats, and experiences in Bali, Indonesia'
            },
            keywords: ['yoga guides', 'bali yoga', 'yoga travel', 'yoga resources', 'bali wellness']
          })
        }}
      />

      <MobileOptimizedHeader />

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(233, 206, 179, 0.9), rgba(233, 206, 179, 0.9)), url('${generateColorFallback(1200, 600, '#e6ceb3')}')`
        }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#5d4c42] px-4 py-2 text-sm font-medium text-white">
            <Book className="h-4 w-4" />
            <span>Expert Guides & Resources</span>
          </div>

          <h1 className="text-4xl font-bold text-[#5d4c42] md:text-5xl lg:text-6xl">
            Your Complete Guide to Yoga in Bali
          </h1>

          <p className="mt-6 text-lg text-[#5d4c42]/80 md:text-xl">
            Expert-written guides covering everything from finding your perfect studio to
            planning transformative retreats. Based on analysis of 450+ verified yoga spaces across Bali.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-[#5d4c42]/70">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              <span>{guides.length} Comprehensive Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>450+ Studios Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Regularly Updated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Categories Overview */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Browse by Category
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guideCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#f9f3e9] p-6 border border-[#e6ceb3] transition-all hover:shadow-md"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#e6ceb3] p-3">
                    <Icon className="h-6 w-6 text-[#5d4c42]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#5d4c42]">
                    {category.title}
                  </h3>
                  <p className="mb-3 text-sm text-[#5d4c42]/70">
                    {category.description}
                  </p>
                  <p className="text-sm font-medium text-[#a39188]">
                    {category.count} {category.count === 1 ? 'Guide' : 'Guides'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* All Guides */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="mb-8 text-2xl font-bold text-[#5d4c42] md:text-3xl">
          All Yoga Guides
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {guides.map((guide) => {
            // Get category icon
            const categoryConfig = guideCategories.find(cat =>
              guide.category.toLowerCase().includes(cat.title.toLowerCase().split(' ')[0])
            )
            const CategoryIcon = categoryConfig?.icon || Book

            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-2xl bg-white p-6 shadow-sm border border-[#e6ceb3] transition-all hover:shadow-lg hover:border-[#5d4c42]"
              >
                {/* Category Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f2e8dc] px-3 py-1 text-sm font-medium text-[#5d4c42]">
                    <CategoryIcon className="h-4 w-4" />
                    {guide.category}
                  </span>
                  <span className="text-sm text-[#5d4c42]/60">{guide.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-[#5d4c42] group-hover:text-[#a39188] md:text-2xl">
                  {guide.title}
                </h3>

                {/* Excerpt */}
                <p className="mb-4 text-[#5d4c42]/70 leading-relaxed">
                  {guide.excerpt}
                </p>

                {/* Keywords Preview */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {guide.keywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[#f9f3e9] px-2 py-1 text-xs text-[#5d4c42]/60"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Read More */}
                <div className="flex items-center gap-2 text-sm font-medium text-[#a39188] group-hover:text-[#5d4c42]">
                  <span>Read Full Guide</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Last Updated */}
                <div className="mt-4 pt-4 border-t border-[#e6ceb3] text-xs text-[#5d4c42]/60">
                  Last updated: {new Date(guide.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#e6ceb3] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold text-[#5d4c42] md:text-4xl">
            Ready to Find Your Perfect Yoga Experience?
          </h2>
          <p className="mb-8 text-lg text-[#5d4c42]/80">
            Browse our database of 450+ verified studios and retreats across Bali.
            Filter by location, style, price range, and more.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/studios"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5d4c42] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
            >
              Browse Yoga Studios
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/retreats"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#5d4c42] px-8 py-3 font-semibold text-[#5d4c42] transition-colors hover:bg-[#5d4c42] hover:text-white"
            >
              Explore Retreats
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Why Trust Our Guides */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="mb-12 text-center text-2xl font-bold text-[#5d4c42] md:text-3xl">
          Why Trust Our Guides?
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e6ceb3]">
              <Target className="h-8 w-8 text-[#5d4c42]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#5d4c42]">
              Data-Driven Research
            </h3>
            <p className="text-sm text-[#5d4c42]/70">
              Every guide is based on analysis of 450+ verified yoga studios and retreats,
              not just opinions or promotional content.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e6ceb3]">
              <Users className="h-8 w-8 text-[#5d4c42]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#5d4c42]">
              Real Practitioner Insights
            </h3>
            <p className="text-sm text-[#5d4c42]/70">
              Written by experienced yoga practitioners who live in and regularly explore
              Bali's yoga scene.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e6ceb3]">
              <Clock className="h-8 w-8 text-[#5d4c42]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#5d4c42]">
              Regularly Updated
            </h3>
            <p className="text-sm text-[#5d4c42]/70">
              All guides are reviewed and updated regularly to ensure information remains
              accurate and current.
            </p>
          </div>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
}
