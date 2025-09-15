"use client"

import Link from "next/link"
import { MapPin, Calendar, Phone, Globe, Instagram, Facebook, MessageCircle, Youtube, Music, Mail, FileText } from "lucide-react"
import { SimpleImage } from "./simple-image"
import { WishlistHeart } from "./wishlist-heart"
import { PopularityBadge } from "./popularity-badge"
import { StarRatingCompact } from "./ui/star-rating"
import { ROUTE_PATTERNS } from "@/lib/slug-utils"
import { memo } from "react"

interface MobileCardProps {
  id: string
  name: string
  slug: string
  image?: string
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
}

export const MobileOptimizedCard = memo(function MobileOptimizedCard({
  id,
  name,
  slug,
  image,
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
}: MobileCardProps) {
  const href = type === 'studio' 
    ? ROUTE_PATTERNS.studio(slug)
    : ROUTE_PATTERNS.retreat(slug)

  const wishlistItem = {
    id,
    name,
    slug,
    image,
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

  return (
    <div className={`group overflow-hidden rounded-xl bg-white shadow-sm border border-[#e6ceb3]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 active:scale-[0.98] relative touch-manipulation ${featured ? 'featured-card ring-2 ring-green-500/20' : ''}`}
         style={{ minHeight: '280px' }}>
      {featured && (
        <span className="absolute top-2 left-2 z-20 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg animate-pop">Featured</span>
      )}
      
      {/* Popularity Badge - positioned below featured badge if present */}
      <div className={`absolute ${featured ? 'top-12' : 'top-2'} left-2 z-20`}>
        <PopularityBadge itemId={id} />
      </div>
      
      {/* Wishlist Heart - positioned in top-right corner */}
      <div className="absolute top-2 right-2 z-20">
        <WishlistHeart item={wishlistItem} />
      </div>

      <Link href={href} className="block relative z-10 touch-manipulation">
        <div className="relative h-36 w-full overflow-hidden xs:h-40 sm:h-48">
          <SimpleImage
            src={image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 475px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={featured}
          />
          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-3 xs:p-4 sm:p-4">
          <h3 className="text-sm font-semibold text-[#5d4c42] line-clamp-2 leading-tight xs:text-base sm:text-lg">{name}</h3>

          <div className="mt-1.5 flex items-center text-xs text-[#5d4c42]/80 xs:text-sm">
            <MapPin className="mr-1 h-3 w-3 flex-shrink-0 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">{location}, Bali</span>
          </div>

          {/* Rating Display */}
          {rating > 0 && (
            <div className="mt-1.5">
              <StarRatingCompact rating={rating} reviewCount={reviewCount} />
            </div>
          )}

          {/* Information Availability Indicators */}
          {(phone_number?.trim() || website?.trim() || email?.trim() || business_description?.trim() ||
            instagram_url?.trim() || facebook_url?.trim() || whatsapp_number?.trim() ||
            youtube_url?.trim() || tiktok_url?.trim()) && (
            <div className="mt-2 space-y-1">
              {/* Contact Information Row */}
              {(phone_number?.trim() || website?.trim() || email?.trim() || business_description?.trim()) && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {phone_number?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Phone available">
                      <Phone className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                  {website?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Website available">
                      <Globe className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                  {email?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Email available">
                      <Mail className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                  {business_description?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Description available">
                      <FileText className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                </div>
              )}

              {/* Social Media Row */}
              {(instagram_url?.trim() || facebook_url?.trim() || whatsapp_number?.trim() ||
                youtube_url?.trim() || tiktok_url?.trim()) && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {instagram_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Instagram available">
                      <Instagram className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                  {facebook_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Facebook available">
                      <Facebook className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                  {whatsapp_number?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="WhatsApp available">
                      <MessageCircle className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                  {youtube_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="YouTube available">
                      <Youtube className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
                    </div>
                  )}
                  {tiktok_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="TikTok available">
                      <Music className="h-2.5 w-2.5 text-[#5d4c42] xs:h-3 xs:w-3" />
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
                    className="rounded-full bg-[#a39188] px-2 py-1 text-xs text-white font-medium truncate xs:px-2.5"
                  >
                    {style}
                  </span>
                ))}
              {type === "retreat" && duration && (
                <div className="flex items-center gap-1 min-w-0">
                  <Calendar className="h-3 w-3 text-[#a39188] flex-shrink-0 xs:h-3.5 xs:w-3.5" />
                  <span className="text-xs text-[#5d4c42]/80 xs:text-sm truncate">{duration}</span>
                </div>
              )}
            </div>
            {type === "retreat" && price && (
              <span className="text-xs font-semibold text-[#5d4c42] xs:text-sm whitespace-nowrap">{price}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
})
