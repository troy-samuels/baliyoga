/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for debugging
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Basic image optimization
  images: {
    formats: ['image/webp'],
    unoptimized: false,
  },
}

export default nextConfig