/**
 * Database Quality Assessment Script
 * Provides comprehensive quality scoring and improvement recommendations
 * Complies with CLAUDE.md: error handling, performance optimization
 */

import { createClient } from '@supabase/supabase-js'
import { hasAuthenticImages, countAuthenticImages } from '../lib/image-validation-utils'
import { parseImageUrls } from '../lib/image-utils'

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

interface QualityMetrics {
  // Core Information (20 points)
  hasName: boolean                    // Required
  hasLocation: boolean                // Required  
  hasCategory: boolean                // Required
  
  // Contact Information (30 points)
  hasPhoneNumber: boolean            // 8 points
  hasWebsite: boolean                // 8 points
  hasAddress: boolean                // 9 points
  hasEmail: boolean                  // 5 points (new email scoring)
  
  // Visual Content (20 points)
  hasAuthenticImages: boolean        // 15 points
  hasMultipleImages: boolean         // 5 points (3+ images)
  
  // Social Media Presence (15 points)
  hasInstagram: boolean              // 6 points (most important for yoga)
  hasFacebook: boolean               // 4 points
  hasSocialMediaVariety: boolean     // 3 points (TikTok/YouTube)
  hasInstagramHandle: boolean        // 2 points (handle completeness)
  
  // User Trust & Social Proof (10 points)
  hasRating: boolean                 // 6 points
  hasReviews: boolean                // 2 points
  hasGoodRating: boolean             // 2 points (4.0+)
  
  // Rich Content (5 points)
  hasBusinessDescription: boolean    // 3 points
  hasOpeningHours: boolean           // 2 points
}

interface ProfileQualityScore {
  profileId: string
  profileName: string
  profileType: 'studio' | 'retreat'
  location: string
  metrics: QualityMetrics
  totalScore: number
  maxPossibleScore: number
  qualityPercentage: number
  missingFields: string[]
  improvementPriority: 'critical' | 'high' | 'medium' | 'low'
}

interface QualityReport {
  totalProfiles: number
  averageQualityScore: number
  scoreDistribution: {
    excellent: number    // 90-100%
    good: number        // 80-89%
    fair: number        // 70-79%
    poor: number        // <70%
  }
  profileScores: ProfileQualityScore[]
  fieldCompleteness: {
    [key: string]: {
      present: number
      missing: number
      percentage: number
    }
  }
  improvementOpportunities: {
    field: string
    impact: number
    profilesAffected: number
    difficultyLevel: 'easy' | 'medium' | 'hard'
  }[]
}

/**
 * Calculate quality score for a single profile
 */
function calculateProfileQuality(profile: any): ProfileQualityScore {
  const metrics: QualityMetrics = {
    // Core Information (20 points) - Always present
    hasName: Boolean(profile.name?.trim()),
    hasLocation: Boolean(profile.city?.trim()),
    hasCategory: Boolean(profile.category_name?.trim()),
    
    // Contact Information (30 points)
    hasPhoneNumber: Boolean(profile.phone_number?.trim()),
    hasWebsite: Boolean(profile.website?.trim()),
    hasAddress: Boolean(profile.address?.trim()),
    hasEmail: Boolean(profile.email_address?.trim()),
    
    // Visual Content (20 points)
    hasAuthenticImages: hasAuthenticImages(profile.images),
    hasMultipleImages: countAuthenticImages(profile.images) >= 3,
    
    // Social Media Presence (15 points)
    hasInstagram: Boolean(profile.instagram_url?.trim()),
    hasFacebook: Boolean(profile.facebook_url?.trim()),
    hasSocialMediaVariety: Boolean(profile.tiktok_url?.trim() || profile.youtube_url?.trim()),
    hasInstagramHandle: Boolean(profile.instagram_handle?.trim()),
    
    // User Trust & Social Proof (10 points)
    hasRating: Boolean(profile.review_score && profile.review_score > 0),
    hasReviews: Boolean(profile.review_count && profile.review_count > 0),
    hasGoodRating: Boolean(profile.review_score && profile.review_score >= 4.0),
    
    // Rich Content (5 points)
    hasBusinessDescription: Boolean(profile.business_description?.trim() && profile.business_description.trim().length > 50),
    hasOpeningHours: Boolean(profile.opening_hours && typeof profile.opening_hours === 'string' && profile.opening_hours.trim().length > 10)
  }

  // Calculate total score based on point values
  let totalScore = 0
  const maxPossibleScore = 100

  // Core Information (20 points) - Required fields
  if (metrics.hasName && metrics.hasLocation && metrics.hasCategory) {
    totalScore += 20
  }

  // Contact Information (30 points)
  if (metrics.hasPhoneNumber) totalScore += 8
  if (metrics.hasWebsite) totalScore += 8
  if (metrics.hasAddress) totalScore += 9
  if (metrics.hasEmail) totalScore += 5

  // Visual Content (20 points)
  if (metrics.hasAuthenticImages) totalScore += 15
  if (metrics.hasMultipleImages) totalScore += 5

  // Social Media Presence (15 points)
  if (metrics.hasInstagram) totalScore += 6
  if (metrics.hasFacebook) totalScore += 4
  if (metrics.hasSocialMediaVariety) totalScore += 3
  if (metrics.hasInstagramHandle) totalScore += 2

  // User Trust & Social Proof (10 points)
  if (metrics.hasRating) totalScore += 6
  if (metrics.hasReviews) totalScore += 2
  if (metrics.hasGoodRating) totalScore += 2

  // Rich Content (5 points)
  if (metrics.hasBusinessDescription) totalScore += 3
  if (metrics.hasOpeningHours) totalScore += 2

  const qualityPercentage = (totalScore / maxPossibleScore) * 100

  // Identify missing fields
  const missingFields: string[] = []
  if (!metrics.hasPhoneNumber) missingFields.push('phone_number')
  if (!metrics.hasWebsite) missingFields.push('website')
  if (!metrics.hasAddress) missingFields.push('address')
  if (!metrics.hasEmail) missingFields.push('email_address')
  if (!metrics.hasAuthenticImages) missingFields.push('authentic_images')
  if (!metrics.hasMultipleImages) missingFields.push('multiple_images')
  if (!metrics.hasInstagram) missingFields.push('instagram_url')
  if (!metrics.hasFacebook) missingFields.push('facebook_url')
  if (!metrics.hasSocialMediaVariety) missingFields.push('social_media_variety')
  if (!metrics.hasInstagramHandle) missingFields.push('instagram_handle')
  if (!metrics.hasBusinessDescription) missingFields.push('business_description')
  if (!metrics.hasOpeningHours) missingFields.push('opening_hours')

  // Determine improvement priority
  let improvementPriority: 'critical' | 'high' | 'medium' | 'low' = 'low'
  if (qualityPercentage < 50) improvementPriority = 'critical'
  else if (qualityPercentage < 70) improvementPriority = 'high'
  else if (qualityPercentage < 85) improvementPriority = 'medium'

  const isStudio = profile.category_name?.toLowerCase().includes('studio')
  
  return {
    profileId: profile.id,
    profileName: profile.name,
    profileType: isStudio ? 'studio' : 'retreat',
    location: profile.city || 'Bali',
    metrics,
    totalScore,
    maxPossibleScore,
    qualityPercentage,
    missingFields,
    improvementPriority
  }
}

/**
 * Assess overall database quality
 */
async function assessDatabaseQuality(): Promise<QualityReport> {
  try {
    console.log('🔍 Analyzing database quality...')

    const { data: profiles, error } = await supabaseAdmin
      .from('v3_bali_yoga_studios_and_retreats')
      .select(`
        id,
        name,
        category_name,
        city,
        phone_number,
        website,
        address,
        email_address,
        images,
        review_score,
        review_count,
        business_description,
        opening_hours,
        instagram_url,
        instagram_handle,
        facebook_url,
        tiktok_url,
        youtube_url
      `)

    if (error) throw error

    if (!profiles || profiles.length === 0) {
      throw new Error('No profiles found in database')
    }

    console.log(`📊 Analyzing ${profiles.length} profiles...`)

    // Calculate quality scores for all profiles
    const profileScores = profiles.map(calculateProfileQuality)
    
    // Calculate average quality score
    const averageQualityScore = profileScores.reduce((sum, profile) => 
      sum + profile.qualityPercentage, 0) / profileScores.length

    // Score distribution
    const scoreDistribution = {
      excellent: profileScores.filter(p => p.qualityPercentage >= 90).length,
      good: profileScores.filter(p => p.qualityPercentage >= 80 && p.qualityPercentage < 90).length,
      fair: profileScores.filter(p => p.qualityPercentage >= 70 && p.qualityPercentage < 80).length,
      poor: profileScores.filter(p => p.qualityPercentage < 70).length
    }

    // Field completeness analysis
    const fieldCompleteness: QualityReport['fieldCompleteness'] = {}
    const fieldMappings = {
      'phone_number': 'hasPhoneNumber',
      'website': 'hasWebsite', 
      'address': 'hasAddress',
      'email_address': 'hasEmail',
      'business_description': 'hasBusinessDescription',
      'amenities': 'hasAmenities',
      'opening_hours': 'hasOpeningHours'
    }
    
    Object.entries(fieldMappings).forEach(([fieldName, metricsKey]) => {
      let present = 0
      let missing = 0
      
      profileScores.forEach(profile => {
        if (profile.metrics[metricsKey as keyof QualityMetrics]) {
          present++
        } else {
          missing++
        }
      })
      
      fieldCompleteness[fieldName] = {
        present,
        missing,
        percentage: (present / profileScores.length) * 100
      }
    })

    // Improvement opportunities
    const improvementOpportunities = [
      {
        field: 'phone_number',
        impact: 8,
        profilesAffected: fieldCompleteness.phone_number?.missing || 0,
        difficultyLevel: 'easy' as const
      },
      {
        field: 'website',
        impact: 8,
        profilesAffected: fieldCompleteness.website?.missing || 0,
        difficultyLevel: 'easy' as const
      },
      {
        field: 'address',
        impact: 9,
        profilesAffected: fieldCompleteness.address?.missing || 0,
        difficultyLevel: 'easy' as const
      },
      {
        field: 'email_address',
        impact: 5,
        profilesAffected: fieldCompleteness.email_address?.missing || 0,
        difficultyLevel: 'medium' as const
      },
      {
        field: 'business_description',
        impact: 3,
        profilesAffected: fieldCompleteness.business_description?.missing || 0,
        difficultyLevel: 'medium' as const
      },
      {
        field: 'opening_hours',
        impact: 2,
        profilesAffected: fieldCompleteness.opening_hours?.missing || 0,
        difficultyLevel: 'medium' as const
      },
      {
        field: 'amenities',
        impact: 3,
        profilesAffected: fieldCompleteness.amenities?.missing || 0,
        difficultyLevel: 'hard' as const
      }
    ].sort((a, b) => (b.impact * b.profilesAffected) - (a.impact * a.profilesAffected))

    return {
      totalProfiles: profiles.length,
      averageQualityScore,
      scoreDistribution,
      profileScores,
      fieldCompleteness,
      improvementOpportunities
    }

  } catch (error) {
    console.error('Error assessing database quality:', error)
    throw error
  }
}

/**
 * Generate comprehensive quality report
 */
function generateQualityReport(report: QualityReport): void {
  console.log('\n📊 DATABASE QUALITY REPORT')
  console.log('='.repeat(60))

  console.log(`\n🎯 OVERALL QUALITY SCORE: ${report.averageQualityScore.toFixed(1)}%`)
  
  console.log(`\n📈 PROFILE DISTRIBUTION`)
  console.log(`Total Profiles: ${report.totalProfiles}`)
  console.log(`Excellent (90-100%): ${report.scoreDistribution.excellent} (${((report.scoreDistribution.excellent/report.totalProfiles)*100).toFixed(1)}%)`)
  console.log(`Good (80-89%): ${report.scoreDistribution.good} (${((report.scoreDistribution.good/report.totalProfiles)*100).toFixed(1)}%)`)
  console.log(`Fair (70-79%): ${report.scoreDistribution.fair} (${((report.scoreDistribution.fair/report.totalProfiles)*100).toFixed(1)}%)`)
  console.log(`Poor (<70%): ${report.scoreDistribution.poor} (${((report.scoreDistribution.poor/report.totalProfiles)*100).toFixed(1)}%)`)

  console.log(`\n📋 FIELD COMPLETENESS`)
  Object.entries(report.fieldCompleteness).forEach(([field, stats]) => {
    console.log(`${field.replace('_', ' ')}: ${stats.percentage.toFixed(1)}% complete (${stats.missing} missing)`)
  })

  console.log(`\n🚀 TOP IMPROVEMENT OPPORTUNITIES`)
  report.improvementOpportunities.slice(0, 5).forEach((opp, index) => {
    const potentialImpact = opp.impact * opp.profilesAffected
    console.log(`${index + 1}. ${opp.field.replace('_', ' ')} - Impact: ${potentialImpact} points - ${opp.profilesAffected} profiles - Difficulty: ${opp.difficultyLevel}`)
  })

  // Show critical/high priority profiles
  const highPriorityProfiles = report.profileScores
    .filter(p => p.improvementPriority === 'critical' || p.improvementPriority === 'high')
    .sort((a, b) => a.qualityPercentage - b.qualityPercentage)

  if (highPriorityProfiles.length > 0) {
    console.log(`\n⚠️  PROFILES NEEDING IMMEDIATE ATTENTION (${highPriorityProfiles.length})`)
    highPriorityProfiles.slice(0, 10).forEach(profile => {
      console.log(`• ${profile.profileName} (${profile.qualityPercentage.toFixed(1)}%) - Missing: ${profile.missingFields.join(', ')}`)
    })
  }

  console.log(`\n🎯 PATH TO 95% QUALITY SCORE`)
  const currentScore = report.averageQualityScore
  const targetScore = 95
  const gap = targetScore - currentScore
  
  console.log(`Current: ${currentScore.toFixed(1)}% | Target: ${targetScore}% | Gap: ${gap.toFixed(1)}%`)
  
  if (gap > 0) {
    console.log(`\n💡 RECOMMENDED ACTIONS:`)
    if (gap > 15) {
      console.log(`1. 🔥 Focus on contact information (phone, website, address) - High impact, easy wins`)
      console.log(`2. 📝 Enhance business descriptions - Medium impact`)
      console.log(`3. 🕒 Add opening hours - Lower impact but completes profile`)
    } else if (gap > 5) {
      console.log(`1. 📞 Complete missing contact information`)
      console.log(`2. 🔧 Add amenities and features`)
      console.log(`3. 📝 Improve business descriptions`)
    } else {
      console.log(`1. 🎯 Focus on remaining gaps in highest-rated profiles`)
      console.log(`2. 🔧 Add detailed amenities`)
      console.log(`3. ✨ Enhance with premium features`)
    }
  } else {
    console.log(`🎉 Congratulations! You've exceeded the 95% quality target!`)
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🚀 Starting comprehensive database quality assessment...\n')

    const report = await assessDatabaseQuality()
    generateQualityReport(report)

    console.log('\n✅ Quality assessment complete!')

  } catch (error) {
    console.error('💥 Assessment failed:', error)
    process.exit(1)
  }
}

// Run the assessment
if (require.main === module) {
  main()
}

export { assessDatabaseQuality, type QualityReport }