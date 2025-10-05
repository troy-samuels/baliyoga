"use client"

import { useState, useMemo } from "react"
import { MapPin } from "lucide-react"

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
  // Name-first lookup to match your requirement
  const query = `${name}, Bali, Indonesia`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// Build a Static Maps URL and route it through the existing proxy for CSP/cache benefits
function buildStaticMapSrc({ name, city, lat, lng, address }: MapPreviewProps): string {
  const base = 'https://maps.googleapis.com/maps/api/staticmap'
  // Keep effective resolution within free-tier 640x640 (size * scale)
  const size = '320x160'
  const zoom = 16
  const scale = 2
  const markerColor = '0x5d4c42'
  let centerParam = ''
  let markerParam = ''

  if (typeof lat === 'number' && typeof lng === 'number') {
    centerParam = `${lat},${lng}`
    markerParam = `markers=color:${markerColor}|${lat},${lng}`
  } else {
    // Name-first preview when coordinates are not cached
    const query = `${name}, Bali, Indonesia`
    centerParam = encodeURIComponent(query)
    markerParam = `markers=color:${markerColor}|${encodeURIComponent(query)}`
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID
  // Styled Static Map to better match brand colors (limited by Static Maps styling)
  const styleParams = [
    'style=feature:poi|visibility:off',
    'style=feature:transit|visibility:off',
    'style=feature:road|element:labels|visibility:off',
    'style=feature:landscape|element:geometry.fill|color:0xf9f3e9',
    'style=feature:water|element:geometry|color:0xa39188',
    'style=feature:road|element:geometry|color:0xe6ceb3'
  ].join('&')
  const mapIdParam = mapId ? `&map_id=${encodeURIComponent(mapId)}` : ''
  const raw = `${base}?center=${centerParam}&zoom=${zoom}&size=${size}&scale=${scale}&${markerParam}&maptype=roadmap&region=ID&${styleParams}${mapIdParam}&key=${apiKey}`
  // Use proxy-image route for delivery
  return `/api/proxy-image?url=${encodeURIComponent(raw)}`
}

export function MapPreview(props: MapPreviewProps) {
  const href = useMemo(() => buildMapsUrl(props), [props])
  const [tryProxy, setTryProxy] = useState(false)
  const [useEmbed, setUseEmbed] = useState(false)
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const hasKey = typeof key === 'string' && key.length > 20
  const directSrc = useMemo(() => {
    const base = buildStaticMapSrc(props)
    // base currently points to proxy; derive direct URL for first attempt
    try {
      const url = new URL(base, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
      const raw = url.searchParams.get('url')
      return raw ? decodeURIComponent(raw) : base
    } catch {
      return base
    }
  }, [props])
  const proxySrc = useMemo(() => buildStaticMapSrc(props), [props])

  const Fallback = (
    <div className="relative w-full h-[180px] flex items-center justify-center bg-[#e6ceb3] text-[#5d4c42]">
      <MapPin className="w-6 h-6 opacity-80" />
    </div>
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-lg overflow-hidden border border-[#e6ceb3] bg-[#f5f5f5] hover:shadow-sm transition-shadow ${props.className || ''}`}
      aria-label={`Open ${props.name} location in Google Maps`}
    >
      {useEmbed || !hasKey ? (
        <div className="relative w-full h-[180px]">
          {(() => {
            const embedKey = (process.env.NEXT_PUBLIC_GOOGLE_EMBED_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '').trim()
            const q = encodeURIComponent(`${props.name}, Bali, Indonesia`)
            const src = embedKey
              ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedKey)}&q=${q}&maptype=roadmap&zoom=16`
              : `https://www.google.com/maps?q=${q}&output=embed&hl=en`
            return (
              <iframe
                title={`${props.name} map preview`}
                src={src}
                className="w-full h-full"
                style={{ border: 0, filter: 'grayscale(10%) saturate(80%)', pointerEvents: 'none' as any }}
                loading="lazy"
              />
            )
          })()}
        </div>
      ) : (
        <img
          src={tryProxy ? proxySrc : directSrc}
          alt={`${props.name} location preview`}
          className="w-full h-[180px] object-cover"
          onError={() => {
            if (!tryProxy) {
              setTryProxy(true)
            } else {
              // As a last resort, fall back to an embed that doesn't require a Static Maps key
              setUseEmbed(true)
            }
          }}
          referrerPolicy="origin"
          loading="lazy"
          decoding="async"
        />
      )}
    </a>
  )
}


