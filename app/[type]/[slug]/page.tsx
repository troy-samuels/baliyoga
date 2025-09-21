import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { StudioDetailContent } from '@/components/studio-detail-content'
import { RetreatDetailContent } from '@/components/retreat-detail-content'
import { getAllStudios, getAllRetreats, getStudioBySlug, getRetreatBySlug } from '@/lib/supabase-server'
import type { Studio, Retreat } from '@/lib/supabase-server'
import { isValidSlug } from '@/lib/slug-utils'
import { generateEnhancedMetadata } from '@/lib/enhanced-metadata'

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

// Generate comprehensive metadata for each item
export async function generateMetadata({ params }: ItemDetailPageProps): Promise<Metadata> {
  const { type, slug } = await params

  // Validate slug format
  if (!isValidSlug(slug)) {
    return {
      title: 'Page Not Found | Bali Yoga',
      description: 'The requested yoga studio or retreat page could not be found. Explore our collection of authentic yoga experiences in Bali.',
      robots: { index: false, follow: false }
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
      title: 'Page Not Found | Bali Yoga',
      description: 'The requested page could not be found. Discover authentic yoga studios and retreats in Bali.',
      robots: { index: false, follow: false }
    }
  }

  if (!item) {
    return {
      title: `${itemType === 'studio' ? 'Yoga Studio' : 'Yoga Retreat'} Not Found | Bali Yoga`,
      description: `The requested yoga ${itemType} could not be found. Explore our curated collection of ${itemType === 'studio' ? 'yoga studios' : 'yoga retreats'} in Bali.`,
      robots: { index: false, follow: false }
    }
  }

  // Use enhanced metadata generation
  return generateEnhancedMetadata({ item, type: itemType })
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