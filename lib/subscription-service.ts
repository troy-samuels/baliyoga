/**
 * Studio Subscription Service
 * Implements realistic $45/month revenue model for Bali yoga platform
 */

import { createClient } from '@supabase/supabase-js'
import {
  SubscriptionPlan,
  StudioSubscription,
  SubscriptionAnalytics,
  StudioDashboardData,
  SubscriptionStatus,
  BookingTransaction,
  MonthlyRevenueSummary
} from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Subscription Plans - Realistic pricing for Indonesian market
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free-basic',
    name: 'Basic Listing',
    description: 'Essential presence on Bali Yoga platform',
    price_usd: 0,
    price_idr: 0,
    billing_cycle: 'monthly',
    features: [
      {
        id: 'basic-profile',
        name: 'Basic Profile',
        description: 'Studio name, location, contact info, 3 images',
        category: 'listing',
        is_premium: false
      },
      {
        id: 'search-visibility',
        name: 'Search Visibility',
        description: 'Appears in search results',
        category: 'listing',
        is_premium: false
      }
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'premium-studio',
    name: 'Premium Studio',
    description: 'Enhanced visibility and marketing tools for serious studios',
    price_usd: 45,
    price_idr: 675000, // ~$45 USD at 15,000 IDR/USD
    billing_cycle: 'monthly',
    features: [
      {
        id: 'unlimited-images',
        name: 'Unlimited Images',
        description: 'Upload unlimited high-quality photos',
        category: 'listing',
        is_premium: true
      },
      {
        id: 'priority-placement',
        name: 'Priority Search Placement',
        description: 'Appear higher in search results',
        category: 'listing',
        is_premium: true
      },
      {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        description: 'Track views, clicks, and customer behavior',
        category: 'analytics',
        is_premium: true
      },
      {
        id: 'whatsapp-tools',
        name: 'WhatsApp Integration',
        description: 'Quick booking links and automated responses',
        category: 'integration',
        is_premium: true
      },
      {
        id: 'social-scheduling',
        name: 'Social Media Scheduling',
        description: 'Schedule Instagram and Facebook posts',
        category: 'marketing',
        is_premium: true
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: '24/7 WhatsApp support and profile optimization',
        category: 'support',
        is_premium: true
      }
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

/**
 * Get subscription plan by ID
 */
export function getSubscriptionPlan(planId: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null
}

/**
 * Get available subscription plans
 */
export function getAvailableSubscriptionPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS.filter(plan => plan.is_active)
}

/**
 * Create a new studio subscription
 */
export async function createStudioSubscription(
  studioId: string,
  planId: string,
  paymentMethodId?: string
): Promise<{ success: boolean; subscription?: StudioSubscription; error?: string }> {
  try {
    const plan = getSubscriptionPlan(planId)
    if (!plan) {
      return { success: false, error: 'Invalid subscription plan' }
    }

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const subscriptionData = {
      studio_id: studioId,
      plan_id: planId,
      status: 'active' as SubscriptionStatus,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('studio_subscriptions')
      .insert(subscriptionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return { success: false, error: 'Failed to create subscription' }
    }

    return { success: true, subscription: data }
  } catch (error) {
    console.error('Subscription creation error:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Get studio subscription status
 */
export async function getStudioSubscription(studioId: string): Promise<StudioSubscription | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('studio_subscriptions')
      .select('*')
      .eq('studio_id', studioId)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

/**
 * Check if studio has premium features
 */
export async function hasStudioPremiumFeatures(studioId: string): Promise<boolean> {
  const subscription = await getStudioSubscription(studioId)
  return subscription !== null && subscription.plan_id === 'premium-studio'
}

/**
 * Update subscription status
 */
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: SubscriptionStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('studio_subscriptions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)

    if (error) {
      console.error('Error updating subscription status:', error)
      return { success: false, error: 'Failed to update subscription' }
    }

    return { success: true }
  } catch (error) {
    console.error('Subscription update error:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Record studio analytics for dashboard
 */
export async function recordStudioAnalytics(
  studioId: string,
  event: 'profile_view' | 'contact_click' | 'website_click' | 'phone_click' | 'booking_inquiry'
): Promise<void> {
  try {
    // Only track analytics for premium subscribers
    const hasPremium = await hasStudioPremiumFeatures(studioId)
    if (!hasPremium) return

    const today = new Date().toISOString().split('T')[0]

    // Update daily analytics
    await supabaseAdmin.rpc('increment_studio_analytics', {
      p_studio_id: studioId,
      p_date: today,
      p_event_type: event,
      p_increment: 1
    })

  } catch (error) {
    console.error('Error recording analytics:', error)
  }
}

/**
 * Get studio dashboard data
 */
export async function getStudioDashboardData(studioId: string): Promise<StudioDashboardData | null> {
  try {
    const subscription = await getStudioSubscription(studioId)

    if (!subscription) {
      return null
    }

    // Get analytics for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: analyticsData } = await supabaseAdmin
      .from('studio_analytics')
      .select('*')
      .eq('studio_id', studioId)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

    // Aggregate analytics
    const analytics: SubscriptionAnalytics = {
      studio_id: studioId,
      period_start: thirtyDaysAgo.toISOString(),
      period_end: new Date().toISOString(),
      profile_views: analyticsData?.reduce((sum, day) => sum + (day.profile_views || 0), 0) || 0,
      contact_clicks: analyticsData?.reduce((sum, day) => sum + (day.contact_clicks || 0), 0) || 0,
      website_clicks: analyticsData?.reduce((sum, day) => sum + (day.website_clicks || 0), 0) || 0,
      phone_clicks: analyticsData?.reduce((sum, day) => sum + (day.phone_clicks || 0), 0) || 0,
      search_appearances: analyticsData?.reduce((sum, day) => sum + (day.search_appearances || 0), 0) || 0,
      search_position_avg: 0, // Calculate based on search data
      booking_inquiries: analyticsData?.reduce((sum, day) => sum + (day.booking_inquiries || 0), 0) || 0,
      conversion_rate: 0, // Calculate based on views vs inquiries
      top_keywords: [], // Implement keyword tracking
      created_at: new Date().toISOString()
    }

    // Calculate conversion rate
    if (analytics.profile_views > 0) {
      analytics.conversion_rate = (analytics.booking_inquiries / analytics.profile_views) * 100
    }

    return {
      subscription,
      analytics,
      profile_completion: 85, // Calculate based on filled fields
      recent_activities: [], // Implement activity tracking
      notifications: [] // Implement notification system
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}

/**
 * Record booking transaction for commission tracking
 */
export async function recordBookingTransaction(
  studioId: string,
  customerEmail: string,
  serviceType: 'drop_in' | 'package' | 'retreat' | 'teacher_training',
  amountUsd: number,
  commissionRate: number = 0.08 // 8% default rate
): Promise<{ success: boolean; transaction?: BookingTransaction; error?: string }> {
  try {
    const commissionAmount = amountUsd * commissionRate
    const platformFee = 2 // $2 flat fee for payment processing
    const studioPayout = amountUsd - commissionAmount - platformFee

    const transactionData = {
      studio_id: studioId,
      customer_email: customerEmail,
      service_type: serviceType,
      amount_usd: amountUsd,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      platform_fee: platformFee,
      studio_payout: studioPayout,
      payment_status: 'completed' as const,
      booking_date: new Date().toISOString(),
      service_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('booking_transactions')
      .insert(transactionData)
      .select()
      .single()

    if (error) {
      console.error('Error recording transaction:', error)
      return { success: false, error: 'Failed to record transaction' }
    }

    return { success: true, transaction: data }
  } catch (error) {
    console.error('Transaction recording error:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

/**
 * Get monthly revenue summary
 */
export async function getMonthlyRevenueSummary(
  year: number,
  month: number
): Promise<MonthlyRevenueSummary | null> {
  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    // Get subscription revenue
    const { data: subscriptions } = await supabaseAdmin
      .from('studio_subscriptions')
      .select('plan_id')
      .eq('status', 'active')
      .gte('current_period_start', startDate.toISOString())
      .lte('current_period_start', endDate.toISOString())

    const subscriptionRevenue = subscriptions?.reduce((total, sub) => {
      const plan = getSubscriptionPlan(sub.plan_id)
      return total + (plan?.price_usd || 0)
    }, 0) || 0

    // Get commission revenue
    const { data: transactions } = await supabaseAdmin
      .from('booking_transactions')
      .select('commission_amount, amount_usd')
      .eq('payment_status', 'completed')
      .gte('booking_date', startDate.toISOString())
      .lte('booking_date', endDate.toISOString())

    const commissionRevenue = transactions?.reduce((total, t) => total + t.commission_amount, 0) || 0
    const totalBookings = transactions?.length || 0
    const averageBookingValue = totalBookings > 0 ?
      transactions!.reduce((total, t) => total + t.amount_usd, 0) / totalBookings : 0

    return {
      month: month.toString().padStart(2, '0'),
      year,
      subscription_revenue: subscriptionRevenue,
      commission_revenue: commissionRevenue,
      service_revenue: 0, // For additional services like photography packages
      total_revenue: subscriptionRevenue + commissionRevenue,
      active_subscribers: subscriptions?.length || 0,
      new_subscribers: subscriptions?.length || 0, // Calculate new vs existing
      churned_subscribers: 0, // Calculate churned subscribers
      total_bookings: totalBookings,
      average_booking_value: averageBookingValue
    }

  } catch (error) {
    console.error('Error calculating revenue summary:', error)
    return null
  }
}

/**
 * Calculate realistic revenue projection based on current data
 */
export async function calculateRevenueProjection(): Promise<{
  current_monthly_revenue: number
  projected_6_month: number
  projected_12_month: number
  key_metrics: {
    active_subscribers: number
    monthly_booking_volume: number
    average_commission: number
  }
}> {
  try {
    const currentDate = new Date()
    const currentMonth = await getMonthlyRevenueSummary(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    )

    const currentRevenue = currentMonth?.total_revenue || 0
    const activeSubscribers = currentMonth?.active_subscribers || 0
    const monthlyBookings = currentMonth?.total_bookings || 0
    const avgCommission = currentMonth?.commission_revenue || 0

    // Conservative growth projections based on realistic market conditions
    const monthlyGrowthRate = 0.08 // 8% monthly growth

    const projected6Month = currentRevenue * Math.pow(1 + monthlyGrowthRate, 6)
    const projected12Month = currentRevenue * Math.pow(1 + monthlyGrowthRate, 12)

    return {
      current_monthly_revenue: currentRevenue,
      projected_6_month: Math.min(projected6Month, 8000), // Cap at realistic $8k
      projected_12_month: Math.min(projected12Month, 16000), // Cap at realistic $16k
      key_metrics: {
        active_subscribers: activeSubscribers,
        monthly_booking_volume: monthlyBookings,
        average_commission: avgCommission
      }
    }
  } catch (error) {
    console.error('Error calculating projections:', error)
    return {
      current_monthly_revenue: 0,
      projected_6_month: 0,
      projected_12_month: 0,
      key_metrics: {
        active_subscribers: 0,
        monthly_booking_volume: 0,
        average_commission: 0
      }
    }
  }
}

// All functions already exported individually above