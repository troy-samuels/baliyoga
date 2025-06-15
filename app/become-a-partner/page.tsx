"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { MapPin, Globe, Instagram, Facebook, Twitter, CheckCircle } from "lucide-react"

const yogaStyles = [
  "Hatha", "Vinyasa", "Ashtanga", "Yin", "Restorative", "Hot Yoga", "Bikram",
  "Kundalini", "Iyengar", "Power Yoga", "Aerial Yoga", "Prenatal Yoga",
  "Meditation", "Breathwork", "Acro Yoga", "SUP Yoga"
]

export default function BecomePartnerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    businessType: "",
    businessName: "",
    description: "",
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    address: "",
    city: "",
    selectedStyles: [] as string[],
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStyleToggle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStyles: prev.selectedStyles.includes(style)
        ? prev.selectedStyles.filter(s => s !== style)
        : [...prev.selectedStyles, style]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()
      
      if (!supabase) {
        throw new Error('Unable to connect to database')
      }
      
      const { data, error } = await supabase
        .from('partner_submissions')
        .insert([
          {
            business_type: formData.businessType,
            business_name: formData.businessName,
            description: formData.description,
            website: formData.website,
            social_handles: {
              instagram: formData.instagram,
              facebook: formData.facebook,
              twitter: formData.twitter
            },
            address: formData.address,
            city: formData.city,
            yoga_styles: formData.selectedStyles,
            contact_name: formData.contactName,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            status: 'pending',
            submitted_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Error submitting form:', error)
        alert('There was an error submitting your application. Please try again.')
      } else {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f9f3e9]">
        <MobileOptimizedHeader />
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-[#5d4c42] mb-4">Application Submitted!</h1>
            <p className="text-lg text-[#5d4c42]/80 mb-8">
              Thank you for your interest in becoming a partner. We'll review your application and get back to you within 2-3 business days.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#a39188] text-white px-6 py-3 rounded-lg hover:bg-[#8a7b73] transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
        <MobileOptimizedFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Header */}
      <div className="bg-[#e6ceb3] py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold text-[#5d4c42] md:text-4xl">Become a Partner</h1>
          <p className="mt-4 text-lg text-[#5d4c42]/80">
            Join our community of yoga studios and retreat centers in Bali
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Type */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  What type of business do you have? *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                >
                  <option value="">Select business type</option>
                  <option value="studio">Yoga Studio</option>
                  <option value="retreat">Retreat Center</option>
                  <option value="both">Both Studio & Retreat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="Enter your business name"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                placeholder="Tell us about your business, what makes it special, and what you offer..."
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="+62 xxx xxx xxxx"
                />
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Online Presence</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  <Instagram className="inline w-4 h-4 mr-1" />
                  Instagram Handle
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="@yourstudio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  <Facebook className="inline w-4 h-4 mr-1" />
                  Facebook Page
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="facebook.com/yourstudio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  <Twitter className="inline w-4 h-4 mr-1" />
                  Twitter Handle
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="@yourstudio"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Full Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="Street address, postal code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5d4c42] mb-2">
                  City/Area *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#e6ceb3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a39188]"
                  placeholder="e.g., Ubud, Canggu, Seminyak"
                />
              </div>
            </div>
          </div>

          {/* Yoga Styles */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#5d4c42] mb-4">Yoga Styles Offered</h2>
            <p className="text-sm text-[#5d4c42]/70 mb-4">Select all yoga styles that you offer:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {yogaStyles.map((style) => (
                <label key={style} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selectedStyles.includes(style)}
                    onChange={() => handleStyleToggle(style)}
                    className="rounded border-[#e6ceb3] text-[#a39188] focus:ring-[#a39188]"
                  />
                  <span className="text-sm text-[#5d4c42]">{style}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#a39188] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a7b73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
            <p className="mt-4 text-sm text-[#5d4c42]/70">
              We'll review your application and get back to you within 2-3 business days.
            </p>
          </div>
        </form>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 