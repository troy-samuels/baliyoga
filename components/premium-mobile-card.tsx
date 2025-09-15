"use client"

import Link from "next/link"
import { MapPin, Calendar, Phone, Globe, Instagram, Facebook, MessageCircle, Youtube, Music, Mail, FileText, Crown, Star } from "lucide-react"
import { SimpleImage } from "./simple-image"
import { WishlistHeart } from "./wishlist-heart"
import { PopularityBadge } from "./popularity-badge"
import { StarRatingCompact } from "./ui/star-rating"
import { ROUTE_PATTERNS } from "@/lib/slug-utils"
import { memo, useState } from "react"

interface PremiumMobileCardProps {
  id: string
  name: string
  slug: string
  image?: string
  images?: string[] // Premium: Support for multiple images
  location: string
  rating: number
  reviewCount?: number
  styles?: string[]
  type: "studio" | "retreat"
  duration?: string
  price?: string
  phone_number?: string
  website?: string
  business_description?: string
  email?: string
  instagram_url?: string
  facebook_url?: string
  whatsapp_number?: string
  youtube_url?: string
  tiktok_url?: string
  featured?: boolean
  isPremium?: boolean // New: Premium subscription status
  priorityScore?: number // New: For search ranking
}

export const PremiumMobileCard = memo(function PremiumMobileCard({
  id,
  name,
  slug,
  image,
  images = [],
  location,
  rating,
  reviewCount = 0,
  styles,
  type,
  duration,
  price,
  phone_number,
  website,
  business_description,
  email,
  instagram_url,
  facebook_url,
  whatsapp_number,
  youtube_url,
  tiktok_url,
  featured = false,
  isPremium = false,
  priorityScore = 0,
}: PremiumMobileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const href = type === 'studio'
    ? ROUTE_PATTERNS.studio(slug)
    : ROUTE_PATTERNS.retreat(slug)

  // Use multiple images for premium, single image for free
  const displayImages = isPremium && images.length > 0 ? images : [image].filter(Boolean)
  const currentImage = displayImages[currentImageIndex] || image

  const wishlistItem = {
    id,
    name,
    slug,
    image: currentImage,
    location,
    rating,
    type,
    styles,
    duration,
    price,
    phone_number,
    website,
    business_description,
    email,
    instagram_url,
    facebook_url,
    whatsapp_number,
    youtube_url,
    tiktok_url,
  }

  // Handle image cycling for premium studios
  const handleImageCycle = (e: React.MouseEvent) => {
    if (!isPremium || displayImages.length <= 1) return

    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const cardClasses = [
    "group overflow-hidden rounded-xl bg-white shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 active:scale-[0.98] relative touch-manipulation",
    // Premium styling
    isPremium
      ? "border-amber-200/40 bg-gradient-to-br from-white to-amber-50/30 ring-1 ring-amber-200/30"
      : "border-[#e6ceb3]/20",
    // Featured styling
    featured ? "featured-card ring-2 ring-green-500/20" : ""
  ].join(" ")

  return (
    <div className={cardClasses} style={{ minHeight: '280px' }}>
      {/* Premium Badge */}
      {isPremium && (
        <span className="absolute top-2 left-2 z-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg animate-pop flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Premium
        </span>
      )}

      {/* Featured Badge - positioned below premium badge if both exist */}
      {featured && (
        <span className={`absolute ${isPremium ? 'top-12' : 'top-2'} left-2 z-20 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg animate-pop`}>
          Featured
        </span>
      )}

      {/* Popularity Badge - positioned below other badges */}
      <div className={`absolute ${(isPremium && featured) ? 'top-[88px]' : isPremium ? 'top-12' : featured ? 'top-12' : 'top-2'} left-2 z-20`}>
        <PopularityBadge itemId={id} />
      </div>

      {/* Wishlist Heart - positioned in top-right corner */}
      <div className="absolute top-2 right-2 z-20">
        <WishlistHeart item={wishlistItem} />
      </div>

      {/* Image cycling indicator for premium */}
      {isPremium && displayImages.length > 1 && (
        <div className="absolute top-2 right-14 z-20 flex gap-1">
          {displayImages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      <Link href={href} className="block relative z-10 touch-manipulation">
        <div
          className="relative h-36 w-full overflow-hidden xs:h-40 sm:h-48 cursor-pointer"
          onClick={handleImageCycle}
        >
          <SimpleImage
            src={currentImage}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 475px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={featured || isPremium}
          />

          {/* Premium gradient overlay */}
          {isPremium && (
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent opacity-30" />
          )}

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Image cycling hint for premium */}
          {isPremium && displayImages.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Tap to view more
            </div>
          )}
        </div>

        <div className="p-3 xs:p-4 sm:p-4">
          {/* Enhanced title for premium */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold line-clamp-2 leading-tight ${
              isPremium
                ? "text-amber-900 text-sm xs:text-base sm:text-lg"
                : "text-[#5d4c42] text-sm xs:text-base sm:text-lg"
            }`}>
              {name}
            </h3>
            {isPremium && (
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" />
            )}
          </div>

          <div className="mt-1.5 flex items-center text-xs text-[#5d4c42]/80 xs:text-sm">
            <MapPin className="mr-1 h-3 w-3 flex-shrink-0 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">{location}, Bali</span>
          </div>

          {/* Enhanced rating display for premium */}
          {rating > 0 && (
            <div className="mt-1.5">
              <StarRatingCompact
                rating={rating}
                reviewCount={reviewCount}
                className={isPremium ? "text-amber-600" : undefined}
              />
            </div>
          )}

          {/* Premium business description preview */}
          {isPremium && business_description?.trim() && (
            <p className="mt-2 text-xs text-[#5d4c42]/70 line-clamp-2 xs:text-sm">
              {business_description}
            </p>
          )}

          {/* Enhanced Information Availability Indicators */}
          {(phone_number?.trim() || website?.trim() || email?.trim() || business_description?.trim() ||
            instagram_url?.trim() || facebook_url?.trim() || whatsapp_number?.trim() ||
            youtube_url?.trim() || tiktok_url?.trim()) && (
            <div className="mt-2 space-y-1">
              {/* Contact Information Row */}
              {(phone_number?.trim() || website?.trim() || email?.trim() || business_description?.trim()) && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {phone_number?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="Phone available">
                      <Phone className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                  {website?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="Website available">
                      <Globe className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                  {email?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="Email available">
                      <Mail className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                  {business_description?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="Description available">
                      <FileText className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Social Media Row */}
              {(instagram_url?.trim() || facebook_url?.trim() || whatsapp_number?.trim() ||
                youtube_url?.trim() || tiktok_url?.trim()) && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {instagram_url?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="Instagram available">
                      <Instagram className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                  {facebook_url?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="Facebook available">
                      <Facebook className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                  {whatsapp_number?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="WhatsApp available">
                      <MessageCircle className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                  {youtube_url?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="YouTube available">
                      <Youtube className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                  {tiktok_url?.trim() && (
                    <div className={`rounded-full p-1 ${
                      isPremium ? 'bg-amber-100 border border-amber-200' : 'bg-[#e6ceb3]'
                    }`} title="TikTok available">
                      <Music className={`h-2.5 w-2.5 xs:h-3 xs:w-3 ${
                        isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
                      }`} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 min-w-0 flex-1">
              {type === "studio" &&
                styles &&
                styles.slice(0, 2).map((style, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-2 py-1 text-xs font-medium truncate xs:px-2.5 ${
                      isPremium
                        ? "bg-amber-600 text-white"
                        : "bg-[#a39188] text-white"
                    }`}
                  >
                    {style}
                  </span>
                ))}
              {type === "retreat" && duration && (
                <div className="flex items-center gap-1 min-w-0">
                  <Calendar className={`h-3 w-3 flex-shrink-0 xs:h-3.5 xs:w-3.5 ${
                    isPremium ? 'text-amber-600' : 'text-[#a39188]'
                  }`} />
                  <span className="text-xs text-[#5d4c42]/80 xs:text-sm truncate">{duration}</span>
                </div>
              )}
            </div>
            {type === "retreat" && price && (
              <span className={`text-xs font-semibold xs:text-sm whitespace-nowrap ${
                isPremium ? 'text-amber-700' : 'text-[#5d4c42]'
              }`}>
                {price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
})