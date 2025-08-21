import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { RetreatDetailContent } from '@/components/retreat-detail-content'
import { getAllRetreats, getRetreatBySlug } from '@/lib/supabase-server'
import type { Retreat } from '@/lib/types'

interface RetreatDetailPageProps {
  searchParams: Promise<{ slug?: string }>
}

// Generate static params for all retreats
export async function generateStaticParams() {
  const retreats = await getAllRetreats()
  
  return retreats.map((retreat) => ({
    slug: retreat.slug,
  }))
}

// Generate metadata for each retreat
export async function generateMetadata({ searchParams }: RetreatDetailPageProps): Promise<Metadata> {
  const { slug } = await searchParams
  
  if (!slug) {
    return {
      title: 'Retreat Not Found',
      description: 'The requested yoga retreat could not be found.',
    }
  }

  const retreat = await getRetreatBySlug(slug)

  if (!retreat) {
    return {
      title: 'Retreat Not Found',
      description: 'The requested yoga retreat could not be found.',
    }
  }

  const title = `${retreat.name} - Yoga Retreat in ${retreat.location}, Bali`
  const description = retreat.business_description 
    ? `${retreat.business_description.substring(0, 150)}...` 
    : `Join transformative yoga retreat ${retreat.name} in ${retreat.location}, Bali. Rated ${retreat.rating}/5 stars with ${retreat.reviewCount} reviews.`

  return {
    title,
    description,
    keywords: [
      retreat.name,
      'yoga retreat',
      retreat.location,
      'bali retreat',
      'yoga holiday',
      'wellness retreat',
      'meditation retreat'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      images: retreat.image ? [
        {
          url: retreat.image,
          width: 1200,
          height: 630,
          alt: `${retreat.name} yoga retreat in ${retreat.location}, Bali`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: retreat.image ? [retreat.image] : [],
    },
    alternates: {
      canonical: `/retreats/detail?slug=${retreat.slug}`,
    },
  }
}

export default async function RetreatDetailPage({ searchParams }: RetreatDetailPageProps) {
  const { slug } = await searchParams
  
  if (!slug) {
    notFound()
  }

  const retreat = await getRetreatBySlug(slug)

  if (!retreat) {
    notFound()
  }

  return <RetreatDetailContent retreat={retreat} />
}