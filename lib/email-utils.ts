/**
 * Email Extraction and Validation Utilities
 * Comprehensive tools for email discovery, validation, and normalization
 * Target: 100% email coverage across all profiles
 */

interface EmailExtractionResult {
  emails: string[]
  sources: string[]
  confidence: 'high' | 'medium' | 'low'
  validated: boolean
  discoveryMethod: 'website_scraping' | 'social_media' | 'google_places' | 'pattern_generation' | 'existing'
}

interface EmailValidationResult {
  email: string
  isValid: boolean
  isDeliverable: boolean
  isBusiness: boolean
  domain: string
  provider: string
  confidence: number
  errors: string[]
}

/**
 * Extract email addresses from HTML content
 */
export function extractEmailsFromHTML(html: string, baseUrl?: string): EmailExtractionResult {
  const result: EmailExtractionResult = {
    emails: [],
    sources: [],
    confidence: 'low',
    validated: false,
    discoveryMethod: 'website_scraping'
  }

  // Common email patterns - ordered by reliability
  const emailPatterns = [
    // Standard email format
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    // Email in links
    /mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi,
    // Email with surrounding text
    /(?:email|contact|reach|write)(?:\s*[:\-\s]){0,3}([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi
  ]

  // Extract all email matches
  const foundEmails = new Set<string>()
  
  emailPatterns.forEach(pattern => {
    const matches = html.match(pattern)
    if (matches) {
      matches.forEach(match => {
        // Clean up the match
        let email = match.toLowerCase()
        if (email.includes('mailto:')) {
          email = email.replace('mailto:', '')
        }
        // Extract just the email part if there's surrounding text
        const emailMatch = email.match(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/i)
        if (emailMatch) {
          foundEmails.add(emailMatch[1].toLowerCase())
        }
      })
    }
  })

  // Filter out common spam/invalid patterns
  const validEmails = Array.from(foundEmails).filter(email => {
    return !isSpamEmail(email) && isValidEmailFormat(email)
  })

  // Prioritize business emails
  const businessEmails = validEmails.filter(email => isBusinessEmail(email))
  const otherEmails = validEmails.filter(email => !isBusinessEmail(email))

  result.emails = [...businessEmails, ...otherEmails]

  // Determine confidence based on email quality
  if (businessEmails.length > 0) {
    result.confidence = 'high'
    result.sources.push('business_contact')
  } else if (validEmails.length > 0) {
    result.confidence = 'medium' 
    result.sources.push('general_contact')
  }

  // Add source context if base URL provided
  if (baseUrl) {
    result.sources.push(baseUrl)
  }

  return result
}

/**
 * Generate likely email patterns for a business
 */
export function generateEmailPatterns(businessName: string, website?: string): string[] {
  const patterns: string[] = []

  if (!website) return patterns

  // Extract domain from website
  const domain = extractDomainFromUrl(website)
  if (!domain) return patterns

  // Clean business name for email generation
  const cleanName = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 20) // Limit length

  // Common business email patterns
  const commonPrefixes = [
    'info',
    'contact',
    'hello',
    'bookings',
    'studio',
    'yoga',
    'reservations',
    'admin',
    'office',
    cleanName.slice(0, 10)
  ]

  commonPrefixes.forEach(prefix => {
    if (prefix && prefix.length > 2) {
      patterns.push(`${prefix}@${domain}`)
    }
  })

  return patterns.filter((pattern, index, arr) => arr.indexOf(pattern) === index) // Remove duplicates
}

/**
 * Validate email format and deliverability
 */
export function validateEmail(email: string): EmailValidationResult {
  const result: EmailValidationResult = {
    email: email.toLowerCase().trim(),
    isValid: false,
    isDeliverable: false,
    isBusiness: false,
    domain: '',
    provider: '',
    confidence: 0,
    errors: []
  }

  // Basic format validation
  if (!isValidEmailFormat(email)) {
    result.errors.push('Invalid email format')
    return result
  }

  result.isValid = true
  
  // Extract domain
  const [localPart, domain] = email.split('@')
  result.domain = domain
  
  // Determine provider type
  result.provider = getEmailProvider(domain)
  result.isBusiness = isBusinessEmail(email)

  // Calculate confidence score
  result.confidence = calculateEmailConfidence(email)

  // Note: For production, you might want to integrate with email verification APIs
  // For now, we'll assume valid format emails are deliverable
  result.isDeliverable = result.isValid && !isSpamEmail(email)

  return result
}

/**
 * Extract contact page URLs from HTML
 */
export function extractContactPageUrls(html: string, baseUrl: string): string[] {
  const contactUrls: string[] = []
  
  // Common contact page patterns
  const contactPatterns = [
    /href=["']([^"']*contact[^"']*)/gi,
    /href=["']([^"']*about[^"']*)/gi,
    /href=["']([^"']*booking[^"']*)/gi,
    /href=["']([^"']*reservation[^"']*)/gi
  ]

  contactPatterns.forEach(pattern => {
    const matches = html.matchAll(pattern)
    for (const match of matches) {
      let url = match[1]
      if (url) {
        // Convert relative URLs to absolute
        if (url.startsWith('/')) {
          const baseUrlObj = new URL(baseUrl)
          url = `${baseUrlObj.protocol}//${baseUrlObj.host}${url}`
        } else if (!url.startsWith('http')) {
          url = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${url}`
        }
        contactUrls.push(url)
      }
    }
  })

  return [...new Set(contactUrls)] // Remove duplicates
}

/**
 * Extract emails from social media bio/contact info
 */
export function extractEmailsFromSocialProfile(profileData: string): string[] {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const matches = profileData.match(emailPattern)
  
  if (!matches) return []
  
  return matches
    .map(email => email.toLowerCase())
    .filter(email => isValidEmailFormat(email) && !isSpamEmail(email))
}

/**
 * Normalize and clean email addresses
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Score email completeness for quality assessment
 */
export function scoreEmailCompleteness(emailData: { email_address?: string }): {
  hasEmail: boolean
  isBusinessEmail: boolean
  confidence: number
  points: number
} {
  const hasEmail = Boolean(emailData.email_address?.trim())
  const isBusiness = hasEmail ? isBusinessEmail(emailData.email_address!) : false
  
  let confidence = 0
  let points = 0

  if (hasEmail) {
    confidence = calculateEmailConfidence(emailData.email_address!)
    points = 8 // Base points for having email
    if (isBusiness) {
      points += 2 // Bonus for business email
    }
  }

  return {
    hasEmail,
    isBusinessEmail: isBusiness,
    confidence,
    points
  }
}

// Helper Functions

function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isSpamEmail(email: string): boolean {
  const spamPatterns = [
    'noreply',
    'no-reply', 
    'donotreply',
    'example.com',
    'test.com',
    'fake',
    'spam',
    'abuse'
  ]
  
  return spamPatterns.some(pattern => email.toLowerCase().includes(pattern))
}

function isBusinessEmail(email: string): boolean {
  const businessPrefixes = [
    'info',
    'contact',
    'hello',
    'bookings',
    'studio',
    'yoga',
    'reservations',
    'admin',
    'office',
    'booking'
  ]
  
  const [localPart] = email.split('@')
  return businessPrefixes.some(prefix => localPart.toLowerCase().startsWith(prefix))
}

function getEmailProvider(domain: string): string {
  const providers: Record<string, string> = {
    'gmail.com': 'Gmail',
    'yahoo.com': 'Yahoo',
    'hotmail.com': 'Hotmail',
    'outlook.com': 'Outlook',
    'icloud.com': 'iCloud',
    'protonmail.com': 'ProtonMail'
  }

  return providers[domain.toLowerCase()] || 'Custom'
}

function calculateEmailConfidence(email: string): number {
  let confidence = 50 // Base confidence

  // Higher confidence for business emails
  if (isBusinessEmail(email)) {
    confidence += 30
  }

  // Lower confidence for free email providers
  const [, domain] = email.split('@')
  const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
  if (freeProviders.includes(domain.toLowerCase())) {
    confidence -= 20
  }

  // Higher confidence for custom domains
  if (!freeProviders.includes(domain.toLowerCase())) {
    confidence += 20
  }

  return Math.max(0, Math.min(100, confidence))
}

function extractDomainFromUrl(url: string): string | null {
  try {
    // Handle URLs without protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch (error) {
    return null
  }
}

export type {
  EmailExtractionResult,
  EmailValidationResult
}