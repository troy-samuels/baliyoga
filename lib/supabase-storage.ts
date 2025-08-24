// Supabase Storage integration for cached images
import { createClient } from '@supabase/supabase-js'

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
  studioHash: string
): Promise<string> {
  const filename = `${studioId}-${studioHash}-${imageIndex}.jpg`
  
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
      
    console.log(`Uploaded to Supabase: ${filename}`)
    return publicUrl
    
  } catch (error) {
    console.error(`Failed to upload ${filename}:`, error)
    throw error
  }
}

export async function getCachedImageUrls(
  studioId: string, 
  studioHash: string, 
  maxImages: number = 20
): Promise<string[]> {
  const urls: string[] = []
  
  for (let i = 0; i < maxImages; i++) {
    const filename = `${studioId}-${studioHash}-${i}.jpg`
    
    try {
      // Check if file exists
      const { data, error } = await supabaseAdmin.storage
        .from('cached-images')
        .list('', { 
          search: filename,
          limit: 1
        })
        
      if (error || !data.length) {
        break // No more images for this studio
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('cached-images')
        .getPublicUrl(filename)
        
      urls.push(publicUrl)
      
    } catch (error) {
      console.error(`Error checking ${filename}:`, error)
      break
    }
  }
  
  return urls
}

// Get storage usage statistics
export async function getStorageStats(): Promise<{
  totalFiles: number
  totalSize: number
  studios: number
}> {
  try {
    const { data: files, error } = await supabaseAdmin.storage
      .from('cached-images')
      .list('', { limit: 10000 })
    
    if (error) throw error
    
    const totalFiles = files?.length || 0
    const totalSize = files?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0
    
    // Count unique studios
    const studioIds = new Set(
      files?.map(file => file.name.split('-')[0]) || []
    )
    
    return {
      totalFiles,
      totalSize,
      studios: studioIds.size
    }
    
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return { totalFiles: 0, totalSize: 0, studios: 0 }
  }
}
