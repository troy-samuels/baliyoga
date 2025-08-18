"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MobileOptimizedHeader } from '@/components/mobile-optimized-header'
import { SiteFooter } from '@/components/site-footer'

export default function VerifyReviewPage() {
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<{
    status: 'loading' | 'success' | 'error'
    message: string
  }>({ status: 'loading', message: '' })

  useEffect(() => {
    const token = searchParams?.get('token')
    const success = searchParams?.get('success')
    const message = searchParams?.get('message')

    // If we have URL parameters from the GET redirect
    if (success !== null) {
      setVerificationStatus({
        status: success === 'true' ? 'success' : 'error',
        message: message || (success === 'true' ? 'Review verified successfully!' : 'Verification failed.')
      })
      return
    }

    // If we have a token, verify it
    if (token) {
      verifyReview(token)
    } else {
      setVerificationStatus({
        status: 'error',
        message: 'No verification token provided.'
      })
    }
  }, [searchParams])

  const verifyReview = async (token: string) => {
    try {
      const response = await fetch('/api/reviews/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const result = await response.json()

      if (result.success) {
        setVerificationStatus({
          status: 'success',
          message: result.message
        })
      } else {
        setVerificationStatus({
          status: 'error',
          message: result.message
        })
      }
    } catch (error) {
      console.error('Error verifying review:', error)
      setVerificationStatus({
        status: 'error',
        message: 'An error occurred while verifying your review. Please try again.'
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card className="border-[#e6ceb3]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#5d4c42]">
              Review Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {verificationStatus.status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#a39188]" />
                <p className="text-[#5d4c42]/80">Verifying your review...</p>
              </div>
            )}

            {verificationStatus.status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {verificationStatus.message}
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <p className="text-[#5d4c42]/80">
                    Your review has been verified successfully! It will be published after our moderation team reviews it.
                  </p>
                  <p className="text-sm text-[#5d4c42]/60">
                    This typically takes 1-2 business days.
                  </p>
                </div>
              </div>
            )}

            {verificationStatus.status === 'error' && (
              <div className="space-y-4">
                <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {verificationStatus.message}
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <p className="text-[#5d4c42]/80">
                    Unable to verify your review. This could happen if:
                  </p>
                  <ul className="text-sm text-[#5d4c42]/60 text-left space-y-1">
                    <li>• The verification link has expired</li>
                    <li>• The review has already been verified</li>
                    <li>• The verification token is invalid</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <Button asChild className="w-full bg-[#5d4c42] hover:bg-[#a39188]">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
              
              {verificationStatus.status === 'error' && (
                <Button asChild variant="outline" className="w-full border-[#5d4c42] text-[#5d4c42] hover:bg-[#e6ceb3]">
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <SiteFooter />
    </div>
  )
}