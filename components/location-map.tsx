"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface LocationMapProps {
  address: string
  name: string
  city: string
}

export function LocationMap({ address, name, city }: LocationMapProps) {
  const [mapError, setMapError] = useState(false)

  // Create a Google Maps embed URL
  const mapUrl = address 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'DEMO_KEY'}&q=${encodeURIComponent(address)}&zoom=10`
    : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'DEMO_KEY'}&q=${encodeURIComponent(city + ', Bali, Indonesia')}&zoom=10`

  const handleMapError = () => {
    setMapError(true)
  }

  if (mapError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-[#e6ceb3] rounded-lg text-[#5d4c42]/60">
        <MapPin className="w-6 h-6 mr-2" />
        <div className="text-center">
          <div>Map View</div>
          <div className="text-xs mt-1">{city}</div>
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
            <div className="text-xs mt-1 text-red-600">Google Maps API key required</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[200px] rounded-lg overflow-hidden border border-[#e6ceb3]">
      <iframe
        src={mapUrl}
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing location of ${name}`}
        onError={handleMapError}
        className="w-full h-full"
      />
    </div>
  )
} 