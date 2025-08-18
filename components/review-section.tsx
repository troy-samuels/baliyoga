"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ReviewDisplay } from '@/components/ui/review-display'
import { ReviewForm } from '@/components/ui/review-form'
import { 
  PublicReview, 
  ReviewStats, 
  ReviewSortOption, 
  ReviewsResponse 
} from '@/lib/review-types'
import { MessageCircle, PenTool } from 'lucide-react'

interface ReviewSectionProps {
  itemId: string
  itemType: 'studio' | 'retreat'
  itemName: string
  className?: string
}

export function ReviewSection({ 
  itemId, 
  itemType, 
  itemName, 
  className 
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [currentSort, setCurrentSort] = useState<ReviewSortOption>('most_helpful')
  const [currentOffset, setCurrentOffset] = useState(0)
  const [activeTab, setActiveTab] = useState('reviews')

  const loadReviews = async (sortBy: ReviewSortOption = currentSort, offset: number = 0, append: boolean = false) => {
    try {
      setIsLoading(true)
      
      const params = new URLSearchParams({
        item_id: itemId,
        sort: sortBy,
        limit: '10',
        offset: offset.toString()
      })

      const response = await fetch(`/api/reviews?${params}`)
      const data: ReviewsResponse & { success: boolean } = await response.json()

      if (data.success) {
        if (append) {
          setReviews(prev => [...prev, ...data.reviews])
        } else {
          setReviews(data.reviews)
        }
        setStats(data.stats)
        setHasMore(data.pagination.hasMore)
        setCurrentOffset(offset + data.reviews.length)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [itemId])

  const handleSortChange = (newSort: ReviewSortOption) => {
    setCurrentSort(newSort)
    setCurrentOffset(0)
    loadReviews(newSort, 0, false)
  }

  const handleLoadMore = () => {
    loadReviews(currentSort, currentOffset, true)
  }

  const handleReviewSubmissionSuccess = () => {
    // Switch to reviews tab and show success message
    setActiveTab('reviews')
    // Optionally reload reviews (though new review won't be visible until verified and approved)
  }

  return (
    <div className={`mt-12 ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-[#e6ceb3] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#f9f3e9] rounded-none">
            <TabsTrigger 
              value="reviews" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#5d4c42]"
            >
              <MessageCircle className="w-4 h-4" />
              Reviews
              {stats.total_reviews > 0 && (
                <span className="ml-1 text-sm text-gray-600">
                  ({stats.total_reviews})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="write-review"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#5d4c42]"
            >
              <PenTool className="w-4 h-4" />
              Write Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="p-6">
            <ReviewDisplay
              itemId={itemId}
              itemType={itemType}
              reviews={reviews}
              stats={stats}
              onSortChange={handleSortChange}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="write-review" className="p-6">
            <ReviewForm
              itemId={itemId}
              itemType={itemType}
              itemName={itemName}
              onSubmissionSuccess={handleReviewSubmissionSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}