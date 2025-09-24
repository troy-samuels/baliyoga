"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, ExternalLink, AlertCircle } from "lucide-react"

interface Coordinates {
  lat: number
  lng: number
}

interface GoogleMapClientProps {
  address: string
  name: string
  city: string
  className?: string
}

interface GoogleMapError {
  code: string
  message: string
}

// Google Maps TypeScript definitions
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any
        Marker: new (options: any) => any
        Geocoder: new () => any
        SymbolPath: {
          CIRCLE: any
        }
      }
    }
    initGoogleMaps: () => void
  }
}

// Map configuration
const MAP_CONFIG = {
  zoom: {
    withAddress: 15,
    withoutAddress: 12
  },
  styles: [
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
  ],
  defaultOptions: {
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false,
    gestureHandling: 'cooperative'
  }
}

export default function GoogleMapClient({ address, name, city, className }: GoogleMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<GoogleMapError | null>(null)
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false)

  // Only initialize after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get the API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const hasValidApiKey = apiKey &&
    apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' &&
    apiKey !== 'your_google_maps_api_key_here' &&
    apiKey.length > 20 &&
    (apiKey.startsWith('AIza') || apiKey.includes('key='))
  
  // Enhanced debug logging (remove in production)
  if (isMounted && process.env.NODE_ENV === 'development') {
    console.log('🗺️ Google Maps Debug:', {
      hasApiKey: !!apiKey,
      apiKeyStart: apiKey?.substring(0, 8),
      hasValidApiKey,
      isMounted,
      isLoading,
      isLoaded,
      hasError: !!error,
      errorCode: error?.code,
      address: address || 'NO_ADDRESS',
      name: name || 'NO_NAME', 
      city: city || 'NO_CITY',
      coordinates,
      searchQuery: address || `${name}, ${city}, Bali, Indonesia`
    })
  }

  // Build robust geocoding query
  const buildGeocodingQuery = (address: string, name: string, city: string) => {
    // Clean inputs
    const cleanAddress = address?.trim()
    const cleanName = name?.trim()
    const cleanCity = city?.trim()

    // Priority order: full address > name + city > name only
    if (cleanAddress && cleanAddress.length > 5) {
      // Add Bali, Indonesia if not already present
      const lowerAddress = cleanAddress.toLowerCase()
      if (!lowerAddress.includes('bali') && !lowerAddress.includes('indonesia')) {
        return `${cleanAddress}, Bali, Indonesia`
      }
      return cleanAddress
    }
    
    if (cleanName && cleanCity) {
      return `${cleanName}, ${cleanCity}, Bali, Indonesia`
    }
    
    if (cleanName) {
      return `${cleanName}, Bali, Indonesia`
    }
    
    // Last resort fallback
    return 'Ubud, Bali, Indonesia'
  }

  // Create Google Maps URL for external viewing
  const searchQuery = buildGeocodingQuery(address, name, city)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

  // Load Google Maps API
  const loadGoogleMaps = useCallback(async () => {
    if (!isMounted || !hasValidApiKey) {
      setError({
        code: 'NO_API_KEY',
        message: 'Google Maps API key not configured'
      })
      setIsLoading(false)
      return
    }

    try {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsLoaded(true)
        setIsLoading(false)
        return
      }

      // Set timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setError({
          code: 'TIMEOUT_ERROR',
          message: 'Google Maps API failed to load (timeout)'
        })
        setIsLoading(false)
      }, 10000) // 10 second timeout

      // Load the Google Maps script with callback
      const callbackName = 'initGoogleMaps_' + Math.random().toString(36).substr(2, 9)
      
      // Create callback function
      ;(window as any)[callbackName] = () => {
        clearTimeout(timeout)
        setIsLoaded(true)
        setIsLoading(false)
        delete (window as any)[callbackName]
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=${callbackName}&loading=async`
      script.async = true
      script.defer = true

      script.onerror = () => {
        clearTimeout(timeout)
        setError({
          code: 'SCRIPT_LOAD_ERROR',
          message: 'Failed to load Google Maps API'
        })
        setIsLoading(false)
        delete (window as any)[callbackName]
      }

      document.head.appendChild(script)

      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    } catch (err) {
      setError({
        code: 'LOAD_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error loading maps'
      })
      setIsLoading(false)
    }
  }, [apiKey, hasValidApiKey, isMounted])

  // Geocode address and create map
  const initializeMap = useCallback(async () => {
    if (!window.google?.maps?.Geocoder || !mapRef.current || !isLoaded || !isMounted) {
      return
    }

    try {
      // Wait a bit to ensure Google Maps is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (!window.google?.maps?.Geocoder) {
        throw new Error('Google Maps Geocoder not available')
      }

      const geocoder = new window.google.maps.Geocoder()
      const query = buildGeocodingQuery(address, name, city)

      // Enhanced debug logging for geocoding
      if (process.env.NODE_ENV === 'development') {
        console.log('🌍 Starting geocoding with query:', query)
      }

      // Geocode the address
      geocoder.geocode({ address: query }, (results: any[], status: string) => {
        let location: Coordinates
        let usingFallback = false

        if (process.env.NODE_ENV === 'development') {
          console.log('🌍 Geocoding result:', {
            status,
            resultsCount: results?.length || 0,
            firstResult: results?.[0]?.formatted_address,
            firstResultGeometry: results?.[0]?.geometry?.location ? {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            } : null
          })
        }

        if (status === 'OK' && results && results[0]) {
          location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
          setUsingFallbackLocation(false)
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Using geocoded location:', location)
          }
        } else {
          // Fallback to Bali center coordinates
          location = { lat: -8.4095, lng: 115.1889 }
          usingFallback = true
          setUsingFallbackLocation(true)
          if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ Geocoding failed, using fallback location:', location, 'Status:', status)
          }
        }

        setCoordinates(location)
        createMap(location)
      })
    } catch (err) {
      console.error('Error initializing map:', err)
      // Use fallback coordinates instead of showing error
      const fallbackLocation = { lat: -8.4095, lng: 115.1889 }
      setUsingFallbackLocation(true)
      setCoordinates(fallbackLocation)
      createMap(fallbackLocation)
    }
  }, [address, name, city, isLoaded, isMounted])

  // Create the map instance
  const createMap = useCallback((location: Coordinates) => {
    if (!mapRef.current || !window.google || !isMounted) return

    try {
      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: address ? MAP_CONFIG.zoom.withAddress : MAP_CONFIG.zoom.withoutAddress,
        styles: MAP_CONFIG.styles,
        ...MAP_CONFIG.defaultOptions
      })

      // Create marker
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

      // Add click handlers
      marker.addListener('click', () => {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer')
      })

      map.addListener('click', () => {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer')
      })

      mapInstanceRef.current = map
    } catch (err) {
      console.error('Error creating map:', err)
      setError({
        code: 'CREATE_ERROR',
        message: 'Failed to create map'
      })
    }
  }, [name, address, mapsUrl, isMounted])

  // Load Google Maps on component mount (client-side only)
  useEffect(() => {
    if (isMounted) {
      loadGoogleMaps()
    }
  }, [loadGoogleMaps, isMounted])

  // Initialize map when loaded
  useEffect(() => {
    if (isLoaded && !error && isMounted) {
      initializeMap()
    }
  }, [isLoaded, error, initializeMap, isMounted])

  // Handle external link click
  const handleExternalClick = useCallback(() => {
    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
  }, [mapsUrl])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div className="w-full">
        <h4 className="text-sm font-medium text-[#5d4c42] mb-2">Location</h4>
        <div className={`w-full h-[180px] flex items-center justify-center bg-[#e6ceb3] rounded-lg ${className}`}>
          <div className="loading-skeleton w-full h-full rounded-lg"></div>
        </div>
      </div>
    )
  }

  // Enhanced fallback component for when maps can't load
  const FallbackMap = () => (
    <div className={`w-full h-[180px] flex flex-col items-center justify-center bg-gradient-to-br from-[#e6ceb3] via-[#dcc5a8] to-[#d4c1a1] rounded-lg text-[#5d4c42] relative overflow-hidden cursor-pointer hover:from-[#d4c1a1] hover:to-[#c4b091] transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
         onClick={handleExternalClick}
         role="button"
         tabIndex={0}
         onKeyDown={(e) => e.key === 'Enter' && handleExternalClick()}
         aria-label={`View ${name} on Google Maps`}>

      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-8" aria-hidden="true">
        <div className="absolute top-3 left-3 w-12 h-12 border-2 border-[#5d4c42]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-[#5d4c42]/20 rounded-full animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/3 right-8 w-4 h-4 bg-[#5d4c42]/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-6 w-8 h-8 border border-[#5d4c42]/15 rounded-full animate-pulse animation-delay-700"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(45deg, #5d4c42 25%, transparent 25%, transparent 75%, #5d4c42 75%),
                           linear-gradient(45deg, #5d4c42 25%, transparent 25%, transparent 75%, #5d4c42 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-[#5d4c42]" aria-hidden="true" />
        </div>

        <div className="font-semibold text-lg mb-1">{name}</div>
        <div className="text-sm opacity-80 mb-3">{city}, Bali, Indonesia</div>

        {error && error.code === 'NO_API_KEY' && (
          <div className="text-xs mt-2 bg-white/30 backdrop-blur-sm text-[#5d4c42] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/40">
            <div className="w-2 h-2 bg-[#5d4c42]/60 rounded-full"></div>
            Interactive map available with API key
          </div>
        )}

        {(!error || error.code !== 'NO_API_KEY') && (
          <div className="text-xs mt-2 bg-white/30 backdrop-blur-sm text-[#5d4c42] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/40">
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            {error?.code === 'TIMEOUT_ERROR' ? 'Map loading slowly' :
             error?.code === 'SCRIPT_LOAD_ERROR' ? 'Interactive map unavailable' : 'Loading interactive map...'}
          </div>
        )}

        <div className="text-xs mt-3 flex items-center justify-center gap-1.5 opacity-90 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          Click to open in Google Maps
        </div>
      </div>

      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )

  // Show fallback if there's an error or no API key
  if (error || !hasValidApiKey) {
    return (
      <div className="w-full">
        <h4 className="text-sm font-medium text-[#5d4c42] mb-2">Location</h4>
        <FallbackMap />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-[#5d4c42]">Location</h4>
        <button
          onClick={handleExternalClick}
          className="text-xs text-[#5d4c42] hover:text-[#a39188] flex items-center gap-1 transition-colors touch-manipulation"
          aria-label={`Open ${name} in Google Maps`}
        >
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          Open in Maps
        </button>
      </div>
      
      <div className={`relative w-full h-[180px] rounded-lg overflow-hidden border border-[#e6ceb3] bg-[#f5f5f5] ${className}`}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#e6ceb3] z-10">
            <div className="text-[#5d4c42]/60">
              <div className="animate-spin w-6 h-6 border-2 border-[#5d4c42] border-t-transparent rounded-full mx-auto" role="status" aria-label="Loading map"></div>
              <div className="text-xs mt-2">Loading map...</div>
            </div>
          </div>
        )}
        
        {/* Map container */}
        <div 
          ref={mapRef} 
          className="w-full h-full cursor-pointer"
          style={{ minHeight: '180px' }}
          role="application"
          aria-label={`Interactive map showing location of ${name}`}
        />
      </div>
      
      <div className="mt-2 text-xs text-[#5d4c42]/60 text-center">
        Click map to open in Google Maps
        {usingFallbackLocation && (
          <div className="mt-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            📍 Showing general Bali area - click for exact location
          </div>
        )}
        {coordinates && process.env.NODE_ENV === 'development' && (
          <span className="ml-2">
            ({coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)})
          </span>
        )}
      </div>
    </div>
  )
}