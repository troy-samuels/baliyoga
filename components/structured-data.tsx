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
            ? `${item.name} offers ${item.styles.join(', ')} yoga classes.`
            : `${item.name} offers various yoga styles including Hatha, Vinyasa, and traditional Balinese yoga practices.`
        }
      },
      {
        '@type': 'Question',
        name: `Where is ${item.name} located?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${item.name} is located in ${item.location}, Bali, Indonesia. ${item.address ? `The address is ${item.address}.` : ''}`
        }
      },
      {
        '@type': 'Question',
        name: `How can I contact ${item.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can contact ${item.name} ${item.phone_number ? `by phone at ${item.phone_number}` : ''}${item.website ? `${item.phone_number ? ', ' : ''}via their website at ${item.website}` : ''}${item.instagram_url ? ', or through their Instagram profile' : ''}.`
        }
      }
    ]
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