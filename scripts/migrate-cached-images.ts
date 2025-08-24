/**
 * Migration script to reorganize cached images from legacy hash-based structure
 * to the new folder-based structure (studios/{id}/ and retreats/{id}/)
 */

import { createClient } from '@supabase/supabase-js'
import { getAllStudios, getAllRetreats } from '../lib/supabase-server'
import { 
  generateStudioHash, 
  normalizeStudioName, 
  getCachedImageFilename,
  getStudioImagePath 
} from '../lib/image-utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface MigrationReport {
  totalProcessed: number
  successful: number
  failed: number
  skipped: number
  errors: string[]
  migrations: Array<{
    studioId: string
    studioName: string
    type: 'studio' | 'retreat'
    legacyFiles: number
    migratedFiles: number
    newPath: string
    issues: string[]
  }>
}

async function findLegacyImages(studioId: string, studioName: string, location: string): Promise<string[]> {
  const legacyImages: string[] = []
  const studioHash = generateStudioHash(studioName, location)
  
  try {
    const { data: files, error } = await supabaseAdmin.storage
      .from('cached-images')
      .list('', { limit: 1000 })
    
    if (error) throw error
    
    for (const file of files || []) {
      // Check if this file belongs to this studio ID
      if (file.name.startsWith(studioId + '-') && file.name.endsWith('.jpg')) {
        legacyImages.push(file.name)
      }
    }
    
    console.log(`Found ${legacyImages.length} files for studio ${studioId}`)
    
  } catch (error) {
    console.error(`Error finding legacy images for ${studioName}:`, error)
  }
  
  return legacyImages.sort() // Sort to maintain order
}

async function migrateStudioImages(
  studioId: string, 
  studioName: string, 
  location: string, 
  type: 'studio' | 'retreat',
  dryRun: boolean = false
): Promise<{
  legacyFiles: number
  migratedFiles: number
  newPath: string
  issues: string[]
}> {
  
  const issues: string[] = []
  const newPath = getStudioImagePath(studioId, type)
  
  console.log(`\n📁 Migrating ${type}: ${studioName} (${studioId})`)
  console.log(`   New path: ${newPath}`)
  
  // Find legacy images
  const legacyImages = await findLegacyImages(studioId, studioName, location)
  console.log(`   Found ${legacyImages.length} legacy images`)
  
  if (legacyImages.length === 0) {
    return { legacyFiles: 0, migratedFiles: 0, newPath, issues: ['No legacy images found'] }
  }
  
  let migratedFiles = 0
  
  for (let i = 0; i < legacyImages.length; i++) {
    const legacyFilename = legacyImages[i]
    const newFilename = getCachedImageFilename(studioId, i, type)
    
    try {
      console.log(`   📄 ${legacyFilename} → ${newFilename}`)
      
      if (!dryRun) {
        // Copy the file to new location
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from('cached-images')
          .download(legacyFilename)
        
        if (downloadError) throw downloadError
        
        // Upload to new location
        const { error: uploadError } = await supabaseAdmin.storage
          .from('cached-images')
          .upload(newFilename, fileData, {
            contentType: 'image/jpeg',
            upsert: true
          })
        
        if (uploadError) throw uploadError
        
        // Verify the new file exists
        const { data: verifyData, error: verifyError } = await supabaseAdmin.storage
          .from('cached-images')
          .list(getStudioImagePath(studioId, type), { limit: 1 })
        
        if (verifyError || !verifyData?.length) {
          throw new Error('Failed to verify migrated file')
        }
        
        console.log(`   ✅ Successfully migrated`)
      } else {
        console.log(`   🔍 [DRY RUN] Would migrate`)
      }
      
      migratedFiles++
      
    } catch (error) {
      const errorMsg = `Failed to migrate ${legacyFilename}: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.log(`   ❌ ${errorMsg}`)
      issues.push(errorMsg)
    }
  }
  
  return {
    legacyFiles: legacyImages.length,
    migratedFiles,
    newPath,
    issues
  }
}

async function cleanupLegacyFiles(
  studioId: string, 
  studioName: string, 
  location: string,
  dryRun: boolean = false
): Promise<void> {
  console.log(`\n🧹 Cleaning up legacy files for ${studioName}`)
  
  const legacyImages = await findLegacyImages(studioId, studioName, location)
  
  for (const legacyFilename of legacyImages) {
    try {
      if (!dryRun) {
        const { error } = await supabaseAdmin.storage
          .from('cached-images')
          .remove([legacyFilename])
        
        if (error) throw error
        console.log(`   🗑️  Deleted ${legacyFilename}`)
      } else {
        console.log(`   🔍 [DRY RUN] Would delete ${legacyFilename}`)
      }
    } catch (error) {
      console.log(`   ❌ Failed to delete ${legacyFilename}:`, error)
    }
  }
}

async function getAllCachedStudioIds(): Promise<Array<{id: string, type: 'studio' | 'retreat', imageCount: number}>> {
  const { data: files, error } = await supabaseAdmin.storage
    .from('cached-images')
    .list('', { limit: 5000 })
  
  if (error) throw error
  
  const studioImageCounts = new Map<string, number>()
  
  files?.forEach(file => {
    const parts = file.name.split('-')
    if (parts.length >= 7 && file.name.endsWith('.jpg')) {
      const studioId = parts.slice(0, 5).join('-')
      studioImageCounts.set(studioId, (studioImageCounts.get(studioId) || 0) + 1)
    }
  })
  
  return Array.from(studioImageCounts.entries()).map(([id, imageCount]) => ({
    id,
    type: 'studio' as const, // Default to studio for now
    imageCount
  }))
}

export async function migrateCachedImages(options: {
  dryRun?: boolean
  limit?: number
  offset?: number
  type?: 'studio' | 'retreat' | 'all'
  cleanup?: boolean
  studioId?: string
  migrateAll?: boolean
} = {}): Promise<MigrationReport> {
  
  const { 
    dryRun = false, 
    limit = 50,
    offset = 0, 
    type = 'all', 
    cleanup = false,
    studioId,
    migrateAll = false
  } = options
  
  console.log(`🚀 Starting image migration${dryRun ? ' (DRY RUN)' : ''}`)
  console.log(`   Type: ${type}`)
  console.log(`   Limit: ${limit}`)
  console.log(`   Cleanup: ${cleanup}`)
  
  const report: MigrationReport = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [],
    migrations: []
  }
  
  try {
    let items: Array<{id: string, name: string, location: string, type: 'studio' | 'retreat'}>
    
    if (migrateAll) {
      // Get ALL cached studio IDs from storage
      console.log(`📊 Getting all cached studio IDs from storage...`)
      const cachedStudios = await getAllCachedStudioIds()
      
      // Get database items for name/location lookup
      const [dbStudios, dbRetreats] = await Promise.all([
        getAllStudios(),
        getAllRetreats()
      ])
      
      const dbLookup = new Map<string, any>()
      
      // Add studios to lookup
      dbStudios.forEach(s => {
        dbLookup.set(s.id, { ...s, type: 'studio' as const })
      })
      
      // Add retreats to lookup  
      dbRetreats.forEach(r => {
        dbLookup.set(r.id, { ...r, type: 'retreat' as const })
      })
      
      items = cachedStudios.map(cached => {
        const dbItem = dbLookup.get(cached.id)
        return {
          id: cached.id,
          name: dbItem?.name || `Unknown Studio (${cached.id.slice(0, 8)})`,
          location: dbItem?.location || 'Unknown Location',
          type: cached.type
        }
      })
      
      console.log(`📊 Found ${items.length} studios with cached images`)
      
    } else {
      // Original logic: get from database only
      const studios = type === 'all' || type === 'studio' ? await getAllStudios() : []
      const retreats = type === 'all' || type === 'retreat' ? await getAllRetreats() : []
      
      items = [
        ...studios.map(s => ({ ...s, type: 'studio' as const })),
        ...retreats.map(r => ({ ...r, type: 'retreat' as const }))
      ]
    }
    
    // Filter by specific studio if requested
    if (studioId) {
      items = items.filter(item => item.id === studioId)
    }
    
    items = items.slice(offset, offset + limit)
    
    console.log(`📊 Processing ${items.length} items`)
    
    for (const item of items) {
      report.totalProcessed++
      
      try {
        const migrationResult = await migrateStudioImages(
          item.id,
          item.name,
          item.location,
          item.type,
          dryRun
        )
        
        if (migrationResult.migratedFiles > 0) {
          report.successful++
          
          // Cleanup legacy files if requested
          if (cleanup && !dryRun) {
            await cleanupLegacyFiles(item.id, item.name, item.location, dryRun)
          }
        } else {
          report.skipped++
        }
        
        report.migrations.push({
          studioId: item.id,
          studioName: item.name,
          type: item.type,
          ...migrationResult
        })
        
      } catch (error) {
        report.failed++
        const errorMsg = `Failed to migrate ${item.name} (${item.id}): ${error instanceof Error ? error.message : 'Unknown error'}`
        report.errors.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }
    
    // Print summary
    console.log(`\n📈 MIGRATION SUMMARY`)
    console.log(`   Total processed: ${report.totalProcessed}`)
    console.log(`   Successful: ${report.successful}`)
    console.log(`   Skipped: ${report.skipped}`)
    console.log(`   Failed: ${report.failed}`)
    console.log(`   Total migrated files: ${report.migrations.reduce((sum, m) => sum + m.migratedFiles, 0)}`)
    
    if (report.errors.length > 0) {
      console.log(`\n❌ ERRORS:`)
      report.errors.forEach(error => console.log(`   ${error}`))
    }
    
  } catch (error) {
    const errorMsg = `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    report.errors.push(errorMsg)
    console.error(errorMsg)
  }
  
  return report
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const cleanup = args.includes('--cleanup')
  const limitArg = args.find(arg => arg.startsWith('--limit='))
  const typeArg = args.find(arg => arg.startsWith('--type='))
  const studioIdArg = args.find(arg => arg.startsWith('--studio-id='))
  
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 50
  const type = typeArg ? typeArg.split('=')[1] as 'studio' | 'retreat' | 'all' : 'all'
  const studioId = studioIdArg ? studioIdArg.split('=')[1] : undefined
  
  migrateCachedImages({ dryRun, limit, type, cleanup, studioId })
    .then(report => {
      console.log('\n✅ Migration completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    })
}