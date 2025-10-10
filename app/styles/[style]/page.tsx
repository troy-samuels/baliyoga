import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, TrendingUp, Users, Heart, ArrowRight } from 'lucide-react'
import { MobileOptimizedHeader } from '@/components/mobile-optimized-header'
import { MobileOptimizedFooter } from '@/components/mobile-optimized-footer'
import { MobileOptimizedCard } from '@/components/mobile-optimized-card'
import {
  getYogaStyleBySlug,
  getAllYogaStyles,
  getRelatedYogaStyles,
  YOGA_STYLE_SLUGS
} from '@/lib/yoga-styles-data'
import { getAllStudios } from '@/lib/supabase-server'
import type { Studio } from '@/lib/types'

interface StylePageProps {
  params: Promise<{
    style: string
  }>
}

// Generate static params for all yoga styles
export async function generateStaticParams() {
  return YOGA_STYLE_SLUGS.map(style => ({ style }))
}

// Generate comprehensive metadata for SEO
export async function generateMetadata({ params }: StylePageProps): Promise<Metadata> {
  const { style } = await params
  const styleData = getYogaStyleBySlug(style)

  if (!styleData) {
    return {
      title: 'Yoga Style Not Found | Bali Yoga',
      description: 'The requested yoga style could not be found.',
      robots: { index: false, follow: false }
    }
  }

  return {
    title: styleData.metaTitle,
    description: styleData.metaDescription,
    keywords: styleData.keywords.join(', '),
    openGraph: {
      title: styleData.metaTitle,
      description: styleData.metaDescription,
      type: 'website',
      siteName: 'Bali Yoga',
      images: [{
        url: `/images/styles/${style}.jpg`,
        width: 1200,
        height: 630,
        alt: styleData.displayName
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: styleData.metaTitle,
      description: styleData.metaDescription
    },
    alternates: {
      canonical: `/styles/${style}`
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
}

export default async function StylePage({ params }: StylePageProps) {
  const { style } = await params
  const styleData = getYogaStyleBySlug(style)

  if (!styleData) {
    notFound()
  }

  // Get all studios and filter by style
  const allStudios = await getAllStudios()

  // Filter studios that offer this style (you'll need to add yoga_styles field to database)
  // For now, we'll show all studios as placeholder - implement filtering when database is ready
  const matchingStudios = allStudios
    .filter((studio: Studio) => {
      // TODO: Implement actual filtering when yoga_styles field is added to database
      // For now, return studios from popular locations for this style
      return styleData.popularIn.some(location =>
        studio.location?.toLowerCase().includes(location.toLowerCase().split(' ')[0])
      )
    })
    .slice(0, 12) // Show top 12 studios

  const relatedStyles = getRelatedYogaStyles(style)

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      {/* CollectionPage Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${styleData.displayName} in Bali`,
            description: styleData.metaDescription,
            url: `https://baliyoga.com/styles/${style}`,
            about: {
              '@type': 'Thing',
              name: styleData.displayName,
              description: styleData.shortDescription
            },
            mainEntity: {
              '@type': 'ItemList',
              name: `${styleData.displayName} Studios in Bali`,
              numberOfItems: matchingStudios.length,
              itemListElement: matchingStudios.slice(0, 10).map((studio, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'LocalBusiness',
                  name: studio.name,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: studio.location,
                    addressRegion: 'Bali',
                    addressCountry: 'Indonesia'
                  }
                }
              }))
            }
          })
        }}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: styleData.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          })
        }}
      />

      <MobileOptimizedHeader />

      {/* Hero Section */}
      <div className="relative bg-[#e6ceb3] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-[#5d4c42]/70">
            <Link href="/" className="hover:text-[#5d4c42]">Home</Link>
            {' / '}
            <Link href="/styles" className="hover:text-[#5d4c42]">Yoga Styles</Link>
            {' / '}
            <span className="text-[#5d4c42]">{styleData.displayName}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            {/* Content */}
            <div>
              <h1 className="text-3xl font-bold text-[#5d4c42] sm:text-4xl md:text-5xl">
                {styleData.displayName} in Bali
              </h1>

              <p className="mt-4 text-lg text-[#5d4c42]/90 leading-relaxed">
                {styleData.shortDescription}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#a39188]" />
                  <span className="text-[#5d4c42]">{matchingStudios.length}+ Studios</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm">
                  <Clock className="h-4 w-4 text-[#a39188]" />
                  <span className="text-[#5d4c42]">{styleData.typicalClass.duration}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-[#a39188]" />
                  <span className="text-[#5d4c42]">{styleData.typicalClass.intensity}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-2 text-3xl font-bold text-[#5d4c42]">
                  {styleData.forBeginners.suitable ? '✓' : '~'}
                </div>
                <div className="text-sm font-medium text-[#5d4c42]">
                  {styleData.forBeginners.suitable ? 'Beginner Friendly' : 'Intermediate+'}
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-2 text-3xl font-bold text-[#5d4c42]">
                  {styleData.benefits.length}+
                </div>
                <div className="text-sm font-medium text-[#5d4c42]">Key Benefits</div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-2 text-3xl font-bold text-[#5d4c42]">
                  {styleData.popularIn.length}
                </div>
                <div className="text-sm font-medium text-[#5d4c42]">Popular Areas</div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-2 text-3xl font-bold text-[#5d4c42]">
                  {styleData.faqs.length}
                </div>
                <div className="text-sm font-medium text-[#5d4c42]">FAQs Answered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studios Offering This Style */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Top {styleData.displayName} Studios in Bali
          </h2>
          <p className="mt-2 text-[#5d4c42]/70">
            Verified studios offering high-quality {styleData.displayName} classes
          </p>
        </div>

        {matchingStudios.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matchingStudios.map((studio) => (
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
                email={studio.email_address}
                instagram_url={studio.instagram_url}
                facebook_url={studio.facebook_url}
                featured={false}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center">
            <p className="text-[#5d4c42]/70">
              Studios offering {styleData.displayName} will be listed here. Check back soon!
            </p>
            <Link
              href="/studios"
              className="mt-4 inline-block text-[#a39188] hover:underline"
            >
              Browse all studios →
            </Link>
          </div>
        )}

        {matchingStudios.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-full bg-[#5d4c42] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
            >
              View All Studios
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>

      {/* About This Style */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="mb-6 text-2xl font-bold text-[#5d4c42] md:text-3xl">
            About {styleData.displayName}
          </h2>

          <div className="prose prose-lg max-w-none">
            {styleData.detailedDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-[#5d4c42]/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="mb-8 text-2xl font-bold text-[#5d4c42] md:text-3xl">
          Benefits of {styleData.displayName}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {styleData.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#a39188] mt-0.5" />
              <span className="text-sm text-[#5d4c42]/90">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Perfect For */}
      <div className="bg-[#f2e8dc] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-8 text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Perfect For
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {styleData.bestFor.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-white p-4"
              >
                <Heart className="h-5 w-5 flex-shrink-0 text-[#a39188]" />
                <span className="text-sm font-medium text-[#5d4c42]">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What to Expect */}
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <h2 className="mb-6 text-2xl font-bold text-[#5d4c42] md:text-3xl">
          What to Expect in Class
        </h2>

        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-semibold text-[#5d4c42]/70">Duration</div>
              <div className="text-lg font-medium text-[#5d4c42]">
                {styleData.typicalClass.duration}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-[#5d4c42]/70">Intensity</div>
              <div className="text-lg font-medium text-[#5d4c42]">
                {styleData.typicalClass.intensity}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-[#5d4c42]/70">Temperature</div>
              <div className="text-lg font-medium text-[#5d4c42]">
                {styleData.typicalClass.temperature}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-[#5d4c42]/70">Class Focus</div>
              <div className="text-sm text-[#5d4c42]">
                {styleData.typicalClass.focus.slice(0, 2).join(', ')}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {styleData.whatToExpect.split('\n\n').map((paragraph, index) => (
              <div key={index} className="mb-4">
                {paragraph.startsWith('**') ? (
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                ) : (
                  <p className="text-[#5d4c42]/90 leading-relaxed">{paragraph}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For Beginners */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="mb-6 text-2xl font-bold text-[#5d4c42] md:text-3xl">
            {styleData.forBeginners.suitable ? 'Perfect for Beginners' : 'Beginner Considerations'}
          </h2>

          <div className={`rounded-xl p-6 shadow-sm md:p-8 ${
            styleData.forBeginners.suitable ? 'bg-green-50 border-2 border-green-200' : 'bg-amber-50 border-2 border-amber-200'
          }`}>
            <div className="mb-4 flex items-center gap-3">
              {styleData.forBeginners.suitable ? (
                <div className="rounded-full bg-green-500 p-2">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="rounded-full bg-amber-500 p-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="text-lg font-semibold text-[#5d4c42]">
                {styleData.forBeginners.suitable
                  ? 'Beginner-Friendly Style'
                  : 'Some Experience Recommended'}
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {styleData.forBeginners.considerations.split('\n\n').map((paragraph, index) => (
                <div key={index} className="mb-4">
                  {paragraph.startsWith('**') ? (
                    <h4 className="text-md font-semibold text-[#5d4c42] mb-2">
                      {paragraph.replace(/\*\*/g, '')}
                    </h4>
                  ) : (
                    <p className="text-[#5d4c42]/90 leading-relaxed">{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <h2 className="mb-8 text-2xl font-bold text-[#5d4c42] md:text-3xl">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {styleData.faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <h3 className="mb-3 text-lg font-semibold text-[#5d4c42] flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#a39188] flex-shrink-0 mt-1" />
                {faq.question}
              </h3>
              <p className="text-[#5d4c42]/80 leading-relaxed pl-8">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Locations */}
      {styleData.popularIn.length > 0 && (
        <div className="bg-[#e6ceb3] py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold text-[#5d4c42] md:text-3xl">
              Where to Practice {styleData.displayName} in Bali
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {styleData.popularIn.map((location, index) => (
                <Link
                  key={index}
                  href={`/locations/${location.toLowerCase().split(' ')[0].split(',')[0]}`}
                  className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#5d4c42] border-2 border-transparent"
                >
                  <MapPin className="h-8 w-8 text-[#a39188] mb-3" />
                  <h3 className="font-semibold text-[#5d4c42] group-hover:text-[#a39188]">
                    {location}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Styles */}
      {relatedStyles.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <h2 className="mb-8 text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Related Yoga Styles
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedStyles.map((relatedStyle) => (
              <Link
                key={relatedStyle.slug}
                href={`/styles/${relatedStyle.slug}`}
                className="group rounded-xl bg-white p-6 shadow-sm border border-[#e6ceb3] transition-all hover:shadow-md hover:border-[#5d4c42]"
              >
                <h3 className="mb-2 text-xl font-semibold text-[#5d4c42] group-hover:text-[#a39188]">
                  {relatedStyle.displayName}
                </h3>
                <p className="mb-4 text-sm text-[#5d4c42]/70">
                  {relatedStyle.shortDescription}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#a39188]">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-[#e6ceb3] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold text-[#5d4c42] md:text-4xl">
            Ready to Try {styleData.displayName}?
          </h2>
          <p className="mb-8 text-lg text-[#5d4c42]/80">
            Browse our verified studios offering {styleData.displayName} classes across Bali
          </p>
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-full bg-[#5d4c42] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
          >
            Find Your Perfect Studio
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
}
