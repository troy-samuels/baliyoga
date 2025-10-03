import Script from 'next/script'
import type { Studio, Retreat } from '@/lib/types'
import { generateStructuredData, generateBreadcrumbData, generateReviewStructuredData } from '@/lib/enhanced-metadata'

interface StructuredDataProps {
  item: Studio | Retreat
  type: 'studio' | 'retreat'
  reviews?: any[]
}

/**
 * Structured Data component for yoga studios and retreats
 * Injects JSON-LD schema markup for better search engine understanding
 */
export function StructuredData({ item, type, reviews }: StructuredDataProps) {
  const businessData = generateStructuredData(item, type, reviews)
  const breadcrumbData = generateBreadcrumbData(item, type)
  const reviewData = reviews && reviews.length > 0 ? generateReviewStructuredData(item, type, reviews) : null

  // Additional FAQ structured data for better rich snippets
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What types of yoga are offered at ${item.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: type === 'studio' && 'styles' in item && item.styles.length > 0
            ? `${item.name} offers ${item.styles.join(', ')} yoga classes in ${item.location}, Bali.`
            : `${item.name} offers various authentic yoga styles including Hatha, Vinyasa, and traditional Balinese yoga practices.`
        }
      },
      {
        '@type': 'Question',
        name: `Where exactly is ${item.name} located in Bali?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${item.name} is located in ${item.location}, Bali, Indonesia. ${item.location_details?.address ? `The full address is ${item.location_details.address}.` : ''} ${item.latitude && item.longitude ? `GPS coordinates: ${item.latitude}, ${item.longitude}` : ''}`
        }
      },
      {
        '@type': 'Question',
        name: `How can I contact and book at ${item.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can contact ${item.name} ${item.phone_number ? `by phone at ${item.phone_number}` : ''}${item.website ? `${item.phone_number ? ', ' : ''}via their website at ${item.website}` : ''}${item.instagram_url ? ', through their Instagram profile' : ''}${item.email_address ? `, or by email at ${item.email_address}` : ''}.`
        }
      },
      {
        '@type': 'Question',
        name: `What makes ${item.name} special for yoga in ${item.location}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.business_description
            ? item.business_description.substring(0, 200) + (item.business_description.length > 200 ? '...' : '')
            : `${item.name} offers an authentic yoga experience in the heart of ${item.location}, combining traditional practices with modern wellness approaches in beautiful Bali.`
        }
      },
      {
        '@type': 'Question',
        name: `What are the prices at ${item.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: type === 'studio' && 'drop_in_price_usd' in item && item.drop_in_price_usd
            ? `Drop-in yoga classes at ${item.name} cost $${item.drop_in_price_usd} USD. ${item.price_range ? `Price range: ${item.price_range}.` : ''}`
            : `Contact ${item.name} directly for current pricing and package options. Most studios in ${item.location} offer flexible pricing for drop-ins, packages, and monthly memberships.`
        }
      }
    ]
  }

  // Local business area-specific structured data
  const localAreaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${item.name.toLowerCase().replace(/\s+/g, '-')}-${item.location.toLowerCase()}-yoga`,
    name: `${item.name} - ${item.location} Yoga`,
    alternateName: [`${item.location} Yoga`, `Yoga ${item.location}`, `${item.location} ${type}`],
    description: `Yoga ${type} in ${item.location}, Bali - ${item.name}`,
    geo: item.latitude && item.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: item.latitude,
      longitude: item.longitude
    } : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: item.location,
      addressRegion: 'Bali',
      addressCountry: 'Indonesia'
    },
    areaServed: [{
      '@type': 'City',
      name: item.location
    }, {
      '@type': 'AdministrativeArea',
      name: 'Bali'
    }],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: item.latitude && item.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: item.latitude,
        longitude: item.longitude
      } : undefined,
      geoRadius: '5000' // 5km radius
    }
  }

  return (
    <>
      {/* Main business structured data */}
      <Script
        id={`business-structured-data-${item.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessData)
        }}
      />

      {/* Breadcrumb structured data */}
      <Script
        id={`breadcrumb-structured-data-${item.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />

      {/* FAQ structured data */}
      <Script
        id={`faq-structured-data-${item.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData)
        }}
      />

      {/* Local area structured data */}
      <Script
        id={`local-area-structured-data-${item.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localAreaData)
        }}
      />

      {/* Review structured data */}
      {reviewData && (
        <Script
          id={`review-structured-data-${item.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(reviewData)
          }}
        />
      )}
    </>
  )
}