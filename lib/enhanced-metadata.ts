import type { Metadata } from 'next'
import type { Studio, Retreat } from '@/lib/types'
import { getCanonicalUrl } from '@/lib/slug-utils'

interface EnhancedMetadataParams {
  item: Studio | Retreat
  type: 'studio' | 'retreat'
  baseUrl?: string
}

/**
 * Generate comprehensive metadata for studio and retreat detail pages
 * Optimized for both search engines and LLMs
 */
export function generateEnhancedMetadata({
  item,
  type,
  baseUrl = 'https://baliyoga.com'
}: EnhancedMetadataParams): Metadata {
  const isStudio = type === 'studio'
  const businessType = isStudio ? 'Yoga Studio' : 'Yoga Retreat'
  const businessTypeSlug = isStudio ? 'studio' : 'retreat'

  // Enhanced title with location and business type
  const title = `${item.name} - ${businessType} in ${item.location}, Bali | Authentic Yoga Experience`

  // Rich description with business details and context
  const generateDescription = (): string => {
    const baseDescription = item.business_description
      ? item.business_description.substring(0, 120)
      : `Experience authentic yoga at ${item.name}, a premier ${businessType.toLowerCase()} located in ${item.location}, Bali.`

    const ratingText = item.rating ? ` Rated ${item.rating}/5 stars` : ''
    const reviewText = item.reviewCount ? ` with ${item.reviewCount} reviews` : ''
    const styleText = 'styles' in item && item.styles.length > 0
      ? ` Specializing in ${item.styles.slice(0, 2).join(' and ')}.`
      : ''

    return `${baseDescription}${ratingText}${reviewText}.${styleText} Book your transformative yoga journey in Bali.`
  }

  const description = generateDescription()

  // Comprehensive keywords including location-specific and yoga-related terms
  const generateKeywords = (): string[] => {
    const baseKeywords = [
      item.name,
      `${item.location} yoga ${businessTypeSlug}`,
      `yoga ${businessTypeSlug} ${item.location}`,
      `${item.location} yoga classes`,
      'bali yoga',
      'yoga bali',
      'yoga classes bali',
      'meditation bali',
      'yoga retreat bali',
      'yoga studio bali',
      'authentic yoga bali',
      'traditional yoga',
      'yoga teacher training',
      'spiritual retreat',
      'wellness retreat',
      'mindfulness',
      'hatha yoga',
      'vinyasa yoga',
      'yin yoga',
      'ashtanga yoga'
    ]

    // Add location-specific keywords
    const locationKeywords = [
      `${item.location.toLowerCase()} yoga`,
      `yoga in ${item.location.toLowerCase()}`,
      `${item.location.toLowerCase()} retreat`,
      `${item.location.toLowerCase()} wellness`
    ]

    // Add style-specific keywords for studios
    const styleKeywords = 'styles' in item && item.styles
      ? item.styles.flatMap(style => [
          `${style.toLowerCase()} yoga`,
          `${style.toLowerCase()} classes`,
          `${item.location.toLowerCase()} ${style.toLowerCase()}`
        ])
      : []

    return [...baseKeywords, ...locationKeywords, ...styleKeywords]
  }

  // Enhanced OpenGraph metadata
  const openGraph = {
    title,
    description,
    type: 'website' as const,
    locale: 'en_US',
    siteName: 'Bali Yoga - Authentic Yoga Studios & Retreats',
    url: `${baseUrl}/${isStudio ? 'studios' : 'retreats'}/${item.slug}`,
    images: item.image ? [
      {
        url: item.image,
        width: 1200,
        height: 630,
        alt: `${item.name} - ${businessType} in ${item.location}, Bali - Authentic yoga experience`,
        type: 'image/jpeg',
      },
      {
        url: item.image,
        width: 800,
        height: 600,
        alt: `${item.name} yoga ${businessTypeSlug} interior view`,
        type: 'image/jpeg',
      }
    ] : [
      {
        url: `${baseUrl}/images/bali-yoga-default.jpg`,
        width: 1200,
        height: 630,
        alt: `Yoga ${businessType} in ${item.location}, Bali`,
        type: 'image/jpeg',
      }
    ],
  }

  // Enhanced Twitter metadata
  const twitter = {
    card: 'summary_large_image' as const,
    site: '@baliyoga',
    creator: '@baliyoga',
    title,
    description,
    images: item.image ? [item.image] : [`${baseUrl}/images/bali-yoga-default.jpg`],
  }

  // Additional metadata for better indexing
  const additionalMeta = {
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    category: 'Health & Wellness',
    classification: 'Yoga Studio',
    coverage: 'Worldwide',
    distribution: 'Global',
    rating: 'General',
    referrer: 'no-referrer-when-downgrade',
  }

  return {
    title,
    description,
    keywords: generateKeywords(),
    openGraph,
    twitter,
    alternates: {
      canonical: getCanonicalUrl(type, item.slug),
    },
    other: {
      'geo.region': 'ID-BA',
      'geo.placename': item.location,
      'geo.position': item.latitude && item.longitude ? `${item.latitude};${item.longitude}` : undefined,
      'ICBM': item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : undefined,
      'business-type': businessType,
      'business-location': `${item.location}, Bali, Indonesia`,
      'price-range': isStudio ? '$$' : '$$$',
    },
    ...additionalMeta,
  }
}

/**
 * Generate structured data (JSON-LD) for yoga studios and retreats
 * Optimized for rich snippets and local business results
 */
export function generateStructuredData(item: Studio | Retreat, type: 'studio' | 'retreat', reviews?: any[]) {
  const baseUrl = 'https://baliyoga.com'
  const isStudio = type === 'studio'

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': isStudio ? ['LocalBusiness', 'SportsActivityLocation', 'HealthAndBeautyBusiness'] : ['TouristAttraction', 'Event'],
    '@id': `${baseUrl}/${isStudio ? 'studios' : 'retreats'}/${item.slug}`,
    name: item.name,
    description: item.business_description || `${isStudio ? 'Yoga studio' : 'Yoga retreat'} in ${item.location}, Bali offering authentic yoga experiences and wellness practices.`,
    url: `${baseUrl}/${isStudio ? 'studios' : 'retreats'}/${item.slug}`,
    image: item.image ? [
      {
        '@type': 'ImageObject',
        url: item.image,
        caption: `${item.name} - ${isStudio ? 'Yoga Studio' : 'Yoga Retreat'} in ${item.location}, Bali`,
        width: 1200,
        height: 630
      }
    ] : [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: item.location,
      addressRegion: 'Bali',
      addressCountry: 'Indonesia',
      streetAddress: item.address || item.location,
      postalCode: '80361', // General Bali postal code
    },
    geo: item.latitude && item.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: item.latitude,
      longitude: item.longitude,
      '@context': 'https://schema.org'
    } : undefined,
    telephone: item.phone_number,
    email: item.email_address,
    sameAs: [
      item.website,
      item.instagram_url,
      item.facebook_url,
      item.youtube_url,
      item.tiktok_url,
    ].filter(Boolean),
    aggregateRating: item.rating ? {
      '@type': 'AggregateRating',
      ratingValue: item.rating,
      reviewCount: item.reviewCount || 1,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    priceRange: isStudio ? '$$' : '$$$',
    currenciesAccepted: 'IDR, USD',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    hasMap: item.latitude && item.longitude ? `https://maps.google.com/?q=${item.latitude},${item.longitude}` : undefined,
  }

  // Add individual reviews to structured data
  const reviewsSchema = reviews && reviews.length > 0 ? reviews.slice(0, 5).map(review => ({
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1
    },
    author: {
      '@type': 'Person',
      name: review.user_name
    },
    reviewBody: review.content,
    name: review.title,
    datePublished: review.created_at,
    publisher: {
      '@type': 'Organization',
      name: 'Bali Yoga'
    }
  })) : undefined

  if (isStudio) {
    return {
      ...baseStructuredData,
      category: 'Yoga Studio',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Yoga Classes & Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Yoga Classes',
              category: 'Fitness & Wellness',
              description: 'Authentic yoga classes in various styles'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Meditation Sessions',
              category: 'Wellness',
              description: 'Guided meditation and mindfulness practices'
            }
          }
        ]
      },
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Yoga Classes',
          value: true
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Meditation',
          value: true
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Wellness Programs',
          value: true
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Professional Instructors',
          value: true
        }
      ],
      openingHours: item.opening_hours && Array.isArray(item.opening_hours)
        ? item.opening_hours.map((hours: any) => `${hours.day} ${hours.hours}`)
        : ['Mo-Su 06:00-20:00'], // Default hours if not specified
      review: reviewsSchema,
      knowsAbout: ['Yoga', 'Meditation', 'Wellness', 'Mindfulness', 'Spiritual Practice'],
      isAccessibleForFree: false,
      smokingAllowed: false
    }
  } else {
    return {
      ...baseStructuredData,
      category: 'Yoga Retreat',
      touristType: ['Wellness Seeker', 'Yoga Practitioner', 'Spiritual Seeker'],
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: item.location,
        address: {
          '@type': 'PostalAddress',
          addressLocality: item.location,
          addressRegion: 'Bali',
          addressCountry: 'Indonesia'
        }
      },
      offers: {
        '@type': 'Offer',
        name: 'Yoga Retreat Package',
        category: 'Retreat Experience',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        description: 'Comprehensive yoga retreat experience with accommodation, meals, and activities'
      },
      review: reviewsSchema,
      knowsAbout: ['Yoga Retreats', 'Wellness Tourism', 'Spiritual Transformation', 'Meditation Retreats'],
      startDate: item.start_date,
      endDate: item.end_date,
      duration: item.duration || 'P7D' // Default 7 days if not specified
    }
  }
}

/**
 * Generate review structured data specifically
 */
export function generateReviewStructuredData(item: Studio | Retreat, type: 'studio' | 'retreat', reviews: any[]) {
  const baseUrl = 'https://baliyoga.com'

  if (!reviews || reviews.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}/${item.slug}#reviews`,
    name: `${item.name} Reviews`,
    description: `Customer reviews and ratings for ${item.name}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: item.rating || 4.5,
      reviewCount: item.reviewCount || reviews.length,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.slice(0, 10).map(review => ({
      '@type': 'Review',
      '@id': `${baseUrl}/review/${review.id}`,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        '@type': 'Person',
        name: review.user_name
      },
      reviewBody: review.content,
      name: review.title,
      datePublished: review.created_at,
      dateModified: review.updated_at || review.created_at,
      publisher: {
        '@type': 'Organization',
        name: 'Bali Yoga',
        url: baseUrl
      },
      itemReviewed: {
        '@type': type === 'studio' ? 'LocalBusiness' : 'TouristAttraction',
        name: item.name,
        url: `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}/${item.slug}`
      }
    }))
  }
}

export function generateBreadcrumbData(item: Studio | Retreat, type: 'studio' | 'retreat') {
  const baseUrl = 'https://baliyoga.com'
  const locationSlug = item.location.toLowerCase().replace(/\s+/g, '-')

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}/${item.slug}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: {
          '@type': 'WebPage',
          '@id': baseUrl,
          url: baseUrl
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: type === 'studio' ? 'Yoga Studios' : 'Yoga Retreats',
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}`,
          url: `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}`
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${item.location} ${type === 'studio' ? 'Yoga Studios' : 'Yoga Retreats'}`,
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}/${locationSlug}`,
          url: `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}/${locationSlug}`
        }
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: item.name,
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}/${item.slug}`,
          url: `${baseUrl}/${type === 'studio' ? 'studios' : 'retreats'}/${item.slug}`
        }
      }
    ],
  }
}