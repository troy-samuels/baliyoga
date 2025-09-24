/**
 * Batch Coordinate Population Script
 * Populates coordinate columns for all existing entries in the database
 */

import { createClient } from '@supabase/supabase-js'
import { geocodingService } from '../lib/geocoding-service'
import type { DatabaseStudio, DatabaseRetreat } from '../lib/types'

// Environment configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for bulk operations
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

if (!googleMapsApiKey) {
  console.warn('⚠️  Google Maps API key not found. Only static coordinates will be used.')
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface PopulationStats {
  total: number
  processed: number
  cached: number
  newlyGeocoded: number
  staticCoordinates: number
  fallbacks: number
  errors: number
}

/**
 * Main execution function
 */
async function populateCoordinates() {
  console.log('🚀 Starting coordinate population for existing database entries...\n')

  const stats: PopulationStats = {
    total: 0,
    processed: 0,
    cached: 0,
    newlyGeocoded: 0,
    staticCoordinates: 0,
    fallbacks: 0,
    errors: 0
  }

  try {
    // Get all entries that don't have coordinates yet
    const { data: entries, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('id, name, city, address, latitude, longitude, coordinates_source')
      .or('latitude.is.null,longitude.is.null')
      .order('name')

    if (error) {
      throw new Error(`Failed to fetch entries: ${error.message}`)
    }

    if (!entries || entries.length === 0) {
      console.log('✅ All entries already have coordinates!')
      return
    }

    stats.total = entries.length
    console.log(`📊 Found ${stats.total} entries without coordinates\n`)

    // Process entries in batches to avoid rate limiting
    const batchSize = 10
    const delayBetweenBatches = 1000 // 1 second

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize)
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)}`)
      console.log(`   Entries ${i + 1}-${Math.min(i + batchSize, entries.length)} of ${entries.length}`)

      // Process batch
      for (const entry of batch) {
        await processEntry(entry, stats)
      }

      // Rate limiting delay between batches
      if (i + batchSize < entries.length) {
        console.log(`   ⏳ Waiting ${delayBetweenBatches}ms before next batch...`)
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
      }
    }

    // Final statistics
    printFinalStats(stats)

  } catch (error) {
    console.error('❌ Error during coordinate population:', error)
    process.exit(1)
  }
}

/**
 * Process a single entry
 */
async function processEntry(
  entry: { id: string; name: string; city?: string; address?: string; latitude?: number; longitude?: number; coordinates_source?: string },
  stats: PopulationStats
): Promise<void> {
  stats.processed++

  try {
    // Skip if already has coordinates
    if (entry.latitude && entry.longitude) {
      stats.cached++
      console.log(`   ✅ ${entry.name} (already has coordinates)`)
      return
    }

    // Use geocoding service
    const result = await geocodingService.getCoordinates({
      businessName: entry.name,
      address: entry.address || '',
      city: entry.city || '',
      id: entry.id
    })

    // Track statistics based on source
    switch (result.source) {
      case 'database':
        stats.cached++
        break
      case 'google_geocoding':
        stats.newlyGeocoded++
        break
      case 'static_coordinates':
        stats.staticCoordinates++
        break
      case 'fallback':
        stats.fallbacks++
        break
    }

    console.log(`   🎯 ${entry.name}`)
    console.log(`      Source: ${result.source}${result.fromCache ? ' (cached)' : ''}`)
    console.log(`      Coords: ${result.coordinates.lat.toFixed(4)}, ${result.coordinates.lng.toFixed(4)}`)
    if (result.confidence) {
      console.log(`      Confidence: ${(result.confidence * 100).toFixed(1)}%`)
    }

    // Small delay for Google API rate limiting
    if (result.source === 'google_geocoding' && !result.fromCache) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

  } catch (error) {
    stats.errors++
    console.error(`   ❌ Error processing ${entry.name}:`, error)
  }
}

/**
 * Print final statistics
 */
function printFinalStats(stats: PopulationStats) {
  console.log('\n' + '='.repeat(60))
  console.log('📊 COORDINATE POPULATION COMPLETE')
  console.log('='.repeat(60))

  console.log(`Total entries processed: ${stats.processed}/${stats.total}`)
  console.log(`Already cached: ${stats.cached}`)
  console.log(`Newly geocoded (Google): ${stats.newlyGeocoded}`)
  console.log(`Static coordinates: ${stats.staticCoordinates}`)
  console.log(`Fallback coordinates: ${stats.fallbacks}`)
  console.log(`Errors: ${stats.errors}`)

  const successRate = ((stats.processed - stats.errors) / stats.total * 100).toFixed(1)
  console.log(`\n✅ Success rate: ${successRate}%`)

  if (stats.newlyGeocoded > 0) {
    console.log(`\n💰 Google API calls used: ${stats.newlyGeocoded}`)
    const estimatedCost = (stats.newlyGeocoded * 0.005).toFixed(2) // $0.005 per geocoding request
    console.log(`💳 Estimated cost: $${estimatedCost}`)
  }

  console.log('\n🎉 All future map loads will now use cached coordinates for instant performance!')
}

/**
 * Verify population results
 */
async function verifyPopulation() {
  console.log('\n🔍 Verifying coordinate population...')

  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('coordinates_source, latitude, longitude')

    if (error) {
      throw error
    }

    if (!data) {
      console.log('❌ No data returned during verification')
      return
    }

    const total = data.length
    const withCoordinates = data.filter(item => item.latitude && item.longitude).length
    const sourceCounts: Record<string, number> = {}

    data.forEach(item => {
      if (item.coordinates_source) {
        sourceCounts[item.coordinates_source] = (sourceCounts[item.coordinates_source] || 0) + 1
      }
    })

    console.log(`\n📈 Verification Results:`)
    console.log(`Total entries: ${total}`)
    console.log(`With coordinates: ${withCoordinates} (${(withCoordinates / total * 100).toFixed(1)}%)`)
    console.log(`Missing coordinates: ${total - withCoordinates}`)

    console.log(`\n📊 Coordinate sources:`)
    Object.entries(sourceCounts).forEach(([source, count]) => {
      const percentage = (count / total * 100).toFixed(1)
      console.log(`  ${source}: ${count} (${percentage}%)`)
    })

  } catch (error) {
    console.error('❌ Error during verification:', error)
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--verify')) {
    await verifyPopulation()
    return
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🗺️  Coordinate Population Script

Usage:
  npm run populate-coordinates          # Populate missing coordinates
  npm run populate-coordinates --verify # Verify current state
  npm run populate-coordinates --help   # Show this help

This script will:
1. Find all entries without coordinates
2. Use the geocoding service to determine precise locations
3. Cache results in the database for instant future lookups
4. Provide detailed statistics and progress tracking

Note: Requires Google Maps API key for best results. Without it, only
static Bali coordinates will be used.
`)
    return
  }

  await populateCoordinates()

  if (!args.includes('--no-verify')) {
    await verifyPopulation()
  }
}

// Handle interruption gracefully
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Population interrupted by user')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Population terminated')
  process.exit(0)
})

// Run the script
main().catch(error => {
  console.error('💥 Script failed:', error)
  process.exit(1)
})