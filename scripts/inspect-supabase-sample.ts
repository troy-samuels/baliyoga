import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { transformStudio, transformRetreat } from '../lib/supabase-server'

dotenv.config({ path: '.env.local' })

function getEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Row = Record<string, any>

function pick<T extends Row>(row: T, keys: string[]): Row {
  const out: Row = {}
  for (const k of keys) out[k] = row[k]
  return out
}

async function run() {
  console.log('🔍 Inspecting Supabase sample data (first 3 studios, 3 retreats)')

  const { data: studioRows, error: studioErr } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select('*')
    .eq('category_name', 'Yoga studio')
    .limit(3)

  if (studioErr) throw studioErr
  console.log('\n--- Studios ---')
  for (const row of studioRows || []) {
    const raw = pick(row, [
      'id','name','city','address','review_score','review_count','images','yoga_styles','amenities','languages_spoken','price_range','drop_in_price_usd','category_name','business_description'
    ])
    const transformed = transformStudio(row as any)
    const view = pick(transformed as any, [
      'id','name','slug','location','location_details','rating','reviewCount','image','images','styles','amenities','languages_spoken','price_range','drop_in_price_usd','business_description'
    ])
    console.dir({ raw, transformed: view }, { depth: 4 })
  }

  const { data: retreatRows, error: retreatErr } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select('*')
    .eq('category_name', 'Yoga retreat center')
    .limit(3)

  if (retreatErr) throw retreatErr
  console.log('\n--- Retreats ---')
  for (const row of retreatRows || []) {
    const raw = pick(row, [
      'id','name','city','address','review_score','review_count','images','duration','price_range','start_date','end_date','accommodation_type','meals_included','transportation_included','certification_offered','business_description'
    ])
    const transformed = transformRetreat(row as any)
    const view = pick(transformed as any, [
      'id','name','slug','location','rating','reviewCount','image','images','duration','price','start_date','end_date','accommodation_type','meals_included','transportation_included','certification_offered','location_details','business_description'
    ])
    console.dir({ raw, transformed: view }, { depth: 4 })
  }

  console.log('\n✅ Done')
}

run().catch((e) => {
  console.error('❌ Error inspecting sample data:', e)
  process.exit(1)
})


