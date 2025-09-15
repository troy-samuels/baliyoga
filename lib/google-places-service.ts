/**
 * Google Places API Service for finding authentic yoga studio images
 * Complies with CLAUDE.md: error handling, performance optimization, mobile-first
 */

interface PlacePhoto {
  photo_reference: string
  height: number
  width: number
  html_attributions: string[]
}

interface PlaceDetails {
  place_id: string
  name: string
  photos?: PlacePhoto[]
  rating?: number
  user_ratings_total?: number
  types: string[]
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  website?: string
  formatted_phone_number?: string
  formatted_address?: string
  editorial_summary?: {
    overview?: string
  }
  opening_hours?: {
    periods: any[]
  }
}

interface PlaceSearchResult {
  place_id: string
  name: string
  rating?: number
  user_ratings_total?: number
  photos?: PlacePhoto[]
  types: string[]
}

interface YogaImageCandidate {
  imageUrl: string
  width: number
  height: number
  confidence: 'high' | 'medium' | 'low'
  source: 'google_places'
  metadata: {
    placeName: string
    placeId: string
    attribution: string
  }
}

interface SocialMediaExtraction {
  instagram_url?: string
  instagram_handle?: string
  facebook_url?: string
  tiktok_url?: string
  youtube_url?: string
  source: 'google_places'
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Google Places API client for yoga studio image discovery
 */
export class GooglePlacesYogaService {
  private apiKey: string
  private baseUrl = 'https://maps.googleapis.com/maps/api/place'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY!
    
    if (!this.apiKey || this.apiKey === 'your_google_maps_api_key_here') {
      throw new Error('Google Places API key not configured. Please set NEXT_PUBLIC_GOOGLE_PLACES_API_KEY in environment.')
    }
  }

  /**
   * Search for yoga studios by name and location
   */
  async searchYogaStudio(studioName: string, location: string): Promise<PlaceSearchResult[]> {
    try {
      // Clean and prepare search query
      const query = `${studioName} yoga ${location} bali`
      const searchUrl = `${this.baseUrl}/textsearch/json`
      
      const params = new URLSearchParams({
        query,
        key: this.apiKey,
        type: 'gym', // Yoga studios are often categorized as gyms in Google
        fields: 'place_id,name,rating,user_ratings_total,photos,types,geometry'
      })

      const response = await fetch(`${searchUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API status: ${data.status}`)
      }

      // Filter results to focus on yoga-related places
      const yogaResults = (data.results || []).filter((place: any) =>
        this.isYogaRelated(place.name, place.types || [])
      )

      return yogaResults.map((place: any) => ({
        place_id: place.place_id,
        name: place.name,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        photos: place.photos || [],
        types: place.types || []
      }))

    } catch (error) {
      console.error('Error searching for yoga studio:', error)
      return []
    }
  }

  /**
   * Get detailed information and photos for a place
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const detailsUrl = `${this.baseUrl}/details/json`
      
      const params = new URLSearchParams({
        place_id: placeId,
        key: this.apiKey,
        fields: 'place_id,name,photos,rating,user_ratings_total,types,geometry,website,formatted_phone_number,formatted_address,editorial_summary,opening_hours'
      })

      const response = await fetch(`${detailsUrl}?${params}`)
      
      if (!response.ok) {
        throw new Error(`Google Places Details API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.status !== 'OK') {
        throw new Error(`Google Places Details API status: ${data.status}`)
      }

      return data.result

    } catch (error) {
      console.error('Error fetching place details:', error)
      return null
    }
  }

  /**
   * Get authentic yoga images from a place
   */
  async getAuthenticYogaImages(studioName: string, location: string, maxImages = 3): Promise<YogaImageCandidate[]> {
    try {
      console.log(`🔍 Searching for authentic yoga images: ${studioName} in ${location}`)

      // Step 1: Search for the studio
      const searchResults = await this.searchYogaStudio(studioName, location)
      
      if (searchResults.length === 0) {
        console.log(`❌ No places found for ${studioName}`)
        return []
      }

      const candidates: YogaImageCandidate[] = []

      // Step 2: Get photos from each relevant result
      for (const place of searchResults.slice(0, 2)) { // Limit to top 2 results
        const placeDetails = await this.getPlaceDetails(place.place_id)
        
        if (!placeDetails?.photos) continue

        // Step 3: Process photos and filter for yoga authenticity
        for (const photo of placeDetails.photos.slice(0, maxImages)) {
          const imageUrl = this.getPhotoUrl(photo.photo_reference, 800, 600) // Optimized size for web
          
          if (imageUrl) {
            candidates.push({
              imageUrl,
              width: photo.width,
              height: photo.height,
              confidence: this.assessYogaImageConfidence(place.name, place.types),
              source: 'google_places',
              metadata: {
                placeName: place.name,
                placeId: place.place_id,
                attribution: photo.html_attributions?.[0] || 'Google'
              }
            })
          }
        }

        // Add small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Step 4: Sort by confidence and return best candidates
      return candidates
        .sort((a, b) => {
          const confidenceOrder = { high: 3, medium: 2, low: 1 }
          return confidenceOrder[b.confidence] - confidenceOrder[a.confidence]
        })
        .slice(0, maxImages)

    } catch (error) {
      console.error('Error getting authentic yoga images:', error)
      return []
    }
  }

  /**
   * Generate photo URL from photo reference
   */
  private getPhotoUrl(photoReference: string, maxWidth = 800, maxHeight = 600): string | null {
    if (!photoReference) return null

    const params = new URLSearchParams({
      photo_reference: photoReference,
      maxwidth: maxWidth.toString(),
      maxheight: maxHeight.toString(),
      key: this.apiKey
    })

    return `${this.baseUrl}/photo?${params}`
  }

  /**
   * Check if a place is yoga-related
   */
  private isYogaRelated(name: string, types: string[]): boolean {
    const nameWords = name.toLowerCase()
    const yogaKeywords = ['yoga', 'pilates', 'meditation', 'wellness', 'retreat', 'studio']
    
    // Check name contains yoga keywords
    const hasYogaInName = yogaKeywords.some(keyword => nameWords.includes(keyword))
    
    // Check types
    const relevantTypes = [
      'gym', 
      'health', 
      'spa', 
      'establishment',
      'point_of_interest'
    ]
    const hasRelevantType = types.some(type => relevantTypes.includes(type))

    return hasYogaInName && hasRelevantType
  }

  /**
   * Assess confidence level for yoga authenticity
   */
  private assessYogaImageConfidence(placeName: string, types: string[]): 'high' | 'medium' | 'low' {
    const nameWords = placeName.toLowerCase()
    
    // High confidence: name clearly indicates yoga
    if (nameWords.includes('yoga studio') || 
        nameWords.includes('yoga center') || 
        nameWords.includes('yoga shala') ||
        nameWords.includes('yoga barn')) {
      return 'high'
    }
    
    // Medium confidence: has yoga in name
    if (nameWords.includes('yoga') || 
        nameWords.includes('pilates') ||
        nameWords.includes('meditation')) {
      return 'medium'
    }
    
    // Low confidence: wellness/spa that might have yoga
    return 'low'
  }

  /**
   * Validate that an image URL is accessible
   */
  async validateImageUrl(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch(imageUrl, { 
        method: 'HEAD',
        timeout: 5000 // 5 second timeout
      })
      
      return response.ok && response.headers.get('content-type')?.startsWith('image/')
      
    } catch (error) {
      console.warn('Image validation failed:', imageUrl, error)
      return false
    }
  }

  /**
   * Download and process image for storage
   */
  async downloadImage(imageUrl: string): Promise<Buffer | null> {
    try {
      const response = await fetch(imageUrl, {
        timeout: 10000 // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`Image download failed: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.startsWith('image/')) {
        throw new Error('Response is not an image')
      }

      return Buffer.from(await response.arrayBuffer())

    } catch (error) {
      console.error('Error downloading image:', imageUrl, error)
      return null
    }
  }

  /**
   * Extract social media information from Google Places data
   */
  async extractSocialMediaFromPlaces(studioName: string, location: string): Promise<SocialMediaExtraction | null> {
    try {
      console.log(`🔍 Searching Google Places for social media: ${studioName} in ${location}`)

      // Step 1: Search for the studio
      const searchResults = await this.searchYogaStudio(studioName, location)
      
      if (searchResults.length === 0) {
        console.log(`❌ No Google Places results found for ${studioName}`)
        return null
      }

      // Step 2: Get detailed information from the best match
      const bestMatch = searchResults[0]
      const placeDetails = await this.getPlaceDetails(bestMatch.place_id)
      
      if (!placeDetails) {
        console.log(`❌ Could not retrieve place details for ${studioName}`)
        return null
      }

      const socialMedia: SocialMediaExtraction = {
        source: 'google_places',
        confidence: 'medium' // Google Places data is generally reliable but may not be complete
      }

      // Google Places doesn't directly provide social media URLs in most cases
      // But we can extract social media from the website if provided
      if (placeDetails.website) {
        try {
          // Import the extraction function here to avoid circular dependency
          const { extractSocialMediaFromHTML, normalizeSocialMediaUrls } = await import('./social-media-utils')
          
          // Fetch the website content and extract social media
          const response = await fetch(placeDetails.website, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: AbortSignal.timeout(5000)
          })

          if (response.ok) {
            const html = await response.text()
            const extracted = extractSocialMediaFromHTML(html)
            const normalized = normalizeSocialMediaUrls(extracted)

            if (normalized.instagram_url) socialMedia.instagram_url = normalized.instagram_url
            if (normalized.instagram_handle) socialMedia.instagram_handle = normalized.instagram_handle
            if (normalized.facebook_url) socialMedia.facebook_url = normalized.facebook_url
            if (normalized.tiktok_url) socialMedia.tiktok_url = normalized.tiktok_url
            if (normalized.youtube_url) socialMedia.youtube_url = normalized.youtube_url

            console.log(`✅ Extracted social media from ${placeDetails.website}`)
          }
        } catch (error) {
          console.log(`⚠️ Could not extract social media from website: ${error}`)
        }
      }

      // Check if we found any social media
      const foundAny = socialMedia.instagram_url || socialMedia.facebook_url || 
                      socialMedia.tiktok_url || socialMedia.youtube_url

      return foundAny ? socialMedia : null

    } catch (error) {
      console.error('Error extracting social media from Google Places:', error)
      return null
    }
  }

  /**
   * Get comprehensive social media data for a yoga studio
   */
  async getSocialMediaForStudio(studioName: string, location: string): Promise<SocialMediaExtraction | null> {
    return await this.extractSocialMediaFromPlaces(studioName, location)
  }
}

/**
 * Helper function to create service instance
 */
export function createGooglePlacesService(): GooglePlacesYogaService | null {
  try {
    return new GooglePlacesYogaService()
  } catch (error) {
    console.error('Failed to create Google Places service:', error)
    return null
  }
}