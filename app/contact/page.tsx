"use client"

import { useState } from "react"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "general"
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/placeholder.svg?height=600&width=1200&text=Contact+Bali+Yoga')"
        }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">Get in Touch</h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#e6ceb3]">
            <h2 className="text-2xl font-bold text-[#5d4c42] mb-6">Send us a Message</h2>
            
            {submitStatus === "success" && (
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-green-800">Thank you for your message! We'll get back to you within 24 hours.</p>
              </div>
            )}
            
            {submitStatus === "error" && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-red-800">Sorry, there was an error sending your message. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#5d4c42] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-[#e6ceb3] px-4 py-3 text-[#5d4c42] focus:border-[#a39188] focus:outline-none focus:ring-2 focus:ring-[#a39188]/20"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#5d4c42] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-[#e6ceb3] px-4 py-3 text-[#5d4c42] focus:border-[#a39188] focus:outline-none focus:ring-2 focus:ring-[#a39188]/20"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium text-[#5d4c42] mb-2">
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-[#e6ceb3] px-4 py-3 text-[#5d4c42] focus:border-[#a39188] focus:outline-none focus:ring-2 focus:ring-[#a39188]/20"
                >
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="press">Press & Media</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#5d4c42] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-[#e6ceb3] px-4 py-3 text-[#5d4c42] focus:border-[#a39188] focus:outline-none focus:ring-2 focus:ring-[#a39188]/20"
                  placeholder="Brief subject of your message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#5d4c42] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-[#e6ceb3] px-4 py-3 text-[#5d4c42] focus:border-[#a39188] focus:outline-none focus:ring-2 focus:ring-[#a39188]/20"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5d4c42] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#a39188] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#e6ceb3]">
              <h2 className="text-2xl font-bold text-[#5d4c42] mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#e6ceb3] p-3">
                    <Mail className="h-5 w-5 text-[#5d4c42]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5d4c42]">Email</h3>
                    <p className="text-[#5d4c42]/80">info@baliyoga.com</p>
                    <p className="text-sm text-[#5d4c42]/60">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#e6ceb3] p-3">
                    <Phone className="h-5 w-5 text-[#5d4c42]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5d4c42]">Phone</h3>
                    <p className="text-[#5d4c42]/80">+62 361 123 4567</p>
                    <p className="text-sm text-[#5d4c42]/60">Mon-Fri, 9AM-6PM WITA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#e6ceb3] p-3">
                    <MapPin className="h-5 w-5 text-[#5d4c42]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5d4c42]">Location</h3>
                    <p className="text-[#5d4c42]/80">Ubud, Bali, Indonesia</p>
                    <p className="text-sm text-[#5d4c42]/60">Serving all of Bali</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#e6ceb3] p-3">
                    <Clock className="h-5 w-5 text-[#5d4c42]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#5d4c42]">Business Hours</h3>
                    <p className="text-[#5d4c42]/80">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-[#5d4c42]/80">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-[#5d4c42]/80">Sunday: Closed</p>
                    <p className="text-sm text-[#5d4c42]/60">WITA (Bali Time)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl bg-[#e6ceb3] p-8">
              <h2 className="text-2xl font-bold text-[#5d4c42] mb-6">Quick Links</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#5d4c42] mb-2">For Studios & Retreats</h3>
                  <p className="text-[#5d4c42]/80 text-sm mb-3">
                    Interested in partnering with us? Join our platform and reach thousands of yoga enthusiasts.
                  </p>
                  <a
                    href="/become-a-partner"
                    className="inline-block rounded-lg bg-[#5d4c42] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a39188]"
                  >
                    Become a Partner
                  </a>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#5d4c42] mb-2">Need Help?</h3>
                  <p className="text-[#5d4c42]/80 text-sm mb-3">
                    Check our FAQ section for quick answers to common questions.
                  </p>
                  <a
                    href="/faq"
                    className="inline-block rounded-lg border-2 border-[#5d4c42] px-4 py-2 text-sm font-semibold text-[#5d4c42] transition-colors hover:bg-[#5d4c42] hover:text-white"
                  >
                    View FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 