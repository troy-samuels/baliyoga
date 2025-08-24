// Generate a solid color image as fallback for blog and static content only
// NOTE: Studio and retreat images now use CachedImage component with Supabase storage
export function generateColorFallback(width: number = 300, height: number = 200, color: string = '#e6ceb3'): string {
  return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`
} 