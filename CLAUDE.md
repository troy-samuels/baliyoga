# Bali Yoga Directory - Project Context

## Project Overview
A Next.js 15 application helping users discover yoga studios and retreats across Bali. Users can search, filter, compare locations, leave reviews, and save favorites. Aimed at tourists and yoga enthusiasts visiting Bali.

**Core Features**: Studio/retreat discovery, advanced filtering, wishlist system, reviews/ratings, mobile-first design, Google Maps integration, blog content for SEO.

## Tech Stack
- **Frontend**: Next.js 15.2.4, React 19.1.0, TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.17, Radix UI components, Lucide React icons
- **Database**: Supabase (PostgreSQL) with real-time features
- **Architecture**: SSR-first with strategic client-side hydration
- **Development**: Started with v0, moved to Cursor and Claude Code

## Key Areas Covered
**Locations**: All major Bali areas (Ubud, Canggu, Seminyak, Sanur, Uluwatu, etc.)
**Content**: Studios and retreats with Google Maps-style data plus social handles
**Booking**: Currently contact info only, booking system planned for later
**Reviews**: Star ratings and written experiences

## Current Priorities (Critical - Follow This Order)
1. **Bug Fixes**: Fix bugs without breaking the system - test thoroughly before changes
2. **Systematic Feature Addition**: Add features incrementally with proper testing
3. **Performance**: Improve load speeds and ensure images load correctly
4. **Mobile Optimization**: Enhance mobile experience (already mobile-first but needs improvement)

## Development Guidelines

### Bug Fixing Protocol
- Always test changes in isolation first
- Use plan mode for complex bug fixes to avoid system breakage
- Check both server and client components when fixing hydration issues
- Test mobile and desktop versions after any UI changes
- Verify Supabase queries work properly before implementing
- Use error boundaries to contain potential issues

### Feature Development Workflow
1. **Plan First**: Use plan mode to design feature architecture
2. **Incremental Development**: Build features in small, testable pieces
3. **Mobile-First**: Always consider mobile experience in feature design
4. **Performance Impact**: Consider load speed impact of new features
5. **SEO Consideration**: Ensure new features don't hurt SEO performance

### Performance Optimization Rules
- Use Next.js Image component for all images with WebP/AVIF formats
- Implement proper loading states to prevent layout shifts
- Use React cache() for server-side data deduplication
- Dynamic imports for client-only components
- Optimize Supabase queries - limit data fetching and use proper indexing
- Monitor bundle size with webpack analyzer

### Mobile Optimization Standards
- Touch-friendly interactions (44px minimum touch targets)
- Optimize for slower Indonesian internet connections
- Test on various screen sizes (320px to 768px)
- Ensure maps and interactive elements work on touch devices
- Optimize image sizes for mobile data usage
- Use mobile-optimized components (already in codebase)

### Code Conventions
- **File Structure**: Follow existing Next.js App Router structure
- **Components**: Server components by default, "use client" only when needed
- **Styling**: Use Tailwind utility classes, avoid custom CSS
- **TypeScript**: Use existing types in lib/types.ts, add new types there
- **Data Fetching**: Server-side with cache() for static data, client-side for interactions
- **Error Handling**: Use error boundaries and graceful degradation
- **State Management**: React Context for global state, local state for components

### Supabase Best Practices
- Use lib/supabase-server.ts for server-side operations
- Always handle errors gracefully with try/catch
- Use Row Level Security (RLS) for data protection
- Optimize queries with proper select statements and limits
- Use the existing table: 'v3_bali_yoga_studios_and_retreats'
- Cache frequently accessed data with React cache()

### Component Development
- Follow existing mobile-optimized patterns in components folder
- Use Radix UI components from components/ui/ folder
- Implement proper loading states using components/loading-states.tsx
- Add error handling with components/error-boundary.tsx
- Ensure server/client compatibility (no hydration mismatches)

### Image Optimization
- Always use Next.js Image component
- Set proper width/height attributes
- Use remotePatterns in next.config.mjs for external images
- Implement lazy loading for better performance
- Consider different image sizes for mobile vs desktop
- Use WebP/AVIF formats when possible

### Common Patterns to Follow
- **Data Fetching**: Use getFeaturedStudios/getFeaturedRetreats patterns from lib/supabase-server.ts
- **URL Generation**: Use slug-utils.ts for consistent URL handling
- **Security**: Use security-utils.ts for input sanitization
- **Analytics**: Use lib/analytics.ts for tracking implementations
- **Wishlist**: Follow wishlist-context.tsx patterns for state management

### Testing Before Deployment
- Test on mobile devices (or browser dev tools mobile view)
- Verify images load correctly across different screen sizes
- Check performance with Network tab (simulate slow connections)
- Test wishlist functionality works across sessions
- Verify Supabase queries return expected data
- Ensure no console errors or warnings
- Test navigation between pages works smoothly

### Environment Setup
- All environment variables are in .env.local
- Key variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- Optional: Google Maps API key for enhanced map features
- Use Vercel for deployment (optimized for Next.js)

### When Adding New Features
- Review ARCHITECTURE.md first to understand system design
- Start with plan mode to architect the feature properly
- Consider impact on existing mobile optimization
- Ensure feature works with current Supabase schema
- Add proper TypeScript types in lib/types.ts
- Test feature on both mobile and desktop
- Consider SEO implications for new pages/routes

### Performance Monitoring
- Use Next.js built-in Web Vitals reporting
- Monitor bundle size with npm run analyze
- Check Core Web Vitals scores regularly
- Optimize images and components based on performance data

## Important Notes
- **Non-technical user**: Explain technical concepts clearly when needed
- **Mobile-first**: Always prioritize mobile experience
- **Bali focus**: Consider local internet speeds and user behavior
- **Tourism context**: Users are often traveling with limited data/wifi
- **Gradual improvement**: Build incrementally rather than major overhauls