"use client"

import type { Studio, Retreat } from "@/lib/data-utils"

interface CategorySchemaProps {
  type: "studios" | "retreats"
  items: (Studio | Retreat)[]
  totalCount?: number
}

export function CategorySchema({ type, items, totalCount }: CategorySchemaProps) {
  const isStudios = type === "studios"
  
  // Collection page schema for category listing
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": isStudios ? "Best Yoga Studios in Bali" : "Best Yoga Retreats in Bali",
    "description": isStudios 
      ? "Comprehensive directory of top-rated yoga studios across Bali, Indonesia. Find professional yoga classes, experienced instructors, and authentic practice spaces."
      : "Discover transformative yoga retreat experiences in Bali. From weekend intensives to month-long programs, find the perfect retreat for your practice.",
    "url": `https://baliyoga.com/${type}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": isStudios ? "Bali Yoga Studios" : "Bali Yoga Retreats",
      "description": isStudios 
        ? "Complete listing of verified yoga studios in Bali"
        : "Curated collection of yoga retreats in Bali",
      "numberOfItems": totalCount || items.length,
      "itemListElement": items.slice(0, 10).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": isStudios ? "LocalBusiness" : "Event",
          "@id": `https://baliyoga.com/${type}/${item.slug}`,
          "name": item.name,
          "description": item.business_description || `${item.name} is a ${item.category} located in ${item.location}, Bali.`,
          "url": `https://baliyoga.com/${type}/${item.slug}`,
          "image": item.image,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": item.location,
            "addressRegion": "Bali",
            "addressCountry": "Indonesia"
          },
          "aggregateRating": item.rating > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": item.rating,
            "reviewCount": item.reviewCount || 1,
            "bestRating": 5,
            "worstRating": 1
          } : undefined
        }
      }))
    },
    "breadcrumb": {
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
          "name": isStudios ? "Yoga Studios" : "Yoga Retreats",
          "item": `https://baliyoga.com/${type}`
        }
      ]
    },
    "keywords": isStudios 
      ? ["bali yoga studios", "yoga classes bali", "ubud yoga", "canggu yoga", "seminyak yoga", "yoga instructors bali"]
      : ["bali yoga retreats", "yoga retreat packages", "wellness retreats bali", "meditation retreats", "spiritual retreats bali"],
    "about": {
      "@type": "Thing",
      "name": isStudios ? "Yoga Studios in Bali" : "Yoga Retreats in Bali",
      "description": isStudios 
        ? "Professional yoga studios offering various styles of yoga practice in Bali, Indonesia"
        : "Transformative yoga retreat experiences in the spiritual heart of Bali, Indonesia"
    }
  }

  // Local business aggregate schema for studios
  const businessAggregateSchema = isStudios ? {
    "@context": "https://schema.org",
    "@type": "LocalBusinessAggregateRating",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": items.length > 0 ? (items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1) : "4.5",
      "reviewCount": items.reduce((sum, item) => sum + (item.reviewCount || 0), 0) || 1000,
      "bestRating": 5,
      "worstRating": 1
    },
    "itemReviewed": {
      "@type": "Organization",
      "name": "Bali Yoga Studios",
      "description": "Collection of top-rated yoga studios in Bali"
    }
  } : null

  // Service schema for the category
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": isStudios ? "Yoga Studio Directory" : "Yoga Retreat Directory",
    "description": isStudios 
      ? "Comprehensive directory service helping people find the best yoga studios in Bali"
      : "Curated directory service connecting travelers with authentic yoga retreat experiences in Bali",
    "provider": {
      "@type": "Organization", 
      "name": "Bali Yoga Directory"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Bali, Indonesia"
    },
    "serviceType": isStudios ? "Yoga Studio Directory" : "Yoga Retreat Directory",
    "audience": {
      "@type": "Audience",
      "audienceType": "Yoga Practitioners"
    }
  }

  return (
    <>
      {/* Collection page schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema, null, 2)
        }}
      />
      
      {/* Business aggregate schema for studios */}
      {businessAggregateSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessAggregateSchema, null, 2)
          }}
        />
      )}
      
      {/* Service schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema, null, 2)
        }}
      />
    </>
  )
}