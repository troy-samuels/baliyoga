"use client"

import Link from "next/link"
import { MapPin, Phone, Globe, Instagram, Facebook, MessageCircle, Youtube, Music, Mail, FileText } from "lucide-react"
import { SimpleImage } from "./simple-image"
import { WishlistHeart } from "./wishlist-heart"
import { PopularityBadge } from "./popularity-badge"
import { StarRatingCompact } from "./ui/star-rating"
import { memo } from "react"

interface CardProps {
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
}

export const PerformanceOptimizedCard = memo(function PerformanceOptimizedCard({
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
}: CardProps) {
  const href = `/${type}/${slug}`

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
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 hover:scale-[1.02] relative">
      {/* Popularity Badge - positioned in top-left corner */}
      <div className="absolute top-2 left-2 z-20">
        <PopularityBadge itemId={id} />
      </div>
      
      {/* Wishlist Heart - positioned in top-right corner */}
      <div className="absolute top-2 right-2 z-20">
        <WishlistHeart item={wishlistItem} />
      </div>

      <Link href={href} className="block" prefetch={false}>
        <div className="relative h-48 w-full overflow-hidden">
          <SimpleImage
            src={image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#5d4c42] line-clamp-2">{name}</h3>
          <div className="mt-1 flex items-center text-sm text-[#5d4c42]">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{location}, Bali</span>
          </div>
          
          {/* Rating Display */}
          {rating > 0 && (
            <div className="mt-2">
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
                <div className="flex items-center gap-2 flex-wrap">
                  {phone_number?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Phone available">
                      <Phone className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                  {website?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Website available">
                      <Globe className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                  {email?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Email available">
                      <Mail className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                  {business_description?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Description available">
                      <FileText className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                </div>
              )}

              {/* Social Media Row */}
              {(instagram_url?.trim() || facebook_url?.trim() || whatsapp_number?.trim() ||
                youtube_url?.trim() || tiktok_url?.trim()) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {instagram_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Instagram available">
                      <Instagram className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                  {facebook_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="Facebook available">
                      <Facebook className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                  {whatsapp_number?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="WhatsApp available">
                      <MessageCircle className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                  {youtube_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="YouTube available">
                      <Youtube className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                  {tiktok_url?.trim() && (
                    <div className="rounded-full bg-[#e6ceb3] p-1" title="TikTok available">
                      <Music className="h-3 w-3 text-[#5d4c42]" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {type === "studio" &&
                styles &&
                styles.slice(0, 2).map((style, index) => (
                  <span key={index} className="rounded-full bg-[#a39188] px-2 py-1 text-xs text-white">
                    {style}
                  </span>
                ))}
              {type === "retreat" && duration && (
                <span className="rounded-full bg-[#a39188] px-2 py-1 text-xs text-white">{duration}</span>
              )}
            </div>
            {type === "retreat" && price && <span className="font-medium text-[#5d4c42] text-sm">{price}</span>}
          </div>
        </div>
      </Link>
    </div>
  )
})
