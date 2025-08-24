import { NextResponse } from 'next/server'
import { getStorageStats } from '@/lib/supabase-storage'

export async function GET() {
  try {
    const stats = await getStorageStats()
    
    return NextResponse.json({
      success: true,
      stats: {
        uniqueStudios: stats.studios,
        totalFiles: stats.totalFiles,
        totalSizeMB: stats.totalSize / (1024 * 1024)
      }
    })
  } catch (error) {
    console.error('Error getting image stats:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get image statistics' 
    }, { status: 500 })
  }
}
