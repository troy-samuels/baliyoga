"use client"

import { useEffect } from 'react'
import { GA_TRACKING_ID, isAnalyticsEnabled, pageview, trackStudioView } from '@/lib/analytics'

export default function TestAnalyticsPage() {
  useEffect(() => {
    console.log('Analytics Debug Info:')
    console.log('GA_TRACKING_ID:', GA_TRACKING_ID)
    console.log('isAnalyticsEnabled:', isAnalyticsEnabled)
    console.log('window.gtag exists:', typeof window !== 'undefined' && !!window.gtag)
    console.log('window.dataLayer:', typeof window !== 'undefined' ? window.dataLayer : 'undefined')
    
    // Test tracking
    if (isAnalyticsEnabled) {
      console.log('Attempting to track page view...')
      pageview('/test-analytics')
      
      setTimeout(() => {
        console.log('Attempting to track studio view...')
        trackStudioView('test-studio-123', 'Test Studio Name')
      }, 2000)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f9f3e9] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5d4c42] mb-8">Analytics Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-[#5d4c42]">Debug Information</h2>
          
          <div className="space-y-2 text-sm">
            <p><strong>GA Tracking ID:</strong> {GA_TRACKING_ID || 'Not set'}</p>
            <p><strong>Analytics Enabled:</strong> {isAnalyticsEnabled ? 'Yes' : 'No'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Window defined:</strong> {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-[#5d4c42] mb-2">Test Actions</h3>
            <div className="space-x-4">
              <button 
                onClick={() => pageview('/test-manual-pageview')}
                className="bg-[#5d4c42] text-white px-4 py-2 rounded hover:bg-[#a39188]"
              >
                Test Page View
              </button>
              <button 
                onClick={() => trackStudioView('manual-test-123', 'Manual Test Studio')}
                className="bg-[#a39188] text-white px-4 py-2 rounded hover:bg-[#5d4c42]"
              >
                Test Studio View
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-[#5d4c42] mb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-[#5d4c42]/80">
              <li>Open browser developer tools (F12)</li>
              <li>Go to Console tab</li>
              <li>Check for analytics debug info and errors</li>
              <li>Go to Network tab and filter by "google-analytics" or "gtag"</li>
              <li>Click the test buttons above and watch for network requests</li>
              <li>Check Google Analytics Real-time reports</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}