"use client"

import React from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const router = useRouter()

  // Determine error type for better user experience
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
  const isNotFoundError = error.message.includes('404') || error.message.includes('not found')
  
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-[#f9f3e9]" role="alert">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-[#5d4c42] mb-2">
          {isNotFoundError ? 'Page Not Found' : isNetworkError ? 'Connection Error' : 'Something went wrong'}
        </h2>
        
        <p className="text-[#5d4c42]/70 mb-6 text-sm">
          {isNotFoundError 
            ? "The page you're looking for could not be found."
            : isNetworkError
            ? "Please check your internet connection and try again."
            : "An unexpected error occurred while loading this content."
          }
        </p>
        
        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="text-xs text-[#5d4c42]/50 cursor-pointer hover:text-[#5d4c42]/70">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs bg-red-50 p-3 rounded border border-red-200 overflow-auto max-h-32 text-red-700">
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#5d4c42] text-white rounded-lg hover:bg-[#4a3b33] transition-colors font-medium touch-manipulation"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#5d4c42] text-[#5d4c42] rounded-lg hover:bg-[#e6ceb3] transition-colors font-medium touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#5d4c42] text-[#5d4c42] rounded-lg hover:bg-[#e6ceb3] transition-colors font-medium touch-manipulation"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </div>
    </div>
  )
}

// Error boundary class component
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In production, you could send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics or error tracking service
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || ErrorFallback
      return <FallbackComponent error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />
    }

    return this.props.children
  }
}

// Specific error boundaries for different use cases

// Page-level error boundary with full page layout
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <div className="min-h-screen bg-[#f9f3e9] flex items-center justify-center">
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Component-level error boundary with compact layout
export function ComponentErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-sm">Failed to load content</span>
          </div>
          <p className="text-red-600 text-xs mb-3">
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={resetErrorBoundary}
            className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors touch-manipulation"
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Data fetching error boundary
export function DataErrorBoundary({ 
  children, 
  fallbackMessage = "Failed to load data"
}: { 
  children: React.ReactNode
  fallbackMessage?: string 
}) {
  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <div className="text-center p-6">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-[#5d4c42]/70 mb-4">{fallbackMessage}</p>
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5d4c42] text-white rounded-lg hover:bg-[#4a3b33] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}