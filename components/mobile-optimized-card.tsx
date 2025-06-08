"use client"

import Link from "next/link"
import { MapPin, Calendar, Phone, Globe } from "lucide-react"
import { OptimizedImage } from "./optimized-image"
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
}: MobileCardProps) {
  const href = `/${type === "studio" ? "studios" : "retreats"}/${slug}`

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 hover:scale-[1.02]">
      <Link href={href} className="block">
        <div className="relative h-40 w-full overflow-hidden sm:h-48">
          <OptimizedImage
            src={image || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(name)}`}
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
          <div className="mt-1 flex items-center gap-2 sm:gap-3">
            {phone_number && (
              <div className="flex items-center text-xs text-[#5d4c42]/70">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate text-xs">{phone_number}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center text-xs text-[#5d4c42]/70">
                <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate text-xs">Website</span>
              </div>
            )}
          </div>

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
