# 🚀 Deployment Guide - Bali Yoga

## 📋 Table of Contents
- [Quick Deployment](#quick-deployment)
- [Platform-Specific Guides](#platform-specific-guides)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## ⚡ Quick Deployment

### **Vercel (Recommended)**
Optimized for Next.js applications with zero configuration:

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build and deploy
vercel

# 3. Configure environment variables in Vercel dashboard
# 4. Enable automatic deployments from Git
```

**Why Vercel?**
- ✅ Zero-config Next.js optimization
- ✅ Global CDN with edge caching
- ✅ Automatic HTTPS and custom domains
- ✅ Built-in analytics and monitoring
- ✅ Seamless Git integration

## 🏗️ Platform-Specific Guides

### **Vercel Deployment**

#### **Initial Setup**
```bash
# Clone and install
git clone https://github.com/troy-samuels/baliyoga.git
cd baliyoga
npm install

# Deploy to Vercel
npx vercel

# Follow the prompts:
# Set up and deploy? [Y/n] y
# Which scope? [your-username]
# Link to existing project? [y/N] n
# What's your project's name? bali-yoga
# In which directory? ./ 
# Override settings? [y/N] n
```

#### **Environment Variables**
Add in Vercel Dashboard → Settings → Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

#### **Build Configuration**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1", "fra1", "hkg1"]
}
```

### **Netlify Deployment**

#### **Setup Process**
```bash
# 1. Build settings in Netlify dashboard:
Build command: npm run build
Publish directory: .next/static
Node version: 18

# 2. netlify.toml configuration
```

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  environment = { NODE_ENV = "production" }
```

### **Cloudflare Pages**

#### **Configuration**
```bash
# Build settings:
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
```

### **Self-Hosted Docker**

#### **Dockerfile**
```dockerfile
# Use Node.js 18 Alpine
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy built application
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

## 🔧 Environment Configuration

### **Required Environment Variables**

```env
# Database (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Site Configuration (Required)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### **Optional Environment Variables**

```env
# Google Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Security
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com

# Email (if using contact forms)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# Analytics
VERCEL_ANALYTICS_ID=your_analytics_id
```

### **Environment Validation**
```typescript
// lib/env-validation.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

## ⚡ Performance Optimization

### **Build Optimization**

#### **Next.js Configuration**
```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    gzipSize: true,
  },
  
  // Compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
```

#### **Bundle Analysis**
```bash
# Analyze bundle size
npm run analyze

# Check specific chunks
npm run analyze:server  # Server bundle
npm run analyze:browser # Client bundle
```

### **Database Optimization**

#### **Supabase Configuration**
```sql
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_studios_location ON v3_bali_yoga_studios_and_retreats (city);
CREATE INDEX IF NOT EXISTS idx_studios_rating ON v3_bali_yoga_studios_and_retreats (review_score DESC);
CREATE INDEX IF NOT EXISTS idx_studios_category ON v3_bali_yoga_studios_and_retreats (category_name);

-- Enable RLS for security
ALTER TABLE v3_bali_yoga_studios_and_retreats ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read" ON v3_bali_yoga_studios_and_retreats
FOR SELECT USING (true);
```

#### **Connection Pooling**
```typescript
// lib/supabase-server.ts
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})
```

## 📊 Monitoring & Analytics

### **Vercel Analytics**
```typescript
// pages/_app.tsx or app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
```

### **Google Analytics**
```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

export const gtag = {
  pageview: (url: string) => {
    window.gtag('config', GA_TRACKING_ID, { page_path: url })
  },
  event: ({ action, category, label, value }) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  },
}
```

### **Error Monitoring**
```typescript
// lib/error-monitoring.ts
export function reportError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    console.error('Production Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    })
  } else {
    console.error('Development Error:', error, context)
  }
}
```

## 🔒 Security Configuration

### **Content Security Policy**
```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https: blob:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://api.supabase.co https://www.google-analytics.com;
              frame-src 'self' https://www.google.com;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ]
  },
}
```

### **Rate Limiting**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const limit = 100 // Limit each IP to 100 requests per 10 minutes
  const windowMs = 10 * 60 * 1000 // 10 minutes

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 0, lastReset: Date.now() })
  }

  const record = rateLimit.get(ip)
  const isNewWindow = Date.now() - record.lastReset > windowMs

  if (isNewWindow) {
    record.count = 1
    record.lastReset = Date.now()
  } else {
    record.count += 1
  }

  if (record.count > limit) {
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

## 🛠️ Troubleshooting

### **Common Build Issues**

#### **TypeScript Errors**
```bash
# Temporary bypass during deployment
npm run build -- --ignore-ts-errors

# Or fix in next.config.mjs
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Use only for deployment emergencies
  },
}
```

#### **Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max_old_space_size=4096' next build"
  }
}
```

#### **Image Optimization Issues**
```javascript
// next.config.mjs - Disable image optimization if needed
const nextConfig = {
  images: {
    unoptimized: true, // Only for debugging
  },
}
```

### **Runtime Issues**

#### **Environment Variable Problems**
```typescript
// Debug environment variables
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  nodeEnv: process.env.NODE_ENV,
})
```

#### **Database Connection Issues**
```typescript
// Test Supabase connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('v3_bali_yoga_studios_and_retreats')
      .select('count')
      .limit(1)
    
    if (error) throw error
    console.log('Database connection successful')
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}
```

### **Performance Issues**

#### **Slow Build Times**
```bash
# Analyze build performance
ANALYZE=true npm run build

# Use SWC compiler (already enabled in Next.js 13+)
# Check .next/cache for build cache issues
rm -rf .next/cache && npm run build
```

#### **Large Bundle Size**
```javascript
// next.config.mjs - Bundle optimization
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  modularizeImports: {
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },
}
```

## 📈 Deployment Checklist

### **Pre-Deployment**
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Build process successful locally
- [ ] Bundle size optimized (`npm run analyze`)
- [ ] Performance tested (`npm run build && npm start`)
- [ ] Security headers configured
- [ ] Error boundaries in place

### **Post-Deployment**
- [ ] Site loads correctly
- [ ] All major pages accessible
- [ ] API endpoints functional
- [ ] Database queries working
- [ ] Images loading properly
- [ ] Analytics tracking active
- [ ] Error monitoring active
- [ ] SSL certificate valid
- [ ] Performance metrics acceptable

### **Monitoring Setup**
- [ ] Uptime monitoring configured
- [ ] Error tracking active
- [ ] Performance monitoring enabled
- [ ] Database performance monitored
- [ ] CDN performance tracked

---

## 🎯 Quick Deploy Commands

### **Development → Staging**
```bash
git push origin staging
# Auto-deploys to staging environment
```

### **Staging → Production**
```bash
git push origin main
# Auto-deploys to production
```

### **Hotfix Deployment**
```bash
git checkout main
git pull origin main
git checkout -b hotfix/urgent-fix
# Make fixes
git commit -m "Hotfix: critical issue"
git push origin hotfix/urgent-fix
# Create PR and merge immediately
```

---

*Happy deploying! 🚀*

*Last Updated: August 21, 2025*