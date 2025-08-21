import { createServerClient } from './supabase'
import type { Studio, Retreat } from './data-utils'
import { getSupabaseStudios, getSupabaseRetreats } from './supabase-data-utils'

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

// Get current week's featured items
export async function getCurrentWeeklyFeatured(): Promise<CurrentWeeklyFeatured> {
  try {
    const supabase = createServerClient()

    // First, try to get from the RPC function (if it exists)
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_current_weekly_featured')

    // If RPC works, use its data
    if (!rpcError && rpcData) {
      const result = rpcData?.[0]
      return {
        week_start: result?.week_start || '',
        week_end: result?.week_end || '',
        featured_studios: result?.featured_studios || [],
        featured_retreats: result?.featured_retreats || [],
        studios_data: result?.studios_data || [],
        retreats_data: result?.retreats_data || []
      }
    }

    // If RPC function doesn't exist, fall back to direct queries
    console.log('RPC function not found, falling back to direct queries:', rpcError)
    
    // Get current week dates
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    
    // Try to get from weekly_featured_rotations table
    const { data: rotationData, error: rotationError } = await supabase
      .from('weekly_featured_rotations')
      .select('*')
      .gte('week_start_date', weekStart.toISOString().split('T')[0])
      .lte('week_start_date', weekEnd.toISOString().split('T')[0])
      .single()

    if (!rotationError && rotationData) {
      // Get actual studio and retreat data
      const studioIds = rotationData.featured_studios || []
      const retreatIds = rotationData.featured_retreats || []
      
      const [studiosData, retreatsData] = await Promise.all([
        studioIds.length > 0 ? getItemsByIds(studioIds, 'studio') : Promise.resolve([]),
        retreatIds.length > 0 ? getItemsByIds(retreatIds, 'retreat') : Promise.resolve([])
      ])

      return {
        week_start: rotationData.week_start_date,
        week_end: rotationData.week_end_date,
        featured_studios: studioIds,
        featured_retreats: retreatIds,
        studios_data: studiosData,
        retreats_data: retreatsData
      }
    }

    // Final fallback: return a few high-rated items from the main table
    console.log('No weekly rotation found, using high-rated items as fallback')
    const fallbackData = await getFallbackFeaturedItems()
    
    console.log('Fallback data retrieved:', {
      studiosCount: fallbackData.studios.length,
      retreatsCount: fallbackData.retreats.length
    })
    
    return {
      week_start: weekStart.toISOString(),
      week_end: weekEnd.toISOString(),
      featured_studios: fallbackData.studios.map(s => s.id),
      featured_retreats: fallbackData.retreats.map(r => r.id),
      studios_data: fallbackData.studios,
      retreats_data: fallbackData.retreats
    }

  } catch (error) {
    console.error('Error in getCurrentWeeklyFeatured:', error)
    
    // Ultimate fallback - return empty data with current week dates
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    
    return {
      week_start: weekStart.toISOString(),
      week_end: weekEnd.toISOString(),
      featured_studios: [],
      featured_retreats: [],
      studios_data: [],
      retreats_data: []
    }
  }
}

// Check if an item is currently featured
export async function isCurrentlyFeatured(itemId: string, itemType: 'studio' | 'retreat'): Promise<boolean> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .rpc('is_currently_featured', { 
      p_item_id: itemId, 
      p_item_type: itemType 
    })

  if (error) {
    console.error('Error checking if item is featured:', error)
    return false
  }

  return data || false
}

// Generate weekly featured rotation (admin function)
export async function generateWeeklyFeaturedRotation(
  weekStart?: string,
  studiosCount: number = 3,
  retreatsCount: number = 3
): Promise<{ success: boolean; message: string; data?: any }> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .rpc('generate_weekly_featured_rotation', { 
      p_week_start: weekStart,
      p_studios_count: studiosCount,
      p_retreats_count: retreatsCount
    })

  if (error) {
    console.error('Error generating weekly rotation:', error)
    return {
      success: false,
      message: 'Failed to generate weekly rotation'
    }
  }

  return {
    success: true,
    message: 'Weekly rotation generated successfully',
    data
  }
}

// Add item to featured pool (admin function)
export async function addToFeaturedPool(
  itemId: string,
  itemType: 'studio' | 'retreat',
  itemData: Studio | Retreat,
  priority: number = 0
): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .rpc('add_to_featured_pool', { 
      p_item_id: itemId,
      p_item_type: itemType,
      p_item_data: itemData,
      p_priority: priority
    })

  if (error) {
    console.error('Error adding to featured pool:', error)
    return {
      success: false,
      message: 'Failed to add item to featured pool'
    }
  }

  return {
    success: true,
    message: 'Item added to featured pool successfully'
  }
}

// Get all featured listings (admin function)
export async function getFeaturedListings(): Promise<FeaturedListing[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('featured_listings_admin')
    .select('*')
    .order('priority', { ascending: false })

  if (error) {
    console.error('Error fetching featured listings:', error)
    return []
  }

  return data || []
}

// Update featured listing priority (admin function)
export async function updateFeaturedListingPriority(
  id: string,
  priority: number
): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('featured_listings')
    .update({ priority })
    .eq('id', id)

  if (error) {
    console.error('Error updating featured listing priority:', error)
    return {
      success: false,
      message: 'Failed to update priority'
    }
  }

  return {
    success: true,
    message: 'Priority updated successfully'
  }
}

// Toggle featured listing eligibility (admin function)
export async function toggleFeaturedListingEligibility(
  id: string,
  isEligible: boolean
): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('featured_listings')
    .update({ is_eligible: isEligible })
    .eq('id', id)

  if (error) {
    console.error('Error updating featured listing eligibility:', error)
    return {
      success: false,
      message: 'Failed to update eligibility'
    }
  }

  return {
    success: true,
    message: `Item ${isEligible ? 'enabled' : 'disabled'} for featuring`
  }
}

// Remove item from featured pool (admin function)
export async function removeFromFeaturedPool(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('featured_listings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error removing from featured pool:', error)
    return {
      success: false,
      message: 'Failed to remove item from featured pool'
    }
  }

  return {
    success: true,
    message: 'Item removed from featured pool successfully'
  }
}

// Get weekly rotations history (admin function)
export async function getWeeklyRotationsHistory(limit: number = 10): Promise<WeeklyFeaturedRotation[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('weekly_featured_rotations')
    .select('*')
    .order('week_start_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching weekly rotations history:', error)
    return []
  }

  return data || []
}

// Auto-populate featured pool from high-rated items
export async function autoPopulateFeaturedPool(): Promise<{ success: boolean; message: string; added: number }> {
  try {
    const supabase = createServerClient()

    // Get high-rated studios and retreats from the main table
    const { data: items, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('*')
      .not('review_score', 'is', null)
      .gte('review_score', 4.0) // 4+ star rating
      .not('images', 'is', null)
      .order('review_score', { ascending: false })
      .limit(50) // Top 50 highest rated

    if (error) {
      console.error('Error fetching high-rated items:', error)
      return {
        success: false,
        message: 'Failed to fetch high-rated items',
        added: 0
      }
    }

    let addedCount = 0

    for (const item of items || []) {
      const itemType = item.category_name === 'Yoga studio' ? 'studio' : 'retreat'
      
      // Calculate priority based on rating and review count
      const priority = Math.round(
        (item.review_score || 0) * 10 + 
        Math.min((item.review_count || 0) * 0.5, 20) // Max 20 bonus points from review count
      )

      const itemData = {
        id: item.id,
        name: item.name,
        slug: createSlug(item.name, item.city || "Bali", itemType),
        location: item.city || "Bali",
        rating: item.review_score || 0,
        reviewCount: item.review_count || 0,
        image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null,
        images: Array.isArray(item.images) ? item.images : [],
        styles: Array.isArray(item.yoga_styles) ? item.yoga_styles : [],
        type: itemType,
        phone_number: item.phone_number,
        website: item.website,
        business_description: item.business_description,
        amenities: Array.isArray(item.amenities) ? item.amenities : [],
        languages_spoken: Array.isArray(item.languages_spoken) ? item.languages_spoken : [],
        drop_in_price_usd: item.drop_in_price_usd,
        price_range: item.price_range,
        location_details: {
          address: item.address || "",
          area: item.city || "Bali",
        },
        category: item.category_name,
        ...(itemType === 'retreat' && {
          duration: "", // Add if available in your data
          price: "", // Add if available in your data
        })
      }

      const result = await addToFeaturedPool(
        String(item.id),
        itemType,
        itemData as any,
        priority
      )

      if (result.success) {
        addedCount++
      }
    }

    return {
      success: true,
      message: `Successfully added ${addedCount} items to featured pool`,
      added: addedCount
    }
  } catch (error) {
    console.error('Error auto-populating featured pool:', error)
    return {
      success: false,
      message: 'Failed to auto-populate featured pool',
      added: 0
    }
  }
}

// Helper function to create slugs (similar to your existing slug generation)
function createSlug(name: string, city: string, type: 'studio' | 'retreat'): string {
  const cleanName = name
    .toLowerCase()
    .replace(/\b(center|centre)\b/gi, '')
    .replace(/\bbali\b/gi, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  const cleanCity = city
    .toLowerCase()
    .replace(/\b(regency|city)\b/gi, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
  
  const parts = [
    cleanName,
    'yoga',
    type,
    cleanCity !== 'bali' ? cleanCity : null,
    'bali'
  ].filter(Boolean)
  
  return parts
    .join('-')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .substring(0, 100)
}

// Helper function to get items by IDs
async function getItemsByIds(ids: string[], type: 'studio' | 'retreat'): Promise<(Studio | Retreat)[]> {
  try {
    // For now, use the existing functions to get all items and filter by IDs
    // This is less efficient but works with the existing architecture
    if (type === 'studio') {
      const allStudios = await getSupabaseStudios()
      return allStudios.filter(studio => ids.includes(studio.id))
    } else {
      const allRetreats = await getSupabaseRetreats()
      return allRetreats.filter(retreat => ids.includes(retreat.id))
    }
    
  } catch (error) {
    console.error(`Error in getItemsByIds for ${type}:`, error)
    return []
  }
}

// Helper function to get fallback featured items (high-rated items)
async function getFallbackFeaturedItems(): Promise<{studios: Studio[], retreats: Retreat[]}> {
  try {
    // Get a few high-rated studios and retreats as fallback
    const [allStudios, allRetreats] = await Promise.all([
      getSupabaseStudios(),
      getSupabaseRetreats()
    ])
    
    // Sort by rating and take top 3 of each
    const topStudios = allStudios
      .filter(studio => studio.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
    
    const topRetreats = allRetreats
      .filter(retreat => retreat.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
    
    return {
      studios: topStudios,
      retreats: topRetreats
    }
    
  } catch (error) {
    console.error('Error in getFallbackFeaturedItems:', error)
    return {
      studios: [],
      retreats: []
    }
  }
}