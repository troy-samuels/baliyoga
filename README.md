# 🧘‍♀️ Bali Yoga - Discover Authentic Yoga Experiences

> A modern, mobile-first platform for discovering yoga studios and retreats across the beautiful island of Bali.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)

## 🌟 Features

- **🔍 Smart Discovery**: Find yoga studios and retreats with advanced filtering
- **❤️ Wishlist System**: Save your favorite places for later
- **📱 Mobile-First**: Optimized for all devices with touch-friendly design
- **🗺️ Interactive Maps**: Google Maps integration for easy location finding
- **⭐ Reviews & Ratings**: Community-driven feedback system
- **🚀 Lightning Fast**: Server-side rendering with zero hydration issues
- **♿ Accessible**: Built with Radix UI for full accessibility compliance

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **pnpm** package manager
- **Supabase** account for database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/troy-samuels/baliyoga.git
   cd baliyoga
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your environment variables:
   ```env
   # Required
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional but recommended
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture Overview

This project follows a **modern, SSR-first architecture** designed for performance and scalability:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Server Side   │    │      Cache       │    │   Client Side   │
│                 │    │                  │    │                 │
│ • Data Fetching │────┤ • React cache()  │────│ • Hydration     │
│ • Page Rendering│    │ • Supabase cache │    │ • Interactivity │
│ • SEO Metadata  │    │ • Image CDN      │    │ • State Mgmt    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Architectural Decisions

- ✅ **Zero Hydration Issues**: Server and client render identical HTML
- ✅ **Server Components First**: Client components only when absolutely necessary  
- ✅ **Progressive Enhancement**: Works without JavaScript, enhanced with it
- ✅ **Type-Safe**: Full TypeScript coverage with strict mode
- ✅ **Mobile-Optimized**: Touch-first design with responsive layouts

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📁 Project Structure

```
bali-yoga/
├── app/                    # Next.js App Router
│   ├── [type]/[slug]/     # Dynamic routes
│   ├── api/               # API endpoints
│   ├── studios/           # Studio pages
│   ├── retreats/          # Retreat pages
│   └── layout.tsx         # Root layout
├── components/            # UI components (100+)
│   ├── ui/               # Base components
│   └── ...               # Feature components
├── lib/                  # Utilities & configs
│   ├── types.ts          # TypeScript types
│   ├── supabase-server.ts # DB operations
│   └── ...               # Helper functions
├── contexts/             # React contexts
└── data/                 # Static data
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Analysis
npm run analyze         # Analyze bundle size
npm run analyze:server  # Analyze server bundle
npm run analyze:browser # Analyze browser bundle

# Data Management
npm run import-csv      # Import CSV data
```

## 🧩 Tech Stack

### **Core Framework**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### **Database & Backend**
- **Supabase** - PostgreSQL with real-time features
- **React Cache** - Server-side data deduplication

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled components
- **Lucide React** - Beautiful icons

### **Key Dependencies**
- `@supabase/supabase-js` - Database client
- `@radix-ui/*` - UI component primitives
- `react-hook-form` - Form management
- `date-fns` - Date utilities
- `lucide-react` - Icon library
- `tailwind-merge` - CSS class utilities

## 🔧 Configuration

### **Next.js Config**
The application is configured for optimal performance:
- Image optimization with WebP/AVIF support
- Bundle analyzer integration
- TypeScript with gradual adoption
- Remote image patterns for external sources

### **Tailwind Config**
Custom design system with:
- Brand color palette
- Mobile-first breakpoints
- Custom animations
- Typography scale

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Environment Variables for Production**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### **Other Platforms**
- **Netlify**: Add `next.config.mjs` and build command `npm run build`
- **Docker**: Dockerfile included for containerized deployments

## 🧪 Testing

The application includes comprehensive error boundaries and loading states. For testing:

```bash
# Development testing
npm run dev

# Production build testing
npm run build && npm run start

# Bundle analysis
npm run analyze
```

## 📊 Performance Features

- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js Image with WebP/AVIF
- **Code Splitting**: Dynamic imports for client components
- **Caching Strategy**: React cache() for data deduplication
- **Bundle Optimization**: Tree shaking and dead code elimination

## 🔒 Security

- **Input Validation**: Zod schemas for all forms
- **XSS Protection**: DOMPurify for user content
- **Database Security**: Supabase Row Level Security
- **Content Security Policy**: Configured for image optimization

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the SSR-first architecture pattern
- Use Server Components by default
- Add Client Components only when interactivity is needed
- Maintain TypeScript types for all new features
- Test on mobile devices for responsive design

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Supabase Team** - For the developer-friendly database platform
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library

## 📞 Support

- **Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/troy-samuels/baliyoga/issues)
- **Discussions**: [GitHub Discussions](https://github.com/troy-samuels/baliyoga/discussions)

---

**Built with ❤️ for the yoga community in Bali**

*Discover your perfect yoga journey on the Island of the Gods* 🏝️