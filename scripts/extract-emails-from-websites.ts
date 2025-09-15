/**
 * Website Email Extraction Script
 * Discovers email addresses from business websites to achieve 100% email coverage
 * Part of comprehensive email enhancement strategy
 */

import { createClient } from '@supabase/supabase-js'
import { 
  extractEmailsFromHTML, 
  extractContactPageUrls, 
  validateEmail, 
  normalizeEmail,
  EmailExtractionResult 
} from '../lib/email-utils'

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

interface WebsiteEmailExtractionResult {
  profileId: string
  profileName: string
  website: string
  extractedEmails: string[]
  contactPagesChecked: string[]
  bestEmail?: string
  confidence: 'high' | 'medium' | 'low'
  success: boolean
  errors: string[]
  discoveryMethod: string[]
}

interface EmailExtractionReport {
  totalProcessed: number
  successfulExtractions: number
  failedExtractions: number
  totalEmailsFound: number
  businessEmailsFound: number
  results: WebsiteEmailExtractionResult[]
  estimatedQualityImprovement: number
}

/**
 * Fetch and parse HTML content from a website
 */
async function fetchWebsiteContent(url: string, timeout = 10000): Promise<string | null> {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    console.log(`📄 Fetching: ${url}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.log(`⚠️ HTTP ${response.status} for ${url}`)
      return null
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      console.log(`⚠️ Non-HTML content for ${url}`)
      return null
    }

    const html = await response.text()
    return html

  } catch (error) {
    console.log(`❌ Failed to fetch ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return null
  }
}

/**
 * Extract emails from a single website with deep scanning
 */
async function extractEmailsFromWebsite(
  profileId: string,
  profileName: string,
  website: string
): Promise<WebsiteEmailExtractionResult> {
  const result: WebsiteEmailExtractionResult = {
    profileId,
    profileName,
    website,
    extractedEmails: [],
    contactPagesChecked: [],
    confidence: 'low',
    success: false,
    errors: [],
    discoveryMethod: []
  }

  try {
    const allFoundEmails = new Set<string>()
    let bestEmailConfidence = 0

    // Step 1: Extract emails from main page
    console.log(`🔍 Scanning main page: ${profileName}`)
    const mainPageHtml = await fetchWebsiteContent(website)
    
    if (!mainPageHtml) {
      result.errors.push('Could not fetch main page content')
      return result
    }

    // Extract emails from main page
    const mainPageEmails = extractEmailsFromHTML(mainPageHtml, website)
    mainPageEmails.emails.forEach(email => allFoundEmails.add(email))
    
    if (mainPageEmails.emails.length > 0) {
      result.discoveryMethod.push('main_page')
      console.log(`📧 Found ${mainPageEmails.emails.length} emails on main page`)
    }

    // Step 2: Find and scan contact pages
    const contactPageUrls = extractContactPageUrls(mainPageHtml, website)
    console.log(`📄 Found ${contactPageUrls.length} potential contact pages`)

    // Scan up to 3 contact pages to avoid overwhelming servers
    for (let i = 0; i < Math.min(3, contactPageUrls.length); i++) {
      const contactUrl = contactPageUrls[i]
      
      try {
        console.log(`🔍 Scanning contact page: ${contactUrl}`)
        const contactPageHtml = await fetchWebsiteContent(contactUrl, 8000)
        
        if (contactPageHtml) {
          result.contactPagesChecked.push(contactUrl)
          const contactEmails = extractEmailsFromHTML(contactPageHtml, contactUrl)
          
          contactEmails.emails.forEach(email => allFoundEmails.add(email))
          
          if (contactEmails.emails.length > 0) {
            result.discoveryMethod.push('contact_page')
            console.log(`📧 Found ${contactEmails.emails.length} additional emails on contact page`)
          }
        }
        
        // Respectful delay between contact page requests
        await new Promise(resolve => setTimeout(resolve, 1500))
        
      } catch (error) {
        console.log(`⚠️ Error scanning contact page ${contactUrl}: ${error}`)
        continue
      }
    }

    // Step 3: Validate and rank emails
    const validatedEmails: Array<{email: string, confidence: number}> = []
    
    for (const email of Array.from(allFoundEmails)) {
      const validation = validateEmail(email)
      if (validation.isValid) {
        validatedEmails.push({
          email: normalizeEmail(email),
          confidence: validation.confidence
        })
      }
    }

    // Sort by confidence (business emails first, then by confidence score)
    validatedEmails.sort((a, b) => b.confidence - a.confidence)
    
    result.extractedEmails = validatedEmails.map(v => v.email)

    // Step 4: Select best email and determine confidence
    if (validatedEmails.length > 0) {
      result.bestEmail = validatedEmails[0].email
      bestEmailConfidence = validatedEmails[0].confidence
      result.success = true

      // Determine overall confidence
      if (bestEmailConfidence >= 80) {
        result.confidence = 'high'
      } else if (bestEmailConfidence >= 60) {
        result.confidence = 'medium'
      } else {
        result.confidence = 'low'
      }

      console.log(`✅ Successfully extracted ${result.extractedEmails.length} emails for ${profileName}`)
      console.log(`🎯 Best email: ${result.bestEmail} (${result.confidence} confidence)`)
    } else {
      result.errors.push('No valid emails found')
      console.log(`📄 No emails found for ${profileName}`)
    }

  } catch (error) {
    result.errors.push(`Extraction error: ${error}`)
    console.log(`❌ Error extracting emails from ${profileName}: ${error}`)
  }

  return result
}

/**
 * Get profiles with websites but no emails
 */
async function getProfilesForEmailExtraction(): Promise<any[]> {
  try {
    console.log('🔍 Finding profiles with websites but missing emails...')

    const { data: profiles, error } = await supabaseAdmin
      .from('v3_bali_yoga_studios_and_retreats')
      .select(`
        id,
        name,
        website,
        email_address,
        review_score,
        review_count
      `)
      .not('website', 'is', null)
      .neq('website', '')
      .or('email_address.is.null,email_address.eq.')

    if (error) throw error

    if (!profiles || profiles.length === 0) {
      console.log('❌ No profiles with websites but missing emails found')
      return []
    }

    console.log(`📋 Found ${profiles.length} profiles with websites but no emails`)
    
    // Sort by review score for prioritization
    return profiles.sort((a, b) => (b.review_score || 0) - (a.review_score || 0))

  } catch (error) {
    console.error('Error finding profiles for email extraction:', error)
    return []
  }
}

/**
 * Apply extracted emails to database
 */
async function applyEmailExtractions(results: WebsiteEmailExtractionResult[]): Promise<void> {
  console.log('\n💾 Applying extracted emails to database...')

  const successfulResults = results.filter(r => r.success && r.bestEmail)

  for (const result of successfulResults) {
    try {
      const { error } = await supabaseAdmin
        .from('v3_bali_yoga_studios_and_retreats')
        .update({ 
          email_address: result.bestEmail
        })
        .eq('id', result.profileId)

      if (error) {
        console.error(`❌ Database update failed for ${result.profileName}:`, error)
      } else {
        console.log(`✅ Updated ${result.profileName} with email: ${result.bestEmail} (${result.confidence} confidence)`)
      }

    } catch (error) {
      console.error(`❌ Error updating ${result.profileName}:`, error)
    }

    // Small delay between updates
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

/**
 * Generate extraction report
 */
function generateExtractionReport(report: EmailExtractionReport): void {
  console.log('\n📊 WEBSITE EMAIL EXTRACTION REPORT')
  console.log('='.repeat(60))

  console.log(`\n📈 SUMMARY`)
  console.log(`Total websites processed: ${report.totalProcessed}`)
  console.log(`Successful extractions: ${report.successfulExtractions}`)
  console.log(`Failed extractions: ${report.failedExtractions}`)
  console.log(`Success rate: ${((report.successfulExtractions/report.totalProcessed)*100).toFixed(1)}%`)

  console.log(`\n📧 EMAIL DISCOVERY`)
  console.log(`Total emails found: ${report.totalEmailsFound}`)
  console.log(`Business emails found: ${report.businessEmailsFound}`)
  console.log(`Average emails per profile: ${(report.totalEmailsFound/report.successfulExtractions || 0).toFixed(1)}`)

  if (report.successfulExtractions > 0) {
    console.log(`\n✅ SUCCESSFUL EXTRACTIONS (Top 10):`)
    report.results
      .filter(r => r.success)
      .sort((a, b) => {
        const confidenceOrder = { high: 3, medium: 2, low: 1 }
        return confidenceOrder[b.confidence] - confidenceOrder[a.confidence]
      })
      .slice(0, 10)
      .forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.profileName} → ${result.bestEmail} (${result.confidence})`)
      })
  }

  console.log(`\n🔍 DISCOVERY METHODS`)
  const mainPageDiscoveries = report.results.filter(r => r.discoveryMethod.includes('main_page')).length
  const contactPageDiscoveries = report.results.filter(r => r.discoveryMethod.includes('contact_page')).length
  
  console.log(`Main page extractions: ${mainPageDiscoveries}`)
  console.log(`Contact page extractions: ${contactPageDiscoveries}`)

  console.log(`\n🎯 QUALITY IMPROVEMENT IMPACT`)
  console.log(`Estimated database quality increase: +${report.estimatedQualityImprovement.toFixed(2)}%`)
  console.log(`Email coverage improvement: +${report.successfulExtractions} profiles`)
  
  // Calculate email coverage improvement
  const emailPoints = report.successfulExtractions * 8 // Each email worth 8 points
  console.log(`Quality score points added: ${emailPoints}`)
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🚀 Starting website email extraction process...\n')

    // Get profiles for extraction
    const profilesToProcess = await getProfilesForEmailExtraction()

    if (profilesToProcess.length === 0) {
      console.log('✨ No profiles found needing email extraction from websites!')
      return
    }

    const report: EmailExtractionReport = {
      totalProcessed: profilesToProcess.length,
      successfulExtractions: 0,
      failedExtractions: 0,
      totalEmailsFound: 0,
      businessEmailsFound: 0,
      results: [],
      estimatedQualityImprovement: 0
    }

    console.log(`📊 Processing ${profilesToProcess.length} websites for email extraction...\n`)
    console.log('⚠️ Note: This process includes respectful website scanning with delays')

    // Process websites in smaller batches to be respectful to servers
    const maxProfiles = Math.min(50, profilesToProcess.length) // Process up to 50 profiles
    console.log(`📊 Processing first ${maxProfiles} profiles for email extraction...\n`)

    for (let i = 0; i < maxProfiles; i++) {
      const profile = profilesToProcess[i]
      
      console.log(`\n🔄 Processing profile ${i + 1}/${maxProfiles}: ${profile.name}`)
      
      const result = await extractEmailsFromWebsite(profile.id, profile.name, profile.website)
      report.results.push(result)

      if (result.success) {
        report.successfulExtractions++
        report.totalEmailsFound += result.extractedEmails.length
        
        // Count business emails
        const businessEmails = result.extractedEmails.filter(email => {
          const businessPrefixes = ['info', 'contact', 'hello', 'bookings', 'studio', 'yoga']
          const [localPart] = email.split('@')
          return businessPrefixes.some(prefix => localPart.toLowerCase().startsWith(prefix))
        })
        report.businessEmailsFound += businessEmails.length
      } else {
        report.failedExtractions++
      }

      // Show progress
      console.log(`📈 Progress: ${i + 1}/${maxProfiles} (${(((i + 1)/maxProfiles)*100).toFixed(1)}%)`)

      // Respectful delay between website scans
      if (i < maxProfiles - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000)) // 3 second delay between profiles
      }
    }

    // Calculate estimated quality improvement
    const emailPoints = report.successfulExtractions * 8 // Each email worth 8 points
    report.estimatedQualityImprovement = emailPoints / 450 // Total profiles in database

    // Apply successful extractions to database
    if (report.successfulExtractions > 0) {
      await applyEmailExtractions(report.results)
    }

    // Generate final report
    generateExtractionReport(report)

    console.log('\n🎉 Website email extraction completed!')

  } catch (error) {
    console.error('💥 Email extraction process failed:', error)
    process.exit(1)
  }
}

// Run the extraction
if (require.main === module) {
  main()
}

export { main as extractEmailsFromWebsites }