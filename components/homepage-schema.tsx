"use client"

export function HomepageSchema() {
  // Organization schema for the homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bali Yoga Directory",
    "alternateName": "Bali Yoga",
    "url": "https://baliyoga.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://baliyoga.com/logo.png",
      "width": 200,
      "height": 60
    },
    "description": "Discover the best yoga studios and retreats in Bali. Find authentic yoga experiences, world-class instructors, and transformative wellness centers across the Island of the Gods.",
    "foundingDate": "2024",
    "areaServed": {
      "@type": "Place",
      "name": "Bali, Indonesia"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": -8.4095,
        "longitude": 115.1889
      },
      "geoRadius": "100000"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "Bali, Indonesia",
      "availableLanguage": ["English", "Indonesian"]
    },
    "knowsAbout": [
      "Yoga Studios",
      "Yoga Retreats", 
      "Wellness Centers",
      "Meditation Centers",
      "Bali Tourism",
      "Wellness Tourism"
    ],
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
    "alternateName": "Bali Yoga",
    "url": "https://baliyoga.com",
    "description": "Find the best yoga studios and retreats in Bali. Discover authentic yoga experiences and transformative wellness centers.",
    "publisher": {
      "@type": "Organization",
      "name": "Bali Yoga Directory"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://baliyoga.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Best Yoga Studios and Retreats in Bali",
      "description": "Curated list of top-rated yoga studios and retreat centers across Bali",
      "numberOfItems": "450+"
    }
  }

  // Local business collection schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Best Yoga Studios and Retreats in Bali",
    "description": "Comprehensive directory of yoga studios and retreat centers across Bali, Indonesia",
    "url": "https://baliyoga.com",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Bali Yoga Directory",
      "description": "Complete listing of yoga studios and retreats in Bali",
      "numberOfItems": "450+",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Yoga Studios",
          "description": "Professional yoga studios across Bali",
          "url": "https://baliyoga.com/studios"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Yoga Retreats",
          "description": "Transformative yoga retreat experiences in Bali",
          "url": "https://baliyoga.com/retreats"
        }
      ]
    },
    "about": {
      "@type": "Thing",
      "name": "Yoga in Bali",
      "description": "Yoga and wellness practices in Bali, Indonesia"
    },
    "keywords": [
      "bali yoga",
      "yoga studios bali", 
      "yoga retreats bali",
      "ubud yoga",
      "canggu yoga",
      "seminyak yoga",
      "bali wellness",
      "yoga indonesia"
    ]
  }

  // FAQ schema for common questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best yoga studios in Bali?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bali offers world-class yoga studios across different regions. Popular areas include Ubud for traditional and spiritual yoga, Canggu for surf and yoga combinations, and Seminyak for luxury wellness experiences. Our directory features over 300 verified yoga studios with reviews and detailed information."
        }
      },
      {
        "@type": "Question", 
        "name": "How much do yoga classes cost in Bali?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yoga class prices in Bali typically range from $8-25 USD for drop-in classes, depending on the studio location and type of class. Many studios offer package deals and monthly memberships for better value."
        }
      },
      {
        "@type": "Question",
        "name": "What types of yoga retreats are available in Bali?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bali offers diverse yoga retreats including Hatha, Vinyasa, Yin, Ashtanga, and spiritual yoga retreats. Duration ranges from weekend intensives to month-long teacher training programs, with options for all skill levels."
        }
      },
      {
        "@type": "Question",
        "name": "Which areas of Bali are best for yoga?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ubud is considered the spiritual heart of Bali with traditional yoga and meditation centers. Canggu offers a vibrant surf and yoga culture. Seminyak provides luxury wellness experiences. Each area offers unique yoga experiences suited to different preferences."
        }
      }
    ]
  }

  return (
    <>
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
      
      {/* Collection page schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema, null, 2)
        }}
      />
      
      {/* FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema, null, 2)
        }}
      />
    </>
  )
}