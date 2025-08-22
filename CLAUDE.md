# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A Next.js 15 application for discovering yoga studios and retreats across Bali. Mobile-first design with SSR architecture, Supabase backend, and comprehensive filtering/search capabilities.

## Common Development Commands

```bash
npm run dev              # Start development server on localhost:3000
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint checks
npm run analyze         # Analyze bundle size (opens in browser)
npm run import-csv      # Import CSV data to Supabase
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
- **Utils**: `lib/*-utils.ts` - Domain-specific utilities (slug, security, analytics)
- **Routes**: `app/` - Next.js App Router structure

### Database Schema
- **Main table**: `v3_bali_yoga_studios_and_retreats`
- **Featured tables**: `featured_studios`, `featured_retreats`
- **Reviews table**: `reviews`
- Always use Row Level Security (RLS) and handle errors with try/catch

## Critical Development Rules

### Performance & Mobile-First
1. Always use Next.js `Image` component with width/height attributes
2. Test on mobile viewport (320px-768px) with touch interactions
3. Optimize for slow Indonesian internet - use loading states
4. 44px minimum touch targets for all interactive elements
5. Use `remotePatterns` in next.config.mjs for external images

### Bug Fixing Protocol
1. Test changes in isolation before implementing
2. Verify both server and client components work
3. Check mobile and desktop views
4. Test Supabase queries before deploying
5. Use error boundaries to contain issues

### Code Standards
- Follow existing patterns in neighboring files
- Use Tailwind utilities (no custom CSS)
- Import Radix components from `components/ui/`
- Add proper TypeScript types in `lib/types.ts`
- Use existing utility functions (don't recreate)

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing Checklist
Before completing any task:
- [ ] Mobile view works correctly (test at 375px width)
- [ ] No console errors or warnings
- [ ] Images load with proper fallbacks
- [ ] Supabase queries return expected data
- [ ] No hydration mismatch errors
- [ ] Loading states prevent layout shifts

## Deployment
Optimized for Vercel deployment. Use `npm run build` to test production build locally.

## Important Context
- **User is non-technical** - Explain technical concepts clearly
- **Tourism focus** - Users often have limited data/wifi while traveling
- **Gradual improvement** - Build incrementally, don't break existing features
- **Bali-specific** - Consider local internet speeds and user behavior patterns