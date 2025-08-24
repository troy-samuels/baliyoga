#!/usr/bin/env node

/**
 * Check database structure without parsing problematic JSON fields
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

async function checkDatabase() {
  console.log('🔍 CHECKING DATABASE STRUCTURE')
  console.log('=' .repeat(50))
  
  try {
    // Get total counts without parsing images
    const { count: totalRecords } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('id', { count: 'exact', head: true })
    
    const { count: withImagesField } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('id', { count: 'exact', head: true })
      .not('images', 'is', null)
      .neq('images', '[]')
      .neq('images', '')
    
    console.log(`📊 Total records: ${totalRecords}`)
    console.log(`📸 Records with images field: ${withImagesField}`)
    
    // Get just basic info without images field
    const { data: sampleRecords } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('id, name, category_name')
      .limit(5)
    
    console.log('\n📋 Sample records:')
    sampleRecords?.forEach((record, i) => {
      console.log(`   ${i + 1}. ${record.name} (${record.category_name})`)
      console.log(`      ID: ${record.id}`)
    })
    
    console.log('\n🎯 KEY INSIGHT:')
    console.log('   Instead of complex cached image storage,')
    console.log('   the website should directly use the images from the database!')
    console.log('   This would be much simpler and eliminate all the complexity.')
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
  }
}

checkDatabase()
