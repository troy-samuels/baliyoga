"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarDisplay } from '@/components/ui/star-rating'
import { Progress } from '@/components/ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ThumbsUp, MoreVertical, AlertTriangle } from 'lucide-react'
import { 
  PublicReview, 
  ReviewStats, 
  ReviewSortOption, 
  REVIEW_SORT_OPTIONS,
  getRatingPercentage,
  getAverageRatingDisplay,
  getReviewCountDisplay
} from '@/lib/review-types'
import { formatDistanceToNow } from 'date-fns'

interface ReviewDisplayProps {
  itemId: string
  itemType: 'studio' | 'retreat'
  reviews: PublicReview[]
  stats: ReviewStats
  onSortChange?: (sort: ReviewSortOption) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  className?: string
}

export function ReviewDisplay({
  itemId,
  itemType,
  reviews,
  stats,
  onSortChange,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className
}: ReviewDisplayProps) {
  const [sortBy, setSortBy] = useState<ReviewSortOption>('most_helpful')

  const handleSortChange = (value: ReviewSortOption) => {
    setSortBy(value)
    onSortChange?.(value)
  }

  if (stats.total_reviews === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No reviews yet</p>
        <p className="text-sm text-gray-500">
          Be the first to share your experience with this {itemType}!
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Review Summary */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {getAverageRatingDisplay(stats.average_rating)}
                </span>
                <div>
                  <StarDisplay 
                    rating={stats.average_rating} 
                    size="lg" 
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {getReviewCountDisplay(stats.total_reviews)}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.rating_distribution[rating.toString() as keyof typeof stats.rating_distribution] || 0
                const percentage = getRatingPercentage(count, stats.total_reviews)
                
                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <Progress 
                      value={percentage} 
                      className="flex-1 h-2" 
                    />
                    <span className="w-12 text-gray-600">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Reviews ({stats.total_reviews})
        </h3>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(REVIEW_SORT_OPTIONS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="mb-6" />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard 
            key={review.id} 
            review={review}
            itemId={itemId}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  )
}

interface ReviewCardProps {
  review: PublicReview
  itemId: string
  className?: string
}

export function ReviewCard({ review, itemId, className }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count)

  const handleHelpfulVote = async () => {
    if (hasVoted || isVoting) return

    setIsVoting(true)
    
    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_id: review.id,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setHasVoted(true)
        setHelpfulCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error voting for review:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true })

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Review Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <StarDisplay rating={review.rating} size="sm" />
                <span className="font-semibold text-gray-900">{review.title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>By {review.user_name}</span>
                <span>•</span>
                <span>{timeAgo}</span>
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {review.content}
            </p>
          </div>

          {/* Review Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpfulVote}
              disabled={hasVoted || isVoting}
              className={`text-gray-600 hover:text-gray-900 ${hasVoted ? 'text-blue-600' : ''}`}
            >
              <ThumbsUp className={`w-4 h-4 mr-1 ${hasVoted ? 'fill-current' : ''}`} />
              Helpful ({helpfulCount})
            </Button>

            <Button variant="ghost" size="sm" className="text-gray-400">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact review summary for cards
export function ReviewSummary({
  stats,
  showDistribution = false,
  className
}: {
  stats: ReviewStats
  showDistribution?: boolean
  className?: string
}) {
  if (stats.total_reviews === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-gray-500">No reviews yet</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <StarDisplay rating={stats.average_rating} size="sm" />
        <span className="text-sm font-medium">
          {getAverageRatingDisplay(stats.average_rating)}
        </span>
        <span className="text-sm text-gray-600">
          ({stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {showDistribution && (
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.rating_distribution[rating.toString() as keyof typeof stats.rating_distribution] || 0
            const percentage = getRatingPercentage(count, stats.total_reviews)
            
            if (count === 0) return null
            
            return (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span className="w-6">{rating}★</span>
                <Progress value={percentage} className="flex-1 h-1" />
                <span className="w-8 text-gray-500">{count}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}