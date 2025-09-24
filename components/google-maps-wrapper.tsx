"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

interface GoogleMapWrapperProps {
  address: string
  name: string
  city: string
  id?: string // Studio/retreat ID for coordinate caching
  className?: string
}

// SSR-safe loading component
function GoogleMapLoading() {
  return (
    <div className="w-full">
      <h4 className="text-sm font-medium text-[#5d4c42] mb-2">Location</h4>
      <div className="w-full h-[180px] flex flex-col items-center justify-center bg-[#e6ceb3] rounded-lg text-[#5d4c42] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-[#5d4c42] rounded-full"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-2 border-[#5d4c42] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#5d4c42] rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-[#5d4c42] border-t-transparent rounded-full mx-auto mb-2" role="status" aria-label="Loading map"></div>
          <div className="text-sm">Loading map...</div>
        </div>
      </div>
    </div>
  )
}

// Dynamic import with SSR completely disabled
const GoogleMapClient = dynamic(() => import('./google-maps-client'), { 
  ssr: false,
  loading: () => <GoogleMapLoading />
})

// Client component wrapper
export default function GoogleMapWrapper(props: GoogleMapWrapperProps) {
  return (
    <Suspense fallback={<GoogleMapLoading />}>
      <GoogleMapClient {...props} />
    </Suspense>
  )
}