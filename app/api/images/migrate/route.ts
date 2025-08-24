import { NextRequest, NextResponse } from 'next/server'
import { migrateCachedImages } from '@/scripts/migrate-cached-images'

// Migration API endpoint
export async function POST(request: NextRequest) {
  try {
    const { 
      dryRun = true, 
      limit = 10,
      offset = 0, 
      type = 'studio',
      cleanup = false,
      studioId,
      migrateAll = false
    } = await request.json()

    console.log(`Starting migration via API: dryRun=${dryRun}, limit=${limit}, type=${type}`)

    // Run migration
    const report = await migrateCachedImages({
      dryRun,
      limit: migrateAll ? Math.min(limit, 500) : Math.min(limit, 100), // Higher limit for migrateAll
      offset,
      type,
      cleanup,
      studioId,
      migrateAll
    })

    return NextResponse.json({
      success: true,
      report,
      message: `Migration completed. Processed ${report.totalProcessed} items, migrated ${report.migrations.reduce((sum, m) => sum + m.migratedFiles, 0)} files.`
    })

  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Get migration status/info
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      info: {
        description: 'Cached Images Migration API',
        usage: {
          'POST /api/images/migrate': {
            description: 'Run migration script',
            parameters: {
              dryRun: 'boolean - If true, only shows what would be migrated (default: true)',
              limit: 'number - Maximum items to process (max: 100, default: 10)',
              type: 'string - Type to migrate: "studio", "retreat", or "all" (default: "studio")',
              cleanup: 'boolean - Whether to delete legacy files after migration (default: false)',
              studioId: 'string - Optional: migrate only specific studio ID'
            },
            examples: [
              { dryRun: true, limit: 5, type: 'studio' },
              { dryRun: false, limit: 20, type: 'all', cleanup: true }
            ]
          }
        },
        safety: [
          'Always run with dryRun: true first to preview changes',
          'Start with small limits (5-10) to test',
          'Use cleanup: true only after verifying migration success',
          'Monitor Supabase storage usage during migration'
        ]
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get migration info'
    }, { status: 500 })
  }
}