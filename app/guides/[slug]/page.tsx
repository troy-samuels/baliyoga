import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Calendar, User, ArrowRight, CheckCircle } from 'lucide-react'
import { MobileOptimizedHeader } from '@/components/mobile-optimized-header'
import { MobileOptimizedFooter } from '@/components/mobile-optimized-footer'
import {
  getGuideBySlug,
  getAllGuides,
  getRelatedGuides,
  GUIDE_SLUGS
} from '@/lib/guide-data'
import { generateColorFallback } from '@/lib/image-fallback'

interface GuidePageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all guides
export async function generateStaticParams() {
  return GUIDE_SLUGS.map(slug => ({ slug }))
}

// Generate comprehensive metadata for SEO
export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return {
      title: 'Guide Not Found | Bali Yoga',
      description: 'The requested yoga guide could not be found.',
      robots: { index: false, follow: false }
    }
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    keywords: guide.keywords.join(', '),
    authors: [{ name: guide.author }],
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: 'article',
      publishedTime: guide.lastUpdated,
      authors: [guide.author],
      siteName: 'Bali Yoga',
      images: [{
        url: guide.heroImage || generateColorFallback(1200, 630, '#e6ceb3'),
        width: 1200,
        height: 630,
        alt: guide.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
      images: [guide.heroImage || generateColorFallback(1200, 630, '#e6ceb3')]
    },
    alternates: {
      canonical: `/guides/${slug}`
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

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  const relatedGuides = getRelatedGuides(slug)

  // Format last updated date
  const lastUpdatedDate = new Date(guide.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      {/* Article Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.metaDescription,
            image: guide.heroImage,
            author: {
              '@type': 'Organization',
              name: guide.author
            },
            publisher: {
              '@type': 'Organization',
              name: 'Bali Yoga',
              logo: {
                '@type': 'ImageObject',
                url: 'https://baliyoga.com/logo.png'
              }
            },
            datePublished: guide.lastUpdated,
            dateModified: guide.lastUpdated,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://baliyoga.com/guides/${slug}`
            },
            keywords: guide.keywords.join(', ')
          })
        }}
      />

      {/* FAQ Schema for SEO */}
      {guide.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: guide.faqs.map(faq => ({
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
      )}

      {/* HowTo Schema for guides */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: guide.title,
            description: guide.metaDescription,
            image: guide.heroImage,
            totalTime: `PT${guide.readTime}`,
            step: guide.sections.map((section, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: section.title,
              text: section.content
            }))
          })
        }}
      />

      <MobileOptimizedHeader />

      {/* Hero Section */}
      <div className="relative bg-[#e6ceb3] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-[#5d4c42]/70">
            <Link href="/" className="hover:text-[#5d4c42]">Home</Link>
            {' / '}
            <Link href="/guides" className="hover:text-[#5d4c42]">Guides</Link>
            {' / '}
            <span className="text-[#5d4c42]">{guide.title}</span>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block rounded-full bg-[#5d4c42] px-4 py-1 text-sm font-medium text-white">
              {guide.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#5d4c42] sm:text-4xl md:text-5xl">
            {guide.title}
          </h1>

          {/* Meta Information */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#5d4c42]/80">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{guide.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Updated {lastUpdatedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{guide.readTime}</span>
            </div>
          </div>

          {/* Excerpt */}
          <p className="mt-6 text-lg text-[#5d4c42]/90">
            {guide.excerpt}
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e6ceb3] shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 md:px-6">
          <details className="md:hidden">
            <summary className="cursor-pointer font-semibold text-[#5d4c42]">
              Table of Contents
            </summary>
            <ul className="mt-2 space-y-1 text-sm">
              {guide.tableOfContents.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index}`}
                    className="text-[#5d4c42]/70 hover:text-[#5d4c42]"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <div className="hidden md:block">
            <p className="mb-2 text-sm font-semibold text-[#5d4c42]">Table of Contents:</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {guide.tableOfContents.map((item, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="text-[#5d4c42]/70 hover:text-[#5d4c42] hover:underline"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-[#e6ceb3]">
            {guide.introduction.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-[#5d4c42]/90 leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {guide.sections.map((section, sectionIndex) => (
            <section
              key={sectionIndex}
              id={`section-${sectionIndex}`}
              className="scroll-mt-24"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#5d4c42] mb-6">
                {section.title}
              </h2>

              <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-[#e6ceb3]">
                <div className="prose prose-lg max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-[#5d4c42]/90 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}

                  {/* Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-8 space-y-6">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="border-l-4 border-[#e6ceb3] pl-6">
                          <h3 className="text-xl font-semibold text-[#5d4c42] mb-3">
                            {subsection.subtitle}
                          </h3>
                          <div className="text-[#5d4c42]/90 leading-relaxed space-y-3">
                            {subsection.content.split('\n\n').map((para, paraIndex) => (
                              <p key={paraIndex}>{para}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        {guide.faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5d4c42] mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {guide.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-6 shadow-sm border border-[#e6ceb3]"
                >
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-3 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#a39188] flex-shrink-0 mt-1" />
                    {faq.question}
                  </h3>
                  <p className="text-[#5d4c42]/80 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="mt-16 rounded-2xl bg-[#e6ceb3] p-8 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5d4c42] mb-4">
            {guide.callToAction.title}
          </h2>
          <p className="text-[#5d4c42]/80 mb-6 max-w-2xl mx-auto">
            {guide.callToAction.description}
          </p>
          <Link
            href={guide.callToAction.buttonLink}
            className="inline-flex items-center gap-2 rounded-full bg-[#5d4c42] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
          >
            {guide.callToAction.buttonText}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5d4c42] mb-6">
              Related Guides
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedGuides.map((relatedGuide) => (
                <Link
                  key={relatedGuide.slug}
                  href={`/guides/${relatedGuide.slug}`}
                  className="group rounded-xl bg-white p-6 shadow-sm border border-[#e6ceb3] transition-all hover:shadow-md hover:border-[#5d4c42]"
                >
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-[#f2e8dc] px-3 py-1 text-xs font-medium text-[#5d4c42]">
                      {relatedGuide.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#5d4c42] mb-2 group-hover:text-[#a39188]">
                    {relatedGuide.title}
                  </h3>
                  <p className="text-sm text-[#5d4c42]/70 mb-3">
                    {relatedGuide.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#5d4c42]/60">
                    <Clock className="h-4 w-4" />
                    <span>{relatedGuide.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Last Updated Notice */}
        <div className="mt-12 rounded-lg bg-[#f2e8dc] p-4 text-center text-sm text-[#5d4c42]/70">
          <p>
            This guide was last updated on {lastUpdatedDate}. Information is regularly reviewed
            and updated to ensure accuracy. Based on analysis of 450+ verified yoga studios and retreats in Bali.
          </p>
        </div>
      </article>

      <MobileOptimizedFooter />
    </div>
  )
}
