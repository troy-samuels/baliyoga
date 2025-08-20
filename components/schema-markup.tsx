"use client"

import type { Studio, Retreat } from "@/lib/data-utils"

interface SchemaMarkupProps {
  item: Studio | Retreat
  type: "studio" | "retreat"
}

export function SchemaMarkup({ item, type }: SchemaMarkupProps) {
  // Base schema properties common to both studios and retreats
  const baseSchema = {
    "@context": "https://schema.org",
    "@id": `https://baliyoga.com/${type === "studio" ? "studios" : "retreats"}/${item.slug}`,
    "name": item.name,
    "description": item.business_description || `${item.name} is a ${item.category} located in ${item.location}, Bali.`,
    "url": `https://baliyoga.com/${type === "studio" ? "studios" : "retreats"}/${item.slug}`,
    "image": item.images && item.images.length > 0 ? item.images : [item.image],
    "telephone": item.phone_number || undefined,
    "sameAs": item.website ? [item.website] : undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": item.location_details?.address || "",
      "addressLocality": item.location,
      "addressRegion": "Bali",
      "addressCountry": "Indonesia",
      "postalCode": ""
    },
    "geo": {
      "@type": "GeoCoordinates",
      // Default Bali coordinates - would be better with actual geocoding
      "latitude": -8.4095,
      "longitude": 115.1889
    },
    "aggregateRating": item.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": item.rating,
      "reviewCount": item.reviewCount || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "priceRange": item.price_range || undefined
  }

  let schema: any

  if (type === "studio") {
    // Schema for Yoga Studios (LocalBusiness + SportsActivityLocation + ExerciseGym)
    schema = {
      ...baseSchema,
      "@type": ["LocalBusiness", "SportsActivityLocation", "ExerciseGym"],
      "businessType": "Yoga Studio",
      "categories": ["Yoga Studio", "Wellness Center", "Fitness Center"],
      "amenityFeature": item.amenities?.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      })) || undefined,
      "knowsLanguage": item.languages_spoken?.map(language => ({
        "@type": "Language",
        "name": language
      })) || undefined,
      "offers": item.drop_in_price_usd ? {
        "@type": "Offer",
        "name": "Drop-in Class",
        "price": item.drop_in_price_usd,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "category": "Yoga Class"
      } : undefined,
      "sport": "Yoga",
      "activity": item.styles || ["Yoga"],
      "openingHoursSpecification": Array.isArray(item.opening_hours) ? item.opening_hours.map((hours: any) => {
        if (typeof hours === 'object' && hours.day && hours.hours) {
          return {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": hours.day,
            "opens": hours.hours.split('-')[0]?.trim(),
            "closes": hours.hours.split('-')[1]?.trim()
          }
        }
        return null
      }).filter(Boolean) : undefined
    }
  } else {
    // Schema for Yoga Retreats (Event + TouristAttraction)
    schema = {
      ...baseSchema,
      "@type": ["Event", "TouristAttraction"],
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventActive",
      "category": "Yoga Retreat",
      "keywords": ["yoga", "retreat", "wellness", "bali", "meditation", ...(item.styles || [])],
      "amenityFeature": item.amenities?.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      })) || undefined,
      "inLanguage": item.languages_spoken || ["English"],
      "organizer": {
        "@type": "Organization",
        "name": item.name,
        "url": item.website || `https://baliyoga.com/retreats/${item.slug}`
      },
      "location": {
        "@type": "Place",
        "name": item.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": item.location_details?.address || "",
          "addressLocality": item.location,
          "addressRegion": "Bali",
          "addressCountry": "Indonesia"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -8.4095,
          "longitude": 115.1889
        }
      },
      "offers": {
        "@type": "Offer",
        "name": "Yoga Retreat Package",
        "price": "Contact for pricing",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "category": "Retreat Package"
      },
      "performer": {
        "@type": "Organization",
        "name": item.name
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "Yoga Practitioners"
      }
    }
  }

  // Add breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://baliyoga.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": type === "studio" ? "Yoga Studios" : "Yoga Retreats",
        "item": `https://baliyoga.com/${type === "studio" ? "studios" : "retreats"}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": item.name,
        "item": `https://baliyoga.com/${type === "studio" ? "studios" : "retreats"}/${item.slug}`
      }
    ]
  }

  // Organization schema for the site
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bali Yoga Directory",
    "url": "https://baliyoga.com",
    "logo": "https://baliyoga.com/logo.png",
    "description": "Discover the best yoga studios and retreats in Bali. Find authentic yoga experiences, world-class instructors, and transformative wellness centers across the Island of the Gods.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "Bali, Indonesia",
      "availableLanguage": ["English", "Indonesian"]
    },
    "sameAs": [
      "https://www.facebook.com/baliyoga",
      "https://www.instagram.com/baliyoga",
      "https://twitter.com/baliyoga"
    ]
  }

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Bali Yoga Directory",
    "url": "https://baliyoga.com",
    "description": "Find the best yoga studios and retreats in Bali",
    "publisher": {
      "@type": "Organization",
      "name": "Bali Yoga Directory"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://baliyoga.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      {/* Main business/event schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema, null, 2)
        }}
      />
      
      {/* Breadcrumb schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2)
        }}
      />
      
      {/* Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 2)
        }}
      />
      
      {/* Website schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 2)
        }}
      />
    </>
  )
}