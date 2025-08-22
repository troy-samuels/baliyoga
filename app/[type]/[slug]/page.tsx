import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { StudioDetailContent } from '@/components/studio-detail-content'
import { RetreatDetailContent } from '@/components/retreat-detail-content'
import { getAllStudios, getAllRetreats, getStudioBySlug, getRetreatBySlug } from '@/lib/supabase-server'
import type { Studio, Retreat } from '@/lib/supabase-server'
import { getCanonicalUrl, isValidSlug, parseSlug, generateBreadcrumbs } from '@/lib/slug-utils'

interface ItemDetailPageProps {
  params: Promise<{
    type: 'studios' | 'retreats'
    slug: string
  }>
}

// Generate static params for all studios and retreats
export async function generateStaticParams() {
  const [studios, retreats] = await Promise.all([
    getAllStudios(),
    getAllRetreats()
  ])
  
  const studioParams = studios.map((studio) => ({
    type: 'studios' as const,
    slug: studio.slug,
  }))
  
  const retreatParams = retreats.map((retreat) => ({
    type: 'retreats' as const,
    slug: retreat.slug,
  }))
  
  return [...studioParams, ...retreatParams]
}

// Generate metadata for each item
export async function generateMetadata({ params }: ItemDetailPageProps): Promise<Metadata> {
  const { type, slug } = await params
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  let item: Studio | Retreat | null = null
  let itemType: 'studio' | 'retreat'

  if (type === 'studios') {
    item = await getStudioBySlug(slug)
    itemType = 'studio'
  } else if (type === 'retreats') {
    item = await getRetreatBySlug(slug)
    itemType = 'retreat'
  } else {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  if (!item) {
    return {
      title: `${itemType === 'studio' ? 'Studio' : 'Retreat'} Not Found`,
      description: `The requested yoga ${itemType} could not be found.`,
    }
  }

  const title = itemType === 'studio' 
    ? `${item.name} - Yoga Studio in ${item.location}, Bali`
    : `${item.name} - Yoga Retreat in ${item.location}, Bali`
  
  const description = item.description 
    ? `${item.description.substring(0, 150)}...` 
    : `Experience authentic yoga at ${item.name} in ${item.location}, Bali. Rated ${item.rating}/5 stars with ${item.reviewCount} reviews.`

  const keywords = [
    item.name,
    itemType === 'studio' ? 'yoga studio' : 'yoga retreat',
    item.location,
    'bali yoga',
    'yoga classes',
    'meditation'
  ]

  // Add type-specific keywords
  if (itemType === 'studio' && 'styles' in item) {
    keywords.push(...item.styles)
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      images: item.image ? [
        {
          url: item.image,
          width: 1200,
          height: 630,
          alt: `${item.name} yoga ${itemType} in ${item.location}, Bali`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: item.image ? [item.image] : [],
    },
    alternates: {
      canonical: getCanonicalUrl(itemType, item.slug),
    },
  }
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { type, slug } = await params
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound()
  }

  let item: Studio | Retreat | null = null
  let itemType: 'studio' | 'retreat'

  if (type === 'studios') {
    item = await getStudioBySlug(slug)
    itemType = 'studio'
  } else if (type === 'retreats') {
    item = await getRetreatBySlug(slug)
    itemType = 'retreat'
  } else {
    notFound()
  }

  if (!item) {
    notFound()
  }

  // Render appropriate component based on type
  if (itemType === 'studio') {
    return <StudioDetailContent studio={item as Studio} />
  } else {
    return <RetreatDetailContent retreat={item as Retreat} />
  }
}