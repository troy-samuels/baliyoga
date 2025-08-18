"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StarDisplay } from '@/components/ui/star-rating'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MessageSquare,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { Review } from '@/lib/review-types'
import { formatDistanceToNow } from 'date-fns'

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [moderationLoading, setModerationLoading] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/reviews/moderate', {
        headers: {
          'authorization': 'admin-token' // In real app, use proper auth
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setReviews(data.reviews)
      } else {
        setAlerts({
          type: 'error',
          message: data.message || 'Failed to load reviews'
        })
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      setAlerts({
        type: 'error',
        message: 'Failed to load reviews'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const moderateReview = async (reviewId: string, approved: boolean, notes?: string) => {
    try {
      setModerationLoading(reviewId)
      
      const response = await fetch('/api/reviews/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'admin-token' // In real app, use proper auth
        },
        body: JSON.stringify({
          review_id: reviewId,
          approved,
          notes
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setAlerts({
          type: 'success',
          message: result.message
        })
        
        // Remove the review from the list or update its status
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, is_approved: approved, moderation_notes: notes }
            : review
        ))
      } else {
        setAlerts({
          type: 'error',
          message: result.message
        })
      }
    } catch (error) {
      console.error('Error moderating review:', error)
      setAlerts({
        type: 'error',
        message: 'Failed to moderate review'
      })
    } finally {
      setModerationLoading(null)
    }
  }

  // Filter reviews by status
  const pendingReviews = reviews.filter(r => r.is_verified && !r.is_approved)
  const approvedReviews = reviews.filter(r => r.is_approved)
  const unverifiedReviews = reviews.filter(r => !r.is_verified)

  const clearAlert = () => setAlerts(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#5d4c42]">Review Moderation</h1>
          <p className="text-[#5d4c42]/80 mt-1">
            Moderate and approve user reviews
          </p>
        </div>
        <Button onClick={loadReviews} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {alerts && (
        <Alert 
          className={`${alerts.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
          onClick={clearAlert}
        >
          {alerts.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={alerts.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alerts.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{pendingReviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{approvedReviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Unverified</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{unverifiedReviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Lists */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved ({approvedReviews.length})
          </TabsTrigger>
          <TabsTrigger value="unverified" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Unverified ({unverifiedReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reviews pending moderation</p>
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map(review => (
              <ReviewModerationCard
                key={review.id}
                review={review}
                onModerate={moderateReview}
                isLoading={moderationLoading === review.id}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No approved reviews</p>
              </CardContent>
            </Card>
          ) : (
            approvedReviews.map(review => (
              <ReviewModerationCard
                key={review.id}
                review={review}
                onModerate={moderateReview}
                isLoading={moderationLoading === review.id}
                readonly
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="unverified" className="space-y-4">
          {unverifiedReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No unverified reviews</p>
              </CardContent>
            </Card>
          ) : (
            unverifiedReviews.map(review => (
              <ReviewModerationCard
                key={review.id}
                review={review}
                onModerate={moderateReview}
                isLoading={moderationLoading === review.id}
                readonly
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ReviewModerationCardProps {
  review: Review
  onModerate: (reviewId: string, approved: boolean, notes?: string) => void
  isLoading: boolean
  readonly?: boolean
}

function ReviewModerationCard({ 
  review, 
  onModerate, 
  isLoading, 
  readonly = false 
}: ReviewModerationCardProps) {
  const [notes, setNotes] = useState(review.moderation_notes || '')

  const handleApprove = () => {
    onModerate(review.id, true, notes.trim() || undefined)
  }

  const handleReject = () => {
    onModerate(review.id, false, notes.trim() || undefined)
  }

  const timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true })

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{review.title}</CardTitle>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>By {review.user_name}</span>
              <span>•</span>
              <span>{review.item_type}: {review.item_id}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarDisplay rating={review.rating} size="sm" />
            {review.is_verified ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Unverified
              </Badge>
            )}
            {review.is_approved && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Approved
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-700 leading-relaxed">{review.content}</p>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Email:</strong> {review.user_email}
        </div>

        {review.moderation_notes && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Moderation Notes</h4>
            <p className="text-sm text-blue-800">{review.moderation_notes}</p>
          </div>
        )}

        {!readonly && review.is_verified && !review.is_approved && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moderation Notes (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this review..."
                className="text-sm"
                rows={2}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Approve
              </Button>
              
              <Button
                onClick={handleReject}
                disabled={isLoading}
                variant="destructive"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}