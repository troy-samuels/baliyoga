"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { Send, CheckCircle } from "lucide-react"

export default function BlogSubmitPage() {
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    authorEmail: "",
    authorBio: "",
    category: "",
    content: "",
    excerpt: "",
    tags: "",
    authorWebsite: "",
    socialMedia: "",
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blog/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        alert("Error submitting your post. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting post:", error)
      alert("Error submitting your post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f9f3e9]">
        <MobileOptimizedHeader />
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
          <Card className="border-[#e6ceb3] text-center">
            <CardContent className="p-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
              <h1 className="text-3xl font-bold text-[#5d4c42] mb-4">Thank You!</h1>
              <p className="text-lg text-[#5d4c42]/80 mb-6">
                Your blog post submission has been received. Our editorial team will review it and get back to you
                within 3-5 business days.
              </p>
              <div className="space-y-2 text-sm text-[#5d4c42]/70 mb-8">
                <p>• We'll optimize your content for SEO</p>
                <p>• Add professional formatting and images</p>
                <p>• Notify you when it's published</p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-full bg-[#e6ceb3] px-6 py-3 font-medium text-[#5d4c42] transition-colors hover:bg-[#d9b99a]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </CardContent>
          </Card>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />

      {/* Header */}
      <div className="bg-[#e6ceb3] py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <Link href="/blog" className="inline-flex items-center text-[#5d4c42] hover:text-[#8a7b73] mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          <h1 className="text-3xl font-bold text-[#5d4c42] md:text-4xl mb-2">Submit Your Blog Post</h1>
          <p className="text-lg text-[#5d4c42]/80">
            Share your yoga journey, wellness tips, or Bali experiences with our community
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <Card className="border-[#e6ceb3]">
          <CardHeader>
            <CardTitle className="text-[#5d4c42]">Tell Us Your Story</CardTitle>
            <p className="text-[#5d4c42]/70">
              Fill out the form below to submit your blog post. Our editorial team will review and optimize it for
              publication.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Author Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#5d4c42]">About You</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5d4c42] mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                      className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5d4c42] mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={formData.authorEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, authorEmail: e.target.value }))}
                      className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5d4c42] mb-1">Author Bio</label>
                  <textarea
                    value={formData.authorBio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, authorBio: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                    placeholder="Tell us about yourself (yoga experience, certifications, etc.)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5d4c42] mb-1">Website (Optional)</label>
                    <input
                      type="url"
                      value={formData.authorWebsite}
                      onChange={(e) => setFormData((prev) => ({ ...prev, authorWebsite: e.target.value }))}
                      className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5d4c42] mb-1">Social Media (Optional)</label>
                    <input
                      type="text"
                      value={formData.socialMedia}
                      onChange={(e) => setFormData((prev) => ({ ...prev, socialMedia: e.target.value }))}
                      className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                      placeholder="@yourusername or profile link"
                    />
                  </div>
                </div>
              </div>

              {/* Blog Post Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#5d4c42]">Your Blog Post</h3>

                <div>
                  <label className="block text-sm font-medium text-[#5d4c42] mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                    placeholder="e.g., My Transformative Yoga Retreat Experience in Ubud"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5d4c42] mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Yoga Practice">Yoga Practice</option>
                    <option value="Meditation">Meditation</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Food & Nutrition">Food & Nutrition</option>
                    <option value="Spirituality">Spirituality</option>
                    <option value="Bali Travel">Bali Travel</option>
                    <option value="Culture">Culture</option>
                    <option value="Teacher Training">Teacher Training</option>
                    <option value="Beginners">Beginners</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5d4c42] mb-1">Brief Summary *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                    placeholder="Write a compelling 2-3 sentence summary of your post"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5d4c42] mb-1">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    rows={15}
                    className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                    placeholder="Write your full blog post here. Share your story, insights, tips, or experiences. Be authentic and helpful to our yoga community."
                    required
                  />
                  <p className="text-xs text-[#5d4c42]/60 mt-1">
                    {formData.content.split(/\s+/).filter((word) => word.length > 0).length} words
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5d4c42] mb-1">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    className="w-full rounded-lg border border-[#e6ceb3] p-3 focus:border-[#a39188] focus:outline-none"
                    placeholder="yoga, bali, meditation, wellness (comma separated)"
                  />
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-[#f2e8dc] rounded-lg p-4">
                <h4 className="font-semibold text-[#5d4c42] mb-2">Submission Guidelines</h4>
                <ul className="text-sm text-[#5d4c42]/80 space-y-1">
                  <li>• Content should be original and not published elsewhere</li>
                  <li>• Minimum 500 words for consideration</li>
                  <li>• Focus on yoga, wellness, spirituality, or Bali travel</li>
                  <li>• Include personal experiences and practical tips</li>
                  <li>• We may edit for clarity, SEO, and style</li>
                </ul>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="mt-1"
                  required
                />
                <label htmlFor="terms" className="text-sm text-[#5d4c42]/80">
                  I agree that my content may be edited for publication and understand that submission does not
                  guarantee publication. I retain ownership of my content.
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.agreeToTerms}
                  className="bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a] flex items-center"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Blog Post
                    </>
                  )}
                </Button>
                <Link href="/blog">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <SiteFooter />
    </div>
  )
}
