"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StarRating } from '@/components/ui/star-rating'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { 
  ReviewFormData, 
  ReviewValidationErrors, 
  validateReviewForm, 
  hasValidationErrors,
  REVIEW_LIMITS 
} from '@/lib/review-types'

interface ReviewFormProps {
  itemId: string
  itemType: 'studio' | 'retreat'
  itemName: string
  onSubmissionSuccess?: () => void
  className?: string
}

export function ReviewForm({ 
  itemId, 
  itemType, 
  itemName, 
  onSubmissionSuccess,
  className 
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    user_name: '',
    user_email: '',
    rating: 0,
    title: '',
    content: ''
  })
  
  const [errors, setErrors] = useState<ReviewValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (field: keyof ReviewFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateReviewForm(formData)
    setErrors(validationErrors)
    
    if (hasValidationErrors(validationErrors)) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          item_id: itemId,
          item_type: itemType
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.verification_required 
            ? 'Thank you for your review! Please check your email to verify your review before it can be published.'
            : 'Thank you for your review! It has been submitted for moderation.'
        })
        
        // Reset form
        setFormData({
          user_name: '',
          user_email: '',
          rating: 0,
          title: '',
          content: ''
        })
        
        onSubmissionSuccess?.()
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to submit review. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while submitting your review. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Write a Review for {itemName}
        </CardTitle>
        <p className="text-gray-600">
          Share your experience to help others discover great yoga {itemType}s in Bali
        </p>
      </CardHeader>
      <CardContent>
        {submitStatus.type && (
          <Alert className={`mb-6 ${submitStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_name">Your Name *</Label>
              <Input
                id="user_name"
                type="text"
                value={formData.user_name}
                onChange={(e) => handleInputChange('user_name', e.target.value)}
                placeholder="Enter your name"
                className={errors.user_name ? 'border-red-300' : ''}
                maxLength={REVIEW_LIMITS.MAX_NAME_LENGTH}
              />
              {errors.user_name && (
                <p className="text-sm text-red-600">{errors.user_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_email">Your Email *</Label>
              <Input
                id="user_email"
                type="email"
                value={formData.user_email}
                onChange={(e) => handleInputChange('user_email', e.target.value)}
                placeholder="Enter your email"
                className={errors.user_email ? 'border-red-300' : ''}
              />
              {errors.user_email && (
                <p className="text-sm text-red-600">{errors.user_email}</p>
              )}
              <p className="text-xs text-gray-500">
                Used for verification only. Will not be displayed publicly.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => handleInputChange('rating', rating)}
                size="lg"
                showRatingText
              />
            </div>
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Give your review a helpful title"
              className={errors.title ? 'border-red-300' : ''}
              maxLength={REVIEW_LIMITS.MAX_TITLE_LENGTH}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.title.length}/{REVIEW_LIMITS.MAX_TITLE_LENGTH} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Share your experience with this yoga studio/retreat. What did you like? What could be improved?"
              className={`min-h-[120px] ${errors.content ? 'border-red-300' : ''}`}
              maxLength={REVIEW_LIMITS.MAX_CONTENT_LENGTH}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.content.length}/{REVIEW_LIMITS.MAX_CONTENT_LENGTH} characters
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be honest and specific about your experience</li>
              <li>• Focus on the yoga classes, instructors, and facilities</li>
              <li>• Be respectful and constructive in your feedback</li>
              <li>• Avoid personal attacks or inappropriate language</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Review...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}