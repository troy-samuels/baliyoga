"use client"

import Link from "next/link"
import { Star, MapPin, Phone, Globe } from "lucide-react"
import { OptimizedImage } from "./optimized-image"
import { WishlistHeart } from "./wishlist-heart"
import { PopularityBadge } from "./popularity-badge"
import { memo } from "react"

interface CardProps {
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
}

export const PerformanceOptimizedCard = memo(function PerformanceOptimizedCard({
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
}: CardProps) {
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
          <OptimizedImage
            src={image || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(name)}`}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute bottom-2 right-2 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 shadow-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#5d4c42] line-clamp-2">{name}</h3>
          <div className="mt-1 flex items-center text-sm text-[#5d4c42]">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{location}, Bali</span>
          </div>
          
          {/* Contact Information */}
          {(phone_number || website) && (
            <div className="mt-2 flex items-center gap-2 sm:gap-3 text-sm text-[#5d4c42]">
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
