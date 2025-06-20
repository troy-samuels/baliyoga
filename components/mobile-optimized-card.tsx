"use client"

import Link from "next/link"
import { MapPin, Calendar, Phone, Globe } from "lucide-react"
import { OptimizedImage } from "./optimized-image"
import { WishlistHeart } from "./wishlist-heart"
import { PopularityBadge } from "./popularity-badge"
import { generateColorFallback } from "@/lib/image-fallback"
import { memo } from "react"

interface MobileCardProps {
  id: string
  name: string
  slug: string
  image?: string
  location: string
  rating: number
  styles?: string[]
  type: "studio" | "retreat"
  duration?: string
  price?: string
  phone_number?: string
  website?: string
  featured?: boolean
}

export const MobileOptimizedCard = memo(function MobileOptimizedCard({
  id,
  name,
  slug,
  image,
  location,
  rating,
  styles,
  type,
  duration,
  price,
  phone_number,
  website,
  featured = false,
}: MobileCardProps) {
  const href = `/${type === "studio" ? "studios" : "retreats"}/${slug}`

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
  }

  return (
    <div className={`group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 hover:scale-[1.02] relative ${featured ? 'featured-card' : ''}`}>
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

      <Link href={href} className="block relative z-10">
        <div className="relative h-40 w-full overflow-hidden sm:h-48">
          <OptimizedImage
            src={image || generateColorFallback(300, 200, '#e6ceb3')}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="text-base font-semibold text-[#5d4c42] line-clamp-2 sm:text-lg">{name}</h3>

          <div className="mt-1 flex items-center text-xs text-[#5d4c42] sm:text-sm">
            <MapPin className="mr-1 h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">{location}, Bali</span>
          </div>

          {/* Contact Information */}
          {(phone_number || website) && (
            <div className="mt-2 flex items-center gap-2 sm:gap-3 text-xs text-[#5d4c42] sm:text-sm">
              {phone_number && (
                <Phone className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
              )}
              {website && (
                <Globe className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
              )}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {type === "studio" &&
                styles &&
                styles.slice(0, 2).map((style, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#a39188] px-2 py-0.5 text-xs text-white sm:px-2 sm:py-1"
                  >
                    {style}
                  </span>
                ))}
              {type === "retreat" && duration && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#a39188] sm:h-4 sm:w-4" />
                  <span className="text-xs text-[#5d4c42]/80 sm:text-sm">{duration}</span>
                </div>
              )}
            </div>
            {type === "retreat" && price && (
              <span className="text-xs font-medium text-[#5d4c42] sm:text-sm">{price}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
})
