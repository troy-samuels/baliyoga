import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'
import type { 
  Studio, 
  Retreat, 
  DatabaseStudio, 
  DatabaseRetreat 
} from './types'
import { generateSlug } from './slug-utils'

// Server-side Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single server-side client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})


// Transform database studio to app studio
function transformStudio(dbStudio: DatabaseStudio): Studio {
  const location = dbStudio.city || 'Bali'
  const slug = generateSlug(dbStudio.name, location, 'studio')
  
  return {
    id: dbStudio.id,
    name: dbStudio.name,
    slug,
    type: 'studio',
    location,
    rating: dbStudio.review_score || 0,
    reviewCount: dbStudio.review_count || 0,
    image: dbStudio.images?.[0],
    images: dbStudio.images || [],
    business_description: dbStudio.business_description || '',
    phone_number: dbStudio.phone_number,
    website: dbStudio.website,
    location_details: {
      address: dbStudio.address || '',
      area: location,
    },
    category: dbStudio.category_name || 'Yoga',
    styles: dbStudio.yoga_styles || [],
    amenities: dbStudio.amenities || [],
    languages_spoken: dbStudio.languages_spoken || [],
    drop_in_price_usd: dbStudio.drop_in_price_usd,
    price_range: dbStudio.price_range || '',
    opening_hours: dbStudio.opening_hours || [],
    locationSlug: generateSlug(location),
    typeSlug: 'studio',
    urlPath: `/studios/detail?slug=${slug}`,
    createdAt: dbStudio.created_at,
    updatedAt: dbStudio.updated_at,
  }
}

// Transform database retreat to app retreat
function transformRetreat(dbRetreat: DatabaseRetreat): Retreat {
  const location = dbRetreat.city || 'Bali'
  const slug = generateSlug(dbRetreat.name, location, 'retreat')
  
  return {
    id: dbRetreat.id,
    name: dbRetreat.name,
    slug,
    type: 'retreat',
    location,
    rating: dbRetreat.review_score || 0,
    reviewCount: dbRetreat.review_count || 0,
    image: dbRetreat.images?.[0],
    images: dbRetreat.images || [],
    business_description: dbRetreat.business_description || '',
    phone_number: dbRetreat.phone_number,
    website: dbRetreat.website,
    location_details: {
      address: dbRetreat.address || '',
      area: location,
    },
    category: dbRetreat.category_name || 'Wellness',
    duration: dbRetreat.duration || '',
    price: dbRetreat.price_range || '',
    start_date: dbRetreat.start_date,
    end_date: dbRetreat.end_date,
    max_participants: dbRetreat.max_participants,
    accommodation_type: dbRetreat.accommodation_type,
    meals_included: dbRetreat.meals_included,
    transportation_included: dbRetreat.transportation_included,
    certification_offered: dbRetreat.certification_offered,
    level_requirements: dbRetreat.level_requirements,
    createdAt: dbRetreat.created_at,
    updatedAt: dbRetreat.updated_at,
  }
}

// Cached data fetching functions for server-side use
export const getAllStudios = cache(async (): Promise<Studio[]> => {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('*')
      .eq('category_name', 'Yoga studio')
      .order('review_score', { ascending: false, nullsLast: true })
      .limit(100)

    if (error) {
      console.error('Error fetching studios:', error)
      return []
    }

    return (data || []).map(transformStudio)
  } catch (error) {
    console.error('Failed to fetch studios:', error)
    return []
  }
})

export const getAllRetreats = cache(async (): Promise<Retreat[]> => {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('*')
      .eq('category_name', 'Yoga retreat')
      .order('review_score', { ascending: false, nullsLast: true })
      .limit(100)

    if (error) {
      console.error('Error fetching retreats:', error)
      return []
    }

    return (data || []).map(transformRetreat)
  } catch (error) {
    console.error('Failed to fetch retreats:', error)
    return []
  }
})

export const getStudioBySlug = cache(async (slug: string): Promise<Studio | null> => {
  try {
    const studios = await getAllStudios()
    return studios.find(studio => studio.slug === slug) || null
  } catch (error) {
    console.error('Failed to fetch studio by slug:', error)
    return null
  }
})

export const getRetreatBySlug = cache(async (slug: string): Promise<Retreat | null> => {
  try {
    const retreats = await getAllRetreats()
    return retreats.find(retreat => retreat.slug === slug) || null
  } catch (error) {
    console.error('Failed to fetch retreat by slug:', error)
    return null
  }
})

export const getFeaturedStudios = cache(async (limit: number = 6): Promise<Studio[]> => {
  try {
    const studios = await getAllStudios()
    return studios
      .filter(studio => studio.rating >= 4.5 && studio.images.length > 0)
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch featured studios:', error)
    return []
  }
})

export const getFeaturedRetreats = cache(async (limit: number = 6): Promise<Retreat[]> => {
  try {
    const retreats = await getAllRetreats()
    return retreats
      .filter(retreat => retreat.rating >= 4.5 && retreat.images.length > 0)
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch featured retreats:', error)
    return []
  }
})

export const searchStudios = cache(async (query: string): Promise<Studio[]> => {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('*')
      .eq('category_name', 'Yoga studio')
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,business_description.ilike.%${query}%`)
      .order('review_score', { ascending: false, nullsLast: true })
      .limit(20)

    if (error) {
      console.error('Error searching studios:', error)
      return []
    }

    return (data || []).map(transformStudio)
  } catch (error) {
    console.error('Failed to search studios:', error)
    return []
  }
})

export const searchRetreats = cache(async (query: string): Promise<Retreat[]> => {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('*')
      .eq('category_name', 'Yoga retreat')
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,business_description.ilike.%${query}%`)
      .order('review_score', { ascending: false, nullsLast: true })
      .limit(20)

    if (error) {
      console.error('Error searching retreats:', error)
      return []
    }

    return (data || []).map(transformRetreat)
  } catch (error) {
    console.error('Failed to search retreats:', error)
    return []
  }
})