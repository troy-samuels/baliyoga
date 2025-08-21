# 🔌 API Documentation - Bali Yoga

## Overview

This document outlines the API architecture and endpoints for the Bali Yoga platform. The application uses **Next.js API Routes** with server-side data fetching patterns.

## 🏗️ API Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │   API Routes     │    │   Database      │
│                 │    │                  │    │                 │
│ • Components    │────┤ • Validation     │────│ • Supabase      │
│ • Forms         │    │ • Business Logic │    │ • PostgreSQL    │
│ • Interactions  │    │ • Error Handling │    │ • Real-time     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📡 API Endpoints

### **Core Data APIs**

#### **Studios API**
```typescript
GET /api/studios
```
- **Purpose**: Fetch all yoga studios with filtering
- **Parameters**: 
  - `location?` - Filter by city/region
  - `style?` - Filter by yoga styles
  - `rating?` - Minimum rating filter
- **Response**: Array of studio objects
- **Caching**: Server-side cached with React cache()

#### **Retreats API**
```typescript
GET /api/retreats
```
- **Purpose**: Fetch all yoga retreats with filtering
- **Parameters**:
  - `location?` - Filter by city/region
  - `duration?` - Filter by retreat length
  - `price_range?` - Filter by price range
- **Response**: Array of retreat objects
- **Caching**: Server-side cached with React cache()

### **Content Management APIs**

#### **Blog API**
```typescript
GET /api/blog              # Get all blog posts
POST /api/blog             # Create new blog post (admin)
GET /api/blog/[id]         # Get specific blog post
PUT /api/blog/[id]         # Update blog post (admin)
DELETE /api/blog/[id]      # Delete blog post (admin)
POST /api/blog/submit      # Submit blog post for review
```

#### **Featured Content API**
```typescript
GET /api/featured          # Get current featured content
POST /api/featured         # Update featured content (admin)
GET /api/featured/history  # Get featured content history
```

### **User Interaction APIs**

#### **Reviews API**
```typescript
POST /api/reviews          # Submit a review
GET /api/reviews/[itemId]  # Get reviews for studio/retreat
POST /api/reviews/verify   # Verify review authenticity
DELETE /api/reviews/[id]   # Delete review (admin/owner)
```

### **Utility APIs**

#### **Image Proxy API**
```typescript
GET /api/proxy-image?url=${encodedImageUrl}
```
- **Purpose**: Proxy external images for optimization
- **Security**: CSP-compliant image serving
- **Performance**: Cached and optimized delivery

#### **Upload API**
```typescript
POST /api/upload
```
- **Purpose**: Handle file uploads (images, documents)
- **Security**: File type validation, size limits
- **Storage**: Supabase Storage integration

## 🔧 Server-Side Data Fetching

The application primarily uses **Server Components** with server-side data fetching:

```typescript
// lib/supabase-server.ts
export const getAllStudios = cache(async (): Promise<Studio[]> => {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('*')
      .eq('category_name', 'Yoga studio')
      .order('review_score', { ascending: false, nullsLast: true })
      .limit(100)

    if (error) throw error
    return (data || []).map(transformStudio)
  } catch (error) {
    console.error('Failed to fetch studios:', error)
    return []
  }
})

// Usage in Server Component
export default async function StudiosPage() {
  const studios = await getAllStudios() // Cached automatically
  return <StudioGrid studios={studios} />
}
```

## 📊 Data Flow Patterns

### **Server-Side Rendering (SSR)**
```typescript
// Page Component (Server)
export default async function HomePage() {
  // Parallel data fetching
  const [studios, retreats] = await Promise.all([
    getFeaturedStudios(4),
    getFeaturedRetreats(4)
  ])
  
  return (
    <div>
      <StudioSection studios={studios} />
      <RetreatSection retreats={retreats} />
    </div>
  )
}
```

### **Client-Side Interactions**
```typescript
// Client Component for interactions
"use client"
export function WishlistButton({ itemId }: { itemId: string }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(itemId)
  
  const handleToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(itemId)
    } else {
      addToWishlist(item)
    }
  }
  
  return (
    <button onClick={handleToggle}>
      <Heart fill={isWishlisted ? "red" : "none"} />
    </button>
  )
}
```

## 🔒 Security & Validation

### **Input Validation**
```typescript
// Using Zod for type-safe validation
import { z } from 'zod'

const ReviewSchema = z.object({
  itemId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(10).max(100),
  content: z.string().min(50).max(1000),
  authorName: z.string().min(2).max(50),
  authorEmail: z.string().email().optional()
})

// API Route with validation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = ReviewSchema.parse(body)
    
    // Process validated data...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
  }
}
```

### **Authentication & Authorization**
```typescript
// Supabase Row Level Security (RLS)
-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all reviews
CREATE POLICY "Anyone can view reviews" ON reviews
FOR SELECT USING (true);

-- Policy: Authenticated users can insert reviews
CREATE POLICY "Authenticated users can create reviews" ON reviews
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## 📈 Performance Optimizations

### **Caching Strategy**
```typescript
// React Cache for Server Components
export const getStudios = cache(async () => {
  // This function result is cached for the request
  return await supabase.from('studios').select('*')
})

// SWR for Client-side caching
const { data, error, mutate } = useSWR(
  '/api/studios',
  fetcher,
  {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  }
)
```

### **Database Optimization**
- **Indexes**: Optimized queries with proper database indexes
- **Pagination**: Cursor-based pagination for large datasets  
- **Filtering**: Database-level filtering to reduce data transfer
- **Joins**: Optimized joins to minimize N+1 queries

## 🔄 Error Handling

### **API Error Responses**
```typescript
// Standardized error response format
interface APIError {
  error: string
  message: string
  code?: string
  timestamp: string
  path: string
}

// Example error handling
export async function GET(request: Request) {
  try {
    // API logic...
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch data',
        timestamp: new Date().toISOString(),
        path: request.url
      } as APIError,
      { status: 500 }
    )
  }
}
```

### **Client Error Handling**
```typescript
// Error boundary for API failures
export function APIErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <div className="error-container">
          <p>Failed to load data: {error.message}</p>
          <button onClick={retry}>Try Again</button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
```

## 📋 API Response Formats

### **Studio Object**
```typescript
interface Studio {
  id: string
  name: string
  slug: string
  location: string
  rating: number
  reviewCount: number
  image?: string
  images: string[]
  business_description: string
  phone_number?: string
  website?: string
  location_details: {
    address: string
    area: string
  }
  styles: string[]
  amenities: string[]
  languages_spoken: string[]
  drop_in_price_usd?: number
  price_range: string
  opening_hours: OpeningHours[]
  type: 'studio'
}
```

### **Retreat Object**
```typescript
interface Retreat {
  id: string
  name: string
  slug: string
  location: string
  rating: number
  reviewCount: number
  image?: string
  images: string[]
  business_description: string
  phone_number?: string
  website?: string
  location_details: {
    address: string
    area: string
  }
  duration: string
  price: string
  start_date?: string
  end_date?: string
  max_participants?: number
  accommodation_type?: string
  meals_included?: boolean
  transportation_included?: boolean
  certification_offered?: boolean
  level_requirements?: string[]
  type: 'retreat'
}
```

## 🔧 Development Tools

### **API Testing**
```bash
# Test API endpoints locally
curl http://localhost:3000/api/studios
curl http://localhost:3000/api/retreats
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"itemId":"123","rating":5,"title":"Great!","content":"Amazing experience..."}'
```

### **Database Management**
```sql
-- Useful queries for development
SELECT COUNT(*) FROM v3_bali_yoga_studios_and_retreats WHERE category_name = 'Yoga studio';
SELECT AVG(review_score) FROM v3_bali_yoga_studios_and_retreats;
SELECT location, COUNT(*) FROM v3_bali_yoga_studios_and_retreats GROUP BY location;
```

## 📚 Additional Resources

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js API Routes**: [nextjs.org/docs/app/building-your-application/routing/route-handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Zod Validation**: [zod.dev](https://zod.dev)

---

*Last Updated: August 21, 2025*
*API Version: 2.0 (Post-Architecture-Rebuild)*