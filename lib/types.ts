// Core data types with comprehensive TypeScript definitions

export interface BaseItem {
  id: string
  name: string
  slug: string
  location: string
  rating: number
  reviewCount: number
  image?: string
  images: string[]
  business_description: string
  phone_number?: string
  website?: string
  location_details: {
    address: string
    area: string
  }
  category: string
  // Social Media Fields
  instagram_url?: string
  instagram_handle?: string
  facebook_url?: string
  tiktok_url?: string
  youtube_url?: string
  whatsapp_number?: string
  createdAt?: string
  updatedAt?: string
}

export interface Studio extends BaseItem {
  type: 'studio'
  styles: string[]
  amenities: string[]
  languages_spoken: string[]
  drop_in_price_usd?: number
  price_range: string
  opening_hours: OpeningHours[]
  locationSlug: string
  typeSlug: string
  urlPath: string
}

export interface Retreat extends BaseItem {
  type: 'retreat'
  duration: string
  price: string
  start_date?: string
  end_date?: string
  max_participants?: number
  accommodation_type?: string
  meals_included?: boolean
  transportation_included?: boolean
  certification_offered?: boolean
  level_requirements?: string[]
}

export interface OpeningHours {
  day: string
  open: string
  close: string
  closed?: boolean
}

// Database row types (matching Supabase schema)
export interface DatabaseStudio {
  id: string
  name: string
  city?: string
  address?: string
  phone_number?: string
  website?: string
  business_description?: string
  images?: string[] | null
  yoga_styles?: string[] | null
  amenities?: string[] | null
  languages_spoken?: string[] | null
  review_score?: number
  review_count?: number
  drop_in_price_usd?: number
  price_range?: string
  opening_hours?: OpeningHours[] | null
  category_name?: string
  // Social Media Fields
  instagram_url?: string
  instagram_handle?: string
  facebook_url?: string
  tiktok_url?: string
  youtube_url?: string
  whatsapp_number?: string
  created_at?: string
  updated_at?: string
}

export interface DatabaseRetreat {
  id: string
  name: string
  city?: string
  address?: string
  phone_number?: string
  website?: string
  business_description?: string
  images?: string[] | null
  review_score?: number
  review_count?: number
  duration?: string
  price_range?: string
  start_date?: string
  end_date?: string
  max_participants?: number
  accommodation_type?: string
  meals_included?: boolean
  transportation_included?: boolean
  certification_offered?: boolean
  level_requirements?: string[] | null
  category_name?: string
  // Social Media Fields
  instagram_url?: string
  instagram_handle?: string
  facebook_url?: string
  tiktok_url?: string
  youtube_url?: string
  whatsapp_number?: string
  created_at?: string
  updated_at?: string
}

// Featured content types
export interface FeaturedListing {
  id: string
  item_id: string
  item_type: 'studio' | 'retreat'
  item_data: Studio | Retreat
  priority: number
  is_eligible: boolean
  is_manually_featured: boolean
  last_featured_at?: string
  featured_count: number
  created_at: string
  updated_at: string
}

export interface WeeklyFeaturedRotation {
  id: string
  week_start_date: string
  week_end_date: string
  featured_studios: string[]
  featured_retreats: string[]
  rotation_algorithm: string
  created_at: string
}

export interface CurrentWeeklyFeatured {
  week_start: string
  week_end: string
  featured_studios: string[]
  featured_retreats: string[]
  studios_data: Studio[]
  retreats_data: Retreat[]
}

// Review types
export interface Review {
  id: string
  item_id: string
  item_type: 'studio' | 'retreat'
  author_name: string
  author_email?: string
  rating: number
  title: string
  content: string
  is_verified: boolean
  is_moderated: boolean
  helpful_count: number
  created_at: string
  updated_at: string
}

// Blog types
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  published_date: string
  featured_image?: string
  tags: string[]
  category: string
  meta_description?: string
  read_time: number
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

// Location and search types
export interface LocationFilter {
  slug: string
  name: string
  count: number
}

export interface SearchFilters {
  query?: string
  location?: string
  type?: string
  styles?: string[]
  rating?: number
  reviews?: number
  priceRange?: string
  amenities?: string[]
  hasImages?: boolean
}

export interface SearchResult<T = Studio | Retreat> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  filters: SearchFilters
}

// Map and geolocation types
export interface Coordinates {
  lat: number
  lng: number
}

export interface MapMarker {
  id: string
  position: Coordinates
  title: string
  type: 'studio' | 'retreat'
  slug: string
}

// API response types
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  success: boolean
  message?: string
}

// Error types
export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Cache types
export interface CacheConfig {
  ttl: number
  revalidate?: number
  tags?: string[]
}

export interface CachedData<T = any> {
  data: T
  timestamp: number
  ttl: number
  tags?: string[]
}

// Analytics types
export interface AnalyticsEvent {
  name: string
  category: string
  action: string
  label?: string
  value?: number
  customParameters?: Record<string, any>
}

export interface PageViewData {
  path: string
  title: string
  timestamp: string
  userAgent?: string
  referrer?: string
}

// Form and validation types
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface FormState<T = any> {
  data: T
  errors: ValidationError[]
  isSubmitting: boolean
  isValid: boolean
}

// Utility types
export type ItemType = 'studio' | 'retreat'
export type SortOrder = 'asc' | 'desc'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Component prop types
export interface BaseCardProps {
  id: string
  name: string
  slug: string
  image?: string
  location: string
  rating: number
  reviewCount: number
  type: ItemType
  featured?: boolean
  className?: string
  onClick?: () => void
}

export interface StudioCardProps extends BaseCardProps {
  type: 'studio'
  styles: string[]
  phone_number?: string
  website?: string
}

export interface RetreatCardProps extends BaseCardProps {
  type: 'retreat'
  duration: string
  price: string
  phone_number?: string
  website?: string
}

// Export a union type for easy use
export type CardProps = StudioCardProps | RetreatCardProps

// Supabase specific types
export interface SupabaseResponse<T = any> {
  data: T | null
  error: {
    message: string
    code?: string
    details?: string
    hint?: string
  } | null
}

export interface SupabaseTable {
  id: string
  created_at: string
  updated_at?: string
}