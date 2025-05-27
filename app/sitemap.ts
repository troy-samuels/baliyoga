import type { MetadataRoute } from "next"
import { getSupabaseStudios, getSupabaseRetreats } from "@/lib/supabase-data-utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://baliyoga.com" // Replace with your actual domain

  // Get dynamic content
  const studios = await getSupabaseStudios()
  const retreats = await getSupabaseRetreats()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/studios`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/retreats`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Dynamic studio pages
  const studioPages = studios.map((studio) => ({
    url: `${baseUrl}/studios/${studio.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Dynamic retreat pages
  const retreatPages = retreats.map((retreat) => ({
    url: `${baseUrl}/retreats/${retreat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...studioPages, ...retreatPages]
}
