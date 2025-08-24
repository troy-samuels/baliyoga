#!/usr/bin/env node

/**
 * Check what images are actually stored in the database
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read environment variables
let supabaseUrl, supabaseServiceKey
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const envLines = envContent.split('\n')
  
  envLines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim()
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseServiceKey = line.split('=')[1].trim()
    }
  })
} catch (error) {
  console.error('❌ Could not read .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkDatabaseImages() {
  console.log('🔍 CHECKING DATABASE IMAGES')
  console.log('=' .repeat(50))
  
  try {
    // Get a sample of records with images
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('id, name, category_name, images')
      .not('images', 'is', null)
      .neq('images', '[]')
      .neq('images', '')
      .limit(10)
    
    if (error) throw error
    
    console.log(`📊 Found ${data.length} sample records with images\n`)
    
    let totalRecordsWithImages = 0
    let validImageRecords = 0
    let totalImageUrls = 0
    
    for (const record of data) {
      console.log(`📋 ${record.name} (${record.category_name})`)
      console.log(`   ID: ${record.id}`)
      
      let parsedImages = []
      try {
        // Handle both string and array formats
        if (Array.isArray(record.images)) {
          parsedImages = record.images
        } else if (typeof record.images === 'string') {
          parsedImages = JSON.parse(record.images)
        }
        
        if (parsedImages.length > 0) {
          console.log(`   ✅ ${parsedImages.length} images:`)
          parsedImages.slice(0, 3).forEach((img, i) => {
            console.log(`      ${i + 1}. ${img.substring(0, 80)}...`)
          })
          if (parsedImages.length > 3) {
            console.log(`      ... and ${parsedImages.length - 3} more`)
          }
          validImageRecords++
          totalImageUrls += parsedImages.length
        } else {
          console.log(`   ⚠️  Empty images array`)
        }
        
      } catch (error) {
        console.log(`   ❌ Error parsing images: ${error.message}`)
        console.log(`   Raw images field: ${record.images}`)
      }
      
      totalRecordsWithImages++
      console.log('')
    }
    
    // Get total counts
    const { count: totalWithImages, error: countError } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('id', { count: 'exact', head: true })
      .not('images', 'is', null)
      .neq('images', '[]')
      .neq('images', '')
    
    if (countError) throw countError
    
    console.log('📊 SUMMARY:')
    console.log(`   Total records with images field: ${totalWithImages}`)
    console.log(`   Sample records checked: ${totalRecordsWithImages}`)
    console.log(`   Records with valid images: ${validImageRecords}`)
    console.log(`   Average images per record: ${(totalImageUrls / validImageRecords).toFixed(1)}`)
    
    if (validImageRecords > 0) {
      console.log('\n✅ DATABASE HAS IMAGES! You can use these directly instead of the cached image system.')
    } else {
      console.log('\n⚠️  No valid images found in database.')
    }
    
  } catch (error) {
    console.error('❌ Error checking database images:', error)
  }
}

checkDatabaseImages()
