"use client"

import Image from "next/image"

interface MapPreviewProps {
  name: string
  city: string
  address?: string
  lat?: number
  lng?: number
  className?: string
}

// Build a Google Maps destination URL prioritizing coordinates when present
function buildMapsUrl({ name, city, lat, lng, address }: MapPreviewProps): string {
  if (typeof lat === 'number' && typeof lng === 'number') {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }
  const query = address && address.length > 5 ? address : `${name}, ${city}, Bali, Indonesia`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// Build a Static Maps URL and route it through the existing proxy for CSP/cache benefits
function buildStaticMapSrc({ name, city, lat, lng, address }: MapPreviewProps): string {
  const base = 'https://maps.googleapis.com/maps/api/staticmap'
  const size = '640x360'
  const zoom = 15
  const scale = 2
  const markerColor = '0x5d4c42'
  let centerParam = ''
  let markerParam = ''

  if (typeof lat === 'number' && typeof lng === 'number') {
    centerParam = `${lat},${lng}`
    markerParam = `markers=color:${markerColor}|${lat},${lng}`
  } else {
    const query = address && address.length > 5 ? address : `${name}, ${city}, Bali, Indonesia`
    centerParam = encodeURIComponent(query)
    markerParam = `markers=color:${markerColor}|${encodeURIComponent(query)}`
  }

  const raw = `${base}?center=${centerParam}&zoom=${zoom}&size=${size}&scale=${scale}&${markerParam}&maptype=roadmap&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`
  // Use proxy-image route for delivery
  return `/api/proxy-image?url=${encodeURIComponent(raw)}`
}

export function MapPreview(props: MapPreviewProps) {
  const href = buildMapsUrl(props)
  const src = buildStaticMapSrc(props)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-lg overflow-hidden border border-[#e6ceb3] bg-[#f5f5f5] hover:shadow-sm transition-shadow ${props.className || ''}`}
      aria-label={`Open ${props.name} location in Google Maps`}
    >
      <div className="relative w-full" style={{ height: 180 }}>
        <Image
          src={src}
          alt={`${props.name} location preview`}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover"
        />
      </div>
    </a>
  )
}


