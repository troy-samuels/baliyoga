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
import { getSupabaseStudioBySlug, getSupabaseRetreatBySlug, getSimilarItems, getSupabaseStudios, getSupabaseRetreats } from "@/lib/supabase-data-utils"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { WishlistHeart } from "@/components/wishlist-heart"
import { PopularityBadge } from "@/components/popularity-badge"
import { ErrorHandledImage } from "@/components/error-handled-image"
import { LocationMap } from "@/components/location-map"
import { SchemaMarkup } from "@/components/schema-markup"
import { ReviewSection } from "@/components/review-section"
import { generateColorFallback } from "@/lib/image-fallback"

export async function generateStaticParams() {
  // Get all studios and retreats to generate static params
  const [studios, retreats] = await Promise.all([
    getSupabaseStudios(),
    getSupabaseRetreats()
  ])
  
  const params = []
  
  // Add studio params
  for (const studio of studios) {
    params.push({
      type: 'studios',
      slug: studio.slug
    })
  }
  
  // Add retreat params
  for (const retreat of retreats) {
    params.push({
      type: 'retreats', 
      slug: retreat.slug
    })
  }
  
  return params
}

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
      <SchemaMarkup item={item} type={type === "studios" ? "studio" : "retreat"} />
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
              <div className="flex items-center gap-2">
                {/* Google Reviews Display */}
                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                  {/* Google "G" Icon */}
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    className="flex-shrink-0"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  
                  {/* Star Rating and Score */}
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">{item.rating}</span>
                                <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Review Count */}
                  <span className="text-sm text-gray-600">({item.reviewCount})</span>
                    </div>
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
                    src={item.images[0] || generateColorFallback(800, 600, '#e6ceb3')}
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
                      src={image || generateColorFallback(400, 300, '#e6ceb3')}
                      alt={`${item.name} - Image ${index + 2}`}
                      width={400}
                      height={300}
                      className="h-[195px] w-full object-cover"
                      fallbackSrc={generateColorFallback(400, 300, '#e6ceb3')}
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
                  src={item.image || generateColorFallback(800, 600, '#e6ceb3')}
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

              {/* Enhanced Information Panel */}
              <div className="mt-6 space-y-4">
                {/* Business Description */}
                {'business_description' in item && item.business_description && (
                  <div>
                    <h3 className="text-sm font-medium text-[#5d4c42] mb-2">About</h3>
                    <p className="text-sm text-[#5d4c42]/80 leading-relaxed">
                      {item.business_description}
                    </p>
                  </div>
                )}

                {/* Amenities */}
                {'amenities' in item && item.amenities && item.amenities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#5d4c42] mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.amenities.map((amenity, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#f9f9f6] rounded-lg text-xs text-[#5d4c42]"
                        >
                          <div className="w-1.5 h-1.5 bg-[#5d4c42] rounded-full"></div>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages Spoken */}
                {'languages_spoken' in item && item.languages_spoken && item.languages_spoken.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#5d4c42] mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.languages_spoken.map((language, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#e6ceb3] rounded-lg text-xs text-[#5d4c42] font-medium"
                        >
                          🗣️ {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drop-in Pricing - Only show if available */}
                {'drop_in_price_usd' in item && item.drop_in_price_usd && (
                  <div>
                    <h3 className="text-sm font-medium text-[#5d4c42] mb-2">Drop-in Classes</h3>
                    <div className="bg-[#e6ceb3] rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5d4c42]">Drop-in Rate</span>
                        <span className="font-semibold text-[#5d4c42]">
                          ${item.drop_in_price_usd} USD
                        </span>
                      </div>
                      {'price_range' in item && item.price_range && (
                        <div className="mt-1">
                          <span className="text-xs text-[#5d4c42]/70 capitalize">
                            {item.price_range} pricing
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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

              {Array.isArray(item.opening_hours) && item.opening_hours.length > 0 && (
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

        {/* Reviews Section */}
        <ReviewSection 
          itemId={String(item.id)}
          itemType={type === "studios" ? "studio" : "retreat"}
          itemName={item.name}
        />

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
