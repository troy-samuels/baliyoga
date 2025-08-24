// Supabase Storage integration for cached images
import { createClient } from '@supabase/supabase-js'
import { 
  getStudioImagePath, 
  getCachedImageFilename, 
  normalizeStudioName,
  generateStudioHash
} from './image-utils'

// Create a service role client for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for storage operations')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function uploadCachedImage(
  studioId: string, 
  imageIndex: number, 
  imageBuffer: Buffer,
  studioName: string,
  type: 'studio' | 'retreat' = 'studio'
): Promise<string> {
  const filename = getCachedImageFilename(studioId, imageIndex, type)
  
  try {
    const { error } = await supabaseAdmin.storage
      .from('cached-images')
      .upload(filename, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true // Overwrite if exists
      })
    
    if (error) {
      console.error('Supabase upload error:', error)
      throw error
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('cached-images')
      .getPublicUrl(filename)
      
    console.log(`Uploaded to Supabase: ${filename} for ${normalizeStudioName(studioName)}`)
    return publicUrl
    
  } catch (error) {
    console.error(`Failed to upload ${filename}:`, error)
    throw error
  }
}

export async function getCachedImageUrls(
  studioId: string, 
  studioName: string, 
  location?: string,
  type: 'studio' | 'retreat' = 'studio',
  maxImages: number = 20
): Promise<string[]> {
  const urls: string[] = []
  const studioPath = getStudioImagePath(studioId, type)
  
  try {
    // First, try to list images using the new folder structure
    const { data: newFormatFiles, error: newFormatError } = await supabaseAdmin.storage
      .from('cached-images')
      .list(studioPath, { 
        limit: maxImages,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (!newFormatError && newFormatFiles && newFormatFiles.length > 0) {
      // New format found - use these images
      for (const file of newFormatFiles) {
        const fullPath = `${studioPath}/${file.name}`
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('cached-images')
          .getPublicUrl(fullPath)
        urls.push(publicUrl)
      }
      
      console.log(`Found ${urls.length} images in new format for studio ${studioId}`)
      return urls
    }
  } catch (error) {
    console.error(`Error checking new format for studio ${studioId}:`, error)
  }
  
  // Fallback to legacy hash-based format for backward compatibility
  try {
    const studioHash = generateStudioHash(studioName, location || 'bali')
    
    for (let i = 0; i < maxImages; i++) {
      const legacyFilename = `${studioId}-${studioHash}-${i}.jpg`
      
      // Check if legacy file exists
      const { data, error } = await supabaseAdmin.storage
        .from('cached-images')
        .list('', { 
          search: legacyFilename,
          limit: 1
        })
        
      if (error || !data.length) {
        break // No more images for this studio
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('cached-images')
        .getPublicUrl(legacyFilename)
        
      urls.push(publicUrl)
    }
    
    if (urls.length > 0) {
      console.log(`Found ${urls.length} images in legacy format for studio ${studioId}`)
    }
    
  } catch (error) {
    console.error(`Error checking legacy format for studio ${studioId}:`, error)
  }
  
  return urls
}

// Get storage usage statistics
export async function getStorageStats(): Promise<{
  totalFiles: number
  totalSize: number
  studios: number
  retreats: number
  legacyFiles: number
}> {
  try {
    // Get all files recursively
    const getAllFiles = async (path: string = ''): Promise<any[]> => {
      const { data: files, error } = await supabaseAdmin.storage
        .from('cached-images')
        .list(path, { limit: 1000 })
      
      if (error) throw error
      
      const allFiles: any[] = []
      
      for (const file of files || []) {
        if (file.name) {
          const fullPath = path ? `${path}/${file.name}` : file.name
          
          // If it's a folder, recursively get its contents
          if (!file.name.includes('.')) {
            const subFiles = await getAllFiles(fullPath)
            allFiles.push(...subFiles)
          } else {
            allFiles.push({ ...file, fullPath })
          }
        }
      }
      
      return allFiles
    }
    
    const allFiles = await getAllFiles()
    const totalFiles = allFiles.length
    const totalSize = allFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
    
    // Count studios and retreats
    const studios = new Set<string>()
    const retreats = new Set<string>()
    let legacyFiles = 0
    
    for (const file of allFiles) {
      if (file.fullPath.startsWith('studios/')) {
        const studioId = file.fullPath.split('/')[1]
        studios.add(studioId)
      } else if (file.fullPath.startsWith('retreats/')) {
        const retreatId = file.fullPath.split('/')[1]
        retreats.add(retreatId)
      } else {
        // Legacy format (files in root with hash-based naming)
        legacyFiles++
      }
    }
    
    return {
      totalFiles,
      totalSize,
      studios: studios.size,
      retreats: retreats.size,
      legacyFiles
    }
    
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return { totalFiles: 0, totalSize: 0, studios: 0, retreats: 0, legacyFiles: 0 }
  }
}

// Add function to check if studio has cached images
export async function hasStudioImages(studioId: string, type: 'studio' | 'retreat' = 'studio'): Promise<boolean> {
  try {
    const studioPath = getStudioImagePath(studioId, type)
    
    // Check new format first
    const { data: newFormatFiles } = await supabaseAdmin.storage
      .from('cached-images')
      .list(studioPath, { limit: 1 })
    
    return (newFormatFiles && newFormatFiles.length > 0) || false
  } catch (error) {
    console.error(`Error checking if studio ${studioId} has images:`, error)
    return false
  }
}
