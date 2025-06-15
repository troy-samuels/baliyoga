"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"

const faqCategories = [
  {
    id: "general",
    name: "General",
    active: true
  },
  {
    id: "booking",
    name: "Booking & Pricing",
    active: false
  },
  {
    id: "studios",
    name: "For Studios",
    active: false
  },
  {
    id: "retreats",
    name: "For Retreats",
    active: false
  }
]

const faqData = {
  general: [
    {
      question: "What is Bali Yoga and how does it work?",
      answer: "Bali Yoga is a comprehensive platform that connects yoga enthusiasts with the best studios and retreat centers across Bali. We curate authentic experiences, provide detailed information about each location, and help you find the perfect yoga practice that matches your style and preferences."
    },
    {
      question: "How do I find yoga studios or retreats in my preferred area?",
      answer: "You can use our location filters on the Studios and Retreats pages to narrow down options by area such as Ubud, Canggu, Seminyak, or Uluwatu. You can also use the search function to find specific styles or locations that interest you."
    },
    {
      question: "Are all the studios and retreats verified?",
      answer: "Yes, we personally visit and verify each studio and retreat center listed on our platform. We ensure they meet our quality standards for instruction, facilities, and authentic yoga experiences before featuring them on Bali Yoga."
    },
    {
      question: "Can I book classes or retreats directly through Bali Yoga?",
      answer: "Currently, we provide detailed contact information and direct links to each studio or retreat center's booking system. You can call, visit their website, or contact them directly to make reservations."
    },
    {
      question: "Is Bali Yoga free to use?",
      answer: "Yes, Bali Yoga is completely free for users. You can browse studios, read reviews, and access all information without any cost. We're supported by our partner studios and retreat centers."
    }
  ],
  booking: [
    {
      question: "How far in advance should I book a yoga retreat?",
      answer: "We recommend booking yoga retreats at least 2-4 weeks in advance, especially during peak season (June-August). Popular retreats can fill up quickly, so early booking ensures you get your preferred dates and accommodation type."
    },
    {
      question: "What's typically included in retreat pricing?",
      answer: "Most retreats include accommodation, daily yoga sessions, meditation classes, healthy meals, and some cultural activities. Specific inclusions vary by retreat, so check the details page for each program to see exactly what's covered."
    },
    {
      question: "Can I get a refund if I need to cancel my booking?",
      answer: "Cancellation policies vary by studio and retreat center. Most have different refund rates depending on how far in advance you cancel. We recommend checking the specific cancellation policy before booking and considering travel insurance."
    },
    {
      question: "Do I need to bring my own yoga mat and props?",
      answer: "Most studios and retreats provide mats and basic props, but you're welcome to bring your own if you prefer. Check the amenities section of each listing to see what's provided, or contact them directly to confirm."
    },
    {
      question: "Are there discounts for longer stays or group bookings?",
      answer: "Many studios offer package deals for weekly or monthly passes, and retreat centers often have discounts for group bookings. Contact the venues directly to inquire about special rates for extended stays or multiple participants."
    }
  ],
  studios: [
    {
      question: "How can I list my yoga studio on Bali Yoga?",
      answer: "You can apply to become a partner by clicking 'Become a Partner' in our navigation menu. Fill out the application form with your studio details, and our team will review your submission within 2-3 business days."
    },
    {
      question: "What are the requirements to be featured on Bali Yoga?",
      answer: "We look for studios with qualified instructors, clean and safe facilities, authentic yoga practices, and positive community impact. Your studio should be legally operating in Bali with proper permits and insurance."
    },
    {
      question: "Is there a cost to list my studio?",
      answer: "Basic listings are free for qualified studios. We also offer premium listing options with enhanced visibility and additional features. Contact us through the partner application for more details about our partnership packages."
    },
    {
      question: "How do I update my studio information or schedule?",
      answer: "Once you're a partner, you'll receive access to update your listing information. You can also contact our support team anytime to make changes to your studio profile, schedule, or pricing information."
    },
    {
      question: "Can I see analytics about my studio's listing performance?",
      answer: "Yes, partner studios receive monthly reports showing profile views, contact clicks, and other engagement metrics. This helps you understand how users are discovering and interacting with your studio listing."
    }
  ],
  retreats: [
    {
      question: "What makes a retreat suitable for Bali Yoga's platform?",
      answer: "We feature retreats that offer authentic yoga experiences, qualified teachers, quality accommodations, and meaningful cultural immersion. Retreats should focus on wellness, personal growth, and genuine connection to Balinese culture."
    },
    {
      question: "How do I submit my retreat program for consideration?",
      answer: "Use our 'Become a Partner' application form and select 'Retreat Center' or 'Both Studio & Retreat' as your business type. Provide detailed information about your programs, facilities, and what makes your retreat unique."
    },
    {
      question: "Can I list multiple retreat programs or dates?",
      answer: "Absolutely! You can list various retreat programs throughout the year. We encourage retreat centers to showcase different offerings like beginner retreats, advanced programs, or specialized workshops."
    },
    {
      question: "What support do you provide for marketing my retreat?",
      answer: "Partner retreat centers benefit from our platform's marketing reach, social media promotion, and inclusion in our newsletter. We also provide guidance on creating compelling retreat descriptions and photography tips."
    },
    {
      question: "How do you ensure the quality of retreat experiences?",
      answer: "We conduct site visits, review teacher qualifications, and monitor guest feedback. We maintain ongoing relationships with our partners to ensure consistent quality and address any concerns promptly."
    }
  ]
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general")
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({})

  const toggleQuestion = (questionIndex: number) => {
    const key = `${activeCategory}-${questionIndex}`
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const isQuestionOpen = (questionIndex: number) => {
    const key = `${activeCategory}-${questionIndex}`
    return openQuestions[key] || false
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/placeholder.svg?height=600&width=1200&text=Bali+Yoga+FAQ')"
        }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            We're here to help with any questions you have about plans, pricing, and supported features.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 md:gap-4">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-6 md:text-base ${
                activeCategory === category.id
                  ? "bg-[#5d4c42] text-white"
                  : "bg-white text-[#5d4c42] hover:bg-[#e6ceb3]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Questions */}
        <div className="mx-auto max-w-4xl space-y-4">
          {faqData[activeCategory as keyof typeof faqData].map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl bg-white shadow-sm border border-[#e6ceb3]"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[#f9f9f6]"
              >
                <h3 className="text-lg font-semibold text-[#5d4c42] md:text-xl">
                  {faq.question}
                </h3>
                <div className="ml-4 flex-shrink-0">
                  {isQuestionOpen(index) ? (
                    <ChevronUp className="h-5 w-5 text-[#a39188]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#a39188]" />
                  )}
                </div>
              </button>
              
              {isQuestionOpen(index) && (
                <div className="border-t border-[#e6ceb3] bg-[#f9f9f6] px-6 py-4">
                  <p className="text-[#5d4c42]/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 rounded-2xl bg-[#e6ceb3] p-8 text-center">
          <h2 className="text-2xl font-bold text-[#5d4c42] md:text-3xl">
            Still have questions?
          </h2>
          <p className="mt-4 text-[#5d4c42]/80">
            Can't find the answer you're looking for? Please chat with our friendly team.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="rounded-lg bg-[#5d4c42] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
            >
              Contact Us
            </a>
            <a
              href="/become-a-partner"
              className="rounded-lg border-2 border-[#5d4c42] px-6 py-3 font-semibold text-[#5d4c42] transition-colors hover:bg-[#5d4c42] hover:text-white"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 