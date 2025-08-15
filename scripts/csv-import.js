const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zioqkkdhvgrkznxyxtik.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Function to parse array fields from CSV
function parseArrayField(value) {
  if (!value || value === '') return []
  
  // Handle different CSV array formats
  if (value.startsWith('[') && value.endsWith(']')) {
    // JSON array format: ["item1", "item2"]
    try {
      return JSON.parse(value)
    } catch (e) {
      console.warn('Failed to parse JSON array:', value)
      return []
    }
  } else if (value.includes(',')) {
    // Comma-separated format: item1,item2,item3
    return value.split(',').map(item => item.trim()).filter(Boolean)
  } else if (value.includes(';')) {
    // Semicolon-separated format: item1;item2;item3
    return value.split(';').map(item => item.trim()).filter(Boolean)
  } else {
    // Single item
    return [value.trim()]
  }
}

// Function to parse boolean fields from CSV
function parseBoolean(value) {
  if (value === null || value === undefined || value === '') return null
  
  const normalizedValue = value.toString().toLowerCase().trim()
  return normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes'
}

// Function to parse integer fields from CSV
function parseInteger(value) {
  if (value === null || value === undefined || value === '') return null
  
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}

// Function to parse decimal fields from CSV
function parseDecimal(value) {
  if (value === null || value === undefined || value === '') return null
  
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
}

// Function to transform CSV row to database format
function transformCsvRow(row) {
  return {
    id: parseInteger(row.id),
    name: row.name || null,
    city: row.city || null,
    address: row.address || null,
    phone_number: row.phone_number || null,
    website: row.website || null,
    category_name: row.category_name || null,
    review_score: parseDecimal(row.review_score),
    review_count: parseInteger(row.review_count),
    images: row.images ? (row.images.startsWith('[') ? JSON.parse(row.images) : [row.images]) : null,
    opening_hours: row.opening_hours ? JSON.parse(row.opening_hours) : null,
    description: row.description || null,
    postcode: row.postcode || null
  }
}

// Main import function
async function importCsvToSupabase(csvFilePath) {
  console.log('Starting CSV import...')
  
  const rows = []
  
  // Read and parse CSV file
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const transformedRow = transformCsvRow(row)
          rows.push(transformedRow)
        } catch (error) {
          console.error('Error transforming row:', error, row)
        }
      })
      .on('end', async () => {
        console.log(`Parsed ${rows.length} rows from CSV`)
        
        try {
          // Process rows in batches to avoid overwhelming Supabase
          const batchSize = 100
          let successful = 0
          let failed = 0
          
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize)
            console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(rows.length/batchSize)}...`)
            
            try {
              // Use upsert to update existing records or insert new ones
              const { data, error } = await supabase
                .from('v3_bali_yoga_studios_and_retreats')
                .upsert(batch, { 
                  onConflict: 'id',
                  ignoreDuplicates: false 
                })
              
              if (error) {
                console.error('Batch error:', error)
                failed += batch.length
              } else {
                console.log(`✅ Successfully processed ${batch.length} records`)
                successful += batch.length
              }
              
              // Add a small delay between batches
              await new Promise(resolve => setTimeout(resolve, 500))
              
            } catch (batchError) {
              console.error('Batch processing error:', batchError)
              failed += batch.length
            }
          }
          
          console.log('\n📊 Import Summary:')
          console.log(`✅ Successful: ${successful}`)
          console.log(`❌ Failed: ${failed}`)
          console.log(`📈 Total: ${rows.length}`)
          
          resolve({ successful, failed, total: rows.length })
          
        } catch (error) {
          console.error('Import error:', error)
          reject(error)
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error)
        reject(error)
      })
  })
}

// Run the import if this script is called directly
if (require.main === module) {
  const csvFilePath = process.argv[2]
  
  if (!csvFilePath) {
    console.error('Usage: node csv-import.js <path-to-csv-file>')
    process.exit(1)
  }
  
  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV file not found:', csvFilePath)
    process.exit(1)
  }
  
  console.log('🚀 Starting CSV import to Supabase...')
  console.log('📁 CSV file:', csvFilePath)
  console.log('🔗 Supabase URL:', SUPABASE_URL)
  
  importCsvToSupabase(csvFilePath)
    .then((result) => {
      console.log('\n🎉 Import completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Import failed:', error)
      process.exit(1)
    })
}

module.exports = { importCsvToSupabase } 