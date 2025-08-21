import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { StudioDetailContent } from '@/components/studio-detail-content'
import { getAllStudios, getStudioBySlug } from '@/lib/supabase-server'
import type { Studio } from '@/lib/types'

interface StudioDetailPageProps {
  searchParams: Promise<{ slug?: string }>
}

// Generate static params for all studios
export async function generateStaticParams() {
  const studios = await getAllStudios()
  
  return studios.map((studio) => ({
    slug: studio.slug,
  }))
}

// Generate metadata for each studio
export async function generateMetadata({ searchParams }: StudioDetailPageProps): Promise<Metadata> {
  const { slug } = await searchParams
  
  if (!slug) {
    return {
      title: 'Studio Not Found',
      description: 'The requested yoga studio could not be found.',
    }
  }

  const studio = await getStudioBySlug(slug)

  if (!studio) {
    return {
      title: 'Studio Not Found',
      description: 'The requested yoga studio could not be found.',
    }
  }

  const title = `${studio.name} - Yoga Studio in ${studio.location}, Bali`
  const description = studio.business_description 
    ? `${studio.business_description.substring(0, 150)}...` 
    : `Experience authentic yoga at ${studio.name} in ${studio.location}, Bali. Rated ${studio.rating}/5 stars with ${studio.reviewCount} reviews.`

  return {
    title,
    description,
    keywords: [
      studio.name,
      'yoga studio',
      studio.location,
      'bali yoga',
      ...studio.styles,
      'yoga classes',
      'meditation'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      images: studio.image ? [
        {
          url: studio.image,
          width: 1200,
          height: 630,
          alt: `${studio.name} yoga studio in ${studio.location}, Bali`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: studio.image ? [studio.image] : [],
    },
    alternates: {
      canonical: `/studios/detail?slug=${studio.slug}`,
    },
  }
}

export default async function StudioDetailPage({ searchParams }: StudioDetailPageProps) {
  const { slug } = await searchParams
  
  if (!slug) {
    notFound()
  }

  const studio = await getStudioBySlug(slug)

  if (!studio) {
    notFound()
  }

  return <StudioDetailContent studio={studio} />
}