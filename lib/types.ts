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
  // Geocoding fields
  latitude?: number
  longitude?: number
  geocoded_address?: string
  geocoding_confidence?: number
  coordinates_source?: 'google_geocoding' | 'static_coordinates' | 'manual_entry'
  coordinates_updated_at?: string
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
  // Geocoding fields
  latitude?: number
  longitude?: number
  geocoded_address?: string
  geocoding_confidence?: number
  coordinates_source?: 'google_geocoding' | 'static_coordinates' | 'manual_entry'
  coordinates_updated_at?: string
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

// Subscription types for studio revenue model
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price_usd: number
  price_idr: number
  billing_cycle: 'monthly' | 'yearly'
  features: SubscriptionFeature[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionFeature {
  id: string
  name: string
  description: string
  category: 'listing' | 'analytics' | 'marketing' | 'support' | 'integration'
  is_premium: boolean
}

export interface StudioSubscription {
  id: string
  studio_id: string
  plan_id: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  stripe_subscription_id?: string
  payment_method?: PaymentMethod
  trial_ends_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
}

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'incomplete'

export interface PaymentMethod {
  type: 'card' | 'bank_transfer' | 'e_wallet'
  last_digits?: string
  brand?: string
  country?: string
}

export interface SubscriptionAnalytics {
  studio_id: string
  period_start: string
  period_end: string
  profile_views: number
  contact_clicks: number
  website_clicks: number
  phone_clicks: number
  search_appearances: number
  search_position_avg: number
  booking_inquiries: number
  conversion_rate: number
  top_keywords: string[]
  created_at: string
}

export interface StudioDashboardData {
  subscription: StudioSubscription | null
  analytics: SubscriptionAnalytics
  profile_completion: number
  recent_activities: DashboardActivity[]
  notifications: DashboardNotification[]
}

export interface DashboardActivity {
  id: string
  type: 'profile_view' | 'contact_click' | 'booking_inquiry' | 'review_received'
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface DashboardNotification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  action_url?: string
  action_text?: string
  is_read: boolean
  created_at: string
}

// Revenue tracking types
export interface BookingTransaction {
  id: string
  studio_id: string
  customer_email: string
  service_type: 'drop_in' | 'package' | 'retreat' | 'teacher_training'
  amount_usd: number
  commission_rate: number
  commission_amount: number
  platform_fee: number
  studio_payout: number
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  booking_date: string
  service_date: string
  created_at: string
}

export interface MonthlyRevenueSummary {
  month: string
  year: number
  subscription_revenue: number
  commission_revenue: number
  service_revenue: number
  total_revenue: number
  active_subscribers: number
  new_subscribers: number
  churned_subscribers: number
  total_bookings: number
  average_booking_value: number
}

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

// Affiliate tracking types for retreat marketplace transformation
export interface AffiliatePartner {
  id: string
  name: string
  slug: string
  description: string
  website_url: string
  affiliate_url_template: string
  commission_rate: number
  cookie_duration_days: number
  conversion_tracking_enabled: boolean
  api_integration_enabled: boolean
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export interface AffiliateClick {
  id: string
  user_session_id?: string
  affiliate_partner_id: string
  retreat_id: string
  referrer_url?: string
  user_agent?: string
  ip_address?: string
  country_code?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  clicked_at: string
}

export interface AffiliateConversion {
  id: string
  click_id: string
  affiliate_partner_id: string
  retreat_id: string
  conversion_type: 'booking' | 'inquiry' | 'signup' | 'purchase'
  conversion_value: number
  commission_amount: number
  currency: string
  external_booking_id?: string
  customer_email?: string
  booking_date?: string
  retreat_start_date?: string
  retreat_duration_days?: number
  participants_count?: number
  converted_at: string
  verified_at?: string
  status: 'pending' | 'confirmed' | 'rejected' | 'paid'
}

export interface AffiliateLink {
  retreat_id: string
  partner_id: string
  tracking_url: string
  utm_parameters: Record<string, string>
  click_count: number
  conversion_count: number
  revenue_generated: number
  last_clicked_at?: string
  created_at: string
  updated_at: string
}

// Enhanced retreat types for affiliate marketplace
export interface EnhancedRetreat extends Retreat {
  affiliate_enabled: boolean
  affiliate_partners: AffiliatePartner[]
  primary_booking_url?: string
  secondary_booking_urls?: string[]
  commission_rate_override?: number
  min_booking_value?: number
  availability_status: 'available' | 'limited' | 'sold_out' | 'not_available'
  early_bird_discount?: {
    percentage: number
    valid_until: string
  }
  seasonal_pricing?: {
    high_season_multiplier: number
    low_season_multiplier: number
  }
}

export interface RetreatBookingData {
  retreat_id: string
  partner_name: string
  booking_url: string
  price_range: string
  availability: 'available' | 'limited' | 'sold_out'
  commission_rate: number
  special_offers?: string[]
  last_updated: string
}

// Feature flags for gradual rollout
export interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  enabled: boolean
  rollout_percentage: number
  user_segments?: string[]
  environment: 'development' | 'staging' | 'production'
  created_by: string
  created_at: string
  updated_at: string
}

export interface FeatureFlagEvaluation {
  flag_key: string
  enabled: boolean
  user_id?: string
  session_id?: string
  evaluation_reason: 'flag_disabled' | 'rollout_percentage' | 'user_segment' | 'default'
  evaluated_at: string
}

// Revenue attribution and analytics
export interface RevenueAttribution {
  conversion_id: string
  touchpoints: AttributionTouchpoint[]
  attribution_model: 'first_click' | 'last_click' | 'linear' | 'time_decay' | 'position_based'
  attributed_revenue: number
  attribution_breakdown: AttributionBreakdown[]
  confidence_score: number
  created_at: string
}

export interface AttributionTouchpoint {
  id: string
  channel: string
  source: string
  medium: string
  campaign?: string
  content?: string
  timestamp: string
  page_url: string
  referrer_url?: string
}

export interface AttributionBreakdown {
  touchpoint_id: string
  channel: string
  attributed_value: number
  attribution_percentage: number
}

// Content management for retreat guides
export interface RetreatGuide {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image: string
  location_focus: string[]
  retreat_types: string[]
  target_audience: string[]
  seo_keywords: string[]
  meta_description: string
  author: string
  published_date: string
  last_updated: string
  status: 'draft' | 'published' | 'archived'
  view_count: number
  engagement_score: number
  affiliate_link_count: number
  conversion_rate: number
}

export interface ContentPerformanceMetrics {
  content_id: string
  content_type: 'guide' | 'blog_post' | 'retreat_page' | 'landing_page'
  page_views: number
  unique_visitors: number
  average_time_on_page: number
  bounce_rate: number
  affiliate_clicks: number
  affiliate_conversions: number
  revenue_generated: number
  seo_ranking_position: number
  period_start: string
  period_end: string
}

// Email marketing and lead generation
export interface EmailSubscriber {
  id: string
  email: string
  first_name?: string
  last_name?: string
  subscription_source: string
  interests: string[]
  location?: string
  subscription_date: string
  last_engagement_date?: string
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained'
  tags: string[]
}

export interface EmailCampaign {
  id: string
  name: string
  subject_line: string
  content_type: 'retreat_newsletter' | 'location_guide' | 'promotional' | 'welcome_series'
  target_segments: string[]
  retreat_focus?: string[]
  send_date: string
  sent_count: number
  delivered_count: number
  open_count: number
  click_count: number
  conversion_count: number
  revenue_generated: number
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
}