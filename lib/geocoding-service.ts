/**
 * Geocoding Service for Cached Coordinate Management
 * Provides intelligent coordinate resolution with database caching
 */

import { createClient } from '@supabase/supabase-js'
import { findBaliCoordinates } from '@/lib/bali-coordinates'
import type { DatabaseStudio, DatabaseRetreat } from '@/lib/types'

// Environment configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interfaces
export interface Coordinates {
  lat: number
  lng: number
}

export interface GeocodingResult {
  coordinates: Coordinates
  geocodedAddress?: string
  confidence?: number
  source: 'database' | 'google_geocoding' | 'static_coordinates' | 'fallback'
  fromCache: boolean
  updatedAt?: string
}

export interface LocationData {
  businessName: string
  address?: string
  city?: string
  id?: string
}

/**
 * Main geocoding service class
 */
export class GeocodingService {
  private static instance: GeocodingService

  static getInstance(): GeocodingService {
    if (!GeocodingService.instance) {
      GeocodingService.instance = new GeocodingService()
    }
    return GeocodingService.instance
  }

  /**
   * Get coordinates with intelligent caching and fallback
   */
  async getCoordinates(location: LocationData): Promise<GeocodingResult> {
    const { businessName, address, city, id } = location

    try {
      // 1. First check database cache if we have an ID
      if (id) {
        const cachedResult = await this.getCachedCoordinates(id)
        if (cachedResult) {
          const shouldRefresh = this.shouldRefreshCache(
            cachedResult.geocoding_confidence,
            cachedResult.coordinates_updated_at
          )
          if (!shouldRefresh) {
            return {
              coordinates: { lat: cachedResult.latitude, lng: cachedResult.longitude },
              geocodedAddress: cachedResult.geocoded_address,
              confidence: cachedResult.geocoding_confidence,
              source: (cachedResult.coordinates_source as GeocodingResult['source']) || 'database',
              fromCache: true,
              updatedAt: cachedResult.coordinates_updated_at
            }
          }
          // If refresh is needed, we still return cached immediately for UX,
          // and fire-and-forget an async refresh to update the DB
          ;(async () => {
            if (address && address.length > 5 && googleMapsApiKey) {
              const refreshed = await this.geocodeWithGoogle(businessName, address, city)
              if (refreshed) {
                await this.cacheCoordinates(id, { ...refreshed, fromCache: false })
              }
            }
          })().catch(() => {})
          return {
            coordinates: { lat: cachedResult.latitude, lng: cachedResult.longitude },
            geocodedAddress: cachedResult.geocoded_address,
            confidence: cachedResult.geocoding_confidence,
            source: (cachedResult.coordinates_source as GeocodingResult['source']) || 'database',
            fromCache: true,
            updatedAt: cachedResult.coordinates_updated_at
          }
        }
      }

      // 2. Try Google Geocoding API for detailed address
      if (address && address.length > 5 && googleMapsApiKey) {
        const geocodingResult = await this.geocodeWithGoogle(businessName, address, city)
        if (geocodingResult) {
          const result = {
            ...geocodingResult,
            fromCache: false
          }
          // Cache the result if we have an ID
          if (id) {
            await this.cacheCoordinates(id, result)
          }
          return result
        }
      }

      // 3. Fall back to static Bali coordinates
      const staticLocation = findBaliCoordinates(address || '', businessName, city || '')
      if (staticLocation) {
        const result: GeocodingResult = {
          coordinates: { lat: staticLocation.lat, lng: staticLocation.lng },
          geocodedAddress: `${staticLocation.name}, Bali, Indonesia`,
          confidence: 0.8,
          source: 'static_coordinates',
          fromCache: false
        }

        // Cache the static result if we have an ID
        if (id) {
          await this.cacheCoordinates(id, result)
        }

        return result
      }

      // 4. Final fallback to Bali center
      const fallbackResult: GeocodingResult = {
        coordinates: { lat: -8.4095, lng: 115.1889 },
        geocodedAddress: 'Bali, Indonesia',
        confidence: 0.5,
        source: 'fallback',
        fromCache: false
      }

      // Cache the fallback if we have an ID
      if (id) {
        await this.cacheCoordinates(id, fallbackResult)
      }

      return fallbackResult

    } catch (error) {
      console.error('Error in getCoordinates:', error)

      // Return fallback on any error
      return {
        coordinates: { lat: -8.4095, lng: 115.1889 },
        geocodedAddress: 'Bali, Indonesia',
        confidence: 0.5,
        source: 'fallback',
        fromCache: false
      }
    }
  }

  /**
   * Get cached coordinates from database
   */
  private async getCachedCoordinates(id: string): Promise<{
    latitude: number
    longitude: number
    geocoded_address?: string
    geocoding_confidence?: number
    coordinates_source?: string
    coordinates_updated_at?: string
  } | null> {
    try {
      const { data, error } = await supabase
        .from('v3_bali_yoga_studios_and_retreats')
        .select('latitude, longitude, geocoded_address, geocoding_confidence, coordinates_source, coordinates_updated_at')
        .eq('id', id)
        .single()

      if (error || !data || !data.latitude || !data.longitude) {
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching cached coordinates:', error)
      return null
    }
  }

  /**
   * Cache coordinates in database
   */
  private async cacheCoordinates(id: string, result: GeocodingResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('v3_bali_yoga_studios_and_retreats')
        .update({
          latitude: result.coordinates.lat,
          longitude: result.coordinates.lng,
          geocoded_address: result.geocodedAddress,
          geocoding_confidence: result.confidence,
          coordinates_source: result.source,
          coordinates_updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error caching coordinates:', error)
      }
    } catch (error) {
      console.error('Error in cacheCoordinates:', error)
    }
  }

  /**
   * Geocode using Google Maps Geocoding API
   */
  private async geocodeWithGoogle(
    businessName: string,
    address: string,
    city?: string
  ): Promise<Omit<GeocodingResult, 'fromCache'> | null> {
    if (!googleMapsApiKey) {
      return null
    }

    try {
      // Build detailed query
      const query = this.buildGeocodingQuery(businessName, address, city)
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleMapsApiKey}&components=country:ID` // Restrict to Indonesia

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0]
        const location = result.geometry.location

        return {
          coordinates: { lat: location.lat, lng: location.lng },
          geocodedAddress: result.formatted_address,
          confidence: this.calculateConfidence(result),
          source: 'google_geocoding'
        }
      }

      return null
    } catch (error) {
      console.error('Error with Google Geocoding API:', error)
      return null
    }
  }

  /**
   * Build optimized geocoding query
   */
  private buildGeocodingQuery(businessName: string, address: string, city?: string): string {
    // Start with business name and address
    let query = `${businessName}, ${address}`

    // Add city if provided
    if (city) {
      query += `, ${city}`
    }

    // Always include Bali, Indonesia for context
    query += ', Bali, Indonesia'

    return query
  }

  /**
   * Decide whether cached coordinates should be refreshed
   */
  private shouldRefreshCache(confidence?: number, updatedAt?: string): boolean {
    const minConfidence = 0.78
    if (typeof confidence === 'number' && confidence < minConfidence) return true
    if (!updatedAt) return false
    try {
      const last = new Date(updatedAt).getTime()
      if (Number.isNaN(last)) return false
      const ageDays = (Date.now() - last) / (1000 * 60 * 60 * 24)
      return ageDays > 180 // refresh after ~6 months
    } catch {
      return false
    }
  }

  /**
   * Calculate confidence based on Google's response
   */
  private calculateConfidence(result: any): number {
    // Start with base confidence
    let confidence = 0.7

    // Higher confidence for exact matches
    if (result.geometry.location_type === 'ROOFTOP') {
      confidence = 0.95
    } else if (result.geometry.location_type === 'RANGE_INTERPOLATED') {
      confidence = 0.9
    } else if (result.geometry.location_type === 'GEOMETRIC_CENTER') {
      confidence = 0.8
    }

    // Boost confidence for establishment results
    const types = result.types || []
    if (types.includes('establishment') || types.includes('point_of_interest')) {
      confidence = Math.min(confidence + 0.1, 1.0)
    }

    return Math.round(confidence * 100) / 100 // Round to 2 decimal places
  }

  /**
   * Batch geocode multiple locations (for scripts)
   */
  async batchGeocode(
    locations: LocationData[],
    onProgress?: (completed: number, total: number, current: LocationData) => void
  ): Promise<Array<{ id: string; result: GeocodingResult | null }>> {
    const results: Array<{ id: string; result: GeocodingResult | null }> = []

    for (let i = 0; i < locations.length; i++) {
      const location = locations[i]

      if (onProgress) {
        onProgress(i, locations.length, location)
      }

      try {
        const result = await this.getCoordinates(location)
        results.push({ id: location.id!, result })

        // Rate limiting for Google API - wait 100ms between requests
        if (result.source === 'google_geocoding') {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error(`Error geocoding ${location.businessName}:`, error)
        results.push({ id: location.id!, result: null })
      }
    }

    return results
  }

  /**
   * Get statistics about cached coordinates
   */
  async getCacheStats(): Promise<{
    total: number
    cached: number
    uncached: number
    sources: Record<string, number>
  }> {
    try {
      const { data, error } = await supabase
        .from('v3_bali_yoga_studios_and_retreats')
        .select('coordinates_source')

      if (error) {
        throw error
      }

      const total = data.length
      const cached = data.filter(item => item.coordinates_source).length
      const uncached = total - cached

      const sources: Record<string, number> = {}
      data.forEach(item => {
        if (item.coordinates_source) {
          sources[item.coordinates_source] = (sources[item.coordinates_source] || 0) + 1
        }
      })

      return { total, cached, uncached, sources }
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return { total: 0, cached: 0, uncached: 0, sources: {} }
    }
  }
}

// Export singleton instance
export const geocodingService = GeocodingService.getInstance()

// Convenience functions
export const getCoordinates = (location: LocationData): Promise<GeocodingResult> =>
  geocodingService.getCoordinates(location)

export const getCacheStats = () =>
  geocodingService.getCacheStats()