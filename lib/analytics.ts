// Google Analytics 4 implementation with privacy-first approach
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Check if GA is enabled - Allow in production or when GA_ID is present
export const isAnalyticsEnabled = !!GA_TRACKING_ID && typeof window !== 'undefined'

// Track page views
export const pageview = (url: string) => {
  if (!isAnalyticsEnabled) return
  
  window.gtag('config', GA_TRACKING_ID!, {
    page_location: url,
    // Privacy-first settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
}

// Track custom events
interface EventParams {
  action: string
  category?: string
  label?: string
  value?: number
  [key: string]: any
}

export const event = ({ action, category, label, value, ...params }: EventParams) => {
  if (!isAnalyticsEnabled) return
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...params,
  })
}

// Predefined events for common actions
export const trackStudioView = (studioName: string, studioId: string) => {
  event({
    action: 'view_studio',
    category: 'Studio',
    label: studioName,
    studio_id: studioId,
  })
}

export const trackRetreatView = (retreatName: string, retreatId: string) => {
  event({
    action: 'view_retreat',
    category: 'Retreat',
    label: retreatName,
    retreat_id: retreatId,
  })
}

export const trackBlogView = (blogTitle: string, blogSlug: string) => {
  event({
    action: 'view_blog_post',
    category: 'Blog',
    label: blogTitle,
    blog_slug: blogSlug,
  })
}

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchTerm,
    value: resultsCount,
  })
}

export const trackWishlistAdd = (itemType: 'studio' | 'retreat', itemName: string, itemId: string) => {
  event({
    action: 'add_to_wishlist',
    category: 'Wishlist',
    label: `${itemType}: ${itemName}`,
    item_type: itemType,
    item_id: itemId,
  })
}

export const trackWishlistRemove = (itemType: 'studio' | 'retreat', itemName: string, itemId: string) => {
  event({
    action: 'remove_from_wishlist',
    category: 'Wishlist',
    label: `${itemType}: ${itemName}`,
    item_type: itemType,
    item_id: itemId,
  })
}

export const trackContactForm = (formType: 'contact' | 'blog_submit' | 'partner_inquiry') => {
  event({
    action: 'form_submit',
    category: 'Form',
    label: formType,
  })
}

export const trackOutboundLink = (url: string, linkText?: string) => {
  event({
    action: 'click_outbound_link',
    category: 'Outbound Link',
    label: linkText || url,
    link_url: url,
  })
}

// Performance tracking
export const trackPageLoadTime = (loadTime: number) => {
  event({
    action: 'page_load_time',
    category: 'Performance',
    value: Math.round(loadTime),
  })
}

// User engagement tracking
export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    value: percentage,
  })
}

// Error tracking
export const trackError = (error: string, page?: string) => {
  event({
    action: 'javascript_error',
    category: 'Error',
    label: error,
    page: page || window.location.pathname,
  })
}

// Enhanced ecommerce tracking for retreat bookings
export const trackRetreatBookingStart = (retreatName: string, retreatId: string, price: number) => {
  event({
    action: 'begin_checkout',
    category: 'Ecommerce',
    label: retreatName,
    value: price,
    currency: 'USD',
    item_id: retreatId,
    item_name: retreatName,
    item_category: 'Retreat',
  })
}

// GDPR compliance helper
export const hasConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('analytics_consent') === 'granted'
}

export const grantConsent = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem('analytics_consent', 'granted')
  
  // Update gtag consent
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied', // Keep ads denied for privacy
    })
  }
}

export const denyConsent = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem('analytics_consent', 'denied')
  
  // Update gtag consent
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    })
  }
} 