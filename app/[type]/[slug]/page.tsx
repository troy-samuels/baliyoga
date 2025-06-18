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
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStudioBySlug, getRetreatBySlug } from "@/lib/data-utils"
import { getSupabaseStudioBySlug, getSupabaseRetreatBySlug, getSimilarItems } from "@/lib/supabase-data-utils"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { WishlistHeart } from "@/components/wishlist-heart"
import { PopularityBadge } from "@/components/popularity-badge"
import { ErrorHandledImage } from "@/components/error-handled-image"
import { LocationMap } from "@/components/location-map"

export async function generateMetadata({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params
  
  const item = await (type === "studios"
    ? getSupabaseStudioBySlug(slug)
    : getSupabaseRetreatBySlug(slug))

  if (!item) {
    return {
      title: "Item not found",
      description: "The requested listing could not be found.",
    }
  }

  return {
    title: `${item.name} - ${type === "studios" ? "Yoga Studio" : "Retreat"} in ${item.location}`,
    description: `${item.name} is a ${item.category} located in ${item.location}, Bali.`,
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
        <MobileOptimizedHeader />
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

  // Create wishlist item object
  const wishlistItem = {
    id: String(item.id),
    name: item.name,
    slug: item.slug,
    image: item.image,
    location: item.location,
    rating: item.rating,
    type: type === "studios" ? "studio" as const : "retreat" as const,
    styles: item.styles,
    duration: 'duration' in item ? item.duration : undefined,
    price: typeof item.price === 'string' ? item.price : undefined,
    phone_number: item.phone_number,
    website: item.website,
  }

  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
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
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#5d4c42] md:text-4xl">{item.name}</h1>
                  <p className="mt-1 text-lg text-[#5d4c42]/80">
                    {item.category} in {item.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PopularityBadge itemId={String(item.id)} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <WishlistHeart item={wishlistItem} className="rounded-full bg-white p-2 shadow-sm hover:bg-[#e6ceb3]" />
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
            {item.rating > 0 && (
              <div className="flex items-center">
                <span className="flex items-center font-medium text-[#5d4c42] bg-[#f2e8dc] px-2 py-1 rounded-full">
                  <span>{item.rating}</span>
                  <span className="text-[#5d4c42]/60 mx-1">/</span>
                  <span className="text-[#5d4c42]/60">5</span>
                </span>
                <span className="ml-2 text-[#5d4c42]/60">({item.reviewCount} reviews)</span>
              </div>
            )}
            {type === "retreats" && 'duration' in item && item.duration && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>

          {item.styles && item.styles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.styles.map((style, index) => (
                <span key={index} className="rounded-full bg-[#e6ceb3] px-3 py-1 text-sm text-[#5d4c42]">
                  {style}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Images */}
          <div className="md:col-span-2">
            {item.images && item.images.length > 1 ? (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
                {/* Main large image */}
                <div className="relative overflow-hidden rounded-xl md:col-span-2 md:row-span-2">
                  <ErrorHandledImage
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
                    <ErrorHandledImage
                      src={image || "/placeholder.svg?height=300&width=400&text=No+Image"}
                      alt={`${item.name} - Image ${index + 2}`}
                      width={400}
                      height={300}
                      className="h-[195px] w-full object-cover"
                      fallbackSrc="/placeholder.svg?height=300&width=400&text=Image+Not+Available"
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
                <ErrorHandledImage
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
              {item.location_details?.address && (
                <div className="mb-4 p-3 bg-[#f9f9f6] rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 h-4 w-4 text-[#5d4c42] flex-shrink-0" />
                    <span className="text-[#5d4c42]/80 text-sm">
                      {item.location_details.address}
                    </span>
                  </div>
                </div>
              )}

              {/* Location Map */}
              <div className="mt-4">
                <LocationMap 
                  address={item.location_details?.address || ""}
                  name={item.name}
                  city={item.location}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Only show sections if we have real data */}
        {(type === "retreats" && 'duration' in item && item.duration) || 
         (type === "retreats" && 'price' in item && item.price) ||
         (type === "retreats" && 'includes' in item && item.includes && item.includes.length > 0) ||
         (item.opening_hours && item.opening_hours.length > 0) ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[#5d4c42]">Details</h2>
            <div className="mt-4 space-y-6">
              {type === "retreats" && (
                <div>
                  <h3 className="text-lg font-semibold text-[#5d4c42]">Program Details</h3>
                  <div className="mt-2 space-y-2">
                    {'duration' in item && item.duration && (
                      <div className="flex justify-between">
                        <span className="text-[#5d4c42]/80">Duration</span>
                        <span className="font-medium text-[#5d4c42]">{item.duration}</span>
                      </div>
                    )}
                    {'price' in item && item.price && (
                      <div className="flex justify-between">
                        <span className="text-[#5d4c42]/80">Price</span>
                        <span className="font-medium text-[#5d4c42]">
                          {typeof item.price === 'string' ? item.price : 'Contact for pricing'}
                        </span>
                      </div>
                    )}
                    {'includes' in item && item.includes && item.includes.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-[#5d4c42] mb-2">What's Included:</h4>
                        <ul className="space-y-1">
                          {item.includes.map((include, index) => (
                            <li key={index} className="flex items-center text-[#5d4c42]/80">
                              <Check className="w-4 h-4 mr-2 text-green-600" />
                              {include}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.opening_hours && item.opening_hours.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#5d4c42]">Opening Hours</h3>
                  <div className="mt-2 space-y-2">
                    {item.opening_hours.map((hours, index) => {
                      if (typeof hours === 'object' && hours && 'day' in hours && 'hours' in hours) {
                        return (
                          <div key={index} className="flex justify-between">
                            <span className="text-[#5d4c42]/80">{hours.day}</span>
                            <span className="font-medium text-[#5d4c42]">{hours.hours}</span>
                          </div>
                        )
                      } else {
                        return (
                          <div key={index} className="text-[#5d4c42]/80">
                            {String(hours)}
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

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
                    type === "retreats" && 'price' in similarItem && typeof similarItem.price === 'string' && similarItem.price
                      ? similarItem.price
                      : undefined
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
