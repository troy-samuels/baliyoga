# 🏗️ Bali Yoga - Architectural Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Architecture Pattern](#architecture-pattern)
- [Directory Structure](#directory-structure)
- [Data Flow](#data-flow)
- [Key Components](#key-components)
- [Dependencies](#dependencies)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

## 🎯 Project Overview

**Bali Yoga** is a Next.js 15 application designed to help users discover authentic yoga studios and retreats in Bali. The platform features a modern, mobile-optimized interface with comprehensive search, filtering, and wishlist functionality.

### Core Features
- 🧘 **Studio & Retreat Discovery**: Browse and search yoga studios and retreats across Bali
- 🔍 **Advanced Filtering**: Filter by location, styles, rating, price range, and amenities
- ❤️ **Wishlist System**: Save favorite studios and retreats for later
- 📱 **Mobile-First Design**: Optimized for all devices with touch-friendly interactions
- 🗺️ **Interactive Maps**: Google Maps integration for location visualization
- ⭐ **Reviews & Ratings**: Community-driven feedback system
- 📖 **Blog Content**: SEO-optimized articles about yoga in Bali

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5.8.3** - Type-safe development

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Icon library
- **CSS Modules** - Scoped styling where needed

### Database & Backend
- **Supabase** - PostgreSQL database with real-time features
- **Next.js API Routes** - Server-side API endpoints
- **React Cache** - Server-side data caching

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting (implicit)
- **Bundle Analyzer** - Bundle optimization analysis

## 🏛️ Architecture Pattern

### **SSR-First Architecture**
The application follows a **Server-Side Rendering (SSR) first** approach with strategic client-side hydration:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Server Side   │    │   Static Pages   │    │   Client Side   │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ • Data Fetching │    │ • SEO Metadata   │    │ • Interactivity │
│ • Page Rendering│ ───│ • Static Content │───▶│ • State Management│
│ • Caching       │    │ • Fast Loading   │    │ • Dynamic Features│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Zero Hydration Issues**
- ✅ Server and client render identical HTML
- ✅ No conditional rendering based on `typeof window`
- ✅ Progressive enhancement pattern
- ✅ Proper loading states prevent layout shifts

## 📁 Directory Structure

```
bali-yoga/
├── 📁 app/                          # App Router directory (Next.js 13+)
│   ├── 📁 [type]/[slug]/           # Dynamic routes for studios/retreats
│   ├── 📁 api/                     # API routes
│   │   ├── 📁 blog/               # Blog management APIs
│   │   ├── 📁 featured/           # Featured content APIs
│   │   ├── 📁 reviews/            # Review system APIs
│   │   └── 📁 studios/            # Studio data APIs
│   ├── 📁 admin/                  # Admin dashboard
│   ├── 📁 blog/                   # Blog pages
│   ├── 📁 retreats/               # Retreat pages
│   │   ├── 📁 detail/            # Individual retreat pages
│   │   └── 📁 [location]/        # Location-based filtering
│   ├── 📁 studios/                # Studio pages
│   │   ├── 📁 detail/            # Individual studio pages
│   │   └── 📁 [location]/        # Location-based filtering
│   ├── 📁 wishlist/              # Wishlist functionality
│   ├── layout.tsx                 # Root layout (SSR-only)
│   ├── page.tsx                   # Homepage
│   ├── loading.tsx                # Global loading UI
│   └── error.tsx                  # Global error handling
├── 📁 components/                  # Reusable UI components (100+ components)
│   ├── 📁 ui/                     # Base UI components (Radix-based)
│   ├── client-providers.tsx       # Client-side context providers
│   ├── error-boundary.tsx         # Error boundary components
│   ├── loading-states.tsx         # Loading UI components
│   └── ...mobile-optimized-*.tsx  # Mobile-first components
├── 📁 lib/                        # Utility functions and configurations
│   ├── types.ts                   # Centralized TypeScript types
│   ├── supabase-server.ts         # Server-side database operations
│   ├── slug-utils.ts              # URL slug generation
│   ├── security-utils.ts          # Security utilities
│   └── analytics.ts               # Analytics tracking
├── 📁 contexts/                   # React context providers
│   └── wishlist-context.tsx       # Wishlist state management
├── 📁 data/                       # Static data files
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## 🔄 Data Flow

### **Server-Side Data Fetching**
```typescript
// Server Component (app/page.tsx)
const [studios, retreats] = await Promise.all([
  getFeaturedStudios(4),    // Cached with React cache()
  getFeaturedRetreats(4)    // Cached with React cache()
])

// Supabase operations (lib/supabase-server.ts)
export const getFeaturedStudios = cache(async (limit: number) => {
  const { data, error } = await supabase
    .from('v3_bali_yoga_studios_and_retreats')
    .select('*')
    .eq('category_name', 'Yoga studio')
    .order('review_score', { ascending: false })
    .limit(limit)
  
  return data?.map(transformStudio) || []
})
```

### **Client-Side State Management**
```typescript
// Wishlist Context (contexts/wishlist-context.tsx)
const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)
  
  // Hydrate from localStorage only on client
  useEffect(() => {
    const items = storage.get()
    dispatch({ type: 'HYDRATE', payload: items })
  }, [])
  
  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  )
}
```

## 🧩 Key Components

### **Layout System**
- `app/layout.tsx` - Pure server-side root layout with zero client logic
- `components/client-providers.tsx` - Client-side providers wrapper
- Mobile-optimized header, footer, and navigation components

### **Data Display**
- `MobileOptimizedCard` - Responsive card component for studios/retreats
- `DetailContent` - Server-rendered detail pages with client enhancements
- `LoadingStates` - Consistent loading UI across the application

### **Interactive Features**
- `WishlistHeart` - Save/unsave functionality with optimistic updates
- `GoogleMapsWrapper` - Client-only maps with proper SSR handling
- `SearchFiltering` - Advanced search and filtering capabilities

### **Error Handling**
- `ErrorBoundary` - Comprehensive error boundaries at multiple levels
- Graceful degradation for failed data fetching
- User-friendly error messages with recovery options

## 📦 Dependencies

### **Production Dependencies**

#### **Core Framework** (Required)
- `next@15.2.4` - React framework
- `react@19.1.0` & `react-dom@19.1.0` - UI library
- `typescript@5.8.3` - Type safety

#### **Database & Data** (Critical)
- `@supabase/supabase-js@latest` - Database client
- `csv-parser@3.0.0` - Data import utilities
- `date-fns@4.1.0` - Date manipulation
- `zod@3.25.64` - Schema validation

#### **UI & Styling** (Essential)
- `tailwindcss@3.4.17` & `autoprefixer@10.4.21` - Styling
- `@radix-ui/*` - 20+ accessible UI components
- `lucide-react@0.454.0` - Icons (4,000+ icons)
- `class-variance-authority@0.7.1` - Component variants
- `clsx@2.1.1` & `tailwind-merge@2.6.0` - Conditional classes

#### **Forms & Validation**
- `react-hook-form@7.58.0` - Form management
- `@hookform/resolvers@3.10.0` - Form validation
- `input-otp@1.4.1` - OTP input component

#### **Enhanced Features**
- `embla-carousel-react@8.5.1` - Image carousels
- `recharts@2.15.0` - Data visualization
- `next-themes@0.4.6` - Theme management
- `sonner@1.7.4` - Toast notifications
- `dompurify@3.2.6` - XSS protection

### **Development Dependencies**
- `@next/bundle-analyzer@15.2.4` - Bundle analysis
- `cross-env@7.0.3` - Cross-platform scripts
- `webpack-bundle-analyzer@4.10.2` - Bundle visualization

### **Optional Integrations**
- Google Maps API - Location visualization
- Google Analytics - User tracking
- Service Worker - Offline functionality

## 🔧 Development Guidelines

### **Component Development**
```typescript
// ✅ Good: Server Component by default
export default async function StudioPage() {
  const studios = await getStudios() // Server-side data fetching
  return <StudioList studios={studios} />
}

// ✅ Good: Client Component when needed
"use client"
export function InteractiveMap() {
  const [location, setLocation] = useState()
  return <GoogleMap location={location} />
}

// ❌ Bad: Mixed server/client rendering
export function ProblematicComponent() {
  const isClient = typeof window !== 'undefined' // Hydration mismatch!
  return isClient ? <ClientContent /> : <ServerContent />
}
```

### **Data Fetching Patterns**
```typescript
// ✅ Server-side with caching
export const getStudios = cache(async () => {
  const { data } = await supabase.from('studios').select('*')
  return data
})

// ✅ Client-side for interactions
const { mutate } = useSWR('/api/studios', fetcher)
```

### **State Management**
- **Server State**: React Query/SWR for API data
- **Client State**: React Context for global state (wishlist, theme)
- **URL State**: Next.js router for navigation state
- **Local State**: React hooks for component state

## 🚀 Deployment

### **Build Configuration**
```javascript
// next.config.mjs
const nextConfig = {
  typescript: { ignoreBuildErrors: true }, // Gradual TypeScript adoption
  images: {
    remotePatterns: [...], // Optimized image loading
    formats: ['image/webp', 'image/avif']
  }
}
```

### **Environment Variables**
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_GA_ID=your_analytics_id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### **Performance Optimizations**
- ✅ **Image Optimization**: Next.js Image component with WebP/AVIF
- ✅ **Code Splitting**: Dynamic imports for client-only components
- ✅ **Caching**: React cache() for server-side data deduplication
- ✅ **Bundle Analysis**: Webpack analyzer for optimization insights
- ✅ **SEO**: Dynamic metadata generation for all pages

### **Deployment Targets**
- **Primary**: Vercel (optimized for Next.js)
- **Alternative**: Netlify, Cloudflare Pages
- **Self-hosted**: Docker containerization support

## 🔒 Security Considerations

- **XSS Protection**: DOMPurify for user-generated content
- **Input Validation**: Zod schemas for all forms
- **Database Security**: Supabase RLS (Row Level Security)
- **API Security**: Rate limiting and CORS configuration
- **Content Security**: CSP headers for image optimization

## 📈 Monitoring & Analytics

- **Performance**: Next.js built-in Web Vitals reporting
- **User Analytics**: Google Analytics integration
- **Error Tracking**: Built-in error boundaries with reporting
- **Bundle Analysis**: Automated bundle size monitoring

---

## 🤝 Contributing

This architecture provides a solid foundation for:
- 🔄 **Scalable Development**: Clear separation of concerns
- 🚀 **Performance**: Optimized rendering and caching
- 🛡️ **Reliability**: Comprehensive error handling
- 📱 **Mobile Experience**: Touch-optimized interactions
- 🔍 **SEO**: Server-side rendering with dynamic metadata

For detailed implementation examples, refer to the component files and their inline documentation.

---

*Last Updated: August 21, 2025*
*Architecture Version: 2.0 (Post-Rebuild)*