/**
 * Content sanitization utilities for XSS prevention
 * 
 * This provides basic sanitization until DOMPurify can be properly installed.
 * Note: This is a basic implementation. For production, use a proper library like DOMPurify.
 */

// Basic HTML sanitization function
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove potentially dangerous attributes
  html = html.replace(/\s*(on\w+)\s*=\s*["'][^"']*["']/gi, '') // onclick, onload, etc.
  html = html.replace(/\s*javascript\s*:/gi, '') // javascript: URLs
  html = html.replace(/\s*data\s*:/gi, '') // data: URLs
  html = html.replace(/\s*vbscript\s*:/gi, '') // vbscript: URLs
  
  // Remove style attributes that could contain expressions
  html = html.replace(/\s*style\s*=\s*["'][^"']*expression\([^"']*\)["']/gi, '')
  
  // Remove iframe, object, embed tags
  html = html.replace(/<(iframe|object|embed|form|input|button)[^>]*>.*?<\/\1>/gi, '')
  html = html.replace(/<(iframe|object|embed|form|input|button)[^>]*\/>/gi, '')
  
  // Remove link tags that could load external resources
  html = html.replace(/<link[^>]*>/gi, '')
  
  // Remove meta tags
  html = html.replace(/<meta[^>]*>/gi, '')
  
  return html.trim()
}

// Sanitize text content (removes all HTML)
export function sanitizeText(text: string): string {
  if (!text) return ''
  
  return text
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim()
}

// Sanitize for use in attributes
export function sanitizeAttribute(value: string): string {
  if (!value) return ''
  
  return value
    .replace(/[<>'"&]/g, (match) => {
      switch (match) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '"': return '&quot;'
        case "'": return '&#x27;'
        case '&': return '&amp;'
        default: return match
      }
    })
}

// Validate and sanitize URLs
export function sanitizeUrl(url: string): string {
  if (!url) return ''
  
  // Remove dangerous protocols
  if (/^\s*javascript:/i.test(url) || 
      /^\s*data:/i.test(url) || 
      /^\s*vbscript:/i.test(url)) {
    return ''
  }
  
  // Only allow http, https, mailto, and relative URLs
  if (!/^(https?:\/\/|mailto:|\/|\.\/|#)/i.test(url)) {
    return ''
  }
  
  return url.trim()
}