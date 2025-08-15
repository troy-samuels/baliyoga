"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, ExternalLink } from "lucide-react"

interface LocationMapProps {
  address: string
  name: string
  city: string
}

// Declare global google types
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function LocationMap({ address, name, city }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Get the API key and check if it's properly configured
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const hasValidApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE'

  // Create Google Maps link for external viewing
  const searchQuery = address || `${city}, Bali, Indonesia`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

  // Load Google Maps API
  useEffect(() => {
    if (!hasValidApiKey || !mapRef.current) {
      setIsLoading(false)
      return
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap()
      return
    }

    // Load Google Maps API
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      initializeMap()
    }
    
    script.onerror = () => {
      setMapError(true)
      setIsLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [hasValidApiKey, apiKey, address, city, name])

  const initializeMap = async () => {
    if (!window.google || !mapRef.current) {
      setMapError(true)
      setIsLoading(false)
      return
    }

    try {
      const geocoder = new window.google.maps.Geocoder()
      const query = address || `${city}, Bali, Indonesia`

      // Geocode the address
      geocoder.geocode({ address: query }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location
          createMap(location)
        } else {
          // Fallback to Bali center if geocoding fails
          const baliCenter = { lat: -8.4095, lng: 115.1889 }
          createMap(baliCenter)
        }
      })
    } catch (error) {
      console.error('Error initializing map:', error)
      setMapError(true)
      setIsLoading(false)
    }
  }

  const createMap = (location: any) => {
    if (!mapRef.current) return

    try {
      // Custom map style to hide POIs
      const mapStyle = [
        {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.business",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "transit",
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "landscape",
          "stylers": [{ "color": "#f9f3e9" }]
        },
        {
          "featureType": "water",
          "stylers": [{ "color": "#a39188" }]
        }
      ]

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: address ? 15 : 12,
        styles: mapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: false,
        gestureHandling: 'cooperative'
      })

      // Create custom marker
      const marker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#5d4c42',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      })

      // Add click handler to marker
      marker.addListener('click', () => {
        window.open(mapsLink, '_blank')
      })

      // Add click handler to map
      map.addListener('click', () => {
        window.open(mapsLink, '_blank')
      })

      setMapInstance(map)
      setIsLoading(false)
    } catch (error) {
      console.error('Error creating map:', error)
      setMapError(true)
      setIsLoading(false)
    }
  }

  // Fallback view when no API key or map error
  if (mapError || !hasValidApiKey) {
    return (
      <div className="w-full">
        <h4 className="text-sm font-medium text-[#5d4c42] mb-2">Location</h4>
        <div className="w-full h-[180px] flex flex-col items-center justify-center bg-gradient-to-br from-[#e6ceb3] to-[#d4c1a1] rounded-lg text-[#5d4c42] relative overflow-hidden cursor-pointer hover:from-[#d4c1a1] hover:to-[#c4b091] transition-colors"
             onClick={() => window.open(mapsLink, '_blank')}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-[#5d4c42] rounded-full"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-2 border-[#5d4c42] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#5d4c42] rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-[#5d4c42]" />
            <div className="font-medium">{name}</div>
            <div className="text-sm mt-1 opacity-80">{city}, Bali</div>
            {!hasValidApiKey && (
              <div className="text-xs mt-2 bg-orange-100 text-orange-700 px-2 py-1 rounded">
                Maps API not configured
              </div>
            )}
            
            <div className="text-xs mt-2 flex items-center justify-center gap-1 opacity-80">
              <ExternalLink className="w-3 h-3" />
              Click to view on Google Maps
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-[#5d4c42]">Location</h4>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#5d4c42] hover:text-[#a39188] flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          Open in Maps
        </a>
      </div>
      
      <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-[#e6ceb3] bg-[#f5f5f5]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#e6ceb3] z-10">
            <div className="text-[#5d4c42]/60">
              <div className="animate-spin w-6 h-6 border-2 border-[#5d4c42] border-t-transparent rounded-full mx-auto"></div>
              <div className="text-xs mt-2">Loading map...</div>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-full cursor-pointer"
          style={{ minHeight: '180px' }}
        />
      </div>
      
      <div className="mt-2 text-xs text-[#5d4c42]/60 text-center">
        Click map to open in Google Maps
      </div>
    </div>
  )
} 