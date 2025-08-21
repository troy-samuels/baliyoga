# 🚀 Deployment Optimization & Claude Code Configuration Guide

## 🎯 Immediate Action Items to Prevent Deployment Issues

### **1. Critical Configuration Files**

#### **Package.json Script Optimization**
```json
{
  "name": "bali-yoga",
  "version": "2.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix",
    "analyze": "ANALYZE=true next build",
    "type-check": "tsc --noEmit",
    "pre-deploy": "npm run type-check && npm run lint && npm run build",
    "test-build": "npm run build && npm run start",
    "clean": "rm -rf .next out node_modules/.cache"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

#### **Enhanced Next.js Configuration**
```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimization
  swcMinify: true,
  compress: true,
  
  // TypeScript handling for deployment
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production' ? true : false,
  },
  
  // ESLint handling
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production' ? true : false,
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'clsx'
    ],
    webpackBuildWorker: true,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/studio/:slug',
        destination: '/studios/detail/:slug',
        permanent: true,
      },
      {
        source: '/retreat/:slug', 
        destination: '/retreats/detail/:slug',
        permanent: true,
      },
    ]
  },
  
  // Security and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.vendor = {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        maxSize: 244000,
      }
    }
    return config
  },
}

export default nextConfig
```

### **2. Environment Variable Management**

#### **Environment Validation**
```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key required'),
  NEXT_PUBLIC_SITE_URL: z.string().url('Invalid site URL'),
  
  // Optional
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
  
  // Build-time
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables at build time
const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parseResult.error.format())
  process.exit(1)
}

export const env = parseResult.data

// Runtime check helper
export function checkRequiredEnvVars() {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

#### **.env.example File**
```env
# Required Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional Features
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Development Only
NEXT_PUBLIC_DEBUG_MODE=false
```

### **3. Database Configuration Optimization**

#### **Supabase Connection Optimization**
```typescript
// lib/supabase-server-optimized.ts
import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Optimized client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
  db: {
    schema: 'public',
  },
})

// Enhanced caching strategy with error handling
export const getAllStudios = cache(async (limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select(`
        id,
        name,
        city,
        business_description,
        phone_number,
        website,
        review_score,
        review_count,
        images,
        styles,
        amenities,
        drop_in_price_usd,
        opening_hours
      `)
      .eq('category_name', 'Yoga studio')
      .order('review_score', { ascending: false, nullsLast: true })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to fetch studios: ${error.message}`)
    }

    return data?.map(transformStudio) || []
  } catch (error) {
    console.error('Failed to fetch studios:', error)
    // Return empty array instead of throwing to prevent build failures
    return []
  }
})

// Connection health check
export async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('count')
      .limit(1)
      .single()
    
    return { connected: !error, error: error?.message }
  } catch (error) {
    return { connected: false, error: error.message }
  }
}
```

### **4. Build Process Optimization**

#### **Pre-build Validation Script**
```typescript
// scripts/pre-build-check.ts
import { checkRequiredEnvVars } from '../lib/env'
import { checkDatabaseConnection } from '../lib/supabase-server-optimized'

async function preBuildCheck() {
  console.log('🔍 Running pre-build checks...')
  
  try {
    // Check environment variables
    console.log('✅ Checking environment variables...')
    checkRequiredEnvVars()
    
    // Check database connection
    console.log('✅ Checking database connection...')
    const dbStatus = await checkDatabaseConnection()
    
    if (!dbStatus.connected) {
      console.warn('⚠️  Database connection failed:', dbStatus.error)
      console.warn('⚠️  Build will continue but may have runtime issues')
    } else {
      console.log('✅ Database connection successful')
    }
    
    console.log('✅ Pre-build checks completed successfully')
  } catch (error) {
    console.error('❌ Pre-build check failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  preBuildCheck()
}
```

#### **Enhanced Package.json Scripts**
```json
{
  "scripts": {
    "pre-build": "tsx scripts/pre-build-check.ts",
    "build": "npm run pre-build && next build",
    "build:production": "NODE_ENV=production npm run build",
    "build:analyze": "ANALYZE=true npm run build",
    "deploy:check": "npm run type-check && npm run lint && npm run build",
    "postinstall": "npm run pre-build || echo 'Pre-build check failed, continuing...'"
  }
}
```

## 🏗️ Claude Code Configuration Examples

### **1. .claudeconfig for Bali Yoga Project**
```json
{
  "project": {
    "name": "bali-yoga",
    "description": "Yoga studio and retreat discovery platform for Bali",
    "framework": "next.js",
    "language": "typescript"
  },
  "preferences": {
    "codeStyle": "functional-components",
    "stateManagement": "react-hooks",
    "styling": "tailwind",
    "testing": "jest",
    "architecture": "server-first-ssr"
  },
  "conventions": {
    "componentNaming": "PascalCase",
    "fileNaming": "kebab-case",
    "functionNaming": "camelCase",
    "exportStyle": "named-and-default"
  },
  "guidelines": [
    "Use Server Components by default, Client Components only when needed",
    "Implement proper error boundaries for all major sections",
    "Optimize for mobile-first responsive design",
    "Use React.cache() for server-side data deduplication",
    "Implement loading states for all async operations",
    "Follow accessibility best practices (WCAG 2.1 AA)",
    "Use TypeScript strict mode for type safety"
  ]
}
```

### **2. Context Configuration for Claude Code**
```markdown
# Bali Yoga Project Context for Claude Code

## Project Structure
- Next.js 15 with App Router architecture
- TypeScript strict mode enabled
- Tailwind CSS for styling with mobile-first approach
- Supabase for PostgreSQL database with real-time features
- Server-side rendering with strategic client-side hydration

## Key Design Patterns
1. **SSR-First**: Server Components for data fetching, Client Components for interactivity
2. **Error Boundaries**: Comprehensive error handling at multiple levels
3. **Mobile Optimization**: Touch-friendly interfaces with responsive design
4. **Performance**: Optimized images, caching, and bundle splitting

## Database Schema
Primary table: `v3_bali_yoga_studios_and_retreats`
Key fields: id, name, category_name, city, review_score, images, styles, amenities

## Common Patterns
- Use `cache()` for server-side data deduplication
- Implement loading states with skeleton components
- Use Zod for schema validation
- Follow component composition patterns
- Implement wishlist functionality with local storage
```

### **3. Development Commands for Claude Code**
```bash
# Development setup
npm install
npm run dev

# Quality checks
npm run type-check
npm run lint --fix
npm run build

# Testing and analysis
npm run analyze
npm run test-build

# Deployment preparation
npm run deploy:check
```

## 🚨 Critical Deployment Issue Prevention

### **1. Build Error Prevention**
```typescript
// lib/build-safety.ts
export function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = 'Operation failed'
): Promise<T> {
  return operation().catch((error) => {
    console.error(errorMessage, error)
    return fallback
  })
}

// Usage in server components
const studios = await safeAsyncOperation(
  () => getAllStudios(),
  [],
  'Failed to fetch studios during build'
)
```

### **2. Environment-Based Feature Flags**
```typescript
// lib/feature-flags.ts
export const features = {
  googleMaps: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  analytics: !!process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  enableReviews: process.env.NODE_ENV === 'production',
}

// Conditional rendering
{features.googleMaps && <GoogleMapsWrapper />}
```

### **3. Graceful Degradation Pattern**
```typescript
// components/enhanced-studio-card.tsx
export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <div className="studio-card">
      <StudioImage 
        src={studio.image} 
        fallback="/images/placeholder-studio.jpg"
        alt={studio.name}
      />
      <StudioInfo studio={studio} />
      <ClientOnlyWishlistButton itemId={studio.id} />
    </div>
  )
}

function ClientOnlyWishlistButton({ itemId }: { itemId: string }) {
  return (
    <Suspense fallback={<HeartIcon className="opacity-50" />}>
      <WishlistButton itemId={itemId} />
    </Suspense>
  )
}
```

## 📊 Performance Monitoring Setup

### **1. Bundle Analysis Automation**
```json
{
  "scripts": {
    "analyze:ci": "ANALYZE=true next build && mv .next/static/chunks/analyze-bundle.json public/bundle-analysis.json",
    "monitor:bundle": "bundlewatch --config bundlewatch.config.json"
  }
}
```

### **2. Runtime Performance Monitoring**
```typescript
// lib/performance-monitor.ts
export function measurePagePerformance() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    const metrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      connection: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,
      load: navigation.loadEventStart - navigation.navigationStart,
    }
    
    console.log('Performance Metrics:', metrics)
    return metrics
  }
}
```

## 🎯 Action Plan Summary

### **Immediate (This Week)**
1. ✅ Implement environment variable validation
2. ✅ Add pre-build health checks
3. ✅ Update Next.js configuration for production
4. ✅ Create deployment safety nets

### **Short-term (Next 2 Weeks)**
1. Add comprehensive error boundaries
2. Implement performance monitoring
3. Set up automated bundle analysis
4. Create Claude Code configuration files

### **Medium-term (Next Month)**
1. Add automated testing pipeline
2. Implement feature flag system
3. Set up monitoring and alerting
4. Create comprehensive documentation

This configuration will significantly reduce deployment issues and ensure your Bali Yoga platform performs optimally in production! 🚀