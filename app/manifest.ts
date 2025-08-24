import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bali Yoga - Find Your Perfect Yoga Experience",
    short_name: "Bali Yoga",
    description: "Discover the best yoga studios, retreats, and wellness experiences across Bali",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f3e9",
    theme_color: "#5d4c42",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "16x16",
        type: "image/x-icon",
      },
    ],
  }
}
