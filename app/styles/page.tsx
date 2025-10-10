import { Metadata } from 'next'
import Link from 'next/link'
import { Flame, Leaf, Heart, Zap, Users, Moon, ArrowRight, TrendingUp } from 'lucide-react'
import { MobileOptimizedHeader } from '@/components/mobile-optimized-header'
import { MobileOptimizedFooter } from '@/components/mobile-optimized-footer'
import { getAllYogaStyles } from '@/lib/yoga-styles-data'
import { generateColorFallback } from '@/lib/image-fallback'

// SEO Metadata
export const metadata: Metadata = {
  title: 'Yoga Styles in Bali | Find Your Perfect Practice',
  description: 'Explore all yoga styles available in Bali. From dynamic Vinyasa to gentle Restorative, find the perfect practice for your goals. Complete guide to Vinyasa, Hatha, Yin, Ashtanga, Kundalini, and Restorative yoga.',
  keywords: 'yoga styles bali, types of yoga, vinyasa hatha yin ashtanga, yoga classes bali, beginner yoga styles',
  openGraph: {
    title: 'Yoga Styles in Bali | Find Your Perfect Practice',
    description: 'Explore all yoga styles available in Bali—from dynamic flows to gentle restoration',
    type: 'website',
    siteName: 'Bali Yoga',
    images: [{
      url: '/images/yoga-styles-bali.jpg',
      width: 1200,
      height: 630,
      alt: 'Yoga Styles in Bali'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yoga Styles in Bali',
    description: 'Find your perfect yoga practice in Bali'
  },
  alternates: {
    canonical: '/styles'
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

export default function StylesPage() {
  const styles = getAllYogaStyles()

  // Style icons mapping
  const styleIcons: Record<string, any> = {
    'vinyasa-yoga': Flame,
    'hatha-yoga': Leaf,
    'yin-yoga': Moon,
    'ashtanga-yoga': TrendingUp,
    'kundalini-yoga': Zap,
    'restorative-yoga': Heart
  }

  // Categorize styles by intensity
  const dynamicStyles = styles.filter(s =>
    ['vinyasa-yoga', 'ashtanga-yoga'].includes(s.slug)
  )
  const traditionalStyles = styles.filter(s =>
    ['hatha-yoga', 'kundalini-yoga'].includes(s.slug)
  )
  const gentleStyles = styles.filter(s =>
    ['yin-yoga', 'restorative-yoga'].includes(s.slug)
  )

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Yoga Styles in Bali',
            description: 'Complete guide to all yoga styles practiced in Bali',
            url: 'https://baliyoga.com/styles',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: styles.map((style, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Article',
                  name: style.displayName,
                  description: style.shortDescription,
                  url: `https://baliyoga.com/styles/${style.slug}`
                }
              }))
            }
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
          <h1 className="text-4xl font-bold text-[#5d4c42] md:text-5xl lg:text-6xl">
            Find Your Perfect Yoga Style
          </h1>

          <p className="mt-6 text-lg text-[#5d4c42]/80 md:text-xl">
            From dynamic flows to gentle restoration, Bali offers every style of yoga practice.
            Discover which style matches your goals, personality, and experience level.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#5d4c42]/70">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-[#a39188]" />
              <span>{styles.length} Styles Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#a39188]" />
              <span>All Experience Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#a39188]" />
              <span>450+ Studios Analyzed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Style Finder */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Find Your Style by Goal
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border-2 border-[#e6ceb3] bg-[#f9f3e9] p-6 transition-all hover:border-[#5d4c42]">
              <Flame className="mb-4 h-10 w-10 text-[#a39188]" />
              <h3 className="mb-2 text-lg font-semibold text-[#5d4c42]">
                Build Strength & Fitness
              </h3>
              <p className="mb-4 text-sm text-[#5d4c42]/70">
                Active, athletic practices for cardio and muscle building
              </p>
              <div className="space-y-2">
                <Link
                  href="/styles/vinyasa-yoga"
                  className="block text-sm text-[#a39188] hover:underline"
                >
                  → Vinyasa Flow (Most Popular)
                </Link>
                <Link
                  href="/styles/ashtanga-yoga"
                  className="block text-sm text-[#a39188] hover:underline"
                >
                  → Ashtanga (Advanced)
                </Link>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#e6ceb3] bg-[#f9f3e9] p-6 transition-all hover:border-[#5d4c42]">
              <Leaf className="mb-4 h-10 w-10 text-[#a39188]" />
              <h3 className="mb-2 text-lg font-semibold text-[#5d4c42]">
                Learn Foundations
              </h3>
              <p className="mb-4 text-sm text-[#5d4c42]/70">
                Traditional practices for alignment and understanding
              </p>
              <div className="space-y-2">
                <Link
                  href="/styles/hatha-yoga"
                  className="block text-sm text-[#a39188] hover:underline"
                >
                  → Hatha (Best for Beginners)
                </Link>
                <Link
                  href="/styles/kundalini-yoga"
                  className="block text-sm text-[#a39188] hover:underline"
                >
                  → Kundalini (Spiritual)
                </Link>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#e6ceb3] bg-[#f9f3e9] p-6 transition-all hover:border-[#5d4c42]">
              <Heart className="mb-4 h-10 w-10 text-[#a39188]" />
              <h3 className="mb-2 text-lg font-semibold text-[#5d4c42]">
                Reduce Stress & Heal
              </h3>
              <p className="mb-4 text-sm text-[#5d4c42]/70">
                Gentle, restorative practices for relaxation
              </p>
              <div className="space-y-2">
                <Link
                  href="/styles/yin-yoga"
                  className="block text-sm text-[#a39188] hover:underline"
                >
                  → Yin (Deep Stretching)
                </Link>
                <Link
                  href="/styles/restorative-yoga"
                  className="block text-sm text-[#a39188] hover:underline"
                >
                  → Restorative (Pure Rest)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic/Active Styles */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Dynamic & Active Styles
          </h2>
          <p className="mt-2 text-[#5d4c42]/70">
            Flowing, athletic practices that build strength and cardiovascular fitness
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {dynamicStyles.map((style) => {
            const Icon = styleIcons[style.slug] || Flame
            return (
              <Link
                key={style.slug}
                href={`/styles/${style.slug}`}
                className="group rounded-2xl bg-white p-8 shadow-sm border border-[#e6ceb3] transition-all hover:shadow-lg hover:border-[#5d4c42]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-12 w-12 text-[#a39188]" />
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                    style.forBeginners.suitable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {style.forBeginners.suitable ? 'Beginner Friendly' : 'Intermediate+'}
                  </span>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-[#5d4c42] group-hover:text-[#a39188]">
                  {style.displayName}
                </h3>

                <p className="mb-4 text-[#5d4c42]/70 leading-relaxed">
                  {style.shortDescription}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {style.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#f2e8dc] px-3 py-1 text-xs text-[#5d4c42]/70"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-[#a39188]">
                  <span>Learn more about {style.name}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Traditional Styles */}
      <div className="bg-[#f2e8dc] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#5d4c42] md:text-3xl">
              Traditional & Foundational Styles
            </h2>
            <p className="mt-2 text-[#5d4c42]/70">
              Classical practices emphasizing alignment, breath, and spiritual connection
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {traditionalStyles.map((style) => {
              const Icon = styleIcons[style.slug] || Leaf
              return (
                <Link
                  key={style.slug}
                  href={`/styles/${style.slug}`}
                  className="group rounded-2xl bg-white p-8 shadow-sm border border-[#e6ceb3] transition-all hover:shadow-lg hover:border-[#5d4c42]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Icon className="h-12 w-12 text-[#a39188]" />
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                      style.forBeginners.suitable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {style.forBeginners.suitable ? 'Beginner Friendly' : 'All Levels'}
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-[#5d4c42] group-hover:text-[#a39188]">
                    {style.displayName}
                  </h3>

                  <p className="mb-4 text-[#5d4c42]/70 leading-relaxed">
                    {style.shortDescription}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {style.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#f2e8dc] px-3 py-1 text-xs text-[#5d4c42]/70"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-[#a39188]">
                    <span>Learn more about {style.name}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Gentle/Restorative Styles */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Gentle & Restorative Styles
          </h2>
          <p className="mt-2 text-[#5d4c42]/70">
            Slow, meditative practices for flexibility, relaxation, and healing
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {gentleStyles.map((style) => {
            const Icon = styleIcons[style.slug] || Heart
            return (
              <Link
                key={style.slug}
                href={`/styles/${style.slug}`}
                className="group rounded-2xl bg-white p-8 shadow-sm border border-[#e6ceb3] transition-all hover:shadow-lg hover:border-[#5d4c42]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-12 w-12 text-[#a39188]" />
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Beginner Friendly
                  </span>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-[#5d4c42] group-hover:text-[#a39188]">
                  {style.displayName}
                </h3>

                <p className="mb-4 text-[#5d4c42]/70 leading-relaxed">
                  {style.shortDescription}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {style.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#f2e8dc] px-3 py-1 text-xs text-[#5d4c42]/70"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-[#a39188]">
                  <span>Learn more about {style.name}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Style Comparison Table */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Quick Style Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#e6ceb3]">
                  <th className="pb-4 pr-4 font-semibold text-[#5d4c42]">Style</th>
                  <th className="pb-4 pr-4 font-semibold text-[#5d4c42]">Pace</th>
                  <th className="pb-4 pr-4 font-semibold text-[#5d4c42]">Intensity</th>
                  <th className="pb-4 pr-4 font-semibold text-[#5d4c42]">Best For</th>
                  <th className="pb-4 font-semibold text-[#5d4c42]">Beginners</th>
                </tr>
              </thead>
              <tbody>
                {styles.map((style, index) => (
                  <tr key={style.slug} className={index % 2 === 0 ? 'bg-[#f9f3e9]' : 'bg-white'}>
                    <td className="py-4 pr-4">
                      <Link
                        href={`/styles/${style.slug}`}
                        className="font-medium text-[#a39188] hover:underline"
                      >
                        {style.name}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-[#5d4c42]/70">
                      {style.slug.includes('vinyasa') || style.slug.includes('ashtanga') ? 'Fast' :
                       style.slug.includes('hatha') || style.slug.includes('kundalini') ? 'Moderate' : 'Slow'}
                    </td>
                    <td className="py-4 pr-4 text-[#5d4c42]/70">
                      {style.typicalClass.intensity.split(' ')[0]}
                    </td>
                    <td className="py-4 pr-4 text-[#5d4c42]/70">
                      {style.bestFor[0]}
                    </td>
                    <td className="py-4">
                      {style.forBeginners.suitable ? (
                        <span className="text-green-600">✓ Yes</span>
                      ) : (
                        <span className="text-amber-600">~ Some experience</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#e6ceb3] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold text-[#5d4c42] md:text-4xl">
            Ready to Find Your Perfect Studio?
          </h2>
          <p className="mb-8 text-lg text-[#5d4c42]/80">
            Browse 450+ verified yoga studios across Bali offering all these styles
          </p>
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-full bg-[#5d4c42] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
          >
            Browse All Studios
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
}
