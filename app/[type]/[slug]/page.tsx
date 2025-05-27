import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Facebook,
  Globe,
  Heart,
  Instagram,
  MapPin,
  Phone,
  Share2,
  Twitter,
  Users,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStudioBySlug, getRetreatBySlug } from "@/lib/data-utils"
import { getSupabaseStudioBySlug, getSupabaseRetreatBySlug } from "@/lib/supabase-data-utils"

// This would normally come from a database or API
const getMockData = (type: string, slug: string) => {
  // This is mock data - in a real app, you would fetch this from an API or database
  if (type === "studios") {
    return {
      type: "studio",
      name: "Harmony Yoga Studio",
      slug: "harmony-yoga-studio",
      tagline: "Find your balance in the heart of Ubud",
      description:
        "Harmony Yoga Studio is a peaceful sanctuary nestled in the lush greenery of Ubud. Our studio offers a variety of yoga classes for all levels, from beginners to advanced practitioners. With experienced instructors and a serene environment, we provide the perfect space for your yoga journey.",
      longDescription:
        "Harmony Yoga Studio was founded in 2015 with a vision to create a peaceful sanctuary where people could connect with themselves through the practice of yoga. Nestled in the lush greenery of Ubud, our studio has become a beloved destination for both locals and travelers seeking to deepen their practice.\n\nOur spacious bamboo studio is designed to bring the outside in, with open sides that allow the gentle Bali breeze to flow through during practice. The sounds of nature – birds singing, leaves rustling – create a natural soundtrack that enhances your yoga experience.\n\nWe believe that yoga is for everyone, which is why we offer a diverse range of classes suitable for all levels. Whether you're a complete beginner or an experienced yogi, our skilled instructors will guide you through your practice with care and attention.",
      location: {
        address: "Jl. Raya Ubud No. 88, Ubud",
        area: "Ubud",
        coordinates: { lat: -8.5069, lng: 115.2624 },
      },
      rating: 4.9,
      reviewCount: 127,
      price: {
        dropIn: "$15",
        weekly: "$75",
        monthly: "$220",
      },
      images: [
        "/placeholder.svg?height=600&width=800&text=Harmony Yoga Studio 1",
        "/placeholder.svg?height=600&width=800&text=Harmony Yoga Studio 2",
        "/placeholder.svg?height=600&width=800&text=Harmony Yoga Studio 3",
        "/placeholder.svg?height=600&width=800&text=Harmony Yoga Studio 4",
      ],
      styles: ["Hatha", "Vinyasa", "Yin", "Restorative"],
      amenities: [
        "Mats provided",
        "Changing rooms",
        "Showers",
        "Drinking water",
        "Tea service",
        "Wi-Fi",
        "Air conditioning",
        "Props available",
      ],
      schedule: [
        {
          day: "Monday",
          classes: [
            { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
            { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
            { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
          ],
        },
        {
          day: "Tuesday",
          classes: [
            { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
            { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
            { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
          ],
        },
        {
          day: "Wednesday",
          classes: [
            { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
            { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
            { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
          ],
        },
        {
          day: "Thursday",
          classes: [
            { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
            { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
            { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
          ],
        },
        {
          day: "Friday",
          classes: [
            { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
            { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
            { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
          ],
        },
        {
          day: "Saturday",
          classes: [
            { time: "08:00 - 09:30", name: "Weekend Flow", style: "Vinyasa", instructor: "Sarah" },
            { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
          ],
        },
        {
          day: "Sunday",
          classes: [
            { time: "08:00 - 09:30", name: "Weekend Flow", style: "Vinyasa", instructor: "Sarah" },
            { time: "16:00 - 17:30", name: "Restorative", style: "Restorative", instructor: "Emma" },
          ],
        },
      ],
      instructors: [
        {
          name: "Sarah Johnson",
          image: "/placeholder.svg?height=200&width=200&text=Sarah",
          bio: "Sarah has been practicing yoga for over 15 years and teaching for 10. She specializes in Vinyasa and Hatha yoga, with additional training in meditation and mindfulness.",
          styles: ["Vinyasa", "Hatha", "Meditation"],
        },
        {
          name: "David Lee",
          image: "/placeholder.svg?height=200&width=200&text=David",
          bio: "David discovered yoga during his travels in India and has been teaching for 8 years. His classes focus on alignment and breath awareness.",
          styles: ["Hatha", "Alignment", "Pranayama"],
        },
        {
          name: "Emma Wilson",
          image: "/placeholder.svg?height=200&width=200&text=Emma",
          bio: "Emma specializes in Yin and Restorative yoga, creating a nurturing space for deep relaxation and release. She has been teaching for 5 years.",
          styles: ["Yin", "Restorative", "Yoga Nidra"],
        },
      ],
      reviews: [
        {
          name: "Michael T.",
          date: "April 2023",
          rating: 5,
          text: "Beautiful studio with excellent teachers. The morning flow class with Sarah was exactly what I needed - challenging but accessible. Will definitely return!",
        },
        {
          name: "Lisa R.",
          date: "March 2023",
          rating: 5,
          text: "I've been coming to Harmony for a month now and love the variety of classes. The studio itself is gorgeous and peaceful. Highly recommend the Yin classes with Emma.",
        },
        {
          name: "James K.",
          date: "February 2023",
          rating: 4,
          text: "Great studio with knowledgeable instructors. The only reason for 4 stars instead of 5 is that it can get quite busy during peak times. Otherwise, excellent!",
        },
      ],
      faqs: [
        {
          question: "Do I need to book classes in advance?",
          answer:
            "We recommend booking classes in advance, especially during high season (June-August). You can book through our website or by calling the studio.",
        },
        {
          question: "What should I bring to class?",
          answer:
            "We provide mats and props, but you're welcome to bring your own if you prefer. We recommend bringing a water bottle and a small towel.",
        },
        {
          question: "Are beginners welcome?",
          answer:
            "We have classes suitable for all levels, including complete beginners. Our Gentle Hatha classes are perfect for those new to yoga.",
        },
        {
          question: "Do you offer private classes?",
          answer: "Yes, we offer private one-on-one or small group sessions. Please contact us directly to arrange.",
        },
      ],
      similar: [
        {
          name: "Serenity Yoga Center",
          image: "/placeholder.svg?height=200&width=300&text=Serenity",
          location: "Ubud",
          rating: 4.8,
        },
        {
          name: "Lotus Yoga Bali",
          image: "/placeholder.svg?height=200&width=300&text=Lotus",
          location: "Ubud",
          rating: 4.7,
        },
        {
          name: "Green Path Yoga",
          image: "/placeholder.svg?height=200&width=300&text=Green Path",
          location: "Ubud",
          rating: 4.9,
        },
      ],
    }
  } else if (type === "retreats") {
    return {
      type: "retreat",
      name: "Serenity Wellness Retreat",
      slug: "serenity-wellness-retreat",
      tagline: "A transformative 7-day journey to wellness in paradise",
      description:
        "Escape to our tranquil retreat center nestled in the lush rice fields of Ubud. Our 7-day wellness program combines daily yoga, meditation, healthy cuisine, and cultural experiences to rejuvenate your body, mind, and spirit.",
      longDescription:
        "Serenity Wellness Retreat offers a transformative 7-day journey in the heart of Bali's cultural center, Ubud. Our retreat center is nestled among lush rice fields, providing a peaceful sanctuary away from the hustle and bustle of everyday life.\n\nOur carefully crafted program combines daily yoga and meditation practices, nourishing plant-based cuisine, cultural excursions, and healing spa treatments to create a holistic experience that rejuvenates your body, mind, and spirit.\n\nWhether you're seeking to deepen your yoga practice, reset your health, or simply take time for self-care, our retreat provides the perfect setting for your personal journey. Our experienced facilitators create a supportive environment where you can explore, grow, and connect with like-minded individuals from around the world.",
      location: {
        address: "Jl. Raya Tegallalang, Ubud",
        area: "Ubud",
        coordinates: { lat: -8.4305, lng: 115.2762 },
      },
      rating: 4.9,
      reviewCount: 89,
      price: {
        standard: "$1,299",
        premium: "$1,599",
        deposit: "$300",
      },
      duration: "7 days / 6 nights",
      dates: [
        { start: "June 15, 2023", end: "June 21, 2023", availability: "Limited" },
        { start: "July 10, 2023", end: "July 16, 2023", availability: "Available" },
        { start: "August 5, 2023", end: "August 11, 2023", availability: "Available" },
        { start: "September 12, 2023", end: "September 18, 2023", availability: "Available" },
      ],
      images: [
        "/placeholder.svg?height=600&width=800&text=Serenity Retreat 1",
        "/placeholder.svg?height=600&width=800&text=Serenity Retreat 2",
        "/placeholder.svg?height=600&width=800&text=Serenity Retreat 3",
        "/placeholder.svg?height=600&width=800&text=Serenity Retreat 4",
      ],
      styles: ["Vinyasa", "Yin", "Meditation", "Breathwork"],
      includes: [
        "6 nights accommodation",
        "3 vegetarian/vegan meals daily",
        "2 daily yoga sessions",
        "Daily meditation",
        "1 Balinese massage",
        "Waterfall excursion",
        "Rice field walk",
        "Temple ceremony visit",
        "Cooking class",
        "Airport transfers",
      ],
      accommodation: [
        {
          type: "Shared Room",
          description:
            "Comfortable shared room with twin beds, en-suite bathroom, air conditioning, and a balcony overlooking the rice fields.",
          price: "$1,299 per person",
        },
        {
          type: "Private Room",
          description:
            "Spacious private room with a queen bed, en-suite bathroom, air conditioning, and a private balcony with stunning views.",
          price: "$1,599 per person",
        },
      ],
      schedule: {
        typical: [
          { time: "06:30 - 07:00", activity: "Morning tea" },
          { time: "07:00 - 08:30", activity: "Morning yoga practice" },
          { time: "08:30 - 09:30", activity: "Breakfast" },
          { time: "10:00 - 12:00", activity: "Workshop or excursion" },
          { time: "12:30 - 13:30", activity: "Lunch" },
          { time: "13:30 - 15:30", activity: "Free time / Optional spa treatments" },
          { time: "15:30 - 16:30", activity: "Afternoon workshop" },
          { time: "17:00 - 18:30", activity: "Evening yoga / Meditation" },
          { time: "19:00 - 20:00", activity: "Dinner" },
          { time: "20:30 - 21:30", activity: "Evening activity (varies by day)" },
        ],
      },
      facilitators: [
        {
          name: "Maya Patel",
          image: "/placeholder.svg?height=200&width=200&text=Maya",
          bio: "Maya is the founder of Serenity Wellness Retreat and has been teaching yoga for over 15 years. Her approach combines traditional Hatha and Vinyasa with mindfulness practices.",
          role: "Lead Yoga Teacher",
        },
        {
          name: "Ketut Wira",
          image: "/placeholder.svg?height=200&width=200&text=Ketut",
          bio: "Ketut is a Balinese healer and meditation guide who brings local wisdom and spiritual practices to the retreat experience.",
          role: "Meditation Guide",
        },
        {
          name: "Claire Bennett",
          image: "/placeholder.svg?height=200&width=200&text=Claire",
          bio: "Claire is a nutritionist and plant-based chef who creates nourishing, delicious meals using local, organic ingredients.",
          role: "Retreat Chef",
        },
      ],
      reviews: [
        {
          name: "Sophia L.",
          date: "March 2023",
          rating: 5,
          text: "This retreat exceeded all my expectations. The location is breathtaking, the food was incredible, and the yoga sessions were transformative. I left feeling renewed and inspired.",
        },
        {
          name: "Thomas B.",
          date: "February 2023",
          rating: 5,
          text: "A life-changing experience. The perfect balance of structure and free time, with excellent teachers and beautiful accommodations. I've already booked to return next year!",
        },
        {
          name: "Olivia M.",
          date: "January 2023",
          rating: 4,
          text: "A wonderful retreat in a stunning location. The yoga and meditation sessions were excellent. My only suggestion would be to offer more variety in the workshops.",
        },
      ],
      faqs: [
        {
          question: "Is this retreat suitable for beginners?",
          answer:
            "Yes, our retreat welcomes practitioners of all levels. Our teachers offer modifications for beginners and challenges for more advanced students.",
        },
        {
          question: "What is the cancellation policy?",
          answer:
            "Deposits are non-refundable. Full payments are refundable up to 60 days before the retreat minus the deposit. Within 60 days, no refunds are available, but you may transfer your booking to another person.",
        },
        {
          question: "Is airport transfer included?",
          answer: "Yes, we provide complimentary airport transfers on arrival and departure days.",
        },
        {
          question: "What should I pack?",
          answer:
            "We recommend comfortable yoga clothes, a light jacket or sweater for evenings, swimwear, sunscreen, insect repellent, and any personal items you may need. Yoga mats and props are provided.",
        },
      ],
      similar: [
        {
          name: "Bali Bliss Retreat",
          image: "/placeholder.svg?height=200&width=300&text=Bali Bliss",
          location: "Ubud",
          duration: "5 days",
          rating: 4.8,
        },
        {
          name: "Jungle Yoga Escape",
          image: "/placeholder.svg?height=200&width=300&text=Jungle Yoga",
          location: "Ubud",
          duration: "8 days",
          rating: 4.7,
        },
        {
          name: "Ocean Harmony Retreat",
          image: "/placeholder.svg?height=200&width=300&text=Ocean Harmony",
          location: "Canggu",
          duration: "6 days",
          rating: 4.9,
        },
      ],
    }
  }

  // Default fallback
  return {
    type: "unknown",
    name: "Not Found",
    slug: slug,
    description: "The requested listing could not be found.",
  }
}

export default async function DetailPage({ params }: { params: { type: string; slug: string } }) {
  const { type, slug } = params

  // Try to get data from our Supabase data utility first
  let data
  if (type === "studios") {
    const studio = await getSupabaseStudioBySlug(slug)
    if (studio) {
      data = { ...studio, type: "studio" }
    }
  } else if (type === "retreats") {
    const retreat = await getSupabaseRetreatBySlug(slug)
    if (retreat) {
      data = { ...retreat, type: "retreat" }
    }
  }

  // If no data found from Supabase, try the local data utility
  if (!data) {
    if (type === "studios") {
      const studio = getStudioBySlug(slug)
      if (studio) {
        data = { ...studio, type: "studio" }
      }
    } else if (type === "retreats") {
      const retreat = getRetreatBySlug(slug)
      if (retreat) {
        data = { ...retreat, type: "retreat" }
      }
    }
  }

  // If still no data found, use mock data
  if (!data) {
    data = getMockData(type, slug)
  }

  const isStudio = data.type === "studio"
  const isRetreat = data.type === "retreat"

  // Prepare images array
  const images = data.images || [data.image || "/placeholder.svg?height=600&width=800&text=No+Image"]
  if (!data.images && data.image) {
    images.push(
      "/placeholder.svg?height=600&width=800&text=Image+2",
      "/placeholder.svg?height=600&width=800&text=Image+3",
      "/placeholder.svg?height=600&width=800&text=Image+4",
    )
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <SiteHeader />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href={isStudio ? "/studios" : isRetreat ? "/retreats" : "/"}
            className="inline-flex items-center text-[#5d4c42] hover:text-[#a39188]"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to {isStudio ? "Studios" : isRetreat ? "Retreats" : "Home"}
          </Link>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-xl ${
                      index === 0 ? "col-span-1 md:col-span-2 md:row-span-2" : ""
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=600&width=800&text=No+Image"}
                      alt={`${data.name} - Image ${index + 1}`}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#5d4c42] md:text-4xl">{data.name}</h1>
                  <p className="mt-1 text-lg text-[#5d4c42]/80">
                    {data.tagline || `Experience ${data.name} in ${data.location}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-white p-2 text-[#5d4c42] shadow-sm hover:bg-[#e6ceb3]">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Save to favorites</span>
                  </button>
                  <button className="rounded-full bg-white p-2 text-[#5d4c42] shadow-sm hover:bg-[#e6ceb3]">
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[#5d4c42]">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{data.location_details?.area || data.location}, Bali</span>
                </div>
                <div className="flex items-center">
                  <span className="flex items-center font-medium text-[#5d4c42] bg-[#f2e8dc] px-2 py-1 rounded-full">
                    <span>{data.rating}</span>
                    <span className="text-[#5d4c42]/60 mx-1">/</span>
                    <span className="text-[#5d4c42]/60">5</span>
                  </span>
                  <span className="ml-2 text-[#5d4c42]/60">({data.reviewCount} reviews)</span>
                </div>
                {isRetreat && data.duration && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{data.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {data.styles &&
                  data.styles.map((style, index) => (
                    <span key={index} className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm text-[#5d4c42]">
                      {style}
                    </span>
                  ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-5 gap-2">
                <TabsTrigger value="about" className="px-4">
                  About
                </TabsTrigger>
                {isStudio && (
                  <TabsTrigger value="schedule" className="px-4">
                    Schedule
                  </TabsTrigger>
                )}
                {isRetreat && (
                  <TabsTrigger value="details" className="px-4">
                    Details
                  </TabsTrigger>
                )}
                <TabsTrigger value="team" className="px-4">
                  {isStudio ? "Instructors" : "Facilitators"}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="px-4">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="faqs" className="px-4">
                  FAQs
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6 space-y-6">
                <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#5d4c42]">About {data.name}</h2>
                  <div className="prose text-[#5d4c42]/80">
                    <p>{data.longDescription || data.description}</p>
                  </div>
                </div>

                {/* Amenities/Includes */}
                <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#5d4c42]">{isStudio ? "Amenities" : "What's Included"}</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {(isStudio ? data.amenities : data.includes)?.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-[#5d4c42]/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#5d4c42]">Location</h2>
                  <p className="text-[#5d4c42]/80">{data.location_details?.address || `${data.location}, Bali`}</p>
                  <div className="h-64 w-full overflow-hidden rounded-lg bg-[#e6ceb3]">
                    <Image
                      src="/placeholder.svg?height=300&width=600&text=Map"
                      alt="Location Map"
                      width={600}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Schedule Tab (Studios) */}
              {isStudio && (
                <TabsContent value="schedule" className="mt-6 space-y-6">
                  <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#5d4c42]">Class Schedule</h2>
                    <div className="space-y-6">
                      {data.schedule?.map((day, index) => (
                        <div key={index} className="space-y-3">
                          <h3 className="font-medium text-[#5d4c42]">{day.day}</h3>
                          <div className="space-y-2">
                            {day.classes.map((cls, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col justify-between rounded-lg border border-[#e6ceb3] p-3 sm:flex-row sm:items-center"
                              >
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-[#a39188]" />
                                  <span className="text-sm font-medium text-[#5d4c42]">{cls.time}</span>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                  <span className="font-medium text-[#5d4c42]">{cls.name}</span>
                                  <span className="mx-2 text-[#5d4c42]/60">•</span>
                                  <span className="text-sm text-[#5d4c42]/80">{cls.style}</span>
                                </div>
                                <div className="mt-2 text-sm text-[#5d4c42]/80 sm:mt-0">with {cls.instructor}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* Details Tab (Retreats) */}
              {isRetreat && (
                <TabsContent value="details" className="mt-6 space-y-6">
                  {/* Upcoming Dates */}
                  <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#5d4c42]">Upcoming Dates</h2>
                    <div className="space-y-3">
                      {data.dates?.map((date, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-between rounded-lg border border-[#e6ceb3] p-4 sm:flex-row sm:items-center"
                        >
                          <div>
                            <div className="font-medium text-[#5d4c42]">
                              {date.start} - {date.end}
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span
                              className={`rounded-full px-3 py-1 text-sm ${
                                date.availability === "Limited"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {date.availability}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#5d4c42]">Accommodation Options</h2>
                    <div className="space-y-4">
                      {data.accommodation?.map((option, index) => (
                        <div key={index} className="rounded-lg border border-[#e6ceb3] p-4">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <h3 className="font-medium text-[#5d4c42]">{option.type}</h3>
                            <div className="text-lg font-semibold text-[#5d4c42]">{option.price}</div>
                          </div>
                          <p className="mt-2 text-sm text-[#5d4c42]/80">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Schedule */}
                  <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#5d4c42]">Typical Daily Schedule</h2>
                    <div className="space-y-2">
                      {data.schedule?.typical.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-between rounded-lg border border-[#e6ceb3] p-3 sm:flex-row sm:items-center"
                        >
                          <div className="font-medium text-[#5d4c42]">{item.time}</div>
                          <div className="mt-1 text-[#5d4c42]/80 sm:mt-0">{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* Team Tab */}
              <TabsContent value="team" className="mt-6 space-y-6">
                <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#5d4c42]">
                    {isStudio ? "Our Instructors" : "Retreat Facilitators"}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {(isStudio ? data.instructors : data.facilitators)?.map((person, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-xl border border-[#e6ceb3] bg-white shadow-sm"
                      >
                        <div className="aspect-square w-full overflow-hidden">
                          <Image
                            src={person.image || "/placeholder.svg?height=200&width=200&text=Instructor"}
                            alt={person.name}
                            width={200}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-[#5d4c42]">{person.name}</h3>
                          {isRetreat && person.role && (
                            <p className="mt-1 text-sm font-medium text-[#a39188]">{person.role}</p>
                          )}
                          {isStudio && person.styles && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {person.styles.map((style, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-full bg-[#e6ceb3] px-2 py-0.5 text-xs text-[#5d4c42]"
                                >
                                  {style}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="mt-2 text-sm text-[#5d4c42]/80 line-clamp-3">{person.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#5d4c42]">Reviews</h2>
                    <div className="flex items-center">
                      <span className="flex items-center font-medium text-[#5d4c42] bg-[#f2e8dc] px-2 py-1 rounded-full">
                        <span>{data.rating}</span>
                        <span className="text-[#5d4c42]/60 mx-1">/</span>
                        <span className="text-[#5d4c42]/60">5</span>
                      </span>
                      <span className="ml-2 text-[#5d4c42]/60">({data.reviewCount})</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {data.reviews?.map((review, index) => (
                      <div key={index} className="rounded-lg border border-[#e6ceb3] p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-[#5d4c42]">{review.name}</span>
                            <span className="ml-2 text-sm text-[#5d4c42]/60">{review.date}</span>
                          </div>
                          <div className="flex items-center bg-[#f2e8dc] px-2 py-1 rounded-full">
                            <span className="font-medium text-[#5d4c42]">{review.rating}</span>
                            <span className="text-[#5d4c42]/60 mx-1">/</span>
                            <span className="text-[#5d4c42]/60">5</span>
                          </div>
                        </div>
                        <p className="text-[#5d4c42]/80">{review.text}</p>
                      </div>
                    ))}
                  </div>

                  <Button className="mt-4 w-full bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]">
                    See All Reviews
                  </Button>
                </div>
              </TabsContent>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="mt-6 space-y-6">
                <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#5d4c42]">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {data.faqs?.map((faq, index) => (
                      <div key={index} className="rounded-lg border border-[#e6ceb3] p-4">
                        <h3 className="font-medium text-[#5d4c42]">{faq.question}</h3>
                        <p className="mt-2 text-[#5d4c42]/80">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Similar Listings */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-[#5d4c42]">Similar {isStudio ? "Studios" : "Retreats"}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {data.similar?.map((item, index) => (
                  <Link
                    key={index}
                    href={`/${isStudio ? "studios" : "retreats"}/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md h-[280px]"
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg?height=200&width=300&text=Similar"}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 rounded-full bg-white px-2 py-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-[#5d4c42]">{item.rating}</span>
                          <span className="text-xs text-[#5d4c42]/60">/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <h3 className="font-semibold text-[#5d4c42] line-clamp-2">{item.name}</h3>
                      <div className="mt-auto">
                        <div className="flex items-center text-sm text-[#5d4c42]/80">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>{item.location}, Bali</span>
                        </div>
                        {isRetreat && item.duration && (
                          <div className="mt-1 text-sm text-[#5d4c42]/80">
                            <span>{item.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Booking/Pricing Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#5d4c42]">
                  {isStudio ? "Class Pricing" : "Book This Retreat"}
                </h3>

                {isStudio && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#5d4c42]/80">Drop-in class</span>
                      <span className="font-medium text-[#5d4c42]">{data.price?.dropIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5d4c42]/80">Weekly pass</span>
                      <span className="font-medium text-[#5d4c42]">{data.price?.weekly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5d4c42]/80">Monthly unlimited</span>
                      <span className="font-medium text-[#5d4c42]">{data.price?.monthly}</span>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]">Book a Class</Button>
                    </div>
                  </div>
                )}

                {isRetreat && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-[#f2e8dc] p-4">
                      <div className="mb-2 text-sm text-[#5d4c42]/80">Starting from</div>
                      <div className="text-2xl font-bold text-[#5d4c42]">{data.price}</div>
                      <div className="mt-1 text-sm text-[#5d4c42]/80">per person</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-[#a39188]" />
                        <span className="text-sm text-[#5d4c42]/80">Limited spots available</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-[#a39188]" />
                        <span className="text-sm text-[#5d4c42]/80">Multiple dates available</span>
                      </div>
                    </div>

                    <Button className="w-full bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]">Reserve Your Spot</Button>
                    <div className="text-center text-xs text-[#5d4c42]/60">Secure with deposit</div>
                  </div>
                )}
              </div>

              {/* Contact Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#5d4c42]">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-[#a39188]" />
                    <span className="text-[#5d4c42]/80">{data.phone_number || "+62 812 3456 7890"}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-[#a39188]" />
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5d4c42]/80 hover:text-[#5d4c42] hover:underline"
                    >
                      {data.website || (isStudio ? "harmonyyoga.com" : "serenitybali.com")}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <a href="#" className="rounded-full bg-[#f2e8dc] p-2 text-[#5d4c42] hover:bg-[#e6ceb3]">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a href="#" className="rounded-full bg-[#f2e8dc] p-2 text-[#5d4c42] hover:bg-[#e6ceb3]">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a href="#" className="rounded-full bg-[#f2e8dc] p-2 text-[#5d4c42] hover:bg-[#e6ceb3]">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#5d4c42]">Send a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm text-[#5d4c42]/80">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm text-[#5d4c42]/80">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1 block text-sm text-[#5d4c42]/80">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full rounded-lg border border-[#e6ceb3] p-2 focus:border-[#a39188] focus:outline-none"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-[#e6ceb3] text-[#5d4c42] hover:bg-[#d9b99a]">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
