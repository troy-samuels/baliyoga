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
import { getSupabaseStudioBySlug, getSupabaseRetreatBySlug, getSimilarItems } from "@/lib/supabase-data-utils"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"

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

export default async function DetailPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params
  
  // Get the item data
  const item = await (type === "studios"
    ? getSupabaseStudioBySlug(slug)
    : getSupabaseRetreatBySlug(slug))

  if (!item) {
    return (
      <div className="min-h-screen bg-[#f9f3e9]">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-[#5d4c42]">Item not found</h1>
          <p className="mt-2 text-[#5d4c42]/70">The item you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block text-[#a39188] hover:text-[#8a7b73]">
            Return to home
          </Link>
        </div>
        <SiteFooter />
      </div>
    )
  }

  // Get similar items
  const similarItems = await getSimilarItems(type === "studios" ? "studio" : "retreat", item)

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Link
          href={`/${type}`}
          className="inline-flex items-center text-sm text-[#5d4c42]/70 hover:text-[#5d4c42]"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to {type === "studios" ? "Studios" : "Retreats"}
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#5d4c42] md:text-4xl">{item.name}</h1>
              <p className="mt-1 text-lg text-[#5d4c42]/80">
                {item.tagline || `Experience ${item.name} in ${item.location}`}
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
              <span>{item.location_details?.area || item.location}, Bali</span>
            </div>
            <div className="flex items-center">
              <span className="flex items-center font-medium text-[#5d4c42] bg-[#f2e8dc] px-2 py-1 rounded-full">
                <span>{item.rating}</span>
                <span className="text-[#5d4c42]/60 mx-1">/</span>
                <span className="text-[#5d4c42]/60">5</span>
              </span>
              <span className="ml-2 text-[#5d4c42]/60">({item.reviewCount} reviews)</span>
            </div>
            {type === "retreats" && 'duration' in item && item.duration && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {item.styles &&
              item.styles.map((style, index) => (
                <span key={index} className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm text-[#5d4c42]">
                  {style}
                </span>
              ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Images */}
          <div className="md:col-span-2">
            {item.images && item.images.length > 1 ? (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
                {/* Main large image */}
                <div className="relative overflow-hidden rounded-xl md:col-span-2 md:row-span-2">
                  <Image
                    src={item.images[0] || "/placeholder.svg?height=600&width=800&text=No+Image"}
                    alt={`${item.name} - Main Image`}
                    width={800}
                    height={600}
                    className="h-[300px] md:h-[400px] w-full object-cover"
                  />
                </div>
                {/* Additional smaller images */}
                {item.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index + 1}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <Image
                      src={image || "/placeholder.svg?height=300&width=400&text=No+Image"}
                      alt={`${item.name} - Image ${index + 2}`}
                      width={400}
                      height={300}
                      className="h-[195px] w-full object-cover"
                    />
                    {/* Show +X more photos overlay on the last visible image if there are more images */}
                    {index === 3 && item.images && item.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                        <span className="text-white font-semibold text-lg">
                          +{item.images.length - 5} photos
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={item.image || "/placeholder.svg?height=600&width=800&text=No+Image"}
                  alt={`${item.name} - Main Image`}
                  width={800}
                  height={600}
                  className="h-[300px] md:h-[400px] w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Right Column - Contact Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 border border-[#e6ceb3]">
              <h2 className="text-xl font-bold text-[#5d4c42] mb-4">Contact Information</h2>
              {item.phone_number ? (
                <a href={`tel:${item.phone_number}`} className="block w-full mb-3 rounded-lg bg-[#5d4c42] py-3 text-center text-white font-semibold hover:bg-[#a39188] transition">
                  <Phone className="inline-block w-4 h-4 mr-2" />
                  Call Now
                </a>
              ) : (
                <div className="block w-full mb-3 rounded-lg bg-[#e6ceb3] py-3 text-center text-[#5d4c42] font-semibold">
                  <Phone className="inline-block w-4 h-4 mr-2" />
                  Phone not available
                </div>
              )}
              {item.website ? (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="block w-full mb-4 rounded-lg border-2 border-[#5d4c42] py-3 text-center text-[#5d4c42] font-semibold hover:bg-[#e6ceb3] transition">
                  <Globe className="inline-block w-4 h-4 mr-2" />
                  Visit Website
                </a>
              ) : (
                <div className="block w-full mb-4 rounded-lg border-2 border-[#e6ceb3] py-3 text-center text-[#5d4c42]/60 font-semibold">
                  <Globe className="inline-block w-4 h-4 mr-2" />
                  Website not available
                </div>
              )}
              
              {/* Address */}
              <div className="mb-4 p-3 bg-[#f9f9f6] rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-4 w-4 text-[#5d4c42] flex-shrink-0" />
                  <span className="text-[#5d4c42]/80 text-sm">
                    {item.location_details?.address || "Address not available"}
                  </span>
                </div>
              </div>

              {/* Static Map */}
              <div className="mt-4">
                {item.location_details?.coordinates?.lat && item.location_details?.coordinates?.lng ? (
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${item.location_details.coordinates.lng},${item.location_details.coordinates.lat})/${item.location_details.coordinates.lng},${item.location_details.coordinates.lat},14/400x200?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndjN6bWl2bWgifQ.rJcFIG214AriISLbB6B5aw`}
                    alt="Map location"
                    className="w-full rounded-lg border border-[#e6ceb3]"
                    width={400}
                    height={200}
                  />
                ) : item.location_details?.address ? (
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000/${encodeURIComponent(item.location_details.address)}/14/400x200?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndjN6bWl2bWgifQ.rJcFIG214AriISLbB6B5aw`}
                    alt="Map location"
                    className="w-full rounded-lg border border-[#e6ceb3]"
                    width={400}
                    height={200}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                {(!item.location_details?.coordinates?.lat || !item.location_details?.coordinates?.lng) && !item.location_details?.address && (
                  <div className="w-full h-[200px] flex items-center justify-center bg-[#e6ceb3] rounded-lg text-[#5d4c42]/60">
                    <MapPin className="w-6 h-6 mr-2" />
                    Map not available
                  </div>
                )}
                {item.location_details?.address && (!item.location_details?.coordinates?.lat || !item.location_details?.coordinates?.lng) && (
                  <div className="w-full h-[200px] flex items-center justify-center bg-[#e6ceb3] rounded-lg text-[#5d4c42]/60 hidden">
                    <MapPin className="w-6 h-6 mr-2" />
                    Map not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#5d4c42]">About</h2>
          <p className="mt-4 text-[#5d4c42]/80">{item.description}</p>
          <p className="mt-4 text-[#5d4c42]/80">{item.longDescription}</p>
        </div>

        {/* Details */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#5d4c42]">Details</h2>
          <div className="mt-4 space-y-6">
            {type === "studios" && (
              <div>
                <h3 className="text-lg font-semibold text-[#5d4c42]">Pricing</h3>
                <div className="mt-2 space-y-2">
                  {typeof item.price === 'object' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-[#5d4c42]/80">Drop-in Class</span>
                        <span className="font-medium text-[#5d4c42]">{item.price.dropIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5d4c42]/80">Weekly Pass</span>
                        <span className="font-medium text-[#5d4c42]">{item.price.weekly}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5d4c42]/80">Monthly Pass</span>
                        <span className="font-medium text-[#5d4c42]">{item.price.monthly}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {type === "retreats" && (
              <div>
                <h3 className="text-lg font-semibold text-[#5d4c42]">Program Details</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#5d4c42]/80">Duration</span>
                    <span className="font-medium text-[#5d4c42]">{'duration' in item ? item.duration : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5d4c42]/80">Price</span>
                    <span className="font-medium text-[#5d4c42]">
                      {typeof item.price === 'string' ? item.price : 'Contact for pricing'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {item.opening_hours && item.opening_hours.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#5d4c42]">Opening Hours</h3>
                <div className="mt-2 space-y-2">
                  {item.opening_hours.map((hours, index) => (
                    <div key={index} className="flex justify-between">
                      {typeof hours === 'object' && hours.day && hours.hours ? (
                        <span className="text-[#5d4c42]/80">{hours.day}: {hours.hours}</span>
                      ) : (
                        <span className="text-[#5d4c42]/80">{String(hours)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Items Section */}
        {similarItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#5d4c42]">
              Similar {type === "studios" ? "Studios" : "Retreats"} in {item.location}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {similarItems.map((similarItem) => (
                <MobileOptimizedCard
                  key={String(similarItem.id)}
                  id={String(similarItem.id)}
                  name={similarItem.name}
                  slug={similarItem.slug}
                  image={similarItem.image}
                  location={similarItem.location}
                  rating={typeof similarItem.rating === 'string' ? parseFloat(similarItem.rating) : similarItem.rating}
                  type={type === "studios" ? "studio" : "retreat"}
                  styles={similarItem.styles}
                  duration={'duration' in similarItem ? similarItem.duration : undefined}
                  price={
                    type === "studios"
                      ? (typeof similarItem.price === 'object' && similarItem.price?.dropIn ? similarItem.price.dropIn : undefined)
                      : (typeof similarItem.price === 'string' ? similarItem.price : undefined)
                  }
                  phone_number={similarItem.phone_number}
                  website={similarItem.website}
                />
              ))}
            </div>
          </div>
        )}
        {/* Tertiary Claim Button at the bottom */}
        <div className="text-center text-[#a39188] mt-12">
          Are you the owner of this {type === "studios" ? "studio" : "retreat"}? {" "}
          <Link
            href={`/claim/${item.slug}`}
            className="underline text-[#5d4c42] hover:text-[#a39188] font-medium"
          >
            Claim this listing
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
