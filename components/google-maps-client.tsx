"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, ExternalLink, AlertCircle, Eye, X, Maximize2, Navigation } from "lucide-react"
import { findBaliCoordinates, calculateDistance } from "@/lib/bali-coordinates"
import { getCoordinates } from "@/lib/geocoding-service"
import type { GeocodingResult } from "@/lib/geocoding-service"

interface Coordinates {
  lat: number
  lng: number
}

interface GoogleMapClientProps {
  address: string
  name: string
  city: string
  id?: string // Studio/retreat ID for database lookup
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

// Enhanced map configuration for mobile visibility
const MAP_CONFIG = {
  zoom: {
    street_level: 18,        // For precise addresses - street level view
    neighborhood: 16,        // For city-level coordinates
    area_level: 14,          // For region-level fallbacks
    mobile_optimal: 17,      // Sweet spot for mobile viewing
    withAddress: 17,         // Updated from 15 for better visibility
    withoutAddress: 14       // Updated from 12 for better context
  },
  // Mobile-optimized styling for better visibility
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
      "stylers": [{ "color": "#f5f1eb", "lightness": 5 }] // Slightly lighter for better contrast
    },
    {
      "featureType": "water",
      "stylers": [{ "color": "#4A90E2", "saturation": 30 }] // Blue water for better visibility
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "visibility": "on", "saturation": 10, "lightness": 20 }] // More visible roads
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#f0ad4e", "visibility": "on" }] // Highlight major roads
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text",
      "stylers": [{ "visibility": "on", "color": "#5d4c42" }] // Show area names
    }
  ],
  // Mobile-optimized default options
  defaultOptions: {
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: 9 // TOP_RIGHT for better mobile accessibility
    },
    scrollwheel: false,
    gestureHandling: 'cooperative',
    clickableIcons: false,      // Prevent POI clicks from interfering
    keyboardShortcuts: false,   // Focus on touch interaction
    fullscreenControl: false,   // Use our custom fullscreen (Google Maps redirect)
    streetViewControl: false,   // Use our custom street view button
    mapTypeControl: false       // Keep interface clean
  }
}

export default function GoogleMapClient({ address, name, city, id, className }: GoogleMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<GoogleMapError | null>(null)
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false)
  const [mapsUrl, setMapsUrl] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [streetViewUrl, setStreetViewUrl] = useState<string>('')
  const [locationContext, setLocationContext] = useState<string>('')

  // Only initialize after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Observe visibility to lazy-load Maps only when needed
  useEffect(() => {
    if (!mapRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(mapRef.current)
    return () => observer.disconnect()
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

  // Create coordinate-based Google Maps URL for external viewing
  const createMapsUrl = useCallback((coords: Coordinates, locationName?: string): string => {
    if (coords) {
      // Use exact coordinates for precise location linking
      const coordsUrl = `https://www.google.com/maps/@${coords.lat},${coords.lng},15z`
      return coordsUrl
    }
    // Fallback to text search if no coordinates available
    const searchQuery = buildGeocodingQuery(address, name, city)
    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`
    return fallbackUrl
  }, [address, name, city])

  // Create Street View URL for preview
  const createStreetViewUrl = useCallback((coords: Coordinates): string => {
    if (!coords) return ''
    return `https://www.google.com/maps/@${coords.lat},${coords.lng},3a,75y,90h,90t/data=!3m1!1e3`
  }, [])

  // Generate location context description
  const generateLocationContext = useCallback((coords: Coordinates, staticLocation?: any) => {
    if (!coords) return ''

    // If we have a static location with context
    if (staticLocation) {
      const contextMap: Record<string, string> = {
        'ubud': 'Cultural heart of Bali, surrounded by rice terraces and traditional villages',
        'canggu': 'Popular surf destination with black sand beaches and vibrant cafe culture',
        'seminyak': 'Upscale beach area known for luxury resorts, fine dining and sunset beaches',
        'sanur': 'Calm beach town perfect for families, with gentle waves and traditional charm',
        'uluwatu': 'Dramatic clifftop location with world-class surf breaks and stunning ocean views',
        'jimbaran': 'Peaceful bay area famous for fresh seafood and beautiful sunsets',
        'denpasar': 'Bustling capital city with authentic local markets and cultural sites'
      }

      const key = staticLocation.name.toLowerCase()
      for (const [locationKey, description] of Object.entries(contextMap)) {
        if (key.includes(locationKey)) {
          return description
        }
      }
    }

    // Calculate distances to major areas for context
    const distances = [
      { name: 'Ubud', coords: { lat: -8.5069, lng: 115.2625 } },
      { name: 'Canggu', coords: { lat: -8.6481, lng: 115.1253 } },
      { name: 'Seminyak', coords: { lat: -8.6914, lng: 115.1689 } }
    ].map(area => ({
      ...area,
      distance: calculateDistance(coords.lat, coords.lng, area.coords.lat, area.coords.lng)
    })).sort((a, b) => a.distance - b.distance)

    const nearest = distances[0]
    if (nearest.distance < 5) {
      return `Located in the ${nearest.name} area, ${Math.round(nearest.distance * 10) / 10}km from center`
    } else if (nearest.distance < 20) {
      return `${Math.round(nearest.distance)}km from ${nearest.name}, in a quieter part of Bali`
    } else {
      return `Located in a peaceful area of Bali, away from the main tourist centers`
    }
  }, [])

  // Initialize URLs once when component mounts
  useEffect(() => {
    const searchQuery = buildGeocodingQuery(address, name, city)
    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`
    setMapsUrl(fallbackUrl)
  }, [address, name, city, buildGeocodingQuery])

  // Load Google Maps API
  const loadGoogleMaps = useCallback(async () => {
    if (!isMounted || !hasValidApiKey || !isVisible) {
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`
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
  }, [apiKey, hasValidApiKey, isMounted, isVisible])

  // Get coordinates using smart geocoding service
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !isLoaded || !isMounted) {
      return
    }

    try {
      // Use the new geocoding service for intelligent coordinate resolution
      const geocodingResult: GeocodingResult = await getCoordinates({
        businessName: name || '',
        address: address || '',
        city: city || '',
        id: id
      })

      const location: Coordinates = geocodingResult.coordinates

      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Geocoding result:', {
          source: geocodingResult.source,
          fromCache: geocodingResult.fromCache,
          confidence: geocodingResult.confidence,
          coordinates: location,
          geocodedAddress: geocodingResult.geocodedAddress
        })
      }

      setCoordinates(location)

      // Determine if we're using a fallback location
      const isUsingFallback = geocodingResult.source === 'fallback' ||
                             geocodingResult.source === 'static_coordinates'
      setUsingFallbackLocation(isUsingFallback)

      // Update maps URL and preview data with exact coordinates
      const newMapsUrl = createMapsUrl(location, name)
      setMapsUrl(newMapsUrl)
      setStreetViewUrl(createStreetViewUrl(location))

      // Generate context based on source
      let contextDescription = ''
      if (geocodingResult.geocodedAddress) {
        contextDescription = `Located at: ${geocodingResult.geocodedAddress}`
      } else {
        contextDescription = generateLocationContext(location)
      }
      setLocationContext(contextDescription)

      // Smart zoom level calculation based on coordinate precision
      let zoomLevel = MAP_CONFIG.zoom.mobile_optimal // Default mobile-optimized zoom

      if (geocodingResult.source === 'google_geocoding') {
        if (geocodingResult.confidence && geocodingResult.confidence > 0.9) {
          zoomLevel = MAP_CONFIG.zoom.street_level // High confidence = street level
        } else if (geocodingResult.confidence && geocodingResult.confidence > 0.7) {
          zoomLevel = MAP_CONFIG.zoom.mobile_optimal // Good confidence = mobile optimal
        } else {
          zoomLevel = MAP_CONFIG.zoom.neighborhood // Lower confidence = wider view
        }
      } else if (geocodingResult.source === 'static_coordinates' || geocodingResult.source === 'database') {
        zoomLevel = MAP_CONFIG.zoom.neighborhood // Static coordinates = neighborhood level
      } else if (geocodingResult.source === 'fallback') {
        zoomLevel = MAP_CONFIG.zoom.area_level // Fallback = area level for context
      }

      createMap(location, zoomLevel)

    } catch (err) {
      console.error('Error initializing map with geocoding service:', err)

      // Final fallback if geocoding service fails entirely
      const fallbackLocation = { lat: -8.4095, lng: 115.1889 }
      setUsingFallbackLocation(true)
      setCoordinates(fallbackLocation)

      // Update maps URL and preview data with error fallback coordinates
      const newMapsUrl = createMapsUrl(fallbackLocation, 'Bali')
      setMapsUrl(newMapsUrl)
      setStreetViewUrl(createStreetViewUrl(fallbackLocation))
      setLocationContext('Located in beautiful Bali, Indonesia - tropical paradise island')

      createMap(fallbackLocation, MAP_CONFIG.zoom.withoutAddress)
    }
  }, [address, name, city, id, isLoaded, isMounted, createMapsUrl, createStreetViewUrl, generateLocationContext])

  // Create the map instance
  const createMap = useCallback((location: Coordinates, customZoom?: number) => {
    if (!mapRef.current || !window.google || !isMounted) return

    try {
      // Enhanced zoom level determination with mobile optimization
      const zoomLevel = customZoom ||
        (address && address.length > 10 ? MAP_CONFIG.zoom.street_level :
         address ? MAP_CONFIG.zoom.mobile_optimal :
         MAP_CONFIG.zoom.neighborhood)

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: zoomLevel,
        styles: MAP_CONFIG.styles,
        ...MAP_CONFIG.defaultOptions
      })

      // Create high-visibility marker for mobile
      const marker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: name,
        icon: {
          path: 'M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,7A2,2 0 0,1 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9A2,2 0 0,1 12,7Z', // Modern pin shape
          fillColor: '#FF4444',      // High-contrast red for visibility
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',    // White border for definition
          strokeWeight: 3,           // Thicker border
          scale: 1.8,                // Larger size for mobile visibility
          anchor: new window.google.maps.Point(12, 22), // Anchor at pin tip
          labelOrigin: new window.google.maps.Point(12, 9)
        },
        animation: window.google.maps.Animation.DROP, // Animated drop for attention
        zIndex: 1000 // Always on top
      })

      // Add a subtle pulsing circle around the marker for extra visibility
      const pulseCircle = new window.google.maps.Circle({
        strokeColor: '#FF4444',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#FF4444',
        fillOpacity: 0.1,
        map: map,
        center: location,
        radius: 50, // 50 meter radius
        zIndex: 999
      })

      // Add info window that shows on marker click
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="font-weight: 600; color: #5d4c42; margin-bottom: 4px;">${name}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${city}, Bali, Indonesia</div>
            <button onclick="window.open('${mapsUrl}', '_blank')"
                    style="background: #5d4c42; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Open in Google Maps
            </button>
          </div>
        `,
        maxWidth: 250
      })

      // Enhanced click handlers for better mobile UX
      marker.addListener('click', (event) => {
        // Prevent event from bubbling to map
        event.stop()
        infoWindow.open(map, marker)
        // Show preview modal for additional options after brief delay
        setTimeout(() => setShowPreview(true), 500)
      })

      // Click map background to show preview modal
      map.addListener('click', (event) => {
        // Close any open info windows and show preview
        infoWindow.close()
        setShowPreview(true)
      })

      // Add touch-friendly zoom gesture hints for mobile
      map.addListener('zoom_changed', () => {
        const currentZoom = map.getZoom()
        if (currentZoom < MAP_CONFIG.zoom.area_level) {
          // If zoomed out too far, show hint
          setTimeout(() => {
            const hint = document.createElement('div')
            hint.innerHTML = '📍 Zoom in to see exact location'
            hint.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:white;padding:8px 12px;border-radius:20px;font-size:12px;z-index:1000;pointer-events:none;'
            mapRef.current?.appendChild(hint)
            setTimeout(() => hint.remove(), 2000)
          }, 100)
        }
      })

      // Store references for cleanup
      mapInstanceRef.current = { map, marker, infoWindow, pulseCircle }

      // Store map reference (will be updated by marker creation)
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = { map }
      }
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
    if (isMounted && isVisible) {
      loadGoogleMaps()
    }
  }, [loadGoogleMaps, isMounted, isVisible])

  // Initialize map when loaded
  useEffect(() => {
    if (isLoaded && !error && isMounted && isVisible) {
      initializeMap()
    }
  }, [isLoaded, error, initializeMap, isMounted, isVisible])

  // Handle external link click
  const handleExternalClick = useCallback(() => {
    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
  }, [mapsUrl])

  // Handle preview modal
  const handlePreviewClick = useCallback(() => {
    setShowPreview(true)
  }, [])

  const handleClosePreview = useCallback(() => {
    setShowPreview(false)
  }, [])

  // Handle Street View click
  const handleStreetViewClick = useCallback(() => {
    if (streetViewUrl) {
      window.open(streetViewUrl, '_blank', 'noopener,noreferrer')
    }
  }, [streetViewUrl])

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

  // Enhanced fallback component with better mobile UX
  const FallbackMap = () => (
    <div className={`w-full h-[180px] flex flex-col items-center justify-center bg-gradient-to-br from-[#e6ceb3] via-[#dcc5a8] to-[#d4c1a1] rounded-lg text-[#5d4c42] relative overflow-hidden cursor-pointer hover:from-[#d4c1a1] hover:to-[#c4b091] transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] ${className}`}
         onClick={handlePreviewClick}
         role="button"
         tabIndex={0}
         onKeyDown={(e) => e.key === 'Enter' && handlePreviewClick()}
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
          <Eye className="w-3 h-3" aria-hidden="true" />
          Click to preview location
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
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-[#5d4c42]">Location</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewClick}
              className="text-xs text-[#5d4c42] hover:text-[#a39188] flex items-center gap-1 transition-colors touch-manipulation"
              aria-label={`Preview ${name} location`}
            >
              <Eye className="w-3 h-3" aria-hidden="true" />
              Preview
            </button>
            <button
              onClick={handleExternalClick}
              className="text-xs text-[#5d4c42] hover:text-[#a39188] flex items-center gap-1 transition-colors touch-manipulation"
              aria-label={`Open ${name} in Google Maps`}
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
              Open in Maps
            </button>
          </div>
        </div>
        <FallbackMap />

        {/* Enhanced Location Preview Modal for Fallback */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClosePreview}>
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-lg text-[#5d4c42]">{name}</h3>
                  <p className="text-sm text-[#5d4c42]/70">{city}, Bali, Indonesia</p>
                </div>
                <button
                  onClick={handleClosePreview}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5 text-[#5d4c42]" />
                </button>
              </div>

              {/* Location Context */}
              <div className="p-4 bg-gradient-to-r from-[#e6ceb3]/20 to-[#dcc5a8]/20">
                <p className="text-sm text-[#5d4c42] leading-relaxed">
                  🌴 Located in beautiful Bali, Indonesia - tropical paradise island known for its spiritual energy and stunning landscapes
                </p>
              </div>

              {/* Interactive Buttons */}
              <div className="p-4 space-y-3">
                {/* Google Maps Button */}
                <button
                  onClick={handleExternalClick}
                  className="w-full flex items-center justify-center gap-3 bg-[#5d4c42] text-white py-3 px-4 rounded-xl hover:bg-[#4a3e36] transition-colors font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                  <ExternalLink className="w-4 h-4" />
                </button>

                {/* API Key Note */}
                {error?.code === 'NO_API_KEY' && (
                  <div className="text-xs text-[#5d4c42]/60 text-center pt-2 border-t border-gray-100">
                    Interactive map features available with Google Maps API
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="p-4 bg-gray-50 text-xs text-[#5d4c42]/70">
                💡 <strong>Tip:</strong> Click "Open in Google Maps" to see the exact location, get directions, and explore the area
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-[#5d4c42]">Location</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviewClick}
            className="text-xs text-[#5d4c42] hover:text-[#a39188] flex items-center gap-1 transition-colors touch-manipulation"
            aria-label={`Preview ${name} location`}
          >
            <Eye className="w-3 h-3" aria-hidden="true" />
            Preview
          </button>
          <button
            onClick={handleExternalClick}
            className="text-xs text-[#5d4c42] hover:text-[#a39188] flex items-center gap-1 transition-colors touch-manipulation"
            aria-label={`Open ${name} in Google Maps`}
          >
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
            Open in Maps
          </button>
        </div>
      </div>
      
      <div className={`relative w-full h-[180px] rounded-lg overflow-hidden border border-[#e6ceb3] bg-[#f5f5f5] shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
        {/* Tap hint overlay for better UX */}
        <div className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-sm text-[#5d4c42] text-xs px-2 py-1 rounded-full shadow-sm opacity-80 hover:opacity-100 transition-opacity pointer-events-none">
          📍 Tap to explore
        </div>
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
      
      {/* Enhanced location context with visual feedback */}
      <div className="mt-2 space-y-1">
        <div className="text-xs text-[#5d4c42]/60 text-center">
          {usingFallbackLocation ? (
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              Showing general area - tap for precise location
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Exact location • Tap map for directions
            </div>
          )}
        </div>

        {/* Location confidence indicator */}
        {coordinates && (
          <div className="flex items-center justify-center text-xs text-[#5d4c42]/50">
            {locationContext && (
              <span className="truncate max-w-[200px]">{locationContext}</span>
            )}
            {process.env.NODE_ENV === 'development' && (
              <span className="ml-2 font-mono text-[10px]">
                ({coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Location Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClosePreview}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-lg text-[#5d4c42]">{name}</h3>
                <p className="text-sm text-[#5d4c42]/70">{city}, Bali, Indonesia</p>
              </div>
              <button
                onClick={handleClosePreview}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-[#5d4c42]" />
              </button>
            </div>

            {/* Location Context */}
            {locationContext && (
              <div className="p-4 bg-gradient-to-r from-[#e6ceb3]/20 to-[#dcc5a8]/20">
                <p className="text-sm text-[#5d4c42] leading-relaxed">
                  🌴 {locationContext}
                </p>
              </div>
            )}

            {/* Interactive Buttons */}
            <div className="p-4 space-y-3">
              {/* Google Maps Button */}
              <button
                onClick={handleExternalClick}
                className="w-full flex items-center justify-center gap-3 bg-[#5d4c42] text-white py-3 px-4 rounded-xl hover:bg-[#4a3e36] transition-colors font-medium"
              >
                <Navigation className="w-4 h-4" />
                Open in Google Maps
                <ExternalLink className="w-4 h-4" />
              </button>

              {/* Street View Button */}
              {streetViewUrl && (
                <button
                  onClick={handleStreetViewClick}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  <Maximize2 className="w-4 h-4" />
                  View Street Level
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              {/* Coordinates Info (Development) */}
              {coordinates && process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-[#5d4c42]/60 text-center pt-2 border-t border-gray-100">
                  Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="p-4 bg-gray-50 text-xs text-[#5d4c42]/70">
              💡 <strong>Tip:</strong> Use Street View to see the actual entrance and surroundings before visiting
            </div>
          </div>
        </div>
      )}
    </div>
  )
}