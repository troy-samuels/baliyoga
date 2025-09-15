# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A Next.js 15 application for discovering yoga studios and retreats across Bali, evolving into a comprehensive wellness marketplace. Mobile-first design with SSR architecture, Supabase backend, and comprehensive filtering/search capabilities.

**Strategic Goal**: Transform from high-quality directory into £100,000/month revenue marketplace through 4 phases:
- **Phase 0 (Months 1-3)**: Foundation Excellence - 95% quality score, perfect UX
- **Phase 1 (Months 4-6)**: Engagement & Analytics - Studio dashboards, community building  
- **Phase 2 (Months 7-9)**: Premium Value - Monetization with clear ROI
- **Phase 3 (Months 10-12)**: Full Marketplace - Complete ecosystem

**Current Status**: Phase 0 completion ready with 450 profiles, 85.5% quality score, 63.8% email coverage, comprehensive information availability system implemented

## 🚀 Recent Feature Implementations

### **Information Availability System (September 2025)**
- **Contact Information Filters**: Users can filter by phone, website, email, business description availability
- **Social Media Filters**: Filter by Instagram, Facebook, WhatsApp, YouTube, TikTok presence
- **Visual Availability Indicators**: Card components show icons for available contact info and social media
- **Enhanced Search Logic**: Updated search utilities to support data availability filtering
- **Mobile-First Design**: Touch-friendly indicators with proper accessibility labels
- **Performance Optimized**: Efficient filtering with minimal impact on page load times

### **Code Quality Improvements**
- **Production Console Cleanup**: Removed debug console.log statements, kept error handling
- **ESLint Configuration**: Added strict Next.js recommended configuration
- **Build Optimization**: Verified production build performance and bundle size
- **Component Enhancement**: Updated card components with comprehensive prop interfaces

## Common Development Commands

### **Core Development Commands**
```bash
npm run dev              # Start development server on localhost:3000
npm run build           # Build for production (test locally before deployment)
npm run start           # Start production server
npm run lint            # Run ESLint checks
npm run analyze         # Analyze bundle size (opens in browser)
npm run import-csv      # Import CSV data to Supabase
```

### **Phase 0: Foundation Excellence Commands**
```bash
# Data Quality Enhancement (Priority 1)
npm run assess-quality            # Current: 82.7% → Target: 95%+
npm run extract-emails-websites   # Complete email enhancement (42.4% → 85%+)
npm run enhance-emails-google     # Google Places email discovery
npm run validate-generate-emails  # Advanced pattern generation

# Image Management (Priority 2) 
npm run analyze-images            # Identify missing authentic images
npm run cache-images              # Download authentic yoga images
npm run update-image-urls         # Apply cached images to database

# Content & SEO (Priority 3)
npm run generate-blog-posts       # AI-powered blog content generation
npm run optimize-seo              # Schema markup and technical SEO
npm run analyze-competitors       # SEO competitor analysis
```

### **Phase 1: Studio Engagement Commands** (Coming Months 4-6)
```bash
# Studio Dashboard Development
npm run create-studio-auth        # Studio owner authentication system
npm run setup-analytics-tracking  # Studio analytics and dashboard
npm run test-booking-system       # Basic booking system testing

# Community Features
npm run setup-newsletter          # Email newsletter system
npm run create-events-calendar    # Yoga events and workshops calendar
npm run test-wishlist-system      # Enhanced wishlist functionality
```

## Architecture & Code Organization

### SSR-First Pattern with Zero Hydration Issues
```
Server Components (default) → Static Rendering → Client Hydration (minimal)
```
- **Server Components by default** - Only use "use client" when interactivity is required
- **Data fetching** - Use `lib/supabase-server.ts` with React `cache()` for deduplication
- **Client state** - React Context in `contexts/` (e.g., wishlist-context.tsx)
- **No hydration mismatches** - Avoid `typeof window` checks, use proper loading states

### Key File Locations
- **Types**: `lib/types.ts` - All TypeScript interfaces/types go here
- **Database**: `lib/supabase-server.ts` - Server-side Supabase operations  
- **Components**: `components/ui/` - Radix UI base components
- **Utils**: `lib/*-utils.ts` - Domain-specific utilities (slug, security, analytics, email)
- **Routes**: `app/` - Next.js App Router structure
- **Scripts**: `scripts/` - Data processing, enhancement, and quality scripts

### Database Schema Evolution
**Current Tables:**
- **Main table**: `v3_bali_yoga_studios_and_retreats` (450 profiles, 82.7% quality)
- **Featured tables**: `featured_studios`, `featured_retreats`  
- **Reviews table**: `reviews`

**Phase 0 Additions:**
- **Blog system**: `blog_posts`, `blog_categories`
- **User engagement**: `user_wishlists`, `search_queries`, `newsletter_subscribers`
- **Quality tracking**: Add quality scoring columns to main table

**Phase 1 Additions:**
- **Studio management**: `studio_owners`, `studio_analytics`, `studio_access_logs`
- **Events**: `yoga_events`, `event_registrations`
- **Community**: `wishlist_collections`, `user_profiles`

**Phase 2 Additions:**  
- **Monetization**: `subscription_plans`, `studio_subscriptions`, `booking_requests`
- **Payments**: `payment_transactions`, `commission_calculations`, `studio_payouts`

Always use Row Level Security (RLS) and handle errors with try/catch for all database operations

## Critical Development Rules

### **Phase 0 Development Priorities**
1. **Data Quality First**: All development should improve database quality score (target: 95%+)
2. **Mobile Excellence**: Perfect mobile experience before desktop enhancements
3. **Performance Budget**: <2s page load, <100ms FID, <0.1 CLS
4. **SEO Foundation**: All new pages must have proper meta tags and schema markup
5. **User Trust**: Every feature should build user confidence and studio relationships

### Performance & Mobile-First
1. Always use Next.js `Image` component with width/height attributes
2. Test on mobile viewport (320px-768px) with touch interactions  
3. Optimize for slow Indonesian internet - use loading states and Progressive Web App features
4. 44px minimum touch targets for all interactive elements
5. Use `remotePatterns` in next.config.mjs for external images
6. **New**: Implement service worker for offline functionality
7. **New**: Use WebP/AVIF formats for all images with fallbacks

### Bug Fixing Protocol
1. Test changes in isolation before implementing
2. Verify both server and client components work
3. Check mobile and desktop views
4. Test Supabase queries before deploying
5. Use error boundaries to contain issues

### Code Standards  
- Follow existing patterns in neighboring files
- Use Tailwind utilities (no custom CSS unless absolutely necessary)
- Import Radix components from `components/ui/`
- Add proper TypeScript types in `lib/types.ts` - **mandatory for all new features**
- Use existing utility functions (don't recreate)
- **New**: All components must be accessible (WCAG 2.1 AA compliance)
- **New**: Include proper error boundaries for all new features
- **New**: Add analytics tracking for user interactions
- **New**: Follow single-responsibility principle - one feature per component/function

## Environment Variables

### **Current Required Variables**
```bash
# Core Database (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For scripts and admin operations

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # https://baliyoga.com in production

# Optional Integrations
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key        # Maps and location features
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_places_key    # Business data enhancement
```

### **Phase 1+ Additional Variables** (Coming Months 4-6)
```bash
# Email & Newsletter
RESEND_API_KEY=your_resend_key                      # Email delivery service
NEWSLETTER_FROM_EMAIL=newsletter@baliyoga.com

# Analytics & Monitoring  
NEXT_PUBLIC_GA_TRACKING_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn                          # Error tracking
```

### **Phase 2+ Payment Variables** (Coming Months 7-9)
```bash
# Stripe Payment Processing
STRIPE_PUBLIC_KEY=pk_live_your_public_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Commission & Payout Configuration
STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id
```

## Testing Checklist

### **Phase 0 Testing Requirements**
Before completing any task:
- [ ] **Mobile Excellence**: Test at 320px, 375px, 768px widths with touch interactions
- [ ] **Performance**: Page load <2s, LCP <1.5s, FID <100ms, CLS <0.1
- [ ] **Accessibility**: Screen reader compatibility, keyboard navigation, color contrast
- [ ] **No console errors or warnings** in development and production builds  
- [ ] **Images load with proper fallbacks** and WebP/AVIF optimization
- [ ] **Supabase queries return expected data** with proper error handling
- [ ] **No hydration mismatch errors** between server and client
- [ ] **Loading states prevent layout shifts** during data fetching
- [ ] **SEO verification**: Meta tags, schema markup, sitemap updates
- [ ] **Database quality impact**: Does this improve the quality score?

### **Cross-Browser Testing** (Phase 0+)
- [ ] Safari Mobile (iOS 14+) - Primary Bali tourist demographic
- [ ] Chrome Mobile (Android 10+) - Secondary demographic
- [ ] Desktop Chrome/Safari - Studio owner management
- [ ] Slow 3G network simulation - Indonesian internet conditions

### **Security Testing** (Phase 1+)
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (DOMPurify for user content)
- [ ] CSRF protection for forms
- [ ] Rate limiting on API endpoints

## Deployment Strategy

### **Current Deployment** (Phase 0)
- **Platform**: Vercel (optimized for Next.js 15)
- **Database**: Supabase (PostgreSQL with real-time features)
- **CDN**: Vercel Edge Network for static assets
- **Domain**: Custom domain with SSL certificates
- **Testing**: `npm run build` to test production build locally

### **Phase 0 Deployment Enhancements**
```bash
# Production build verification
npm run build                    # Verify production build success
npm run start                    # Test production mode locally
npm run analyze                  # Ensure bundle size remains optimal (<500KB)

# Performance monitoring setup  
npm run lighthouse-ci            # Automated lighthouse testing (future)
npm run test-core-web-vitals     # Core Web Vitals verification (future)
```

### **Scaling Preparations** (Phase 1+)
- **CDN Enhancement**: Cloudflare or AWS CloudFront for global image delivery
- **Database Scaling**: Read replicas for analytics queries
- **Monitoring**: Application performance monitoring (APM) integration
- **Backup Strategy**: Automated daily backups with point-in-time recovery
- **Cache Layer**: Redis for session data and frequently accessed profiles

### **Security & Compliance**
- **SSL/TLS**: End-to-end encryption for all traffic
- **Headers**: Security headers (CSP, HSTS, X-Frame-Options)
- **API Protection**: Rate limiting and DDoS protection
- **Data Protection**: GDPR compliance for EU visitors
- **Payment Security**: PCI DSS compliance via Stripe (Phase 2+)

## **Phase 0: Foundation Excellence - Data Quality System**

### **Current Status**: 82.7% Quality Score → **Target**: 95%+ 
*Major improvement opportunity: Email coverage increased from 28.4% to 42.4% through sophisticated email enhancement system*

### **Quality Scoring Framework** (100 points total)
- **Core Information (20pts)** - Name, location, category ✅ (100% complete)
- **Contact Information (30pts)** - Phone, website, address, email (current: ~83% - **major focus area**)
- **Visual Content (20pts)** - Authentic images ✅ (84.4% complete with authentic images)
- **Social Media (15pts)** - Instagram, Facebook, handles (64.4% Instagram coverage)
- **User Trust (10pts)** - Reviews and ratings ✅ (good coverage)
- **Rich Content (5pts)** - Descriptions, amenities, hours (improvement needed)

### **Phase 0 Quality Improvement Pipeline**
```bash
# Priority 1: Complete Email Enhancement (42.4% → 85%+)
npm run extract-emails-websites   # Website scraping (proven effective)
npm run enhance-emails-google     # Google Places + pattern generation
npm run validate-generate-emails  # Advanced pattern validation

# Priority 2: Complete Contact Information
npm run enhance-contacts          # Google Places phone/website discovery
npm run manual-contact-research   # High-priority studio research (new)

# Priority 3: Content & Visual Enhancement  
npm run cache-images              # Complete authentic image coverage
npm run generate-descriptions     # AI-powered business descriptions (new)
npm run standardize-amenities     # Standardized amenity categories (new)
```

### **Email Enhancement Success Story**
**Achievement**: 63 new email addresses added through 4-phase enhancement:
1. **Website Extraction**: 47+ profiles processed, high-quality business emails found
2. **Social Media Discovery**: Rate-limited by Facebook (expected), partial success
3. **Google Places Enhancement**: 40/40 success rate with pattern generation  
4. **Advanced Patterns**: 27+ profiles with intelligent business email patterns

**Result**: Database quality improved from 82.0% to 82.7%, email field dropped from #1 to #2 improvement priority

### **Priority Improvement Areas** (Phase 0 Focus)
1. **Complete Email Coverage** (259 profiles missing) - **Primary focus** 
   - Target: 85%+ email coverage through continued enhancement
   - High-impact: 5 points per email × 200+ profiles = 1,000+ quality points

2. **Phone Numbers** (65 profiles missing) - **Quick wins**
   - Target: 95%+ phone coverage via Google Places + manual research
   - Medium-impact: 8 points per phone × 65 profiles = 520 quality points

3. **Business Descriptions** (180+ profiles missing) - **AI opportunity**
   - Target: 95%+ description coverage via AI generation + manual curation
   - Medium-impact: 3 points per description × 180 profiles = 540 quality points

4. **Website URLs** (148 profiles missing) - **Manual research required**
   - Target: 90%+ website coverage through social media and direct research
   - High-impact: 8 points per website × 148 profiles = 1,184 quality points

### **Key Quality Enhancement Files**
- `scripts/assess-data-quality.ts` - Comprehensive quality scoring (updated with email metrics)
- `scripts/extract-emails-websites.ts` - Proven website email extraction system
- `scripts/enhance-emails-google-places.ts` - Pattern generation with 100% success rate
- `scripts/validate-and-generate-emails.ts` - Advanced business email patterns
- `lib/email-utils.ts` - Comprehensive email discovery and validation toolkit

### **Quality Verification Process**
1. **Before Development**: Run `npm run assess-quality` to establish baseline
2. **During Development**: Track quality score impact of each feature
3. **After Completion**: Verify quality improvement and update metrics
4. **Weekly Review**: Monitor quality regression and improvement opportunities

## Important Context & Strategic Approach

### **User-Centric Development**
- **User is non-technical** - Explain technical concepts clearly, focus on benefits over features
- **Tourism focus** - Users often have limited data/wifi while traveling in Indonesia
- **Mobile-first always** - Bali tourists primarily use mobile devices for discovery
- **Trust is paramount** - Every feature must build confidence in studio authenticity

### **Business Strategy Context**
- **Quality over quantity** - 95% database quality target for competitive differentiation
- **Gradual value creation** - Build exceptional free experience before monetization  
- **Studio relationships first** - All development should strengthen studio partnerships
- **Revenue timeline** - Foundation (0-6 months), monetization (7-12 months)

### **Technical Philosophy**
- **Gradual improvement** - Build incrementally, never break existing features
- **Performance budget** - All changes must maintain <2s page load times
- **Scalability preparation** - Code for current needs, architect for 10x growth
- **Data-driven decisions** - Track impact of every feature on user and studio behavior

### **Bali-Specific Considerations**
- **Local internet speeds** - Optimize for slow 3G/4G connections
- **Cultural sensitivity** - Respect local yoga traditions and authentic practices  
- **Seasonal patterns** - Account for high season (Jul-Aug, Dec-Jan) traffic spikes
- **Language considerations** - English primary, Indonesian secondary for local market

---

## 📚 Reference Documents

### **Strategic Planning**
- `MASTER_IMPLEMENTATION_ROADMAP.md` - Complete 12-month implementation plan
- `PROJECT_OVERVIEW.md` - Comprehensive business and technical overview  
- `__Bali Yoga Platform_ £100,000_Month Revenue Strat.md` - Original revenue strategy document

### **Implementation Priority**
**Current Phase**: Phase 0 - Foundation Excellence (Months 1-3)  
**Next Milestone**: 95% database quality score, 85% email coverage, perfect mobile UX  
**Success Metric**: Platform ready for studio dashboard rollout in Month 4

*All development should align with Phase 0 priorities and contribute to the strategic goal of £100,000/month revenue within 12 months.*